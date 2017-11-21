from passlib.hash import pbkdf2_sha256
from base import JsonObject, JsonObjectDataMapper

class UserObject(JsonObject):
    def __init__(self, config={}):
        super(UserObject, self).__init__(
            config,
            pathPrefix = "user",
            defaultConfig = {
                'username': u'',
                'password': u'',
                'email': u'',
                'role': []
                }
            )
        self.compute()

    def compute(self):
        self.role = [
            role
            for role in self.role
            if role
            ]

    def checkPassword(self, password):
        if pbkdf2_sha256.verify(password, self.password):
            return True
        return False

    def updateFromPost(self, form):
        old_password = self.password
        super(UserObject, self).updateFromPost(form)
        if len(self.password):
            try:
                self.password = pbkdf2_sha256.hash(self.password)
            except AttributeError:
                self.password = pbkdf2_sha256.encrypt(self.password)
            else:
                self.password = old_password
        else:
            self.password = old_password

class UserMapper(JsonObjectDataMapper):
    obj = UserObject
    table = "users"
    fields = ['username', 'password', 'email']

    def getList(self, search=None):
        """Returns a list of users matching the search parameter"""
        return self.getMultiple(
            "`username` LIKE :search OR `email` LIKE :search",
            {"search": '%%%s%%' % search}
            )

    def getByExactMatch(self, search=None):
        """Returns a user by exact name or email"""
        objs = self.getMultiple(
            """`username` = :search OR `email` =:search""",
            {"search": search}
            )
        if not objs:
            return None
        return objs[0]

    def getByCredentials(self, username, password):
        objs = self.getMultiple(
            """`username` = :username""",
            {"username": username}
            )
        if not objs:
            return None
        user = objs[0]
        if user.checkPassword(password):
            return user
        return None