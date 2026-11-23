# Schedule Editor (`<template id="app-editor">`)

Edits Liburdi schedule XML files. The root element is `<sched>`, with the sections `metadata`, `description`, `global`, `limits`, `overrides` and `segment`. Several files can be loaded at once. Everything runs client-side.

## Files
- `index.html`: markup and the include order: vendor JSZip → style → markup → `data/` blocks (`#defaultXdr`, `#layoutNGRT`, `#layoutNG`) → `js/01…12`.
- `js/NN-*.js`: one area per file. See `../MAP.md` for the list.

## State and conventions
- **State** (01): `loadedFiles` holds records from `createFileRecord`, each with a stable `id`. Also: `selectedFiles` (indexes), `activeFile`, `changeLog`.
- **History** (01):
  - Structural changes go through `recordHistoryAction(label, fn)` (snapshots).
  - Field edits go through `registerChange` → `pendingEdit` → `commitPendingEdit`.
- **Propagation** (06): An edit outside the segments is copied to the other selected files by `propagateValueToSelectedFiles`. It must stay logged in the change log and in undo.
- **Numbers:** `parseNumberInput` accepts a decimal comma. Values are stored with the original number of decimals. Preserve the `XMLSerializer` output and never rewrite `<note>`.
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
- **Segment field order:** `segments_sorting.json` next to the built HTML. It is loaded only over http(s); otherwise `SEGMENT_SORTING_CONFIG` is used.
- **localStorage** (all keys are listed in `LOCAL_STORAGE_BACKUP_KEYS`, file 12):
  - `hiddenFields`, `lockedFields`, `importantFields`, `parameterUnits`
  - `scheduleEditorChangeLog`, `scheduleEditorCustomHeads`, `scheduleEditorSidebarState`, `scheduleEditorBatchSave`, `scheduleEditorParameterOrder`
  - `scheduleEditorXdrSchemas`, `scheduleEditorActiveXdr`, `scheduleEditorLayoutTemplates`
  - `scheduleEditorHeatInputTargets` (also read by WDR); the old key `scheduleEditorHeatInputTarget`
  - Read through `readStoredJson`, which tolerates corrupt values.

## Tests (`../../tests/`)
- schema, upgrade, viewer, save, reorder, invalid-values, comparison
- text-fields, segment-layout, heat-save, heat-targets, overview
- Sample files: `Schedule_editor/data/samples/`
