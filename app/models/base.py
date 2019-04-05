import json
import re
from copy import deepcopy

class JsonObject(object):
    _version = '0.0.0'
    _pathPrefix = 'obj'
    _defaultConfig = {}
    _defaultFieldType = 'auto'
    _fieldTypes = {
        'id': int
        }
    _camelCaseRe = re.compile(ur""".+?(?<!^)(?:
        (?<=[a-z])(?=[A-Z])
        |(?<=[0-9])(?=[a-zA-Z])
        |(?<=[a-zA-Z])(?=[0-9])
        |$
        )""", re.X)

    def __init__(self, config={}):
        if not config.get('id'):
            self._config = self._merge(
                deepcopy(self._defaultConfig),
                config
                )
        else:
            self._config = config

    @property
    def config(self):
        return self._config

    def migrate(self, mapper=None):
        if '_config' in self._config:
            raise Exception("%d) Configception" % (self.id))

        for key, val in self._config.items():
            if val is None:
                del self._config[key]

        self._config = self._merge(
            deepcopy(self._defaultConfig),
            self._config
            )
        self.compute()

    def clone(self):
        clone = self.__class__(self.config)
        del clone['id']
        return clone

    def splitPath(self, path, filterPrefix=True):
        """ Splits a path by
        - period: path.in.steps.1
        - camelCase: pathInSteps1
        returns ['path','in','steps',1]
        """
        steps = []
        if "." in path:
            steps = path.split('.')
        else:
            steps = [
                m.group(0).lower()
                for m in self._camelCaseRe.finditer(path)
                ]
        steps = [
            int(step) if step.isdigit() else step
            for step in steps
            ]
        if filterPrefix and steps[0] == self._pathPrefix:
            steps = steps[1:]
        return steps

    def update(self, update):
        self._config.update(
            self.castFieldType(update)
            )
        for field in self._config.keys():
            if self._config[field] is None:
                del self._config[field]

    def _getCast(self, cast, key):
        if isinstance(cast, dict):
            return cast.get(
                key,
                cast.get('*', self._defaultFieldType)
                )
        if cast == 'auto':
            return cast
        return self._defaultFieldType

    def _merge(self, a, b, cast=None, path=[]):
        cast = cast or self._fieldTypes

        if isinstance(a, dict) and isinstance(b, dict):
            for key in b:
                if key not in a:
                    a[key] = self.castFieldType(
                        b[key],
                        path + [key]
                        )
                else:
                    a[key] = self._merge(
                        a[key],
                        b[key],
                        self._getCast(cast, key),
                        path + [key]
                        )
            return a

        if isinstance(a, list) and isinstance(b, list):
            return [
                self._merge(_b, _b, cast, path)
                for _b in b
                ]

        if cast == int and b in [None, '']:
            return 0

        if b in [None, 'None'] or cast == 'auto':
            return b

        try:
            return cast(b)
        except Exception as error:
            print error, path, cast, type(b), b
            raise

    def updateFromPost(self, form):
        for field, value in form.iteritems():
            if '[]' in field or '.+' in field:
                value = form.getlist(field)
                field = field.replace('[]', '')
                field = field.replace('.+', '')

            path = self.splitPath(field, False)
            if path[0] != self._pathPrefix:
                continue
            path = path[1:]
            self.setPath(path, value)

        self.compute()

    def compute(self):
        pass

    def __iter__(self):
        return self._config.iteritems()

    def __getattr__(self, field):
        if field.startswith('_') \
                or field in self.__dict__ \
                or field in self.__class__.__dict__:
            return object.__getattribute__(self, field)
        return self.getPath(field)

    def __delattr__(self, field):
        if field.startswith('_') \
                or field in self.__dict__ \
                or field in self.__class__.__dict__:
            object.__delattr__(self, field)
        else:
            self.delPath(field)

    def __getitem__(self, field):
        if field in self.__dict__:
            return self.__dict__[field]
        if field in self.__class__.__dict__:
            return self.__class__.__dict__[field]
        if field.startswith('_'):
            raise KeyError
        return self.getPath(field)

    def __setattr__(self, field, value):
        if field.startswith('_') \
                or field in self.__dict__ \
                or field in self.__class__.__dict__:
            object.__setattr__(self, field, value)
        else:
            self.setPath(field, value)

    def __setitem__(self, field, value):
        if field in self.__dict__:
            self.__dict__[field] = value
        if field in self.__class__.__dict__:
            self.__class__.__dict__[field] = value
        if field.startswith('_'):
            raise KeyError
        self.setPath(field, value)

    def __delitem__(self, field):
        if field in self.__dict__:
            del self.__dict__[field]
        if field in self.__class__.__dict__:
            del self.__class__.__dict__[field]
        if field.startswith('_'):
            raise KeyError
        self.delPath(field)

    def __contains__(self, field):
        return self.hasPath(field)

    def hasPath(self, path):
        return self.getPath(path) is not None

    def getPath(self, path, default=None, structure=None):
        if not isinstance(path, list):
            path = self.splitPath(path)
        if len(path) and path[0].startswith('_'):
            raise Exception("Invalid path: '%r'" % path)

        rv = structure \
            if structure is not None \
            else self._config

        for step in path:
            if isinstance(step, int):
                if not isinstance(rv, list):
                    if default:
                        return default
                    raise Exception("Not a list %s in '%r'" % (
                        step, path))
                elif step >= len(rv):
                    return default
            elif not isinstance(rv, dict):
                if default:
                    return default
                raise Exception("Not a dict %s in '%r': %r" % (
                    step, path, rv))
            elif step not in rv:
                matches = dict([
                    (match.replace("*", ''), match)
                    for match in rv
                    if "*" in match
                    ])
                found = ""
                for match, replace in matches.iteritems():
                    if match in step and len(replace) > len(found):
                        found = replace
                if found:
                    step = found
                else:
                    return default
            rv = rv[step]
        return rv

    def delPath(self, path, structure=None):
        if not isinstance(path, list):
            path = self.splitPath(path)

        rv = structure \
            if structure is not None \
            else self._config

        for step in path[:-1]:
            if isinstance(step, int):
                if not isinstance(rv, list):
                    raise Exception("Not a list %s in %r" % (
                        step, path))
            elif not isinstance(rv, dict):
                raise Exception("Not a dict %s in %r: %r" % (
                    step, path, rv))
            rv = rv[step]
        del rv[path[-1]]

    def castFieldType(self, value, path=[], cast=None, debug=False):
        if not isinstance(path, list):
            path = self.splitPath(path)
        if cast is None:
            path = [
                step for step in path
                if not isinstance(step, int) and step != '+'
                ]
            cast = self.getPath(
                path,
                default=self._defaultFieldType,
                structure=self._fieldTypes
                )
            if debug:
                print 'Cast', path, '=', cast

        if isinstance(value, list):
            if debug:
                print 'list', path
            return [
                self.castFieldType(v, path, cast, debug)
                for v in value
                ]

        if isinstance(value, dict) and (cast == 'auto' or isinstance(cast, dict)):
            if debug:
                print 'dict', path
            return dict([
                (
                    step,
                    self.castFieldType(
                        v,
                        path + [step],
                        self._getCast(cast, step),
                        debug
                        )
                    )
                for step, v in value.iteritems()
                ])

        if cast == int and value in [None, '']:
            if debug:
                print 'empty int', path
            return 0

        if value in [None, 'None'] or cast == 'auto':
            if debug:
                print 'blank', cast, value
            return value

        try:
            if debug:
                print 'casting', cast, value
            return cast(value)
        except Exception as error:
            print error, path, cast, type(value), value
            raise


    def setPath(self, path, value):
        if not isinstance(path, list):
            path = self.splitPath(path)

        if path[0] == '_config':
            raise Exception("%d Cannot set path %r = %r" % (
                self.id, path, value
                ))

        value = self.castFieldType(value, path)

        rv = self._config
        for i in range(len(path)-1):
            step = path[i]

            next_type = dict
            if isinstance(path[i+1], int) or path[i+1] == '+':
                next_type = list

            if isinstance(step, int) or step == '+':
                if not isinstance(rv, list):
                    raise Exception("Not a list at %s %r: %r" % (step, path, rv))
                elif step == '+':
                    step = len(rv)
                if step >= len(rv):
                    rv.extend([next_type()] * (step - len(rv) + 1))
            else:
                if not isinstance(rv, dict):
                    raise Exception("Not a dict at %s %r: %r" % (step, path, rv))
                if step not in rv:
                    rv[step] = next_type()
            rv = rv[step]
        step = path[-1]
        if step == '+':
            step = len(rv)
            if step >= len(rv):
                rv.extend([0] * (step - len(rv) + 1))
        rv[step] = value
        return value


class JsonObjectDataMapper(object):
    obj = JsonObject
    table = None
    fields = []
    order = 'id'
    join_tables = {}

    _instance = None
    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(JsonObjectDataMapper, cls).__new__(
                                cls, *args, **kwargs)
        return cls._instance

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
            if dbrow[field] is None:
                continue
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
        dbrow['config'] = json.dumps(
            dbrow['config'],
            sort_keys=True,
            indent=4
            )
        return dbrow

    def create(self, config=None):
        """Creates an object from config"""
        obj = self.obj(config)
        return obj

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
            SELECT * FROM `%s` WHERE %s ORDER BY `%s`
            """ % (self.table, where, self.order),
            values
            )
        objs = cur.fetchall() or []
        return [
            self._read(dict(obj))
            for obj in objs
            if obj is not None
            ]

    def clearJoinTables(self, obj):
        """Clears entries from join tables by key=obj.id"""
        for table, (attrib, key) in self.join_tables.items():
            self.db.execute("""
                DELETE FROM `%s`
                WHERE `%s` = ?
                """ % (table, key),
                [
                    obj[attrib]
                    ]
                )
        self.db.commit()

    def fillJoinTables(self, obj):
        """Populates entries in join tables by key=obj.id"""
        if not self.join_tables:
            return
        raise NotImplementedError(
            "Needed for %r" % self.join_tables
            )

    def save(self, obj):
        """Insert or Update an obj"""
        if obj.id:
            return self.update(obj)
        return self.insert(obj)

    def insert(self, obj):
        """Insert a new obj"""
        new_obj = self._write(obj)
        if 'id' in new_obj:
            del new_obj['id']

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

        obj.id = cur.lastrowid
        self.fillJoinTables(obj)

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
                ', '.join([
                    "`%s` = :%s" % (f, f)
                    for f in self.fields
                    ])
                ),
            new_obj
            )
        self.db.commit()

        self.clearJoinTables(obj)
        self.fillJoinTables(obj)

        return self.getById(obj.id)

    def delete(self, obj):
        """Deletes an object from the table"""
        self.clearJoinTables(obj)

        cur = self.db.execute("""
            DELETE
            FROM `%s`
            WHERE `id` = ?
            """ % self.table,
            [obj.id]
            )
        self.db.commit()
