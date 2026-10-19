#!/usr/bin/env python3
"""Check published pages for missing local href/src targets and wrong site URLs."""

import sys
import json
import re
from html import unescape
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit

from rendered_content import ContentStructure, rendering_errors, news_errors

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

# Verify the professional pages as generated, catching template/data wiring failures.
def visible_text(path):
    return " ".join(unescape(re.sub(r"<[^>]+>", " ", path.read_text(encoding="utf-8"))).split())

resume = json.loads((root / "assets/json/resume.json").read_text())
home = (root / "index.html").read_text()
for route in ("index.html", "cv/index.html", "research/index.html", "teaching/index.html"):
    text = visible_text(root / route)
    if re.search(r"PhD candidate|Ph\.D\. Student|Currently a doctoral researcher", text, re.I):
        errors.append(f"{route}: obsolete candidate status")
    if "Coudenhove-Kalergi" in text:
        errors.append(f"{route}: obsolete university contact address")
for route in ("cv/index.html", "research/index.html"):
    text = visible_text(root / route)
    for paper in resume["publications"]:
        if paper["name"].casefold() not in text.casefold():
            errors.append(f"{route}: missing public research item {paper['name']}")
    if "abstract_id=7582999" not in (root / route).read_text():
        errors.append(f"{route}: missing QFI working-paper link")
errors.extend(f"index.html: {error}" for error in news_errors(home))
for route in ("cv/index.html", "research/index.html", "teaching/index.html"):
    source = (root / route).read_text()
    errors.extend(f"{route}: {error}" for error in rendering_errors(source))
    structure = ContentStructure()
    structure.feed(source)
    if route.startswith("cv/") and structure.cards < 9:
        errors.append(f"{route}: missing CV section cards")
    if route.startswith(("research/", "teaching/")) and structure.rows < 4:
        errors.append(f"{route}: missing publication/course rows")
for course in resume["teaching"]:
    if course["name"] not in visible_text(root / "teaching/index.html"):
        errors.append(f"teaching/index.html: missing course {course['name']}")
if not (root / "assets/pdf/Tugnetti_CV.pdf").read_bytes().startswith(b"%PDF-"):
    errors.append("Public CV download is not a PDF")

for name in ("robots.txt", "sitemap.xml"):
    path = root / name
    if not path.is_file() or "alshedivat.github.io" in path.read_text(encoding="utf-8"):
        errors.append(f"{name}: missing or contains the template site's host")

if errors:
    sys.exit("\n".join(errors))
print(f"Checked {len(pages)} pages: internal targets and site URLs are valid.")
