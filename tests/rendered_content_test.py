import sys
import unittest
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'bin'))
from rendered_content import rendering_errors, news_errors


class RenderedContentTests(unittest.TestCase):
    def test_escaped_layout_html_is_rejected_but_bibtex_is_allowed(self):
        self.assertTrue(rendering_errors('<pre><code>&lt;h3&gt;Published articles&lt;/h3&gt;\n&lt;div class="row"&gt;</code></pre>'))
        self.assertFalse(rendering_errors('<div class="row"><h3>Published articles</h3></div><pre><code>@article{paper, title={Paper}}</code></pre>'))

    def test_news_relationship_and_single_panel(self):
        source = ''.join(f'<button role="tab" id="news-tab-{y}" aria-controls="news-panel-{y}" aria-selected="{str(y==2026).lower()}" tabindex="{0 if y==2026 else -1}">{y}</button><div role="tabpanel" id="news-panel-{y}" aria-labelledby="news-tab-{y}" {"" if y==2026 else "hidden"}></div>' for y in range(2026,2019,-1))
        self.assertEqual(news_errors(source), [])
        self.assertTrue(news_errors(source.replace('hidden','')))


if __name__ == '__main__':
    unittest.main()
