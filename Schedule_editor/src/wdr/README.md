# WDR (Welddata) Converter (`<template id="app-wdr">`)

Converts Liburdi data logs (CSV). Output format `evaluation` (the default) creates one heat input workbook per CSV plus a summary. Output format `Excel` writes the raw data only. XML files are copied unchanged. Output goes to a chosen folder (`showDirectoryPicker`) or, as a fallback, to ZIP parts.

## Files
- `index.html`: includes SheetJS and JSZip as `type="text/x-library"`; a loader runs them, so VS Code does not lint them. Then follow markup, `js/evaluation.js`, `js/xlsx-writer.js`, `js/workbooks.js` and `js/main.js`.
- `evaluation.js`:
  - `parseLiburdiLog` handles log v2 (metric) and v3 (imperial), with `,` or with `;` plus decimal comma.
  - `evaluateHeatInput` works as follows:
    - the range is the steady state from the SETPOINT block, before the down-slope; without set points, the whole log;
    - the windows are the oscillation period (In-Dwell + Out-Dwell + 2×Excursion), otherwise `periodSeconds`;
    - Method A is computed per sample, Method C is the logged value, plus energy/distance;
    - it also returns weld time and wire length and mass (`wireDiameter`, `wireDensity`).
  - Further helpers: `wdrPassType`, `wdrBeadId`, `wdrTargetsForSchedule` (reads the editor's `scheduleEditorHeatInputTargets`), `wdrTargetStatus`.
- `xlsx-writer.js`:
  - `XlSheet` (streams rows, omits cell refs where possible, inline strings) and `xlBuildWorkbook` (JSZip, scatter charts via `xlScatterChartXml`).
  - Styles are in `XL_STYLE` / `XL_STYLES` (0.00, [h]:mm:ss, 0.000). SheetJS is **not** used for output, because it cannot write charts.
- `workbooks.js`:
  - `buildEvaluationWorkbook`: sheets Data (A–P, stats in row 4 as formulas), Charts, Chart data, Factors and limits, Machine averages, optionally Raw data. Always metric.
  - `buildSummaryWorkbook`: one row per bead, a total row and a per-pass block.
- `main.js`: settings panel (`readEvaluationSettings`, localStorage `wdrEvaluationSettings`), file list, convert loop (`storeOutput`, `flushZip`).

## Tests
- `tests/wdr.test.js` (offline, start page)
- `tests/wdr-evaluation.test.js`:
  - synthetic v2 log, full v3 sample, raw mode;
  - optionally `data/wdr/template_metric_Short.xlsx`.
- Real logs with schedule snapshots are in `data/machine_backup/.../DataLogs/`.
