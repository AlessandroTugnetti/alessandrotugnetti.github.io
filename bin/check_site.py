#!/usr/bin/env python3
"""Check published pages for missing local href/src targets and wrong site URLs."""

import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit

SITE = "https://alessandrotugnetti.github.io"
root = Path(sys.argv[1] if len(sys.argv) > 1 else "_site").resolve()
errors = []


class Links(HTMLParser):
    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        for key in ("href", "src"):
            value = attrs.get(key, "")
            if not value or value.startswith(("#", "mailto:", "tel:", "javascript:", "data:")):
                continue
            target = urlsplit(urljoin(page_url, value))
            if target.netloc != urlsplit(SITE).netloc or target.scheme not in ("http", "https"):
                continue
            path = root / unquote(target.path).lstrip("/")
            if not path.is_file() and not (path / "index.html").is_file():
                errors.append(f"{relative}:{self.getpos()[0]}: missing {value}")
        if tag == "link" and attrs.get("rel") == "canonical":
            if urlsplit(attrs.get("href", "")).netloc != urlsplit(SITE).netloc:
                errors.append(f"{relative}: canonical URL uses the wrong host")


if not (root / "index.html").is_file():
    sys.exit(f"No generated site at {root}")

pages = sorted(path for path in root.rglob("*.html") if "assets" not in path.relative_to(root).parts)
for page in pages:
    relative = page.relative_to(root)
    page_url = SITE + "/" + relative.as_posix()
    parser = Links()
    parser.feed(page.read_text(encoding="utf-8"))

for name in ("robots.txt", "sitemap.xml"):
    path = root / name
    if not path.is_file() or "alshedivat.github.io" in path.read_text(encoding="utf-8"):
        errors.append(f"{name}: missing or contains the template site's host")

if errors:
    sys.exit("\n".join(errors))
print(f"Checked {len(pages)} pages: internal targets and site URLs are valid.")
