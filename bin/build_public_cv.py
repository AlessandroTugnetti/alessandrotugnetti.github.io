#!/usr/bin/env python3
"""Build/check the one-page public CV using the approved JobApplication layout.

The web CV is complete. This PDF deliberately selects experience, education,
training, skills and two published papers, excluding QFI and other working papers.
"""
import argparse
import hashlib
import json
import re
from pathlib import Path
import shutil
import subprocess

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'assets/json/resume.json'
SOURCE = ROOT / '_cv_source'
PDF = ROOT / 'assets/pdf/Tugnetti_CV.pdf'


def tex(text):
    substitutions = {'\\': r'\textbackslash{}', '&': r'\&', '%': r'\%', '$': r'\$', '#': r'\#', '_': r'\_', '{': r'\{', '}': r'\}', '~': r'\textasciitilde{}', '^': r'\textasciicircum{}', '–': '--', '’': "'", '“': '``', '”': "''", '·': r'\textperiodcentered{}'}
    return ''.join(substitutions.get(c, c) for c in str(text))


def generate(r):
    selection = json.loads((SOURCE / 'selection.json').read_text())
    b = r['basics']
    papers = [p for p in r['publications'] if p['status'] == selection['selected_publication_status']]
    assert len(papers) == 2, 'The short PDF selects exactly two published articles'
    assert len(r['work']) == len(selection['experience_bullets']) == 4
    out = r'''% Approved JobApplication editus-one-page-v1 layout, public short-CV adaptation.
% YAAC class: Christophe Roger; retained class license and font notices apply.
\documentclass[localFont,alternative]{yaac-another-awesome-cv}
\newcommand{\decorativeicon}[1]{#1}
\input{layout-overrides}
\def\cvwithoutphoto{1}
\newcommand{\candidatefirstname}{Alessandro}
\newcommand{\candidatelastname}{Tugnetti}
\newcommand{\candidateemail}{'''+tex(b['email'])+r'''}
\newcommand{\candidatewebsite}{alessandrotugnetti.github.io}
\newcommand{\candidatephoneuri}{}
\newcommand{\candidatephonedisplay}{}
\hypersetup{pdflang=en,pdftitle={Alessandro Tugnetti - Curriculum Vitae},pdfauthor={Alessandro Tugnetti}}
% Public-only contacts. No phone, address, date of birth, nationality or referees.
\renewcommand{\makecvsidebar}{%
\begin{tikzpicture}[remember picture,overlay]
\node[anchor=north west,inner sep=0pt] at ([xshift=0.5cm,yshift=-0.8cm]current page.north west) {%
\begin{minipage}[t]{6.95cm}
\centering
{\color{white}\fontsize{25pt}{27pt}\selectfont\bfseries Alessandro\par Tugnetti\par}
\vspace{1.5em}\raggedright
\sidebarlink{\faAt}{mailto:\candidateemail}{\candidateemail}
\sidebarcontact{\faMapMarker}{}{Luxembourg}
\sidebarlink{\faLinkedin}{https://www.linkedin.com/in/alessandrotugnetti/}{linkedin.com/in/alessandrotugnetti}
\sidebarlink{\faGithub}{https://github.com/AlessandroTugnetti}{github.com/AlessandroTugnetti}
\sidebarlink{\faGlobe}{https://alessandrotugnetti.github.io/}{alessandrotugnetti.github.io}
\sidebarsection{Education}{\faGraduationCap}
'''
    for e in r['education']:
        out += r'\sidebareducationentry{'+tex(e['period'])+'}{'+tex(e['studyType'])+'}{'+tex(e['institution'])+'}\n'
    out += r'\sidebarsection{Core Expertise}{\faTasks}'+'\n'
    for label, value in [('Modelling', 'Statistics, machine learning, forecasting'), ('Data', 'Python, R, MATLAB, Stata, SQL'), ('Delivery', 'Research, data quality, teaching')]:
        out += r'\sidebarkeywordsentry{'+tex(label)+'}{'+tex(value)+'}\n'
    out += r'\sidebarsection{Languages}{\faGlobe}'+'\n'
    for e in r['languages']:
        level = re.sub(r'\s*\(self-assessed\)', '', e['fluency'], flags=re.I)
        out += r'\sidebarlanguageentry{'+tex(e['language'])+'}{'+tex(level)+'}\n'
    course = next(e for e in r['certificates'] if e['issuer'] == 'WeSTEM+')
    out += r'\sidebarsection{Development}{\faBook}'+'\n'
    academy_url = 'https://we-stem.org/prorgams-2026-applied-data-ai-fintech-academy/'
    assert course['url'] == academy_url, 'Keep the approved academy URL in the public data'
    out += r'\sidebareducationentry{'+tex(course['period'])+'}{'+r'\href{'+academy_url+'}{'+tex(course['name'])+'}}{'+r'\href{'+academy_url+'}{WeSTEM+} | In progress}\n'
    out += r'''\end{minipage}};
\end{tikzpicture}}
\begin{document}
\hyphenpenalty=6500\exhyphenpenalty=6500\emergencystretch=2em
\makecvsidebar
\sectionTitle{Profile}{\faUser}
'''+tex(selection['profile'])+'\n'+r'\sectionTitle{Experience}{\faSuitcase}'+'\n'+r'\begin{experiences}'+'\n'
    cities = ['Luxembourg', 'Luxembourg', 'Turin, Italy', 'London, United Kingdom']
    for i, (e, bullets) in enumerate(zip(r['work'], selection['experience_bullets'])):
        # Full role date range is intentionally beneath the title to avoid clipping.
        out += r'\experience{}{'+tex(e['position'])+'}{'+tex(e['name'])+'}{'+tex(cities[i])+'}{}{'+r'\textbf{'+tex(e['period'])+'}'+r'\par\smallskip\begin{itemize}'
        out += ''.join(r'\item '+tex(bullet)+'\n' for bullet in bullets)
        out += r'\end{itemize}}{}'+'\n'
        if i < 3:
            out += r'\emptySeparator'+'\n'
    out += r'\end{experiences}'+'\n'+r'\sectionTitle{Selected Publications}{\faBook}'+'\n'+r'\begin{projects}'+'\n'
    for p in papers:
        out += r'\project{'+tex(p['name'])+'}{'+tex(p['period'])+'}{'+tex(p['authors'])+'}{'+r'\href{'+p['url']+'}{'+tex(p['citation'])+'}}{}\n'
    out += r'\end{projects}'+'\n'+r'\end{document}'+'\n'
    return out


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def inputs():
    files = [DATA, Path(__file__).resolve(), SOURCE/'selection.json', SOURCE/'main.tex', SOURCE/'layout-overrides.tex', SOURCE/'yaac-another-awesome-cv.cls']
    files.extend(sorted((SOURCE/'fonts').glob('*')))
    return {str(p.relative_to(ROOT)): digest(p) for p in files}


def verify_pdf():
    # Structural checks are separate from the required rendered-page review.
    from pypdf import PdfReader
    reader = PdfReader(PDF)
    assert len(reader.pages) == 1, 'Public download must be exactly one page'
    page = reader.pages[0]
    text = page.extract_text()
    normalized = re.sub(r"\s+", "", text).lower()
    positions = []
    def record(fragment, cm, tm, font, size):
        if fragment.strip():
            positions.append((fragment.strip(), tm[4]*cm[0]+tm[5]*cm[2]+cm[4]))
    page.extract_text(visitor_text=record)
    assert any('education' in t.lower() and x < 220 for t, x in positions), 'Missing left education column'
    assert any('profile' in t.lower() and x > 230 for t, x in positions), 'Missing right profile column'
    for forbidden in ['QFI', 'Labour-Market', 'self-assessed', '+352', 'Rue Richard', 'Referees']:
        assert re.sub(r'\s+', '', forbidden).lower() not in normalized, f'Unexpected public PDF content: {forbidden}'
    for required in ['Alessandro', 'Tugnetti', '2026', '2027', 'C1/C2', 'B1', 'Selected Publications', 'WeSTEM', '27 October 2026']:
        assert re.sub(r'\s+', '', required).lower() in normalized, f'Missing public PDF content: {required}'
    assert 'sidebarblue' in (SOURCE/'layout-overrides.tex').read_text()
    assert '\\makecvsidebar' in (SOURCE/'main.tex').read_text()
    # Public contact allowlist, including hyperlink annotations.
    uris = [str(a.get_object().get('/A', {}).get('/URI', '')) for a in page.get('/Annots', [])]
    allowed = ['mailto:alessandro.tugnetti@live.it', 'https://www.linkedin.com/in/alessandrotugnetti/', 'https://github.com/AlessandroTugnetti', 'https://alessandrotugnetti.github.io/', 'https://onlinelibrary.wiley.com/', 'https://we-stem.org/prorgams-2026-applied-data-ai-fintech-academy/']
    assert uris.count('https://we-stem.org/prorgams-2026-applied-data-ai-fintech-academy/') == 2, 'Academy and issuer must link to the programme'
    assert all(any(u.startswith(prefix) for prefix in allowed) for u in uris if u), 'Unexpected PDF contact/link'
    return {'pages': 1, 'layout': 'editus-one-page-v1', 'columns': 2, 'selected_papers': 2}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    generated = generate(json.loads(DATA.read_text()))
    manifest = SOURCE/'build.json'
    if args.check:
        assert (SOURCE/'main.tex').read_text() == generated, 'Short CV source is stale; run python3 bin/build_public_cv.py'
        state = json.loads(manifest.read_text())
        assert state['inputs'] == inputs(), 'Short CV inputs changed; rebuild the PDF'
        assert state['pdf_sha256'] == digest(PDF), 'PDF differs from the validated build'
        verify_pdf()
        print('Short public CV: one page, two columns, two published papers; source and PDF match.')
        return
    assert shutil.which('xelatex'), 'Install XeLaTeX to rebuild the public CV'
    (SOURCE/'main.tex').write_text(generated)
    build = SOURCE/'build'
    build.mkdir(exist_ok=True)
    for _ in range(2):
        subprocess.run(['xelatex', '-interaction=nonstopmode', '-halt-on-error', '-output-directory=build', 'main.tex'], cwd=SOURCE, check=True, stdout=subprocess.DEVNULL)
    log = (build/'main.log').read_text()
    assert 'Overfull \\hbox' not in log and 'Overfull \\vbox' not in log, 'CV contains overfull boxes'
    PDF.write_bytes((build/'main.pdf').read_bytes())
    qa = verify_pdf()
    manifest.write_text(json.dumps({'inputs': inputs(), 'pdf_sha256': digest(PDF), 'qa': qa}, indent=2)+'\n')
    print('Built short one-page public CV from the complete web CV and approved selection.')

if __name__ == '__main__':
    main()
