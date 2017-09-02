# -*- coding: utf-8 -*-
import os
import json
from flask import Flask, request, session, g, redirect, url_for, abort, \
     render_template, flash, jsonify, Markup
from passlib.hash import pbkdf2_sha256 as password
import markdown
from markdown.util import etree
from markdown.blockprocessors import BlockProcessor
from markdown.extensions import Extension
import re

from .config import get_config, get_item_data
from .utils import get_datamapper
from .views.user import user
from .views.character import character
from .views.party import party
from .views.monster import monster
from .views.encounter import encounter
from .views.campaign import campaign

app = Flask(__name__)
app.register_blueprint(user, url_prefix='/user')
app.register_blueprint(character, url_prefix='/character')
app.register_blueprint(party, url_prefix='/party')
app.register_blueprint(monster, url_prefix='/monster')
app.register_blueprint(encounter, url_prefix='/encounter')
app.register_blueprint(campaign, url_prefix='/campaign')

# Load default config and override config from an environment variable
app.config.update(get_config())

app.config.from_envvar('FLASKR_SETTINGS', silent=True)

def init_db():
    db = get_db()
    with app.open_resource('schema.sql', mode='r') as f:
        db.cursor().executescript(f.read())
    db.execute("""
        INSERT INTO `users`
        VALUES (1,'admin','$pbkdf2-sha256$6400$/N87Z6w1xjgHwPifs3buPQ$7k8ZnhgsKVR0BW5mpwgro50PlGKBcWilBXIZyHHGddg','','{"role": ["admin", "dm"]}')
        """);
    db.commit()

@app.cli.command('initdb')
def initdb_command():
    """Initializes the database."""
    init_db()
    print('Initialized the database.')

def update_db():
    db = get_db()
    with app.open_resource('update.sql', mode='r') as f:
        db.cursor().executescript(f.read())
    db.commit()

@app.cli.command('updatedb')
def updatedb_command():
    """Updates the database."""
    update_db()
    print('Updated the database.')

@app.before_request
def get_user():
    """Checks if the user is logged in, and returns the user
    object"""
    if session.get('userid') is None \
            and request.endpoint not in ('login', 'static'):
        request.user = None
        if request.path != url_for('login'):
            return redirect(url_for('login'))
    else:
        user_mapper = get_datamapper('user')
        request.user = user_mapper.getById(session.get('userid'))

@app.before_request
def get_party():
    """Checks if the user is hosting a party"""
    if session.get('party_id') is not None:
        party_mapper = get_datamapper('party')
        request.party = party_mapper.getById(session.get('party_id'))
    else:
        request.party = None

@app.teardown_appcontext
def close_db(error):
    """Closes the database again at the end of the request."""
    if hasattr(g, 'sqlite_db'):
        g.sqlite_db.close()

@app.context_processor
def inject_metadata():
    config = get_config()
    items = get_item_data()
    return dict(
        info=config['info'],
        items=items
        )

@app.route('/')
def home():
    if session.get('userid') is None:
        return redirect(url_for('login'))
    return redirect(url_for('character.overview'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        db = get_db()
        name, pwd = request.form['username'], request.form['password']
        cur = db.execute("""
            SELECT `id`, `username`, `password`
            FROM `users`
            WHERE `username` = ?
            """,
            [name]
            )
        user = cur.fetchone()
        #if not user \
                #or not password.verify(pwd, user['password']):
            #flash('Login failed', 'error')
        #else:
        if True:
            session['userid'] = user['id']
            flash(
                'You are now logged in, %s' % user['username'],
                'info'
                )
            return redirect('/')
    return render_template(
        'login.html',
        info=app.config['info']
        )

@app.route('/logout')
def logout():
    session.pop('userid', None)
    session.pop('user', None)
    flash('You were logged out', 'info')
    return redirect(url_for('home'))

@app.route('/set_method/<method>')
def set_method(method):
    if method in ['lookup', 'formula']:
        session['method'] = method
        flash(
            "Your calculation method is now set to '%s'" % (
                session.get('method')
                ),
            'good'
            )
    else:
        flash("Unknown method '%s'" % method, 'error')
    return redirect(request.referrer)

@app.template_filter('sanitize')
def filter_sanitize(text):
    sanitize = re.compile(ur'[^a-zA-Z0-9]+')
    cleaned = sanitize.sub(text, '_')
    return cleaned

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

@app.template_filter('markdown')
def filter_markdown(md):
    html = markdown.markdown(md, extensions=[
        'markdown.extensions.tables',
        SpecialBlockQuoteExtension()
        ])
    return Markup(html)

@app.template_filter('named_headers')
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

@app.template_filter('md_internal_links')
def filter_md_internal_links(md):
    internalLinks = re.compile(
        ur"^(/(encounter|monster)/(\d+))", re.M)

    mappers = {
        'encounter': get_datamapper('encounter'),
        'monster': get_datamapper('monster')
        }

    for match in internalLinks.finditer(md):
        full, view, view_id = match.groups()
        obj = mappers[view].getById(int(view_id))

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

@app.template_filter('linked_objects')
def filter_linked_objects(md):
    internalLinks = re.compile(
        ur"^(/(encounter|monster)/(\d+))", re.M)

    mappers = {
        'encounter': get_datamapper('encounter'),
        'monster': get_datamapper('monster')
        }

    info = []
    for match in internalLinks.finditer(md):
        full, view, view_id = match.groups()
        obj = mappers[view].getById(int(view_id))

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

