# myPKA LaTeX house style

This folder is the reusable source for documents and presentations. It distills formatting rules from the user's private thesis archives. It does not contain thesis prose, data, figures, logos, or personal metadata.

## Document build

```bash
latexmk -pdf -interaction=nonstopmode -halt-on-error document-example.tex
```

The document uses A4 paper, 11 point Bitstream Charter text with Math Design's matching Charter mathematics, 1.5 line spacing, a 3 cm left margin, a 2.5 cm right margin, blue links, bold caption labels with period separators, APA author-year references, native LaTeX tables, and TikZ or PGFPlots visuals. The `charter` and `mathdesign` packages are required because the private thesis source specifies them directly.

## Presentation build

```bash
latexmk -pdf -interaction=nonstopmode -halt-on-error slides-example.tex
```

The presentation uses Beamer only, a 16:9 canvas, dark-blue structure, orange circular list markers, ruled frame titles, frame numbers, APA-like author-year citations, native LaTeX tables, and TikZ or PGFPlots visuals. Tables left-align only the first column and center every later heading and value.

## Citation API

Documents and slides use the same two commands:

```tex
\citet{example2025}                 % Researcher and Scholar (2025)
\citep{example2025}                 % (Researcher and Scholar, 2025)
\citep{example2025,companion2024}   % (Researcher and Scholar, 2025; Analyst and Economist, 2024)
```

Only each year is hyperlinked. Both commands accept comma-separated BibTeX keys, and multiple works are separated by semicolons. The phrase "multiple authors" is interpreted here as multiple cited works: authors belonging to one work remain joined by `and`, while separate works receive the semicolon separator.

Run `./build.sh all` for the default regression check. The script invokes each complete build twice and fails on unresolved references, unresolved citations, or overfull horizontal boxes.

The Beamer design is adapted from the SimplePlus theme by Pin-Yen Huang, version 1.1, which the reference archive identifies as released under the Unlicense: <https://github.com/pm25/SimplePlus-BeamerTheme>.

## Reuse

Copy this folder into a new deliverable directory. Rename `document-example.tex` or `slides-example.tex` to `main.tex`, then remove the unused example source. Keep the style files beside `main.tex` so the artifact remains self-contained.

Every generated plot, graph, and diagram must remain TikZ or PGFPlots source. External photographs, scans, supplied logos, and other non-generative images remain permitted exceptions under [[GL-007-latex-first-artifact-standard]].
