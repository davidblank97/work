# Schedule Editor (`<template id="app-editor">`)

Edits Liburdi schedule XML files. The root element is `<sched>`, with the sections `metadata`, `description`, `global`, `limits`, `overrides` and `segment`. Several files can be loaded at once. Everything runs client-side.

## Files
- `index.html`: markup and the include order: vendor JSZip → style → markup → `data/` blocks (`#defaultXdr`, `#layoutNGRT`, `#layoutNG`) → pdf.js as `text/x-library` (started on demand by `loadPdfJs`) → `js/01…13`.
- `js/NN-*.js`: one area per file. See `../MAP.md` for the list.

## State and conventions
- **State** (01): `loadedFiles` holds records from `createFileRecord`, each with a stable `id`. Also: `selectedFiles` (indexes), `activeFile`, `changeLog`.
- **History** (01):
  - Structural changes go through `recordHistoryAction(label, fn)` (snapshots).
  - Field edits go through `registerChange` → `pendingEdit` → `commitPendingEdit`.
- **Propagation** (06): An edit outside the segments is copied to the other selected files by `propagateValueToSelectedFiles`. It must stay logged in the change log and in undo.
- **Numbers:** `parseNumberInput` accepts a decimal comma. Values are stored with the original number of decimals. Display: at most 2 decimals (`DISPLAY_DECIMALS`, `displayPlaces` in 02).
  - Input fields write back only after real typing (`typedSinceFocus` in 03). Focus and blur, or typing back to the shown text, keep the file value. This avoids losing precision through the rounded display. Preserve the `XMLSerializer` output and never rewrite `<note>`.
- **Save:**
  - Save (`saveActiveFile`) does not download. It makes the current state the new baseline (`markFilesSaved`).
  - Downloads happen only in Batch Save (`markFilesDownloaded`, `needsDownload` → "Saved ↓").
  - Both run through `confirmSchemaBeforeSave` and `confirmHeatInputBeforeSave`.
- **Schema** (07): `validateAgainstXdr` / `getSchemaResult` check every file against the active XDR (built-in or from localStorage).
- **Upgrade** (08): `upgradeDocument` does the following:
  - keeps the values;
  - adds missing fields from the layout template for the head;
  - applies `SCHEMA_RENAMES`;
  - drops unknown fields;
  - orders the fields by the XDR;
  - sets `config_version` and `jog_speed_edit_mode`=1.
- **Heat input** (05): `calculateSegmentHeatInput` is in 01. The target ranges are `{id,name,min,max,files|null}` and are matched by the 4-digit schedule prefix (`fileTargetKey`).
  - Open question: the oscillation cycle uses one excursion. Machine data suggests two; see `docs/PLAN_Excel_Vorlage.md`.
- **WPS** (13):
  - `readWpsPdf` (pdf.js text layer; the worker runs in the main thread, no OCR) → `parseWpsDocument`: header row found by keywords (DE/EN), columns found by x position, ranges parsed by `parseWpsRange`, units converted to A, V, mm/min, m/min, kJ/mm.
  - Editable review table, then `applyWps`. It stores `scheduleEditorWpsRanges` and replaces the heat input targets with `source: "wps"`; manual targets stay.
  - `wpsCheckFile` compares pri/bkg amp, ahc, travel and wire (stored in in/min) and the heat input per segment. Results: fail (nominal outside), warn (override range outside), ok. `confirmWpsBeforeSave` runs in Batch Save.
- **Segment field order:** `segments_sorting.json` next to the built HTML. It is loaded only over http(s); otherwise `SEGMENT_SORTING_CONFIG` is used.
- **localStorage** (all keys are listed in `LOCAL_STORAGE_BACKUP_KEYS`, file 12):
  - `hiddenFields`, `lockedFields`, `importantFields`, `parameterUnits`
  - `scheduleEditorChangeLog`, `scheduleEditorCustomHeads`, `scheduleEditorSidebarState`, `scheduleEditorBatchSave`, `scheduleEditorParameterOrder`
  - `scheduleEditorXdrSchemas`, `scheduleEditorActiveXdr`, `scheduleEditorLayoutTemplates`
  - `scheduleEditorHeatInputTargets` (also read by WDR); the old key `scheduleEditorHeatInputTarget`
  - `scheduleEditorWpsRanges` (`{document, wpsNumber, checkMode, rows[{label, passType, files, current|voltage|travel|wire|heat: {min,max}}]}`)
  - Read through `readStoredJson`, which tolerates corrupt values.

## Tests (`../../tests/`)
- schema, upgrade, viewer, save, reorder, invalid-values, comparison
- text-fields, segment-layout, heat-save, heat-targets, overview, wps (builds its own test PDF)
- Sample files: `Schedule_editor/data/samples/`

## UI conventions (from the suite design system, https://claude.ai/artifact/Swt1V8HuXWB9nRmP11GMc2)
- **Theme:** one warm dark theme. Use the CSS variables in `style.css` (`--bg-*`, `--text-*`, `--accent*`, `--success`, `--warning`, `--danger`); no new hex values.
- **Accent** (`--accent` #f28a3d, weld orange) marks what acts or is active. Text on an accent fill uses `on-accent` (#24150d), never white.
- **State colours** carry one meaning each and always come with a word:
  - `success` = changed, not saved;
  - `warning` = saved but not downloaded, or a warning;
  - `danger` = invalid or destructive.
  - Do not spread `teal`.
- **Copy:**
  - English, with parameters named exactly as their XML keys.
  - Units always visible, e.g. "Length (mm)".
  - Buttons are short verbs in title case: "…" when a button opens a dialog or file picker, "+" when it appends (`+ Add segment`).
  - Status text is plain, without "!". No emoji; icons are Unicode glyphs.
- **Shape and size:**
  - Radius 7px on controls, 8px on panels.
  - Control heights 32px in the header, 28px in panels.
  - Depth comes from grounds and 1px borders, not shadows.
  - Value fields use the mono font, right-aligned.

