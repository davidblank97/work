# AGENTS.md

## Project overview

`Schedule_editor/` contains a browser-based editor for Liburdi welding schedule XML files (`<sched>` root with `description`, `global`, `limits`, `overrides` and `segment` sections). Everything runs client-side; files are only written when the user downloads them.

## Key files

- `Lib_Schedule_Editor_v2_9.html`: current editor. Single self-contained file: embedded JSZip (top `<script>`), CSS (`<style>`), application JavaScript (last `<script>`).
- `Lib_Schedule_Editor_v2.html`, `_v2_7.html`, `_v2_8.html`: older versions, kept for reference. Do not edit unless asked.
- `segments_sorting.json`: priority order of segment fields; fetched only when served over http(s), otherwise the built-in `SEGMENT_SORTING_CONFIG` is used.
- `README_v2_9.md`: user documentation (German). Update it when behavior changes.
- `schedule_beispiel.xml`, `Test 2 Segmente.xml`: sample schedules for manual testing.
- `to_do`: open feature ideas from the user.

## Architecture notes (app script)

- State: `loadedFiles` (records from `createFileRecord`, each with a stable `id`), `selectedFiles` (indexes), `activeFile`, `changeLog` (persisted in localStorage, entries linked via `fileId`).
- History: `recordHistoryAction(label, fn)` for structural changes (string-based snapshots); field edits go through `registerChange` → `pendingEdit` → `commitPendingEdit`.
- Edits in non-segment sections are propagated to other selected files by `propagateValueToSelectedFiles` and must stay logged (change log + undo).
- Numbers are parsed with `parseNumberInput` (accepts decimal comma) and stored with the original number of decimals.
- localStorage is read through `readStoredJson` (tolerates corrupt values).

## Validation and usage

- Start a local server for the full feature set: `cd Schedule_editor && python3 -m http.server 8000`, then open `http://localhost:8000/Lib_Schedule_Editor_v2_9.html`.
- There is no build or test pipeline. For quick checks, extract the last `<script>` block and run `node --check`, or drive the page with jsdom (needs an `innerText` polyfill).
- Manually test with the sample XML files: load, edit, undo/redo, save, batch save, comparison, heat input.

## Safe change guidance

- Prefer minimal, targeted edits; avoid broad refactors unless asked.
- Preserve XML serialization behavior (`XMLSerializer`) and the number formatting of existing values.
- Keep the save note restricted to letters, digits and whitespace (`sanitizeNoteText`): the welding machine requires this.
- Most user-facing text is German; preserve localized labels and messages.
- New versions: prefer Git history over copying the HTML file to a new version number.
