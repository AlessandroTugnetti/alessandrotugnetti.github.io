"""Structural checks for public-page rendering, independent of page wording."""
import re
from html.parser import HTMLParser


class ContentStructure(HTMLParser):
    def __init__(self):
        super().__init__()
        self.code_depth = 0
        self.code_text = []
        self.tabs = []
        self.panels = []
        self.cards = 0
        self.rows = 0

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if tag in ('pre', 'code'):
            self.code_depth += 1
        if attrs.get('role') == 'tab':
            self.tabs.append(attrs)
        if attrs.get('role') == 'tabpanel':
            self.panels.append(attrs)
        classes = attrs.get('class', '').split()
        self.cards += 'card' in classes
        self.rows += 'row' in classes

    def handle_endtag(self, tag):
        if tag in ('pre', 'code'):
            self.code_depth = max(0, self.code_depth - 1)

    def handle_data(self, data):
        if self.code_depth:
            self.code_text.append(data)


def rendering_errors(source):
    parser = ContentStructure()
    parser.feed(source)
    # Bibliographic code is legitimate; escaped layout HTML is not.
    if re.search(r'</?(?:div|h[1-6]|section|article|ol|ul|li|p)(?:\s|>)', ''.join(parser.code_text), re.I):
        return ['layout HTML rendered as visible code']
    return []


def news_errors(source):
    parser = ContentStructure()
    parser.feed(source)
    tabs, panels = parser.tabs, parser.panels
    errors = []
    years = [int(t['id'].removeprefix('news-tab-')) for t in tabs]
    if years != sorted(set(years), reverse=True) or not set(range(2020, 2027)).issubset(years):
        errors.append('News tabs must have unique descending years including 2020–2026')
    if len(tabs) != len(panels) or not tabs:
        errors.append('News tabs and panels must be paired')
    selected = [t for t in tabs if t.get('aria-selected') == 'true']
    visible = [p for p in panels if 'hidden' not in p]
    if len(selected) != 1 or len(visible) != 1:
        errors.append('News must show exactly one selected tab and one panel')
    for tab, panel in zip(tabs, panels):
        if tab.get('aria-controls') != panel.get('id') or panel.get('aria-labelledby') != tab.get('id'):
            errors.append('News tab/panel ARIA relationship is broken')
        active = tab.get('aria-selected') == 'true'
        if active != ('hidden' not in panel) or tab.get('tabindex') != ('0' if active else '-1'):
            errors.append('News visibility and focus order disagree')
    return errors


class LinkedText(HTMLParser):
    """Collect visible link labels and complete publication-author rows."""
    def __init__(self):
        super().__init__()
        self.links = []
        self.author_rows = []
        self.depth = 0
        self.author_depth = None
        self.row_text = []
        self.row_links = []
        self.anchor = None
        self.label = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'div':
            self.depth += 1
            if 'author' in attrs.get('class', '').split():
                self.author_depth = self.depth
                self.row_text, self.row_links = [], []
        if tag == 'a':
            self.anchor = attrs.get('href', '')
            self.label = []

    def handle_data(self, text):
        if self.anchor is not None:
            self.label.append(text)
        if self.author_depth is not None:
            self.row_text.append(text)

    def handle_endtag(self, tag):
        if tag == 'a' and self.anchor is not None:
            item = (' '.join(''.join(self.label).split()), self.anchor)
            self.links.append(item)
            if self.author_depth is not None:
                self.row_links.append(item)
            self.anchor = None
        if tag == 'div':
            if self.depth == self.author_depth:
                self.author_rows.append((' '.join(''.join(self.row_text).split()), self.row_links))
                self.author_depth = None
            self.depth -= 1


def author_link_errors(source, identities):
    parsed = LinkedText()
    parsed.feed(source)
    errors = []
    if not parsed.author_rows:
        errors.append("publication author rows are missing")
    for text, links in parsed.author_rows:
        for identity in identities:
            names = [name for name in identity['aliases'] if name in text]
            if names and not any((name, identity['url']) in links for name in names):
                errors.append(f'publication author missing identity link: {names[0]}')
        if any(name == 'Lorenzo Toscano' for name, _ in links):
            errors.append('Lorenzo Toscano must remain unlinked')
    return errors
