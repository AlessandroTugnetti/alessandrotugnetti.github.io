# Public CV download

The download at `assets/pdf/Tugnetti_CV.pdf` is the exact English CV prepared for Fintech Recruits 2026 and selected by Alessandro on 29 October 2026. It contains the approved photo, three education entries, certificates and three research entries, with no PhD entry or target-role heading. The complete web CV retains its broader background independently.

The editable sources remain in `JobApplication/jobapplication/data/sources/lhoft-fintech-recruits-2026-en/`. The reviewed original is `JobApplication/jobapplication/archive/lhoft-fintech-recruits-2026-en/CV Tugnetti_en.pdf`, relative to the parent `CODEX_projects` folder. `_cv_source/build.json` records this provenance, the PDF hash and structural checks. Publishing this PDF is explicitly authorized by the user's choice of this complete English version, including its existing contact details.

## Update and verify

Generate and visually review future revisions in JobApplication using its approved one-page CV renderer. Import the reviewed PDF without changing its bytes:

```sh
python3 bin/build_public_cv.py --import-pdf "../JobApplication/jobapplication/archive/lhoft-fintech-recruits-2026-en/CV Tugnetti_en.pdf"
npm run cv:check
```

The import and CI check require Python with pypdf. Checks pin the exact PDF hash and verify one A4 page and the English CV sections. `npm run cv:build` validates imported mode without overwriting the selected download. Website resume edits cannot regenerate this PDF.

## Previous renderer

The retained local TeX, selection, class and fonts belong to the superseded public-only renderer. They are inactive while `build.json` uses `imported-jobapplication` mode. Git preserves its former PDF and build manifest. The retained YAAC class credits Christophe Roger and includes its LPPL 1.3c-or-later license notice; font notices remain unchanged.
