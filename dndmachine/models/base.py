import json
import re

class JsonObject(object):
    def __init__(self, config={}, **kwargs):
        self._camelCaseRe = re.compile(ur""".+?(?<!^)(?:
            (?<=[a-z])(?=[A-Z])
            |(?<=[0-9])(?=[a-zA-Z])
            |(?<=[a-zA-Z])(?=[0-9])
            |$
            )""", re.X)
        self._steps = {}

        self._pathPrefix = kwargs.get('pathPrefix', 'obj')
        self._defaultConfig = kwargs.get('defaultConfig', {})
        self._keepFields = kwargs.get('keepFields', [])
        self._defaultFieldType = kwargs.get('defaultFieldType', unicode)
        self._fieldTypes = kwargs.get('fieldTypes', {})

        self._config = self._merge({}, self._defaultConfig)
        self._config = self._merge(self._config, config)
        self.compute()

    @property
    def config(self):
        return self._config

    def splitCamelCase(self, string):
        return [
            m.group(0).lower()
            for m in self._camelCaseRe.finditer(string)
            ]

    def _merge(self, a, b, path=None):
        if path is None: path = []
        if not isinstance(a, dict) or not isinstance(b, dict):
            raise Exception("Conflict: a (%s) or b (%s) is not a dict" % (
                type(a), type(b)
                ))
        for key in b:
            if key in a:
                if isinstance(a[key], dict) and isinstance(b[key], dict):
                    a[key] = self._merge(a[key], b[key], path + [key])
                elif type(a[key]) != type(b[key]):
                    raise Exception('Conflict at %s: %s vs %s (%r vs %r)' % (
                        '.'.join(path + [key]),
                        type(a[key]), type(b[key]),
                        a[key], b[key]
                        ))
                else:
                    a[key] = b[key]
            else:
                a[key] = b[key]
        return a

    def updateFromPost(self, form):
        old = self._config
        self._config = self._merge(self._defaultConfig, {})

        for path, value in form.iteritems():
            steps = path.split('.')
            if steps[0] != self._pathPrefix:
                continue
            cast = self.getFieldType(path)
            if not len(value) and cast == int:
                continue
            value = cast(value)
            self.setPath(path, value)

        for keep in self._keepFields + ['id']:
            if not self.getPath(keep) \
                    and self.getPath(keep, structure=old):
                self.setPath(keep, self.getPath(keep, structure=old))
        self.compute()

    def compute(self):
        pass

    def __iter__(self):
        return self._config.iteritems()

    def __getattr__(self, field):
        try:
            return object.__getattr__(self, field)
        except AttributeError:
            path = '.'.join(self.splitCamelCase(field))
            return self.getPath(path)

    def __getitem__(self, field):
        try:
            return self.__dict__[field]
        except KeyError:
            try:
                return self.__class__.__dict__[field]
            except KeyError:
                path = '.'.join(self.splitCamelCase(field))
                return self.getPath(path)

    def __setattr__(self, field, value):
        if field.startswith('_') \
                or field in self.__dict__ \
                or field in self.__class__.__dict__:
            return object.__setattr__(self, field, value)
        path = '.'.join(self.splitCamelCase(field))
        self.setPath(path, value)

    def __setitem__(self, field, value):
        if field.startswith('_') \
                or field in self.__dict__ \
                or field in self.__class__.__dict__:
            self.__dict__[field] = value
        path = '.'.join(self.splitCamelCase(field))
        self.setPath(path, value)

    def __contains__(self, field):
        path = '.'.join(self.splitCamelCase(field))
        return self.getPath(path) is not None

    def getPath(self, path, default=None, structure=None):
        path = [
            int(step) if step.isdigit() else step
            for step in path.split('.')
            ]
        if path[0] == self._pathPrefix:
            path = path[1:]

        rv = structure if structure is not None else self._config
        for step in path:
            if isinstance(step, int):
                if not isinstance(rv, list):
                    if default:
                        return default
                    raise Exception("Not a list (%r) '%r': %r" % (
                        step, path, rv))
                elif step >= len(rv):
                    return default
            elif not isinstance(rv, dict):
                if default:
                    return default
                raise Exception("Not a dict (%r) '%r': %r" % (
                    step, path, rv))
            elif step not in rv:
                return default
            rv = rv[step]
        return rv

    def getFieldType(self, path):
        if path in ['id', '%s.id' % self._pathPrefix]:
            return int
        path = '.'.join([
            step
            for step in path.split('.')
            if not step.isdigit() and not step.startswith('+')
            ])
        fieldType = self.getPath(
            path,
            default=self._defaultFieldType,
            structure=self._fieldTypes
            )
        return fieldType

    def setPath(self, path, value):
        path = [
            int(step) if step.isdigit() else step
            for step in path.split('.')
            ]
        if path[0] == self._pathPrefix:
            path = path[1:]

        rv = self._config
        for i in range(len(path)):
            step = path[i]

            next_type = dict
            if i+1 >= len(path):
                next_type = lambda: None
            elif isinstance(path[i+1], int) or path[i+1].startswith('+'):
                next_type = list

            if isinstance(step, int) or step.startswith('+'):
                if not isinstance(rv, list):
                    raise Exception("Not a list at %s %r: %r" % (step, path, rv))
                elif not isinstance(step, int):
                    key = step
                    step = self._steps.get(key, len(rv))
                    self._steps[key] = step
                rv.extend([
                    next_type()
                    for _ in range(step - len(rv) + 1)
                    ])
            else:
                if not isinstance(rv, dict):
                    raise Exception("Not a dict at %s %r: %r" % (step, path, rv))
                if step not in rv:
                    rv[step] = next_type()
            if i+1 < len(path):
                rv = rv[step]
            else:
                rv[step] = value

class JsonObjectDataMapper(object):
    obj = JsonObject
    table = None
    fields = []

    def __init__(self, db):
        self.db = db

    def _read(self, dbrow):
        if dbrow is None \
                or not isinstance(dbrow, dict) \
                or 'config' not in dbrow \
                or 'id' not in dbrow:
            raise ValueError("Invalid dbrow: %r" % dbrow)

        dbrow['config'] = json.loads(dbrow['config'])
        for field in self.fields:
            dbrow['config'][field] = dbrow[field]
        dbrow['config']['id'] = dbrow['id']
        return self.obj(dbrow['config'])

    def _write(self, obj):
        if not isinstance(obj, JsonObject):
            raise ValueError("Invalid object: %r" % obj)

        fields = self.fields + ['id']
        dbrow = dict(
            (field, obj[field])
            for field in fields
            if field in obj
            )
        dbrow['config'] = dict(
            (field, value)
            for field, value in obj
            if field not in fields
            )
        dbrow['config'] = json.dumps(dbrow['config'])
        return dbrow

    def getById(self, obj_id):
        """Returns an object from table by obj_id"""
        cur = self.db.execute("""
            SELECT *
            FROM `%s`
            WHERE `id` = ?
            """ % self.table,
            [obj_id]
            )
        obj = cur.fetchone()
        if obj is None:
            return None
        return self._read(dict(obj))

    def getMultiple(self, where="1", values={}):
        """Returns a list of obj matching the where clause"""
        cur = self.db.execute("""
            SELECT * FROM `%s` WHERE %s
            """ % (self.table, where),
            values
            )
        objs = cur.fetchall() or []
        return [
            self._read(dict(obj))
            for obj in objs
            if obj is not None
            ]

    def save(self, obj):
        """Insert or Update an obj"""
        if obj.id:
            return self.update(obj)
        return self.insert(obj)

    def insert(self, obj):
        """Insert a new obj"""
        new_obj = self._write(obj)

        cur = self.db.execute("""
            INSERT INTO `%s`
                (`config`, %s)
            VALUES
                (:config, %s)
            """ % (
                self.table,
                ', '.join(["`%s`" % f for f in new_obj]),
                ', '.join([":%s" % f for f in new_obj])
                ),
            new_obj
            )
        self.db.commit()
        return self.getById(cur.lastrowid)

    def update(self, obj):
        """Updates an existing obj"""
        new_obj = self._write(obj)

        cur = self.db.execute("""
            UPDATE `%s`
            SET `config` = :config, %s
            WHERE `id` = :id
            """ % (
                self.table,
                ', '.join(["`%s` = :%s" % (f, f) for f in self.fields])
                ),
            new_obj
            )
        self.db.commit()
        return self.getById(obj.id)

    def delete(self, obj):
        """Deletes an object from the table"""
        cur = self.db.execute("""
            DELETE
            FROM `%s`
            WHERE `id` = ?
            """ % self.table,
            [obj.id]
            )
        self.db.commit()
