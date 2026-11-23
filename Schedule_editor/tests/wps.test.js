// WPS-Import (digitale PDF) und WPS-Pruefung im Schedule Editor.
const fs = require("fs");
const path = require("path");
const REF = "Schedule_editor/data/samples/04_HIC_PK_764_CS_NGRT_Rev1/0402-Hotpass1.xml";

// Kleine digitale PDF (Helvetica, WinAnsi) mit Textstuecken an festen Positionen.
function makePdf(items) {
    const encode = text => [...text].map(char => (char === "–" ? "\x96" : char)).join("")
        .replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
    const stream = items.map(({ x, y, text, size = 9 }) => `BT /F1 ${size} Tf 1 0 0 1 ${x} ${y} Tm (${encode(text)}) Tj ET`).join("\n");
    const objects = [
        "<< /Type /Catalog /Pages 2 0 R >>",
        "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
        "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 842 595] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
        "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
        `<< /Length ${Buffer.byteLength(stream, "latin1")} >>\nstream\n${stream}\nendstream`
    ];
    let pdf = "%PDF-1.4\n";
    const offsets = objects.map((body, index) => {
        const offset = Buffer.byteLength(pdf, "latin1");
        pdf += `${index + 1} 0 obj\n${body}\nendobj\n`;
        return offset;
    });
    const xref = Buffer.byteLength(pdf, "latin1");
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.map(offset => `${String(offset).padStart(10, "0")} 00000 n \n`).join("")}`;
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
    return Buffer.from(pdf, "latin1");
}

// WPS-Tabelle nach EN ISO 15609-1 (deutsch): Kopf ueber drei Zeilen, Vorschub in cm/min.
function wpsPdf() {
    const columns = [40, 110, 180, 260, 330, 410, 510, 620];
    const row = (y, cells) => cells.map((text, index) => (text ? { x: columns[index], y, text } : null)).filter(Boolean);
    return makePdf([
        { x: 40, y: 540, text: "Schweißanweisung (WPS) nach DIN EN ISO 15609-1", size: 12 },
        { x: 40, y: 515, text: "WPS-Nr.: 0402-HP-01" },
        { x: 300, y: 515, text: "Grundwerkstoff: P355 / Rohr 764 x 32" },
        ...row(420, ["Raupe", "Prozess", "Stromstärke", "Spannung", "Stromart/", "Drahtvorschub", "Schweiß-", "Wärme-"]),
        ...row(408, ["", "", "I [A]", "U [V]", "Polung", "m/min", "geschwindigkeit", "einbringung"]),
        ...row(396, ["", "", "", "", "", "", "cm/min", "kJ/mm"]),
        ...row(380, ["Wurzel", "141", "80 – 120", "9 – 11", "DC -", "0,5 – 1,0", "6 – 9", "0,5 – 0,9"]),
        ...row(366, ["Hotpass", "141", "130 – 190", "9 – 11", "DC -", "1,0 – 1,5", "6 – 8", "max. 1,2"]),
        ...row(352, ["Fülllage", "141", "140 – 200", "10 – 12", "DC -", "1,5 – 3,0", "8 – 12", "0,8 – 1,6"]),
        ...row(338, ["Decklage", "141", "150 – 190", "10 – 12", "DC -", "1,0 – 2,5", "9 ± 2", "1,0 – 1,5"]),
        { x: 40, y: 300, text: "Bemerkungen: Pendeln, Zwischenlagentemperatur siehe Prüfbericht" }
    ]);
}

const rowValues = (frame, label) => frame.evaluate(text => {
    const rowElement = [...document.querySelectorAll(".wps-range-table tbody tr")].find(tr => tr.querySelector(".wps-label-input").value === text);
    if (!rowElement) return null;
    const inputs = [...rowElement.querySelectorAll("input")].map(input => input.value);
    return { label: inputs[0], files: inputs[1], numbers: inputs.slice(2), type: rowElement.querySelector("select").value };
}, label);

module.exports = [
    {
        name: "import digital WPS PDF offline, apply and check",
        async run(t) {
            const { page, frame } = await t.openApp("editor", {
                beforeLoad: page => page.route(url => !url.href.startsWith(t.baseUrl), route => route.abort())
            });
            await frame.evaluate(() => localStorage.setItem("scheduleEditorHeatInputTargets", JSON.stringify([{ id: "m1", name: "Manual", min: "0.1", max: "5", files: null }])));
            await frame.setInputFiles("#fileInput", [t.file(REF)]);
            await page.waitForTimeout(300);
            await frame.click("#wpsBtn");
            t.check("view opened", (await frame.textContent("#content h2")) === "WPS Import / Check");
            const pdfPath = path.join(t.tmpDir, "WPS_0402.pdf");
            fs.writeFileSync(pdfPath, wpsPdf());
            await frame.setInputFiles("#wpsFileInput", [pdfPath]);
            await frame.waitForSelector(".wps-range-table tbody tr", { timeout: 20000 });
            t.check("status", /4 pass row\(s\) found, WPS 0402-HP-01/.test(await frame.textContent("#wpsStatus")), await frame.textContent("#wpsStatus"));
            t.check("wps number", await frame.inputValue("#wpsNumberInput") === "0402-HP-01");
            const hot = await rowValues(frame, "Hotpass");
            // Reihenfolge: Strom, Spannung, Vorschub (mm/min), Draht (m/min), Heat Input – je min/max
            t.check("hot pass row", hot && hot.type === "Hot pass" && hot.files === "0402"
                && hot.numbers.join("|") === "130|190|9|11|60|80|1|1.5||1.2", JSON.stringify(hot));
            const root = await rowValues(frame, "Wurzel");
            t.check("root row (decimal comma, cm/min -> mm/min)", root && root.type === "Root" && root.numbers.join("|") === "80|120|9|11|60|90|0.5|1|0.5|0.9", JSON.stringify(root));
            const cap = await rowValues(frame, "Decklage");
            t.check("cap row (± range)", cap && cap.type === "Cap" && cap.numbers.slice(4, 6).join("|") === "70|110", JSON.stringify(cap));
            const fill = await rowValues(frame, "Fülllage");
            t.check("fill row", fill && fill.type === "Fill", JSON.stringify(fill));
            t.check("unit note", (await frame.textContent(".wps-panel:nth-of-type(2)")).includes("converted from cm/min"));
            t.check("raw text shown", (await frame.textContent(".wps-raw pre")).includes("Schweißanweisung"));

            // Zelle bearbeiten, uebernehmen
            await frame.fill(".wps-range-table tbody tr:first-child .wps-heat-max", "1,0");
            await frame.click("#wpsApplyBtn");
            const store = await frame.evaluate(() => JSON.parse(localStorage.getItem("scheduleEditorWpsRanges")));
            t.check("stored ranges", store.rows.length === 4 && store.wpsNumber === "0402-HP-01" && store.rows[0].heat.max === 1 && store.document === "WPS_0402.pdf", JSON.stringify(store).slice(0, 300));
            let targets = await frame.evaluate(() => JSON.parse(localStorage.getItem("scheduleEditorHeatInputTargets")));
            const wpsTargets = targets.filter(target => target.source === "wps");
            t.check("heat input targets from WPS", wpsTargets.length === 4 && targets.some(target => target.name === "Manual")
                && wpsTargets.some(target => target.name === "WPS 0402-HP-01 Hotpass" && target.max === "1.2" && target.min === "" && target.files.join() === "0402"), JSON.stringify(targets));

            // Pruefung 0402: Strom 180/140 A (±10 %) gegen 130–190 -> Override 198 > 190 = Warnung;
            // Draht 66.93 in/min = 1.70 m/min > 1.5 = ausserhalb; Vorschub 2.9528 in/min = 75 mm/min in 60–80.
            const cells = await frame.evaluate(() => Object.fromEntries([...document.querySelectorAll(".wps-check-table .wps-cell[data-field]")]
                .map(cell => [cell.dataset.field, { text: cell.textContent, status: [...cell.classList].find(name => name.startsWith("is-")) }])));
            t.check("current: warn (override range)", cells.current?.status === "is-warn" && cells.current.text === "P 180 / B 140", JSON.stringify(cells.current));
            t.check("wire: outside", cells.wire?.status === "is-fail" && cells.wire.text === "P 1.7 / B 1.3", JSON.stringify(cells.wire));
            t.check("travel: ok (converted)", cells.travel?.status === "is-ok" && cells.travel.text === "P 75 / B 75", JSON.stringify(cells.travel));
            const heat = await frame.evaluate(() => calculateSegmentHeatInput(loadedFiles[0].sections.segments[0], loadedFiles[0].sections.overrides));
            const heatStatus = heat.heatInput > 1.2 ? "is-fail" : heat.maxHeatInput > 1.2 ? "is-warn" : "is-ok";
            t.check("heat input against WPS max", cells.heat?.status === heatStatus, `${JSON.stringify(cells.heat)} ${heat.heatInput}`);
            t.check("summary", /1 file\(s\) checked · 1 value\(s\) outside the WPS · 2 value\(s\) with override range outside/.test(await frame.textContent("#wpsSummary")), await frame.textContent("#wpsSummary"));

            // Mittelwert-Modus: Strom (180·1.0 + 140·0.3)/1.3 = 170.8 A, Override 153.7–187.8 -> ok
            await frame.selectOption("#wpsCheckMode", "mean");
            const meanCurrent = await frame.evaluate(() => {
                const cell = document.querySelector(".wps-check-table .wps-cell[data-field=current]");
                return { text: cell.textContent, ok: cell.classList.contains("is-ok") };
            });
            t.check("mean mode", meanCurrent.ok && meanCurrent.text === "170.8", JSON.stringify(meanCurrent));

            // Erneuter Import ersetzt nur die WPS-Ziel-Bereiche.
            await frame.setInputFiles("#wpsFileInput", [pdfPath]);
            await frame.waitForSelector("#wpsApplyBtn:not([disabled])");
            await frame.click("#wpsApplyBtn");
            targets = await frame.evaluate(() => JSON.parse(localStorage.getItem("scheduleEditorHeatInputTargets")));
            t.check("re-import replaces only WPS targets", targets.length === 5 && targets.filter(target => target.source === "wps").length === 4, targets.length);

            // Batch Save warnt (Heat-Input-Dialog ggf. zuerst bestaetigen).
            await frame.click("#batchSaveBtn");
            await frame.click("#batchSaveConfirmBtn");
            if (await frame.locator("#heatSaveModal.show").count()) await frame.click("#heatSaveConfirmBtn");
            t.check("batch save: WPS dialog", await frame.locator("#wpsSaveModal.show").count() === 1);
            t.check("dialog names the segment", /0402 · Segment 1: wire feed/.test(await frame.textContent("#wpsSaveList")), await frame.textContent("#wpsSaveList"));
            await frame.click("#wpsSaveCancelBtn");
            t.check("cancel message", (await frame.textContent("#status")).includes("values outside the WPS"));
        }
    },
    {
        name: "manual entry when the PDF has no table",
        async run(t) {
            const { frame } = await t.openApp("editor");
            await frame.click("#wpsBtn");
            const pdfPath = path.join(t.tmpDir, "empty.pdf");
            fs.writeFileSync(pdfPath, makePdf([{ x: 40, y: 500, text: "Deckblatt ohne Parametertabelle" }]));
            await frame.setInputFiles("#wpsFileInput", [pdfPath]);
            await frame.waitForSelector(".wps-note", { timeout: 20000 });
            t.check("note: no table", (await frame.textContent(".wps-note")).includes("No parameter table found"));
            await frame.click("text=Add row");
            t.check("row added", await frame.locator(".wps-range-table tbody tr").count() === 1);
            await frame.click("text=Discard");
            await frame.click("text=Enter ranges manually");
            t.check("manual template rows", await frame.locator(".wps-range-table tbody tr").count() === 4);
        }
    }
];
