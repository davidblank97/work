# AGENTS.md

## Project overview

`Schedule_editor/` contains a browser-based editor for Liburdi welding schedule XML files (`<sched>` root with `description`, `global`, `limits`, `overrides` and `segment` sections). Everything runs client-side; files are only written when the user downloads them.

## Key files

- `Lib_Schedule_Editor_v3_0.html`: current version (Liburdi Schedule Suite 3.0). Start page + router at the top/bottom of the file; the Schedule Editor lives unchanged in `<template id="app-editor">` (embedded JSZip, CSS, app JavaScript), the WDR (Welddata) Converter in `<template id="app-wdr">`. Each app is started as its own document via `iframe.srcdoc` (same origin, `<base href>` set to the suite URL) and kept alive when switching. Edit the apps inside their templates; never put `</template>` inside an app.
- `Lib_Schedule_Editor_v2_9.html`: previous standalone editor, kept for reference.
- `Lib_Schedule_Editor_v2.html`, `_v2_7.html`, `_v2_8.html`, `Liburdi_Schedule_Suite_V1.0.html`: older versions, kept for reference. Do not edit unless asked.
- `segments_sorting.json`: priority order of segment fields; fetched only when served over http(s), otherwise the built-in `SEGMENT_SORTING_CONFIG` is used.
- `README_v3_0.md`: user documentation (German). Update it when behavior changes.
- `schedule_beispiel.xml`, `Test 2 Segmente.xml`: sample schedules for manual testing.
- `to_do`: open feature ideas from the user.

## Architecture notes (app script)

- State: `loadedFiles` (records from `createFileRecord`, each with a stable `id`), `selectedFiles` (indexes), `activeFile`, `changeLog` (persisted in localStorage, entries linked via `fileId`).
- History: `recordHistoryAction(label, fn)` for structural changes (string-based snapshots); field edits go through `registerChange` → `pendingEdit` → `commitPendingEdit`.
- Edits in non-segment sections are propagated to other selected files by `propagateValueToSelectedFiles` and must stay logged (change log + undo).
- Numbers are parsed with `parseNumberInput` (accepts decimal comma) and stored with the original number of decimals.
- localStorage is read through `readStoredJson` (tolerates corrupt values).

## Validation and usage

- Start a local server for the full feature set: `cd Schedule_editor && python3 -m http.server 8000`, then open `http://localhost:8000/Lib_Schedule_Editor_v3_0.html` (start page; `#editor` / `#wdr` open an app directly).
- There is no build or test pipeline. For quick checks, drive the page with Playwright: the apps are `about:srcdoc` frames inside the suite page.
- Manually test with the sample XML files: load, edit, undo/redo, save, batch save, comparison, heat input.

## Safe change guidance

- Prefer minimal, targeted edits; avoid broad refactors unless asked.
- Preserve XML serialization behavior (`XMLSerializer`) and the number formatting of existing values.
- Saving has no dialog and never rewrites `<note>`; `markFilesSaved` makes the saved state the new baseline.
- The UI (start page, editor, converter) is English. README_v3_0.md is German.
- New versions: prefer Git history over copying the HTML file to a new version number.
