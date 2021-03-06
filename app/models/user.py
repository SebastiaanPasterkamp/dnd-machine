from passlib.hash import pbkdf2_sha256
import uuid

from .base import JsonObject, JsonObjectDataMapper

class UserObject(JsonObject):
    _pathPrefix = "user"
    _defaultConfig = {
        'google_id': None,
        'username': '',
        'password': '',
        'email': '',
        'dci': '',
        'role': [],
        }

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

    def setPassword(self, password):
        try:
            self.password = pbkdf2_sha256.hash(password)
        except AttributeError:
            self.password = pbkdf2_sha256.encrypt(password)

    def startRecovery(self):
        key = str(uuid.uuid4().hex.upper()[:32])
        try:
            self.recovery = pbkdf2_sha256.hash(key)
        except AttributeError:
            self.recovery = pbkdf2_sha256.encrypt(key)
        return key

    def checkRecovery(self, key):
        if not self.recovery:
            return False
        if pbkdf2_sha256.verify(key, self.recovery):
            return True
        return False


class UserMapper(JsonObjectDataMapper):
    obj = UserObject
    table = "user"
    fields = ['username', 'password', 'email', 'google_id']
    order = 'username'

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

    def getByGoogleId(self, google_id):
        objs = self.getMultiple(
            """`google_id` = :google_id""",
            {"google_id": google_id}
            )
        if not objs:
            return None
        return objs[0]
