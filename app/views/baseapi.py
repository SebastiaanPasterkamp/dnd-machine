# -*- coding: utf-8 -*-
from flask import (
    Blueprint,
    render_template,
    request,
    jsonify,
    redirect,
    url_for,
    abort
    )

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

        self._callbacks = dict(
            (callback, func)
            for func in self.__class__.__dict__.values()
            if callable(func) \
                and hasattr(func, '_callbacks')
            for callback in func._callbacks
            )

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
        if key not in self._callbacks:
            return args[0] if len(args) else None
        result = self._callbacks[key](self, *args, **kwargs)
        return result

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

    def overview(self, *args, **kwargs):
        self.doCallback('overview', *args, **kwargs)
        return render_template(
            'reactjs-layout.html'
            )

    def show(self, obj_id, *args, **kwargs):
        self.doCallback('show', obj_id, *args, **kwargs)
        return render_template(
            'reactjs-layout.html'
            )

    def newObj(self, *args, **kwargs):
        self.doCallback('new', *args, **kwargs)
        return render_template(
            'reactjs-layout.html'
            )

    def edit(self, obj_id, *args, **kwargs):
        self.doCallback('edit', obj_id, *args, **kwargs)
        return render_template(
            'reactjs-layout.html'
            )

    def raw(self, obj_id):
        self.doCallback('raw', obj_id)

        obj = self.datamapper.getById(obj_id)
        obj = self.doCallback(
            'raw.object',
            obj,
            )

        return jsonify(obj.config)

    def api_list(self, *args, **kwargs):
        self.doCallback('api_list', *args, **kwargs)

        objects = self.datamapper.getMultiple()
        objects = self.doCallback(
            'api_list.objects',
            objects,
            *args,
            **kwargs
            )

        return jsonify([
            self._exposeAttributes(obj, *args, **kwargs)
            for obj in objects
            ])

    def api_get(self, obj_id):
        self.doCallback('api_get', obj_id)

        obj = self.datamapper.getById(obj_id)
        if not obj:
            abort(404, "Object not found")

        obj = self.doCallback(
            'api_get.object',
            obj,
            )

        return jsonify(self._exposeAttributes(obj))

    def api_post(self):
        self.doCallback('api_post')

        data = request.get_json()
        data = self._mutableAttributes(data)
        data = self.doCallback(
            'api_post.data',
            data,
            )

        obj = self.datamapper.create(data)
        if 'id' in obj and obj.id:
            abort(409, "Cannot create with existing ID")
        obj = self.doCallback(
            'api_post.object',
            obj,
            )

        obj.compute()
        obj = self.datamapper.insert(obj)

        return jsonify(self._exposeAttributes(obj))

    def api_patch(self, obj_id):
        self.doCallback('api_patch', obj_id)

        obj = self.datamapper.getById(obj_id)
        if not obj:
            abort(404, "Object not found")

        obj = self.doCallback(
            'api_patch.original',
            obj,
            )

        data = request.get_json()
        if 'id' in data and data['id'] != obj_id:
            abort(409, "Cannot change ID")

        data = self._mutableAttributes(data, obj)
        data = self.doCallback(
            'api_patch.data',
            data,
            obj,
            )

        obj.update(data)
        obj = self.doCallback(
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
            abort(404, "Object not found")

        obj = self.doCallback(
            'api_delete.object',
            obj,
            )

        self.datamapper.delete(obj)

        return jsonify(self._exposeAttributes(obj))

    def api_recompute(self, obj_id=None):
        self.doCallback('api_recompute', obj_id)

        data = request.get_json()
        if obj_id is not None \
                and 'id' in data \
                and data['id'] != obj_id:
            abort(409, "Cannot change ID")

        obj = self.datamapper.getById(obj_id)
        if obj is not None:
            obj = self.doCallback(
                'api_patch.original',
                obj,
                )

        data = self._mutableAttributes(data, obj)
        data = self.doCallback(
            'api_recompute.data',
            data,
            )

        if obj is None:
            obj = self.datamapper.create(data)
            obj = self._api_post_filter(obj)
            obj = self.doCallback(
                'api_post.object',
                obj,
                )
        else:
            obj.update(data)
            obj = self.doCallback(
                'api_patch.object',
                obj,
                )

        obj.compute()

        return jsonify(self._exposeAttributes(obj))
