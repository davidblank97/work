// Anzeige mit hoechstens 2 Nachkommastellen; die Datei behaelt ihre Genauigkeit.
const REF = "Schedule_editor/data/samples/04_HIC_PK_764_CS_NGRT_Rev1/0402-Hotpass1.xml";

const fieldValue = (frame, key) => frame.evaluate(name => document.querySelector(`input[data-field-name="${name}"]`)?.value, key);
const xmlValue = (frame, section, key) => frame.evaluate(([sectionName, name]) => {
    const file = loadedFiles[activeFile];
    const parent = sectionName === "segments" ? file.sections.segments[0] : file.sections[sectionName];
    return [...parent.children].find(child => child.tagName === name)?.textContent;
}, [section, key]);

module.exports = [
    {
        name: "two decimals shown, file precision kept",
        async run(t) {
            const { page, frame } = await t.openApp("editor");
            await frame.setInputFiles("#fileInput", [t.file(REF)]);
            await page.waitForTimeout(300);
            await frame.evaluate(() => showSection("global"));
            t.check("shown with 2 decimals", await fieldValue(frame, "postpurge") === "10.00", await fieldValue(frame, "postpurge"));
            t.check("file keeps 6 decimals", await xmlValue(frame, "global", "postpurge") === "10.000000");
            t.check("integer stays integer", await fieldValue(frame, "datalog_mode") === "1", await fieldValue(frame, "datalog_mode"));

            // Segment: pri_travel 2.952758 in/min -> Anzeige 2.95; Fokus ohne Eingabe aendert nichts.
            await frame.evaluate(() => showSection("segments"));
            await page.waitForTimeout(200);
            t.check("segment value rounded in display", await fieldValue(frame, "pri_travel") === "2.95", await fieldValue(frame, "pri_travel"));
            await frame.focus('input[data-field-name="pri_travel"]');
            await frame.evaluate(() => document.activeElement.blur());
            t.check("focus without typing keeps the file value", await xmlValue(frame, "segments", "pri_travel") === "2.952758", await xmlValue(frame, "segments", "pri_travel"));
            t.check("no change counted", (await frame.textContent("#header .badge")).includes("No changes"), await frame.textContent("#header .badge"));

            // In cm/min (Umrechnung) ebenfalls keine Drift durch Fokus/Verlassen.
            await frame.evaluate(() => { parameterUnits.pri_travel = "cmmin"; saveParameterUnits(); showSection("segments"); });
            await page.waitForTimeout(200);
            await frame.focus('input[data-field-name="pri_travel"]');
            await frame.evaluate(() => document.activeElement.blur());
            t.check("unit mode: no drift", await xmlValue(frame, "segments", "pri_travel") === "2.952758", await xmlValue(frame, "segments", "pri_travel"));
            await frame.evaluate(() => { parameterUnits.pri_travel = "none"; saveParameterUnits(); showSection("segments"); });
            await page.waitForTimeout(200);

            // Tippen und wieder auf den Ausgangstext: Dateiwert von vorher.
            await frame.click('input[data-field-name="pri_travel"]');
            await frame.fill('input[data-field-name="pri_travel"]', "3");
            await frame.fill('input[data-field-name="pri_travel"]', "2.95");
            await frame.evaluate(() => document.activeElement.blur());
            t.check("typed back to the shown value restores the file value", await xmlValue(frame, "segments", "pri_travel") === "2.952758", await xmlValue(frame, "segments", "pri_travel"));

            // Echte Eingabe: gespeichert mit den Stellen der Datei.
            await frame.fill('input[data-field-name="pri_travel"]', "3,1234567");
            await frame.evaluate(() => document.activeElement.blur());
            t.check("typed value stored with file precision", await xmlValue(frame, "segments", "pri_travel") === "3.123457", await xmlValue(frame, "segments", "pri_travel"));
            t.check("typed value shown with 2 decimals", await fieldValue(frame, "pri_travel") === "3.12", await fieldValue(frame, "pri_travel"));
        }
    }
];
