from passlib.hash import pbkdf2_sha256 as password
from base import JsonObject, JsonObjectDataMapper

class UserObject(JsonObject):
    def __init__(self, config={}):
        super(UserObject, self).__init__(
            config,
            pathPrefix = "user",
            keepFields = ['username', 'password', 'role']
            )

    def fromPost(self, form):
        old_password = self.password
        super(UserMapper, self).fromPost(form)
        if len(self.password):
            try:
                self.password = password.hash(self.password)
            except AttributeError:
                self.password = password.encrypt(self.password)
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
        cur = self.db.execute("""
            SELECT id
            FROM `%s`
            WHERE `name` = ? or email = ?
            """ % self.table,
            [search, search]
            )
        obj = cur.fetchone()
        if obj is None:
            return None
        obj = dict(obj)
        return self.getById(obj['id'])
