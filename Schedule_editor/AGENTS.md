# AGENTS.md

## Project overview

`Schedule_editor/` contains a browser-based editor for Liburdi welding schedule XML files (`<sched>` root with `description`, `global`, `limits`, `overrides` and `segment` sections). Everything runs client-side; files are only written when the user downloads them.

## Key files

- `Lib_Schedule_Editor_v3_0.html`: current version (Liburdi Schedule Suite 3.0). Start page + router at the top/bottom of the file; the Schedule Editor lives unchanged in `<template id="app-editor">` (embedded JSZip, CSS, app JavaScript), the WDR (Welddata) Converter in `<template id="app-wdr">`, the Pendant Key Layout Editor in `<template id="app-pendant">` (source `Pendant_layout/…_offline.html`, recoloured to the editor theme; its PDF preview stays light for printing). Each app is started as its own document via `iframe.srcdoc` (same origin, `<base href>` set to the suite URL) and kept alive when switching. Edit the apps inside their templates; never put `</template>` inside an app.
- `archive/`: older versions (`Lib_Schedule_Editor_v2*.html`, README v2.8/v2.9), kept for reference. Do not edit unless asked.
- Schema check: `validateAgainstXdr` / `getSchemaResult` (editor template) validate each file against the active XDR (built-in copy of `WELDSCHEDULE.XDR` in `<script id="defaultXdr">`, more versions in localStorage `scheduleEditorXdrSchemas`, managed in Tools › Settings). Save paths go through `confirmSchemaBeforeSave`. Schedules older than the XDR version legitimately differ; `upgradeDocument` (Tools › Schema Check › Upgrade) migrates them: keep values, add missing fields from the layout template chosen by head (`<script id="layoutNGRT">` / `id="layoutNG"`, copies of `Schedule_Org/Muster_schedules/8888…`/`7777…`), apply `SCHEMA_RENAMES`, drop unknown fields, order by XDR, set `config_version`, `jog_speed_edit_mode`=1. Reference 1.8.3.7 files: `04_HIC_PK_764_CS_NGRT_Rev1/`.
- `WELDSCHEDULE.XDR`: Liburdi schedule schema 1.8.3.7 (source of the built-in copy).
- `segments_sorting.json`: priority order of segment fields; fetched only when served over http(s), otherwise the built-in `SEGMENT_SORTING_CONFIG` is used.
- `README_v3_0.md`: user documentation (German). Update it when behavior changes.
- `schedule_beispiel.xml`, `Test 2 Segmente.xml`: sample schedules for manual testing.
- `text_doc/`: user notes (`to_do` with open feature ideas, heat input notes).

## Architecture notes (app script)

- State: `loadedFiles` (records from `createFileRecord`, each with a stable `id`), `selectedFiles` (indexes), `activeFile`, `changeLog` (persisted in localStorage, entries linked via `fileId`).
- History: `recordHistoryAction(label, fn)` for structural changes (string-based snapshots); field edits go through `registerChange` → `pendingEdit` → `commitPendingEdit`.
- Edits in non-segment sections are propagated to other selected files by `propagateValueToSelectedFiles` and must stay logged (change log + undo).
- Numbers are parsed with `parseNumberInput` (accepts decimal comma) and stored with the original number of decimals.
- localStorage is read through `readStoredJson` (tolerates corrupt values).
- WDR heat input evaluation (in `<template id="app-wdr">`, separate `<script>` before the main script):
  - `parseLiburdiLog` reads log versions 2 and 3; `evaluateHeatInput` mirrors the "Data" sheet of the old Excel template (row r = sample r−4).
  - `buildEvaluationWorkbook` and `buildSummaryWorkbook` write xlsx files through the small `XlSheet`/`xlBuildWorkbook` writer: JSZip with inline strings, formulas with cached values and scatter charts. SheetJS is not used for these files, because it cannot write charts.
  - Settings are stored in localStorage `wdrEvaluationSettings`; target ranges are read from the editor's `scheduleEditorHeatInputTargets`.
  - `tests/wdr-evaluation.test.js` compares the results with the template when `WDR_converter/template_metric_Short.xlsx` exists locally. That file is 60 MB and is not committed.

## Validation and usage

- Start a local server for the full feature set: `cd Schedule_editor && python3 -m http.server 8000`, then open `http://localhost:8000/Lib_Schedule_Editor_v3_0.html` (start page; `#editor` / `#wdr` open an app directly).
- Browser tests live in `tests/` (Playwright, Chromium; they start their own static server):
  `cd Schedule_editor/tests && npm install && npx playwright install chromium && npm test` (filter: `node run.js upgrade`).
  Each `*.test.js` exports `[{ name, run(t) }]`; `t.openApp("editor"|"wdr")` returns `{ page, frame }` (the app is an `about:srcdoc` frame), `t.check(name, ok, detail)` records results. Add a test for every behavior change and keep `npm test` green.
- Manually test with the sample XML files: load, edit, undo/redo, save, batch save, comparison, heat input.

## Safe change guidance

- Prefer minimal, targeted edits; avoid broad refactors unless asked.
- Preserve XML serialization behavior (`XMLSerializer`) and the number formatting of existing values.
- Save (`saveActiveFile`) does not download: it logs a "Saved" change-log entry and makes the state the new baseline (`markFilesSaved`). Downloads only happen in Batch Save (`markFilesDownloaded`, tracks `file.exportedXmlString`; `needsDownload` drives "Saved ↓"). Save As was removed. Never rewrite `<note>`.
- The UI (start page, editor, converter) is English. README_v3_0.md is German.
- New versions: prefer Git history over copying the HTML file to a new version number.
