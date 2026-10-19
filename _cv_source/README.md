# Public CV

`assets/json/resume.json` supplies the public CV page, Research and Teaching pages, and the downloadable PDF. It is a public profile, separate from the tailored JobApplication pipeline. QFI is included here by explicit request.

Run `npm run cv:build` after changing the data, then inspect every PDF page. This uses Python 3, pdfLaTeX and the copied myPKA house style. The editable `main.tex` is generated from the JSON by `bin/build_public_cv.py`; preserve the copied style files. The layout retains A4, 11-point Charter, matching mathematics, 1.5 line spacing and house margins. The PDF is a general public CV, without private addresses or referees’ contact details.

`npm run cv:check` requires the generated source and the validated PDF to match the data. CI verifies their hashes without requiring a TeX installation. Build intermediates are ignored. Existing PDF history remains recoverable in Git.

Home News are maintained separately in `_data/home_news.yml`, grouped by year. Dates preserve known precision: `YYYY`, `YYYY-MM`, or `YYYY-MM-DD`. Do not invent a month or day to satisfy a date field. Horizontal year tabs in the News header show one year at a time, with the latest year selected initially. Arrow keys, Home and End switch tabs; the bar scrolls on narrow screens.
