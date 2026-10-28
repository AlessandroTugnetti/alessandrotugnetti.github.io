#!/usr/bin/env python3
"""Check published pages for missing local href/src targets and wrong site URLs."""

import sys
import json
import re
from html import unescape
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit

from rendered_content import ContentStructure, rendering_errors, news_errors, LinkedText, author_link_errors

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
research_source = (root / "research/index.html").read_text()
for article_id in ("qjMakFHDy7sC", "2osOgNQ5qMEC"):
    if f"citation_for_view=nD56QvQAAAAJ:{article_id}" not in research_source:
        errors.append(f"research/index.html: missing correct Scholar article link {article_id}")
if "citation_for_view=nD56QvQAAAAJ:nD56QvQAAAAJ" in research_source:
    errors.append("research/index.html: Scholar profile ID incorrectly used as article ID")
if len(re.findall(r'alt="\d+ Google Scholar citations \(checked \d{4}-\d{2}-\d{2}\)"', research_source)) != 2:
    errors.append("research/index.html: Scholar counts must include a verified check date")
if "self-assessed" in visible_text(root / "cv/index.html"):
    errors.append("cv/index.html: removed language qualifier still present")
# Academy mentions must remain linked wherever the name is visible.
academy_url = "https://we-stem.org/prorgams-2026-applied-data-ai-fintech-academy/"
class AcademyLinks(HTMLParser):
    def __init__(self, route):
        super().__init__()
        self.route = route
        self.href = None
    def handle_starttag(self, tag, attrs):
        if tag == "a": self.href = dict(attrs).get("href")
    def handle_endtag(self, tag):
        if tag == "a": self.href = None
    def handle_data(self, data):
        if any(name in data for name in ("WeSTEM+", "Applied Data & AI Academy")) and self.href != academy_url:
            errors.append(f"{self.route}: academy mention is not linked to the programme")
for route in ("index.html", "cv/index.html"):
    AcademyLinks(route).feed((root / route).read_text())
if 'datetime="2026-10-27"' not in home or "completion expected" in home:
    errors.append("index.html: academy News must record the actual 27 October start")
if "Saverio Capra" not in visible_text(root / "research/index.html") or "Saverio Cabra" in visible_text(root / "research/index.html"):
    errors.append("research/index.html: corrected QFI coauthor missing")
for paper in resume["publications"]:
    if paper["status"] == "Published article":
        if f'href="{paper["url"]}"' not in research_source:
            errors.append("research/index.html: missing published-paper title destination")
if "from planning and teaching to assessment" not in visible_text(root / "teaching/index.html"):
    errors.append("teaching/index.html: whole-course responsibility missing")
projects_path = root / "projects/index.html"
if not projects_path.is_file() or 'href="/projects/"' not in home:
    errors.append("Projects page/navigation missing")
if 'class="footer-hornet"' not in home or "Finance · Machine learning · Luxembourg" in visible_text(root / "index.html"):
    errors.append("index.html: requested Home visual changes missing")
identities = json.loads((Path(__file__).resolve().parents[1] / "_data/authors.json").read_text())
for route in ("index.html", "research/index.html", "cv/index.html"):
    source = (root / route).read_text()
    errors.extend(f"{route}: {e}" for e in author_link_errors(source, identities))
    if any(label in visible_text(root / route) for label in ("Read the article", "Teaching details", "Let’s connect", "Credential ID:")):
        errors.append(f"{route}: redundant link label remains")
cv_links = LinkedText()
cv_links.feed((root / "cv/index.html").read_text())
for collection, field in (("certificates", "name"), ("education", "studyType"), ("awards", "title"), ("volunteer", "organization"), ("publications", "name")):
    for item in resume[collection]:
        if item.get("url") and (item[field], item["url"]) not in cv_links.links:
            errors.append(f"cv/index.html: name is missing its link: {item[field]}")
home_links = LinkedText()
home_links.feed(home)
for name, url in (("European Financial Management", resume["publications"][0]["url"]), ("Journal of Economic Surveys", resume["publications"][1]["url"]), ("Design Execution and Evaluation of Research in Finance and Economics", "/teaching/")):
    if (name, url) not in home_links.links:
        errors.append(f"index.html: News name is missing its link: {name}")
for course in resume["teaching"]:
    if course["name"] not in visible_text(root / "teaching/index.html"):
        errors.append(f"teaching/index.html: missing course {course['name']}")
# Check the role and both colleague links separately in each requested location.
cv_source = (root / "cv/index.html").read_text()
role_regions = {
    "Home biography": re.search(r'class="intro-biography">(.*?)</div>', home, re.S),
    "Home News": re.search(r'<section class="terminal-news"(.*?)</section>', home, re.S),
    "CV experience": re.search(r'aria-labelledby="cv-experience"(.*?)</section>', cv_source, re.S),
}
for region, match in role_regions.items():
    if not match:
        errors.append(f"{region}: missing ADEM display region")
        continue
    source = match.group(1)
    text = " ".join(unescape(re.sub(r"<[^>]+>", " ", source)).split())
    links = LinkedText()
    links.feed(source)
    if "ADEM" not in text or (region != "Home biography" and "2 November 2026" not in text):
        errors.append(f"{region}: missing dated ADEM role")
    for name in ("Gabriele Marconi", "François-Xavier Borsi"):
        url = next(a["url"] for a in identities if name in a["aliases"])
        if (name, url) not in links.links:
            errors.append(f"{region}: missing colleague link {name}")
    if re.search(r"upcoming|I'll join|Starting 2 November", text):
        errors.append(f"{region}: role must use neutral dated wording")

bio = role_regions["Home biography"]
if bio:
    text = " ".join(unescape(re.sub(r"<[^>]+>", " ", bio.group(1))).split())
    ordered = ["machine learning", "Vice President", "WeSTEM+", "I work as a data scientist at ADEM, in the group of"]
    positions = [text.find(fragment) for fragment in ordered]
    if any(pos < 0 for pos in positions) or positions != sorted(positions):
        errors.append("Home biography: expected interests, QFI, WeSTEM+, then natural ADEM paragraph")
news = role_regions["Home News"]
if news:
    text = " ".join(unescape(re.sub(r"<[^>]+>", " ", news.group(1))).split())
    if not re.search(r'<time[^>]*datetime="2026-11-02"[^>]*>\s*\[2 November 2026\]\s*</time>', news.group(1)):
        errors.append("Home News: ADEM badge must show the full 2 November 2026 event date")
    if "I joined ADEM as a data scientist, in the group of" not in text:
        errors.append("Home News: natural ADEM announcement missing")

if not (root / "assets/pdf/Tugnetti_CV.pdf").read_bytes().startswith(b"%PDF-"):
    errors.append("Public CV download is not a PDF")

for name in ("robots.txt", "sitemap.xml"):
    path = root / name
    if not path.is_file() or "alshedivat.github.io" in path.read_text(encoding="utf-8"):
        errors.append(f"{name}: missing or contains the template site's host")

if errors:
    sys.exit("\n".join(errors))
print(f"Checked {len(pages)} pages: internal targets and site URLs are valid.")
