#!/usr/bin/env python3
"""Render the public CV from the same JSON used by Jekyll; never used by JobApplication."""
import argparse
import hashlib
import json
from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'assets/json/resume.json'
SOURCE = ROOT / '_cv_source'
PDF = ROOT / 'assets/pdf/Tugnetti_CV.pdf'


def tex(text):
    substitutions = {'\\': r'\textbackslash{}', '&': r'\&', '%': r'\%', '$': r'\$', '#': r'\#', '_': r'\_', '{': r'\{', '}': r'\}', '~': r'\textasciitilde{}', '^': r'\textasciicircum{}', '–': '--', '’': "'", '“': '``', '”': "''", '·': r'\textperiodcentered{}'}
    return ''.join(substitutions.get(c, c) for c in str(text))


def entry(title, meta, summary=''):
    result = r'\noindent\begin{minipage}{\linewidth}\raggedright\textbf{' + tex(title) + r'}\par\nobreak' + '\n'
    result += r'{\color{mypkalink}' + tex(meta) + '}\par\n'
    if summary:
        result += tex(summary) + '\\par\n'
    return result + r'\end{minipage}\par\smallskip' + '\n'


def generate(r):
    out = r'''\documentclass[11pt,a4paper]{report}
\usepackage{house-style/mypka-document}
\hyphenpenalty=10000\exhyphenpenalty=10000
\usepackage{fancyhdr}
\pagestyle{fancy}
\fancyhf{}
\fancyhead[L]{\small Alessandro Tugnetti}
\fancyhead[R]{\small Public curriculum vitae}
\fancyfoot[C]{\thepage}
\setlength{\headheight}{14pt}
\setcounter{secnumdepth}{0}
\makeatletter
\renewcommand\section{\@startsection{section}{1}{0pt}{1.2ex plus .2ex}{.6ex}{\Large\bfseries}}
\renewcommand\subsection{\@startsection{subsection}{2}{0pt}{1ex plus .2ex}{.5ex}{\large\bfseries}}
\makeatother
\raggedright
\hypersetup{pdftitle={Alessandro Tugnetti - Public CV},pdfauthor={Alessandro Tugnetti}}
\begin{document}
{\LARGE\bfseries Alessandro Tugnetti}\par
'''
    b = r['basics']
    out += tex(b['label']) + r'\par' + '\n'
    out += tex(b['location']['city']) + r'\quad\href{mailto:' + b['email'] + '}{' + tex(b['email']) + r'}\par' + '\n'
    out += r'\href{' + b['url'] + r'}{Website}\quad\href{' + b['profiles'][0]['url'] + r'}{LinkedIn}\quad\href{' + b['profiles'][1]['url'] + r'}{GitHub}\par\medskip' + '\n'
    out += tex(b['summary']) + '\n'
    out += r'\section*{Experience}' + '\n'
    for e in r['work']:
        out += entry(e['position'], e['name'] + ' · ' + e['period'], e['summary'])
    out += r'\section*{Education}' + '\n'
    for e in r['education']:
        out += entry(e['studyType'], e['institution'] + ' · ' + e['period'], e['summary'])
    out += r'\section*{Teaching}' + '\nUniversity of Luxembourg. Four curricular courses, plus the Python Camp.\par\medskip\n'
    for e in r['teaching']:
        title = e['name'] + (' (' + e['role'] + ')' if e.get('role') else '')
        out += entry(title, e['period'] + (' · ' + e['code'] if e['code'] else ''), e['program'])
    out += r'\section*{Research}' + '\n'
    for group in ['Published article', 'Working paper']:
        out += r'\subsection*{' + ('Published articles' if group == 'Published article' else 'Working papers') + '}\n'
        for e in r['publications']:
            if e['status'] != group:
                continue
            out += entry(e['name'], e['authors'], e.get('citation', e['status']) + (' ' + e['period'] if e['period'] else '') + ' ' + e['summary'])
            if e['url']:
                out += r'\href{' + e['url'] + '}{' + ('SSRN working paper' if 'ssrn' in e['url'] else 'Published article') + r'}\par\medskip' + '\n'
    out += r'\section*{Training \& Certifications}' + '\n'
    for e in r['certificates']:
        out += entry(e['name'], e['issuer'] + ' · ' + e['period'], e['summary'])
        if e['url']:
            out += r'\href{' + e['url'] + r'}{Credential}\par\medskip' + '\n'
    out += r'\section*{Honors, Recognition \& Programs}' + '\n'
    for e in r['awards']:
        out += entry(e['title'], e['awarder'] + ' · ' + e['period'], e['summary'])
    out += r'\section*{Languages}' + '\n'
    for e in r['languages']:
        out += tex(e['language'] + ': ' + e['fluency']) + r'\par' + '\n'
    out += r'\section*{Leadership \& Volunteering}' + '\n'
    for e in r['volunteer']:
        out += entry(e['position'], e['organization'] + ' · ' + e['period'], e['summary'])
    out += r'\section*{Skills}' + '\n'
    for e in r['skills']:
        out += entry(e['name'], ', '.join(e['keywords']))
    out += r'\end{document}' + '\n'
    return out


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    raw = DATA.read_bytes()
    generated = generate(json.loads(raw))
    manifest = SOURCE / 'build.json'
    if args.check:
        assert (SOURCE / 'main.tex').read_text() == generated, 'Public CV LaTeX is stale: run python3 bin/build_public_cv.py'
        state = json.loads(manifest.read_text())
        assert state['data_sha256'] == hashlib.sha256(raw).hexdigest(), 'Public CV data changed since PDF build'
        assert state['pdf_sha256'] == hashlib.sha256(PDF.read_bytes()).hexdigest(), 'Public CV PDF differs from validated build'
        print('Public CV source, data and PDF match.')
        return
    (SOURCE / 'main.tex').write_text(generated)
    build = SOURCE / 'build'
    build.mkdir(exist_ok=True)
    env = __import__('os').environ.copy()
    env['TEXINPUTS'] = str(SOURCE / 'house-style') + ':'
    for _ in range(2):
        subprocess.run(['pdflatex', '-interaction=nonstopmode', '-halt-on-error', '-output-directory=build', 'main.tex'], cwd=SOURCE, env=env, check=True, stdout=subprocess.DEVNULL)
    log = (build / 'main.log').read_text()
    assert 'Overfull \\hbox' not in log and 'Overfull \\vbox' not in log, 'CV contains overfull boxes'
    PDF.write_bytes((build / 'main.pdf').read_bytes())
    manifest.write_text(json.dumps({'data_sha256': hashlib.sha256(raw).hexdigest(), 'pdf_sha256': hashlib.sha256(PDF.read_bytes()).hexdigest()}, indent=2) + '\n')
    print('Built assets/pdf/Tugnetti_CV.pdf from assets/json/resume.json')


if __name__ == '__main__':
    main()
