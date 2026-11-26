# Suite shell (start page + router)

- **`shell.html`:** the document head and the start page with the `#launcher` cards (styles inline).
  - It also holds the suite bar `#suite-bar`, the `#app-host` and one include per app template.
  - The header comment of the built file lives here.
- **`router.js`:** `APPS` maps a route to its template.
  - `getFrame(route)` creates one iframe per app (`srcdoc` = template HTML with `<base href>` = suite URL, same origin). The iframe is kept alive when switching.
  - `showRoute()` handles the hash routes `#editor`, `#wdr` and `#pendant`; an empty hash shows the start page.
  - Same origin means the apps share localStorage: WDR reads the editor's heat input targets.
- **Language (English | Deutsch):** `shared/i18n.js` (engine) and `shared/i18n-de.js` (dictionary) are included in the shell head; the switch `.language-option` is on the start page (handled in `router.js`).
  - The UI is written in English. `SuiteI18n.attach(win)` translates a same-origin window at runtime: text nodes and the attributes title/placeholder/aria-label/alt (and button `value`), through a MutationObserver; alert/confirm/prompt are wrapped and `window.open` children (program overview, XML viewer) are attached too. English originals are kept per node, so `setLanguage("en")` restores them.
  - `getFrame` puts `parent.SuiteI18n.attach(window)` as the first script of every app document and sets `<html lang>`.
  - Skipped: script/style/textarea/pre/code, `[data-no-i18n]` and `[data-lang]`. Long mixed-markup text (editor help, pendant help/banner) exists twice as `data-lang="en"` / `data-lang="de"` blocks; CSS in the app shows the one matching `html[lang]`.
  - Dictionary: `exact` (whitespace-collapsed English text → German) and `patterns` (anchored regex for messages with numbers/names; a group that is an exact key is translated too). Keep XML keys, product names, "Overrides", "WPS", "Head", "Schedule" English.
  - Adding UI text: write it in English and add the German entry. The test `tests/i18n.test.js` › "every visible text has a German translation" walks all views in German and fails with the list of missing texts (its ignore list covers XML keys, units, file data). At runtime: `SuiteI18n.misses()`.
  - localStorage `scheduleSuiteLanguage` ("en"/"de"); the `suite-language` event fires in every attached window.
- **New app:**
  1. Add `src/<app>/index.html`, wrapped in `<template id="app-…">`.
  2. Add an include line in `shell.html`.
  3. Add an entry in `APPS`, a launcher card and a suite-bar button.
  4. Add a probe in `tests/lib.js` `waitForAppFrame`.
- **Tests:** `tests/wdr.test.js` › "start page and switching"; `tests/i18n.test.js` (language switch).
