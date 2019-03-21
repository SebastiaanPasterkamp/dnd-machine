from flask import g
import re

def markdownToToc(markdown):
    re_titles = re.compile('^(#+) (.*?)\s*$', re.M)
    root = []
    level = 1

    current = root
    for match in re_titles.finditer(markdown):
        depth, title = match.groups()

        if len(depth) < level:
            current = root
            level = 0

        while len(depth) > level:
            if not current:
                current.append({'title': ''})
            current[-1]['children'] = current[-1].get('children', [])
            current = current[-1]['children']
            level += 1

        current.append({'title': title})
    return root

def indent(text, level=4):
    indent = " " * level
    return "\n".join([
        indent + line
        for line in text.split("\n")
        ])
