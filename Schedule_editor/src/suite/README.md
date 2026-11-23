# Suite shell (start page + router)

- **`shell.html`:** the document head and the start page with the `#launcher` cards (styles inline).
  - It also holds the suite bar `#suite-bar`, the `#app-host` and one include per app template.
  - The header comment of the built file lives here.
- **`router.js`:** `APPS` maps a route to its template.
  - `getFrame(route)` creates one iframe per app (`srcdoc` = template HTML with `<base href>` = suite URL, same origin). The iframe is kept alive when switching.
  - `showRoute()` handles the hash routes `#editor`, `#wdr` and `#pendant`; an empty hash shows the start page.
  - Same origin means the apps share localStorage: WDR reads the editor's heat input targets.
- **New app:**
  1. Add `src/<app>/index.html`, wrapped in `<template id="app-…">`.
  2. Add an include line in `shell.html`.
  3. Add an entry in `APPS`, a launcher card and a suite-bar button.
  4. Add a probe in `tests/lib.js` `waitForAppFrame`.
- **Tests:** `tests/wdr.test.js` › "start page and switching".
