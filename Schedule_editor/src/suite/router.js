        (() => {
            const APPS = {
                editor: { template: "app-editor", title: "Liburdi Schedule Editor" },
                wdr: { template: "app-wdr", title: "Liburdi Welddata Converter" },
                pendant: { template: "app-pendant", title: "Pendant Key Layout Editor" }
            };
            const launcher = document.getElementById("launcher");
            const bar = document.getElementById("suite-bar");
            const host = document.getElementById("app-host");
            const frames = {};

            // Startet die Anwendung einmalig als eigenes Dokument; danach wird sie nur ein-/ausgeblendet.
            function getFrame(route) {
                if (frames[route]) return frames[route];
                const app = APPS[route];
                const source = document.getElementById(app.template).innerHTML;
                const baseHref = document.baseURI.replace(/"/g, "&quot;");
                const frame = document.createElement("iframe");
                frame.title = app.title;
                frame.setAttribute("allow", "clipboard-read; clipboard-write");
                // Erstes Skript im Dokument: Sprachumschaltung (shared/i18n.js) anhaengen, bevor die App laeuft.
                const lang = window.SuiteI18n ? window.SuiteI18n.getLanguage() : "en";
                const i18n = "<script>try { parent.SuiteI18n && parent.SuiteI18n.attach(window); } catch (error) {}</" + "script>";
                frame.srcdoc = `<!DOCTYPE html><html lang="${lang}"><head><base href="${baseHref}">${i18n}${source}</html>`;
                frame.addEventListener("load", () => {
                    // Fenstertitel der Anwendung uebernehmen (z. B. aktive Datei im Editor).
                    try { document.title = frame.contentDocument.title || app.title; } catch (error) { /* ignore */ }
                });
                host.appendChild(frame);
                frames[route] = frame;
                return frame;
            }

            function showRoute() {
                const route = location.hash.slice(1);
                const active = APPS[route] ? route : "";
                launcher.hidden = Boolean(active);
                bar.hidden = !active;
                host.hidden = !active;
                document.querySelectorAll("#suite-bar [data-route]").forEach(button => {
                    if (button.dataset.route === active) button.setAttribute("aria-current", "page");
                    else button.removeAttribute("aria-current");
                });
                document.querySelectorAll("[data-running]").forEach(badge => {
                    badge.hidden = !frames[badge.dataset.running];
                });
                if (!active) {
                    document.title = window.SuiteI18n ? window.SuiteI18n.translate("Liburdi Schedule Suite 3.1") : "Liburdi Schedule Suite 3.1";
                    return;
                }
                const frame = getFrame(active);
                Object.entries(frames).forEach(([name, element]) => { element.hidden = name !== active; });
                try { document.title = frame.contentDocument?.title || APPS[active].title; } catch (error) { document.title = APPS[active].title; }
                frame.focus();
            }

            // Sprachauswahl auf der Startseite: gilt fuer alle Anwendungen (shared/i18n.js).
            const languageButtons = document.querySelectorAll(".language-option");
            function renderLanguage() {
                const current = window.SuiteI18n ? window.SuiteI18n.getLanguage() : "en";
                languageButtons.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.language === current)));
            }
            languageButtons.forEach(button => button.addEventListener("click", () => {
                if (window.SuiteI18n) window.SuiteI18n.setLanguage(button.dataset.language);
            }));
            window.addEventListener("suite-language", () => { renderLanguage(); showRoute(); });
            renderLanguage();

            bar.addEventListener("click", event => {
                const button = event.target.closest("[data-route]");
                if (!button) return;
                location.hash = button.dataset.route;
                if (!button.dataset.route) history.replaceState(null, "", location.pathname + location.search);
                showRoute();
            });
            window.addEventListener("hashchange", showRoute);
            showRoute();
        })();
