# -*- coding: utf-8 -*-
from flask import (
    Blueprint,
    make_response,
    render_template,
    request,
    jsonify,
    redirect,
    url_for,
    )
from sqlite3 import IntegrityError

from errors import ApiException

def BaseApiCallback(key):
    def func_wrapper(func):
        if not hasattr(func, '_callbacks'):
            func._callbacks = []
        func._callbacks.append(key)
        return func
    return func_wrapper


class BaseApiBlueprint(Blueprint):

    def __init__(self, name, fullname, basemapper, config,
                 *args, **kwargs):
        super(BaseApiBlueprint, self).__init__(
            name, fullname, *args, **kwargs)

        self.name = name
        self.basemapper = basemapper
        self.config = config

        self._callbacks = {}
        for func in self.__class__.__dict__.values():
            if not callable(func):
                continue
            if not hasattr(func, '_callbacks'):
                continue
            for callback in func._callbacks:
                callbacks = self._callbacks.get(callback, [])
                callbacks.append(func)
                self._callbacks[callback] = callbacks

        self.add_url_rule(
            '/', 'index',
            self.index)
        self.add_url_rule(
            '/list', 'overview',
            self.overview)
        self.add_url_rule(
            '/show/<int:obj_id>', 'show',
            self.show)
        self.add_url_rule(
            '/new', 'new',
            self.newObj)
        self.add_url_rule(
            '/raw/<int:obj_id>', 'raw',
            self.raw)
        self.add_url_rule(
            '/edit/<int:obj_id>', 'edit',
            self.edit)

        self.add_url_rule(
            '/api', 'api_list',
            self.api_list, methods=['GET'])
        self.add_url_rule(
            '/api/<int:obj_id>', 'api_get',
            self.api_get, methods=['GET'])
        self.add_url_rule(
            '/api', 'api_post',
            self.api_post, methods=['POST'])
        self.add_url_rule(
            '/copy/<int:obj_id>', 'api_copy',
            self.api_copy, methods=['GET'])
        self.add_url_rule(
            '/api/<int:obj_id>', 'api_patch',
            self.api_patch, methods=['PATCH'])
        self.add_url_rule(
            '/api/<int:obj_id>', 'api_delete',
            self.api_delete, methods=['DELETE'])
        self.add_url_rule(
            '/recompute', 'recompute',
            self.api_recompute, methods=['POST'])
        self.add_url_rule(
            '/recompute/<int:obj_id>', 'recompute',
            self.api_recompute, methods=['POST'])

    def doCallback(self, key, *args, **kwargs):
        for callback in self._callbacks.get(key, []):
            callback(self, *args, **kwargs)

    def checkRole(self, roles):
        if request.user is None:
            return False
        if any([role in request.user.role for role in roles]):
            return True
        return False

    def _exposeAttributes(self, obj):
        return obj.config

    def _mutableAttributes(self, config, obj=None):
        return config

    def index(self, *args, **kwargs):
        self.doCallback('index', *args, **kwargs)
        return redirect(url_for('%s.overview' % self.name))

    def _reactLayout(self):
        response = make_response(
            render_template('reactjs-layout.html')
            )
        response.add_etag()
        return response

    def overview(self, *args, **kwargs):
        self.doCallback('overview', *args, **kwargs)
        return self._reactLayout()

    def show(self, obj_id, *args, **kwargs):
        self.doCallback('show', obj_id, *args, **kwargs)
        return self._reactLayout()

    def newObj(self, obj_id=None, *args, **kwargs):
        if obj_id is None:
            self.doCallback('new', *args, **kwargs)
        else:
            self.doCallback('reset', obj_id, *args, **kwargs)
        return self._reactLayout()

    def edit(self, obj_id, *args, **kwargs):
        self.doCallback('edit', obj_id, *args, **kwargs)
        return self._reactLayout()

    def raw(self, obj_id):
        self.doCallback('raw', obj_id)

        obj = self.datamapper.getById(obj_id)
        self.doCallback(
            'raw.object',
            obj,
            )

        response = jsonify(obj.config)
        response.add_etag()
        return response

    def api_list(self, *args, **kwargs):
        self.doCallback('api_list', *args, **kwargs)

        objs = self.datamapper.getMultiple()
        self.doCallback(
            'api_list.objects',
            objs,
            *args,
            **kwargs
            )

        response = jsonify([
            self._exposeAttributes(obj, *args, **kwargs)
            for obj in objs
            ])
        response.add_etag()
        return response

    def api_get(self, obj_id):
        self.doCallback('api_get', obj_id)

        obj = self.datamapper.getById(obj_id)
        if not obj:
            raise ApiException(404, "Object not found")

        self.doCallback(
            'api_get.object',
            obj,
            )

        response = jsonify(self._exposeAttributes(obj))
        response.add_etag()
        return response

    def api_post(self, obj_id=None):
        self.doCallback('api_post', obj_id)

        obj = None
        if obj_id is not None:
            obj = self.datamapper.getById(obj_id)
            if not obj:
                raise ApiException(404, "Object not found")

            self.doCallback(
                'api_post.original',
                obj,
                )

        data = request.get_json()
        if obj_id is not None \
                and 'id' in data \
                and data['id'] != obj_id:
            raise ApiException(409, "Cannot change ID")

        data = self._mutableAttributes(data, obj)
        self.doCallback(
            'api_post.data',
            data,
            obj
            )

        obj = self.datamapper.create(data)
        if obj_id is not None:
            obj.id = obj_id
        elif 'id' in obj and obj.id is not None:
            raise ApiException(409, "Cannot create with existing ID")
        self.doCallback(
            'api_post.object',
            obj,
            )

        obj.compute()
        obj = self.datamapper.save(obj)

        return jsonify(self._exposeAttributes(obj))

    def api_copy(self, obj_id):
        self.doCallback('api_copy', obj_id)

        obj = self.datamapper.getById(obj_id)
        if not obj:
            raise ApiException(404, "Object not found")
        self.doCallback(
            'api_copy.original',
            obj,
            )

        obj.id = None
        self.doCallback(
            'api_copy.object',
            obj,
            )

        obj = self.datamapper.insert(obj)
        return redirect(url_for(
            '%s.api_get' % self.name,
            obj_id=obj.id
            ))

    def api_patch(self, obj_id):
        self.doCallback('api_patch', obj_id)

        obj = self.datamapper.getById(obj_id)
        if not obj:
            raise ApiException(404, "Object not found")

        self.doCallback(
            'api_patch.original',
            obj,
            )

        data = request.get_json()
        if 'id' in data and data['id'] != obj_id:
            raise ApiException(409, "Cannot change ID")

        data = self._mutableAttributes(data, obj)
        self.doCallback(
            'api_patch.data',
            data,
            obj,
            )

        obj.update(data)
        self.doCallback(
            'api_patch.object',
            obj,
            )

        obj.compute()
        obj = self.datamapper.update(obj)

        return jsonify(self._exposeAttributes(obj))

    def api_delete(self, obj_id):
        self.doCallback('api_delete', obj_id)

        obj = self.datamapper.getById(obj_id)
        if not obj:
            raise ApiException(404, "Object not found")

        self.doCallback(
            'api_delete.object',
            obj,
            )

        try:
            self.datamapper.delete(obj)
        except IntegrityError as ie:
            print ie
            raise ApiException(409, "The object is used elsewhere")

        return jsonify(self._exposeAttributes(obj))

    def api_recompute(self, obj_id=None):
        self.doCallback('api_recompute', obj_id)

        data = request.get_json()
        if obj_id is not None \
                and 'id' in data \
                and data['id'] != obj_id:
            raise ApiException(409, "Cannot change ID")

        obj = self.datamapper.getById(obj_id)
        if obj is not None:
            self.doCallback(
                'api_patch.original',
                obj,
                )

        data = self._mutableAttributes(data, obj)
        self.doCallback(
            'api_recompute.data',
            data,
            )

        if obj is None:
            obj = self.datamapper.create(data)
            self.doCallback(
                'api_post.object',
                obj,
                )
        else:
            obj.update(data)
            self.doCallback(
                'api_patch.object',
                obj,
                )

        obj.compute()

        return jsonify(self._exposeAttributes(obj))
