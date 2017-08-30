from flask import g
import re

from .models import datamapper_factory

def get_datamapper(datamapper):
    """Returns a datamapper for a type.
    """
    if not hasattr(g, 'datamappers'):
        g.datamappers = {}
    if datamapper not in g.datamappers:
        g.datamappers[datamapper] = datamapper_factory(datamapper)
    return g.datamappers[datamapper]

def markdownToToc(markdown):
    re_titles = re.compile('^(#+) (.*)', re.M)
    root = []
    level = 1

    current = root
    for match in re_titles.finditer(markdown):
        depth, title = match.groups()
        while len(depth) > level:
            if 'children' not in current[-1]:
                current[-1]['children'] = []
            current = current[-1]['children']
            level += 1
        if len(depth) > level:
            current = root
            level = len(depth)
            for _ in range(level):
                current = current[-1]['children']
        current.append({'title': title})
    return root
