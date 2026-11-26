        // Language switch (English | Deutsch) for the whole suite.
        // The UI is written in English. One engine in the shell translates the start page and every app
        // document (iframes, overview/viewer windows) at runtime from the dictionary SUITE_I18N_DE
        // (shared/i18n-de.js). English originals are kept per node, so switching back restores them.
        (() => {
            const STORAGE_KEY = "scheduleSuiteLanguage";
            const ATTRIBUTES = ["title", "placeholder", "aria-label", "alt"];
            const SKIP = new Set(["SCRIPT", "STYLE", "TEXTAREA", "PRE", "CODE", "TEMPLATE", "NOSCRIPT"]);
            const originals = new WeakMap(); // Text node / Attr -> { en, shown }
            const windows = new Set();
            const misses = new Set();
            let exact = null;
            let patterns = [];
            let language = "en";
            try { language = localStorage.getItem(STORAGE_KEY) === "de" ? "de" : "en"; } catch (error) { /* ignore */ }

            function loadDictionary() {
                if (exact) return;
                const source = window.SUITE_I18N_DE || { exact: {}, patterns: [] };
                exact = new Map(Object.entries(source.exact));
                patterns = (source.patterns || []).map(([regex, replacement]) =>
                    [new RegExp(`^(?:${regex instanceof RegExp ? regex.source : regex})$`), replacement]);
            }

            // Translates one English string. Leading/trailing whitespace is kept; inner whitespace is collapsed
            // for the lookup. Returns null when there is no translation.
            function lookup(text) {
                loadDictionary();
                const key = text.replace(/\s+/g, " ").trim();
                if (!key || !/[A-Za-z]{2}/.test(key)) return null;
                if (exact.has(key)) return exact.get(key);
                for (const [regex, replacement] of patterns) {
                    if (!regex.test(key)) continue;
                    if (typeof replacement === "function") return key.replace(regex, replacement);
                    return key.replace(regex, (...groups) => replacement.replace(/\$(\d)/g, (match, index) => {
                        const value = groups[Number(index)] ?? "";
                        return exact.has(value) ? exact.get(value) : value;
                    }));
                }
                misses.add(key);
                return null;
            }

            function translate(text) {
                if (language !== "de" || typeof text !== "string") return text;
                const result = lookup(text);
                if (result === null) return text;
                const lead = text.match(/^\s*/)[0];
                const trail = text.match(/\s*$/)[0];
                return lead + result + (text.trim() ? trail : "");
            }

            function skipped(element) {
                for (let node = element; node && node.nodeType === 1; node = node.parentNode) {
                    if (SKIP.has(node.tagName) || node.hasAttribute("data-no-i18n") || node.hasAttribute("data-lang")
                        || node.isContentEditable) return true;
                }
                return false;
            }

            // Sets the shown value of a text node or attribute. "value" is the current DOM value.
            function apply(node, value, set) {
                let entry = originals.get(node);
                if (!entry || value !== entry.shown) {
                    entry = { en: value, shown: value };
                    originals.set(node, entry);
                }
                const target = language === "de" ? translate(entry.en) : entry.en;
                if (target !== value) set(target);
                entry.shown = target;
            }

            function translateText(node) {
                if (!node.parentNode || skipped(node.parentNode)) return;
                apply(node, node.nodeValue, value => { node.nodeValue = value; });
            }

            function translateAttributes(element) {
                if (skipped(element)) return;
                for (const name of ATTRIBUTES) {
                    const attr = element.getAttributeNode(name);
                    if (attr) apply(attr, attr.value, value => { attr.value = value; });
                }
                if (element.tagName === "INPUT" && /^(button|submit|reset)$/i.test(element.type)) {
                    const attr = element.getAttributeNode("value");
                    if (attr) apply(attr, attr.value, value => { attr.value = value; });
                }
            }

            function translateTree(root) {
                if (!root) return;
                if (root.nodeType === 3) { translateText(root); return; }
                if (root.nodeType !== 1 && root.nodeType !== 9 && root.nodeType !== 11) return;
                if (root.nodeType === 1) {
                    if (SKIP.has(root.tagName)) return;
                    translateAttributes(root);
                }
                const doc = root.ownerDocument || root;
                const walker = doc.createTreeWalker(root, 1 | 4, {
                    acceptNode: node => (node.nodeType === 1 && (SKIP.has(node.tagName) || node.hasAttribute("data-no-i18n")
                    || node.hasAttribute("data-lang"))) ? 2 : 1
                });
                for (let node = walker.nextNode(); node; node = walker.nextNode()) {
                    if (node.nodeType === 3) translateText(node);
                    else translateAttributes(node);
                }
            }

            function wrapDialogs(win) {
                ["alert", "confirm", "prompt"].forEach(name => {
                    const original = win[name];
                    if (typeof original !== "function" || original.__i18n) return;
                    const wrapped = function (message, ...rest) {
                        return original.call(win, typeof message === "string" ? translate(message) : message, ...rest);
                    };
                    wrapped.__i18n = true;
                    win[name] = wrapped;
                });
            }

            // Hooks a same-origin window: dialogs, a MutationObserver for later DOM changes, and window.open,
            // so child windows (program overview, XML viewer) are translated as well.
            function attach(win) {
                if (!win || windows.has(win)) return;
                windows.add(win);
                wrapDialogs(win);
                const doc = win.document;
                if (doc.documentElement) doc.documentElement.lang = language;
                const observer = new win.MutationObserver(records => {
                    if (language !== "de") return;
                    for (const record of records) {
                        if (record.type === "childList") record.addedNodes.forEach(translateTree);
                        else if (record.type === "characterData") translateText(record.target);
                        else if (record.type === "attributes") translateAttributes(record.target);
                    }
                });
                observer.observe(doc, {
                    subtree: true, childList: true, characterData: true,
                    attributes: true, attributeFilter: [...ATTRIBUTES, "value"]
                });
                const open = win.open;
                win.open = function (...args) {
                    const child = open.apply(win, args);
                    try { if (child) attach(child); } catch (error) { /* other origin */ }
                    return child;
                };
                const finish = () => translateTree(doc);
                if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", finish);
                finish();
                win.addEventListener("unload", () => windows.delete(win));
            }

            function setLanguage(next) {
                language = next === "de" ? "de" : "en";
                try { localStorage.setItem(STORAGE_KEY, language); } catch (error) { /* ignore */ }
                windows.forEach(win => {
                    try {
                        if (win.closed) { windows.delete(win); return; }
                        win.document.documentElement.lang = language;
                        translateTree(win.document);
                        win.dispatchEvent(new win.CustomEvent("suite-language", { detail: language }));
                    } catch (error) { windows.delete(win); }
                });
            }

            // Another tab of the suite switched the language.
            window.addEventListener("storage", event => {
                if (event.key === STORAGE_KEY && (event.newValue === "de" ? "de" : "en") !== language) setLanguage(event.newValue);
            });

            window.SuiteI18n = {
                attach,
                setLanguage,
                translate,
                getLanguage: () => language,
                misses: () => [...misses].sort()
            };
            attach(window);
            if (language === "de") setLanguage("de");
        })();
