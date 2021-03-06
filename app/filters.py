from flask import Markup, url_for

import markdown
from markdown.util import etree
from markdown.blockprocessors import BlockProcessor
from markdown.extensions import Extension
import re
import json
from functools import reduce

def filter_max(items):
    return max(items)

def filter_sanitize(text):
    sanitize = re.compile(r'[^a-zA-Z0-9]+')
    cleaned = sanitize.sub('_', text)
    return cleaned

def filter_unique(listing):
    unique = dict()
    order = []
    for item in listing:
        key = item['id'] if 'id' in item else json.dumps(item)
        if key not in order:
            order.append(key)
        u = unique[key] = unique.get(key, {
            'count': 0,
            'item': item
            })
        u['count'] += 1

    for key in order:
        yield unique[key]['count'], unique[key]['item']

def filter_field_title(field):
    replace = {
        '[]': '',
        '.+': '',
        '_': ' '
        }
    field = reduce(lambda a, kv: a.replace(*kv), iter(replace.items()), field)
    field = field.split('.')[-1]
    return field.capitalize()

def filter_bonus(number):
    if number > 0:
        return "+%d" % number
    return "%d" % number

def filter_coinage(value, extended=False):
    coinage = {
        'cp': 'Copper',
        'sp': 'Silver',
        'ep': 'Electrum',
        'gp': 'Gold',
        'pp': 'Platinum'
        }
    amount = []
    for coin in ['pp', 'gp', 'ep', 'sp', 'cp']:
        if coin in value:
            amount.append("%d %s" % (
                value[coin],
                coinage[coin] if extended else coin
                ))
    if not extended or len(amount) <= 1:
        return ', '.join(amount)
    return "%s and %s" % (
        ', '.join(amount[:-1]),
        amount[-1]
        )

def filter_distance(dist):
    if isinstance(dist, dict):
        if dist['min'] >= dist['max']:
            return "%(min)s ft." % dist
        return "%(min)s/%(max)s ft." % dist
    if isinstance(dist, int):
        return "%d ft." % dist
    return dist

def filter_classify(number, ranges={}):
    closest = min(
        ranges,
        key=lambda k: abs(ranges[k] - number)
        )
    return closest

def filter_completed(tabs, completed):
    current = True
    for tab in tabs:
        if tab in completed:
            yield tab, True, False
        else:
            yield tab, False, current
            current = False

def filter_by_name(name, items, default=None):
    matches = [
        item
        for item in items
        if item.get('name', item.get('code')) == name
        ]
    if matches:
        return matches[0]
    return default

def filter_json(structure):
    return json.dumps(
        structure,
        indent=4,
        separators=(',', ': ')
        )

class SpecialBlockQuoteProcessor(BlockProcessor):
    RE = re.compile(r'(^|\n)[ ]{0,3}\|(?:\(([^)]+)\))?[ ]?(.*)', re.M)

    def test(self, parent, block):
        return bool(self.RE.search(block))

    def run(self, parent, blocks):
        block = blocks.pop(0)
        css = ''
        m = self.RE.search(block)
        if m:
            css = m.group(2) or ''
            before = block[:m.start()]  # Lines before blockquote
            # Pass lines before blockquote in recursively for parsing forst.
            self.parser.parseBlocks(parent, [before])
            # Remove ``| `` from begining of each line.
            block = '\n'.join(
                [self.clean(line) for line in block[m.start():].split('\n')]
            )
        sibling = self.lastChild(parent)
        if sibling is not None \
                and sibling.tag == "blockquote" \
                and sibling.get('class') == css:
            # Previous block was a blockquote with the same class,
            # so set that as this blocks parent
            quote = sibling
        else:
            # This is a new blockquote. Create a new parent element.
            quote = etree.SubElement(parent, 'blockquote')
            quote.set('class', css)
        # Recursively parse block with blockquote as parent.
        # change parser state so blockquotes embedded in lists use p tags
        self.parser.state.set('blockquote')
        self.parser.parseChunk(quote, block)
        self.parser.state.reset()

    def clean(self, line):
        """ Remove ``|`` from beginning of a line. """
        m = self.RE.match(line)
        if line.strip() == "|":
            return ""
        elif m:
            return m.group(3)
        else:
            return line

class SpecialBlockQuoteExtension(Extension):
    """ Add configurable blockquotes to Markdown. """

    def extendMarkdown(self, md, md_globals):
        """ Add an instance of SpecialBlockQuoteProcessor to BlockParser.
        """
        if '|' not in md.ESCAPED_CHARS:
            md.ESCAPED_CHARS.append('|')
        md.parser.blockprocessors.add(
            'sbq', SpecialBlockQuoteProcessor(md.parser), '>hashheader'
            )

def filter_markdown(md):
    html = markdown.markdown(md, extensions=[
        'markdown.extensions.tables',
        'markdown.extensions.admonition',
        SpecialBlockQuoteExtension()
        ])
    return Markup(html)

def filter_named_headers(html):
    if isinstance(html, Markup):
        html = html.unescape()
    namedHeaders = re.compile(r'(<(h\d+)>([^<]+)</h\d+>)')

    for match in namedHeaders.finditer(html):
        full, header, title = match.groups()
        name = filter_sanitize(title)
        html = html.replace(
            full,
            '<a name="%(name)s"><%(header)s>%(title)s</%(header)s></a>' % {
                'name': filter_sanitize(title),
                'header': header,
                'title': title
                }
            )
    return Markup(html)
