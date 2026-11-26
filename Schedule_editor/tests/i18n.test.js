// Sprachauswahl (English | Deutsch) auf der Startseite: gilt fuer Startseite und alle Apps, laesst sich zuruecknehmen.
const REF = "Schedule_editor/data/samples/04_HIC_PK_764_CS_NGRT_Rev1/0402-Hotpass1.xml";

module.exports = [
    {
        name: "language switch on the start page translates every app and restores English",
        async run(t) {
            const { page, frame } = await t.openApp("editor");
            await frame.setInputFiles("#fileInput", [t.file(REF)]);
            await page.waitForTimeout(300);
            const sectionNames = () => frame.$$eval("#sectionNav button, .section-nav button, [data-section]", items => items.map(item => item.textContent.trim()).filter(Boolean));
            const textOf = selector => frame.evaluate(selector => document.querySelector(selector)?.textContent.trim(), selector);
            t.check("English by default", await textOf("#saveBtn") === "Save" && await page.evaluate(() => SuiteI18n.getLanguage()) === "en");
            const xmlBefore = await frame.evaluate(() => new XMLSerializer().serializeToString(loadedFiles[0].xml));

            await page.click("#suite-bar [data-route='']");
            await page.click(".language-option[data-language=de]");
            t.check("start page in German", (await page.textContent("#launcher h1")).includes("Welches Werkzeug"));
            t.check("Deutsch pressed", await page.getAttribute(".language-option[data-language=de]", "aria-pressed") === "true");
            t.check("language stored", await page.evaluate(() => localStorage.getItem("scheduleSuiteLanguage")) === "de");
            t.check("editor already open is translated", await textOf("#saveBtn") === "Speichern", await textOf("#saveBtn"));
            t.check("editor html lang=de", await frame.evaluate(() => document.documentElement.lang) === "de");
            t.check("tooltip translated", (await frame.getAttribute("#returnBtn", "title")) === "Rückgängig (Strg+Z)", await frame.getAttribute("#returnBtn", "title"));
            t.check("parameter names stay English", await frame.evaluate(() => document.body.textContent.includes("pri_amp")));

            // Neue Inhalte (Heat-Input-Ansicht) und Meldungen werden uebersetzt
            await page.click("a.app-card[data-app=editor]");
            await frame.click("#heatInputBtn");
            t.check("dynamic view translated", (await frame.textContent("#content")).includes("Wärmeeinbringung pro Segment"));
            const message = await frame.evaluate(() => window.parent.SuiteI18n.translate("3 file(s) loaded successfully."));
            t.check("pattern with number", message === "3 Datei(en) erfolgreich geladen.", message);
            t.check("help in German", await frame.evaluate(() => getComputedStyle(document.querySelector(".help-content[data-lang=de]")).display !== "none"
                && getComputedStyle(document.querySelector(".help-content[data-lang=en]")).display === "none"));

            // Andere Apps starten bereits auf Deutsch
            await page.click("#suite-bar [data-route=wdr]");
            let wdr;
            for (let i = 0; i < 50 && !wdr; i++) {
                await page.waitForTimeout(100);
                for (const candidate of page.frames()) {
                    if (candidate.url() === "about:srcdoc" && await candidate.evaluate(() => typeof wdrSelectedFiles !== "undefined").catch(() => false)) wdr = candidate;
                }
            }
            t.check("WDR in German", (await wdr.textContent("body")).includes("KONVERTIERUNG STARTEN"));

            // XML-Inhalt unveraendert
            const xmlAfter = await frame.evaluate(() => new XMLSerializer().serializeToString(loadedFiles[0].xml));
            t.check("file content not touched", xmlBefore === xmlAfter);

            // Zurueck auf Englisch
            await page.click("#suite-bar [data-route='']");
            await page.click(".language-option[data-language=en]");
            t.check("start page English again", (await page.textContent("#launcher h1")).includes("Which tool"));
            t.check("editor English again", await textOf("#saveBtn") === "Save" && (await frame.getAttribute("#returnBtn", "title")) === "Undo (Ctrl+Z)");
            t.check("dynamic view English again", (await frame.textContent("#content")).includes("Heat input per segment"));
            t.check("WDR English again", (await wdr.textContent("body")).includes("START CONVERSION"));
        }
    },
    {
        name: "language persists after reload and dialogs are translated",
        async run(t) {
            const { page, frame } = await t.openApp("editor", {
                beforeLoad: page => page.addInitScript(() => localStorage.setItem("scheduleSuiteLanguage", "de"))
            });
            t.check("editor starts in German", (await frame.textContent("#saveBtn")).trim() === "Speichern");
            let dialogText = "";
            page.on("dialog", dialog => { dialogText = dialog.message(); dialog.dismiss(); });
            await frame.evaluate(() => alert("No changes to save."));
            t.check("alert translated", dialogText === "Keine Änderungen zu speichern.", dialogText);
            await frame.click("#localStorageBackupBtn");
            t.check("settings dialog translated", (await frame.textContent("#localStorageBackupTitle")).trim() === "Einstellungen");
            // Backup: Texteintraege (Sprache, Nahtname) werden roh exportiert und wieder importiert
            await frame.evaluate(() => localStorage.setItem("scheduleEditorOverviewSeamName", "Naht 1"));
            const [download] = await Promise.all([page.waitForEvent("download"), frame.click("#localStorageBackupExportBtn")]);
            const backup = JSON.parse(require("fs").readFileSync(await download.path(), "utf8"));
            t.check("export works with plain-text keys", backup.data.scheduleEditorOverviewSeamName === "Naht 1" && backup.data.scheduleSuiteLanguage === "de", JSON.stringify(backup.data));
            t.check("export status translated", (await frame.textContent("#localStorageBackupStatus")) === "JSON-Sicherung heruntergeladen.");
        }
    }
];
