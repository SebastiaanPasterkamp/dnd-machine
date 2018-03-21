# -*- coding: utf-8 -*-
from flask import Blueprint, request, session, g, redirect, url_for, \
    abort, render_template, flash, jsonify

from .. import get_datamapper
from ..filters import filter_markdown

blueprint = Blueprint(
    'items', __name__, template_folder='templates')


@blueprint.route('/<string:item>/api')
def get_item(item):
    datamapper = get_datamapper()
    if item in datamapper.items:
        return jsonify(datamapper.items[item])
    abort(404)
