# Liburdi Schedule Suite – working rules

- **Product:** `Schedule_editor/Lib_Schedule_Editor_v3_1.html`. This is a single offline HTML file containing a start page and three apps: Schedule Editor, WDR Converter and Pendant Layout.
- **Generated file:** That HTML is **generated**. Never edit or read it. Edit the sources in `Schedule_editor/src/`.
- **Start every task** with `Schedule_editor/src/MAP.md` (topic → file). Then read only the module README and the files it points to.
- **After every change**, from `Schedule_editor/`:
  - `node build.js`
  - `cd tests && npm test` (the pretest checks that the build is current; filter: `node run.js <name>`)
  - check the VS Code diagnostics
- **Do not read** (large, never needed for edits): the built HTML, `src/vendor/`, `src/editor/data/*.xdr`/`*.xml`, `Schedule_editor/data/` (samples, logs, machine backup), `_archiv/`.
- **Workflow:**
  - One feature branch per change.
  - Commit with the trailer `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
  - Merge to `main`, push or delete branches only when the user asks.
- **Language:** The user writes German. The UI and code docs are English; `Schedule_editor/README_v3_1.md` (user manual) is German. Update it when behavior changes.
- **Layout:**
  - `Schedule_editor/data/`: samples, schema, WDR reference files, machine backup with real data logs.
  - `Schedule_editor/docs/`: user notes, to-do list, findings.
  - `_archiv/`: old versions and tools. Leave them untouched.
