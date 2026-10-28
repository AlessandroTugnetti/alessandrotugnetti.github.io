import sys
import unittest
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'bin'))
from rendered_content import rendering_errors, news_errors, author_link_errors, LinkedText


class RenderedContentTests(unittest.TestCase):
    def test_escaped_layout_html_is_rejected_but_bibtex_is_allowed(self):
        self.assertTrue(rendering_errors('<pre><code>&lt;h3&gt;Published articles&lt;/h3&gt;\n&lt;div class="row"&gt;</code></pre>'))
        self.assertFalse(rendering_errors('<div class="row"><h3>Published articles</h3></div><pre><code>@article{paper, title={Paper}}</code></pre>'))

    def test_news_relationship_and_single_panel(self):
        source = ''.join(f'<button role="tab" id="news-tab-{y}" aria-controls="news-panel-{y}" aria-selected="{str(y==2026).lower()}" tabindex="{0 if y==2026 else -1}">{y}</button><div role="tabpanel" id="news-panel-{y}" aria-labelledby="news-tab-{y}" {"" if y==2026 else "hidden"}></div>' for y in range(2026,2019,-1))
        self.assertEqual(news_errors(source), [])
        self.assertTrue(news_errors(source.replace('hidden','')))

    def test_author_names_require_the_correct_identity_link(self):
        identities = [{'aliases': ['Roman Kräussl', 'Roman Kraussl'], 'url': 'https://example.org/roman'}]
        valid = '<div class="author"><a href="https://example.org/roman">Roman Kräussl</a> and Lorenzo Toscano</div>'
        self.assertEqual(author_link_errors(valid, identities), [])
        self.assertTrue(author_link_errors(valid.replace('https://example.org/roman', 'https://example.org/wrong'), identities))
        self.assertTrue(author_link_errors(valid.replace('Lorenzo Toscano', '<a href="https://example.org/lorenzo">Lorenzo Toscano</a>'), identities))
        linked = LinkedText(); linked.feed('<a href="https://example.org"><em>Journal name</em></a>')
        self.assertIn(('Journal name', 'https://example.org'), linked.links)


if __name__ == '__main__':
    unittest.main()
