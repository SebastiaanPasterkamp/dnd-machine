from flask import Markup, url_for

import markdown
from markdown.util import etree
from markdown.blockprocessors import BlockProcessor
from markdown.extensions import Extension
import re
import md5

from . import get_datamapper

def filter_max(items):
    return max(items)

def filter_sanitize(text):
    sanitize = re.compile(ur'[^a-zA-Z0-9]+')
    cleaned = sanitize.sub('_', text)
    return cleaned

def filter_unique(listing):
    unique = dict()
    for item in listing:
        key = item['id'] if 'id' in item else filter_md5(item)
        u = unique[key] = unique.get(key, {
            'count': 0,
            'item': item
            })
        u['count'] += 1

    for u in unique.values():
        yield u['count'], u['item']

def filter_field_title(field):
    replace = {
        '[]': '',
        '.+': '',
        '_': ' '
        }
    field = reduce(lambda a, kv: a.replace(*kv), replace.iteritems(), field)
    field = field.split('.')[-1]
    return field.capitalize()

def filter_bonus(number):
    if number > 0:
        return "+%d" % number
    return "%d" % number

def filter_distance(dist):
    if isinstance(dist, dict):
        if dist['min'] >= dist['max']:
            return "%(min)d ft." % dist
        return "%(min)d/%(max)d ft." % dist
    return "%d ft." % dist

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
        if item['name'] == name
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

def filter_md5(data):
    if not isinstance(data, basestring):
        data = unicode(data)
    return md5.new(data).hexdigest()

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
        SpecialBlockQuoteExtension()
        ])
    return Markup(html)

def filter_named_headers(html):
    if isinstance(html, Markup):
        html = html.unescape()
    namedHeaders = re.compile(ur'(<(h\d+)>([^<]+)</h\d+>)')

    for match in namedHeaders.finditer(html):
        full, header, title = match.groups()
        name = filter_sanitize(title)
        html = html.replace(
            full,
            u'<a name="%(name)s"><%(header)s>%(title)s</%(header)s></a>' % {
                'name': filter_sanitize(title),
                'header': header,
                'title': title
                }
            )
    return Markup(html)

def filter_md_internal_links(md):
    datamapper = get_datamapper()

    internalLinks = re.compile(
        ur"^(/(encounter|monster)/(\d+))", re.M)

    for match in internalLinks.finditer(md):
        full, view, view_id = match.groups()
        obj = datamapper[view].getById(int(view_id))

        if obj is None:
            continue

        args = {'%s_id'%view: view_id}
        md = md.replace(
            full,
            u"**%(view)s**: [%(title)s](%(url)s)" % {
                'view': view.capitalize(),
                'title': obj['name'],
                'url': url_for('%s.show' % view, **args)
                }
            )
    return Markup(md)

def filter_linked_objects(md):
    datamapper = get_datamapper()

    internalLinks = re.compile(
        ur"^(/(encounter|monster)/(\d+))", re.M)

    info = []
    for match in internalLinks.finditer(md):
        full, view, view_id = match.groups()
        obj = datamapper[view].getById(int(view_id))

        if obj is None:
            continue

        args = {'%s_id'%view: view_id}
        info.append({
            'type': view,
            'id': view_id,
            'data': obj,
            'url': url_for('%s.show' % view, **args)
            })
    return info
