# -*- coding: utf-8 -*-
from flask import g

from ..models import datamapper_factory

def get_datamapper(datamapper):
    """Returns a datamapper for a type.
    """
    if not hasattr(g, 'datamappers'):
        g.datamappers = {}
    if datamapper not in g.datamappers:
        g.datamappers[datamapper] = datamapper_factory(datamapper)
    return g.datamappers[datamapper]
