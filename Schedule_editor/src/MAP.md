# Source map

`node build.js` replaces every line `<!-- @include path -->` with the content of that file. Paths are relative to `src/` and resolved recursively, starting from `suite/shell.html`. The result is `../Lib_Schedule_Editor_v3_2.html`.

All JS files of one app run as one classic script in the app's iframe: they share globals, and their order is the include order in `index.html`. A new file needs an include line in the matching `index.html`. Never write `</template>` inside an app; `</script>` is allowed only in strings when it is split.

| Topic | File |
|---|---|
| Start page, suite bar, header comment | `suite/shell.html` |
| Router: iframe per app, `#editor`/`#wdr`/`#pendant`; language switch buttons | `suite/router.js` |
| Language switch EN/DE: engine (runtime translation of all app documents) / German dictionary — see `suite/README.md` | `shared/i18n.js`, `shared/i18n-de.js` |
| **Editor** overview, state, conventions | `editor/README.md` |
| Editor markup (sidebar, panels, modals) | `editor/index.html` |
| Editor styles | `editor/style.css` |
| State, localStorage helpers, heads/presets, history (undo/redo), change log | `editor/js/01-state-history.js` |
| Number parsing, parameter order/drag, file list, sidebar, saved-value markers | `editor/js/02-files-helpers.js` |
| Input fields, panel rendering (global/limits/overrides …) | `editor/js/03-input-panel.js` |
| Segments: list, ring, add/duplicate/move, column layout | `editor/js/04-segments.js` |
| Heat input: limits, target ranges, chart, save check; tool "Heat Input & WPS" with tabs (`openHeatTool`) | `editor/js/05-heat-input.js` |
| Propagation to selected files, Save / Batch Save, modals, head presets | `editor/js/06-save-propagation.js` |
| XDR schema check and XDR manager | `editor/js/07-schema.js` |
| Upgrade to schema version (layout templates) | `editor/js/08-upgrade.js` |
| Program overview (PDF/print) | `editor/js/09-overview.js` |
| Comparison table | `editor/js/10-compare.js` |
| XML viewer (diff with missing values), hidden-field manager | `editor/js/11-viewer.js` |
| Change counter, search, settings (localStorage export/import), revert | `editor/js/12-changes-settings.js` |
| WPS import (PDF text via pdf.js, table parser), WPS ranges, WPS check, save warning | `editor/js/13-wps.js` |
| Built-in XDR 1.8.3.7 and NG/NGRT layout templates (data, do not read) | `editor/data/` |
| **WDR** overview | `wdr/README.md` |
| WDR markup / styles | `wdr/index.html`, `wdr/style.css` |
| Log parser, heat input calculation, pass/bead/target matching | `wdr/js/evaluation.js` |
| Minimal XLSX writer (sheets, styles, scatter charts) | `wdr/js/xlsx-writer.js` |
| Evaluation workbook and summary workbook | `wdr/js/workbooks.js` |
| WDR UI: settings, file selection, convert loop, ZIP/folder output | `wdr/js/main.js` |
| **Pendant** overview | `pendant/README.md` |
| Pendant markup / styles / logic | `pendant/index.html`, `pendant/style.css`, `pendant/pendant.js` |
| Libraries (minified, do not read) | `vendor/` (JSZip in editor and WDR, SheetJS in WDR, pdf.js in editor) |

**Tests:** `../tests/*.test.js`. The test helpers are in `../tests/lib.js` (`startServer`, `t.openApp(route)` returns `{page, frame}`, `t.check`, `t.file`, `smallCsv`). `run.js` runs the files in parallel (`--jobs=N`, default 3); `--quick` skips `SLOW_TESTS`. Tests must wait for conditions (`waitForFunction`), not fixed timeouts, because parallel runs are slower.
