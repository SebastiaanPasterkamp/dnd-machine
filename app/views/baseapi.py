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

class BaseApiBlueprint(Blueprint):
    def __init__(self, name, fullname, basemapper, *args, **kwargs):
        super(BaseApiBlueprint, self).__init__(
            name, fullname, *args, **kwargs)

        self.name = name
        self.basemapper = basemapper

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
            self.new, methods=['GET', 'POST'])
        self.add_url_rule(
            '/raw/<int:obj_id>', 'raw',
            self.raw)
        self.add_url_rule(
            '/edit/<int:obj_id>', 'edit',
            self.edit, methods=['GET', 'POST'])

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

    def index(self):
        return redirect(url_for('%s.overview' % self.name))

    def overview(self, *args, **kwargs):
        return render_template(
            'reactjs-layout.html'
            )

    def show(self, *args, **kwargs):
        return render_template(
            'reactjs-layout.html'
            )

    def new(self, *args, **kwargs):
        return render_template(
            'reactjs-layout.html'
            )

    def edit(self, *args, **kwargs):
        return render_template(
            'reactjs-layout.html'
            )

    def _raw_filter(self, obj):
        return obj

    def raw(self, obj_id):
        obj = self.datamapper.getById(obj_id)

        obj = self._raw_filter(obj)

        if not obj:
            return jsonify(None)

        return jsonify(obj.config)

    def _api_list_filter(self, objs):
        return objs

    def api_list(self):
        objects = self.datamapper.getMultiple()

        objects = self._api_list_filter(objects)

        return jsonify([
            self._exposeAttributes(obj)
            for obj in objects
            ])

    def _api_get_filter(self, obj):
        return obj

    def api_get(self, obj_id):
        obj = self.datamapper.getById(obj_id)

        obj = self._api_get_filter(obj)

        if not obj:
            return jsonify(None)

        return jsonify(self._exposeAttributes(obj))

    def _api_post_filter(self, obj):
        return obj

    def api_post(self):
        update = request.get_json()
        update = dict(
            (key, value)
            for key, value in self._mutableAttributes(update).items()
            )

        obj = self.datamapper.create(update)

        if 'id' in obj and obj.id:
            abort(409, "Cannot create with existing ID")

        obj = self._api_post_filter(obj)

        if not obj:
            return jsonify(None)

        obj.compute()
        obj = self.datamapper.insert(obj)

        return jsonify(self._exposeAttributes(obj))

    def _api_patch_filter(self, obj):
        return obj

    def api_patch(self, obj_id):
        obj = self.datamapper.getById(obj_id)
        if not obj:
            abort(404, "Object not found")

        update = request.get_json()
        update = dict(
            (key, value)
            for key, value in self._mutableAttributes(
                update, obj
                ).items()
            )
        obj.update(update)

        if 'id' not in obj or obj.id != obj_id:
            abort(409, "Cannot change ID")

        obj = self._api_patch_filter(obj)
        if not obj:
            return jsonify(None)

        obj.compute()

        obj = self.datamapper.update(obj)

        return jsonify(self._exposeAttributes(obj))

    def _api_delete_filter(self, obj):
        abort(403, "Not implemented")

    def api_delete(self, obj_id):
        obj = self.datamapper.getById(obj_id)
        if not obj:
            abort(404, "Object not found")

        obj = self._api_delete_filter(obj)

        if not obj:
            return jsonify(None)

        self.datamapper.delete(obj)

        return jsonify(self._exposeAttributes(obj))

    def _api_recompute_filter(self, obj):
        return obj

    def api_recompute(self, obj_id=None):
        update = request.get_json()
        obj = self.datamapper.getById(obj_id)
        update = dict(
            (key, value)
            for key, value in self._mutableAttributes(
                update, obj
                ).items()
            )

        if obj is None:
            obj = self.datamapper.create(update)
            obj = self._api_post_filter(obj)
        else:
            obj.update(update)
            if 'id' not in obj or obj.id != obj_id:
                abort(409, "Cannot change ID")
            obj = self._api_patch_filter(obj)

        obj = self._api_recompute_filter(obj)

        obj.compute()

        return jsonify(self._exposeAttributes(obj))
