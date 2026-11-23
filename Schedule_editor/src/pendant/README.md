# Pendant Key Layout Editor (`<template id="app-pendant">`)

Edits the pendant key layout (`key_layout*.xml`): modes → pages → key grid. It can export XML and open a print/PDF preview.

- **Origin:** `_archiv/Pendant_layout_original/…_offline.html`, recoloured to the editor theme. The PDF preview stays light for printing.
- **Files:**
  - `index.html`: markup.
  - `style.css`: an offline Tailwind shim plus the theme.
  - `pendant.js`: all logic in one `DOMContentLoaded` handler.
- **Main functions:**
  - `init`, `initGridsAndTabs`, `parseAndLoadXml`, `refreshUIFromData`
  - `generateXML`, `download`
  - `copyCurrentPage`/`pasteToCurrentPage`
  - `buildPreviewHtml`/`openPreviewWindow` (the preview is a full HTML document in a template string)
- **Defaults:** mirror `key_layout_default_2025-2026.xml` (the data store at the top of `pendant.js`).
- **Tests:** `tests/pendant.test.js`. Sample file: `data/samples/key_layout.xml`.
