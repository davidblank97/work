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

// Pruefzellen je Feld zusammenfassen: Text "P 180 / B 140" (Mittelwert ohne Praefix), Status = schlechtester Teil.
const checkCells = () => {
    const rank = { "is-ok": 0, "is-na": 0, "is-warn": 1, "is-fail": 2 };
    const fields = {};
    document.querySelectorAll(".wps-check-table .wps-cell[data-field]").forEach(cell => {
        const status = [...cell.classList].find(name => name.startsWith("is-"));
        const prefix = { pri: "P ", bkg: "B " }[cell.dataset.part] || "";
        const field = fields[cell.dataset.field] || (fields[cell.dataset.field] = { parts: [], status: "is-ok" });
        if (field.parts.length >= 2 || field.done) { field.done = true; return; }
        field.parts.push(prefix + cell.textContent);
        if (rank[status] > rank[field.status]) field.status = status;
        if (cell.dataset.part !== "pri") field.done = true;
    });
    return Object.fromEntries(Object.entries(fields).map(([key, field]) => [key, { text: field.parts.join(" / "), status: field.status }]));
};

// Werkzeug "Heat Input & WPS" oeffnen und den Reiter "WPS Import / Check" waehlen.
async function openWps(frame) {
    await frame.click("#heatInputBtn");
    await frame.click("#heatTabWps");
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
            await openWps(frame);
            t.check("one tool with tabs", (await frame.textContent("#content h2")) === "Heat Input & WPS"
                && await frame.getAttribute("#heatTabWps", "aria-selected") === "true" && await frame.locator("#wpsBtn").count() === 0);
            const pdfPath = path.join(t.tmpDir, "WPS_0402.pdf");
            fs.writeFileSync(pdfPath, wpsPdf());
            await frame.setInputFiles("#wpsFileInput", [pdfPath]);
            await frame.waitForSelector(".wps-range-table tbody tr", { timeout: 20000 });
            t.check("status", /4 pass row\(s\) found, WPS 0402-HP-01/.test(await frame.textContent("#wpsStatus")), await frame.textContent("#wpsStatus"));
            t.check("wps number", await frame.inputValue("#wpsNumberInput") === "0402-HP-01");
            const hot = await rowValues(frame, "Hotpass");
            // Reihenfolge: Strom, Spannung, Vorschub (mm/min), Draht (m/min), Heat Input – je min/max
            t.check("hot pass row", hot && hot.type === "Hot pass" && hot.files === "0402"
                && hot.numbers.join("|") === "130|190|9|11|60|80|100|150||||||1.2", JSON.stringify(hot));
            const root = await rowValues(frame, "Wurzel");
            t.check("root row (decimal comma, cm/min -> mm/min)", root && root.type === "Root" && root.numbers.join("|") === "80|120|9|11|60|90|50|100|||||0.5|0.9", JSON.stringify(root));
            const cap = await rowValues(frame, "Decklage");
            t.check("cap row (± range)", cap && cap.type === "Cap" && cap.numbers.slice(4, 6).join("|") === "70|110", JSON.stringify(cap));
            const fill = await rowValues(frame, "Fülllage");
            t.check("fill row", fill && fill.type === "Fill", JSON.stringify(fill));
            t.check("unit note", (await frame.textContent("#content")).includes("converted from cm/min"));
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
            const cells = await frame.evaluate(checkCells);
            t.check("current: warn (override range)", cells.current?.status === "is-warn" && cells.current.text === "P 180 / B 140", JSON.stringify(cells.current));
            t.check("wire: outside", cells.wire?.status === "is-fail" && cells.wire.text === "P 170 / B 130", JSON.stringify(cells.wire));
            t.check("travel: ok (converted)", cells.travel?.status === "is-ok" && cells.travel.text === "P 75 / B 75", JSON.stringify(cells.travel));
            const heat = await frame.evaluate(() => calculateSegmentHeatInput(loadedFiles[0].sections.segments[0], loadedFiles[0].sections.overrides));
            const heatStatus = heat.heatInput > 1.2 ? "is-fail" : heat.maxHeatInput > 1.2 ? "is-warn" : "is-ok";
            t.check("heat input against WPS max", cells.heat?.status === heatStatus, `${JSON.stringify(cells.heat)} ${heat.heatInput}`);
            t.check("summary", /1 file\(s\) checked · 1 value\(s\) outside the WPS · 2 value\(s\) with override range outside/.test(await frame.textContent("#wpsSummary")), await frame.textContent("#wpsSummary"));

            // Mittelwert-Modus: Strom (180·1.0 + 140·0.3)/1.3 = 170.77 A, Override 153.7–187.8 -> ok
            await frame.selectOption("#wpsCheckMode", "mean");
            const meanCurrent = await frame.evaluate(() => {
                const cell = document.querySelector(".wps-check-table .wps-cell[data-field=current]");
                return { text: cell.textContent, ok: cell.classList.contains("is-ok") };
            });
            t.check("mean mode", meanCurrent.ok && meanCurrent.text === "170.77", JSON.stringify(meanCurrent));

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
            await openWps(frame);
            const pdfPath = path.join(t.tmpDir, "empty.pdf");
            fs.writeFileSync(pdfPath, makePdf([{ x: 40, y: 500, text: "Deckblatt ohne Parametertabelle" }]));
            await frame.setInputFiles("#wpsFileInput", [pdfPath]);
            await frame.waitForSelector(".wps-note", { timeout: 20000 });
            t.check("note: no table", (await frame.textContent(".wps-note")).includes("No parameter table found"));
            await frame.click("text=+ Add row");
            t.check("row added", await frame.locator(".wps-range-table tbody tr").count() === 1);
            await frame.click("text=Discard");
            await frame.click("text=Enter ranges manually");
            t.check("manual template rows", await frame.locator(".wps-range-table tbody tr").count() === 4);
        }
    },
    {
        // Echte WPS (Bilfinger-Vordruck, Lagen als Spalten): Seite 24 = HIC-O01-1P, Seite 27 = HIC-O01-2P.
        name: "real WPS document (transposed form, m-141 only)",
        async run(t) {
            const pdf = "Schedule_editor/data/samples/ACCEPTED_NSSS_WDP-3_Rev_006.PDF";
            if (!fs.existsSync(t.file(pdf))) {
                t.check("sample WPS not present – skipped", true);
                return;
            }
            const { page, frame } = await t.openApp("editor", {
                beforeLoad: page => page.route(url => !url.href.startsWith(t.baseUrl), route => route.abort())
            });
            const sample = name => t.file(`Schedule_editor/data/samples/04_HIC_PK_764_CS_NGRT_Rev1/${name}`);
            await frame.setInputFiles("#fileInput", [sample("0402-Hotpass1.xml"), sample("0404-Fill-OUT.xml"), sample("0407-Comp.xml"), sample("0408-Cap.xml")]);
            await page.waitForTimeout(400);
            await openWps(frame);
            await frame.setInputFiles("#wpsFileInput", [t.file(pdf)]);
            await frame.waitForSelector(".wps-range-table tbody tr", { timeout: 30000 });
            const status = await frame.textContent("#wpsStatus");
            t.check("status: two forms, page 24 first", status.includes("2 WPS forms in the document (pages 24, 27); showing page 24") && status.includes("WPS HIC-O01-1P Rev.005"), status);
            t.check("form choice", (await frame.$$eval("#wpsFormSelect option", options => options.map(option => option.textContent))).join("|")
                === "Page 24 – HIC-O01-1P Rev.005 (2 pass row(s))|Page 27 – HIC-O01-2P Rev.005 (2 pass row(s))");
            const fill = await rowValues(frame, "Füllage (m-141)");
            // Strom, Spannung, Vorschub (cm/min -> mm/min), Draht (cm/min -> m/min), Heat Input
            t.check("filling layer", fill && fill.type === "Fill" && fill.files === "0404, 0407"
                && fill.numbers.join("|") === "108|300|8.6|11.77|50|100|80|300|0.2|0.8|0.2|0.6|0.46|1.52", JSON.stringify(fill));
            const cap = await rowValues(frame, "Decklage (m-141)");
            t.check("cap layer", cap && cap.type === "Cap" && cap.files === "0408"
                && cap.numbers.join("|") === "108|200|8.7|11.6|50|100|80|300|0.2|0.6|0.2|0.6|0.47|0.7", JSON.stringify(cap));
            t.check("manual root/hot pass (141) skipped", (await frame.textContent("#content")).includes("Wurzel-/Stützlage (141) skipped"));
            t.check("raw text of page 24 only", (await frame.textContent(".wps-raw summary")).includes("page 24") && !(await frame.textContent(".wps-raw pre")).includes("HIC-O01- 2P"));
            await frame.selectOption("#wpsFormSelect", "1");
            t.check("switch to page 27", await frame.inputValue("#wpsNumberInput") === "HIC-O01-2P Rev.005");
            await frame.selectOption("#wpsFormSelect", "0");
            await frame.click("#wpsApplyBtn");
            const store = await frame.evaluate(() => JSON.parse(localStorage.getItem("scheduleEditorWpsRanges")));
            t.check("applied with page", store.page === 24 && store.wpsNumber === "HIC-O01-1P Rev.005" && store.rows.length === 2, JSON.stringify(store).slice(0, 200));
            const summary = await frame.textContent("#wpsSummary");
            t.check("check: 3 files, hot pass without WPS row", /^3 file\(s\) checked/.test(summary) && summary.includes("no WPS row: 0402"), summary);
            // 0408: pri_travel 3.937008 in/min = 100 mm/min = WPS-Maximum (10 cm/min) -> innerhalb, nicht durch Rundung ausserhalb
            const capTravel = await frame.evaluate(() => document.querySelector('.wps-check-table tr[data-file="0408-Cap.xml"] [data-field=travel]')?.className);
            t.check("travel at the WPS maximum is inside", capTravel && !capTravel.includes("is-fail"), capTravel);
        }
    },
    {
        // 0402: Strom 180/140 A (±10 %), Spannung 9.9/9.4 V (±10 %), Draht 66.93/51.18 in/min = 1.70/1.30 m/min (±10 %).
        name: "fit overrides and values to the WPS",
        async run(t) {
            const { page, frame } = await t.openApp("editor");
            await frame.evaluate(() => localStorage.setItem("scheduleEditorWpsRanges", JSON.stringify({
                document: "test.pdf", wpsNumber: "T-1", checkMode: "separate",
                rows: [{ label: "Hotpass", passType: "Hot pass", files: ["0402"], current: { min: 130, max: 190 }, voltage: { min: 9, max: 11 },
                    travel: { min: 60, max: 80 }, wire: { min: 1, max: 1.5 }, heat: { min: null, max: 1.2 } }]
            })));
            await frame.setInputFiles("#fileInput", [t.file(REF)]);
            await page.waitForTimeout(300);
            await openWps(frame);
            const xml = (section, key) => frame.evaluate(([sectionName, name]) => {
                const file = loadedFiles[0];
                const parent = sectionName === "overrides" ? file.sections.overrides : file.sections.segments[0];
                return [...parent.children].find(child => child.tagName === name).textContent;
            }, [section, key]);
            const statuses = async () => Object.fromEntries(Object.entries(await frame.evaluate(checkCells)).map(([field, cell]) => [field, cell.status]));
            t.check("before: current warn, wire fail", JSON.stringify(await statuses()).includes('"current":"is-warn"') && (await statuses()).wire === "is-fail", JSON.stringify(await statuses()));

            await frame.click("#wpsFitOverridesBtn");
            // pri: (190-180)/180 = 5.56 % -> 5.5; bkg: (140-130)/140 = 7.14 % -> 7.1; Spannung: (9.4-9)/9.4 = 4.26 % -> 4.2
            t.check("pri_amp_max", await xml("overrides", "pri_amp_max") === "5.500000", await xml("overrides", "pri_amp_max"));
            t.check("bkg_amp_max", await xml("overrides", "bkg_amp_max") === "7.100000", await xml("overrides", "bkg_amp_max"));
            t.check("avc_override_max", await xml("overrides", "avc_override_max") === "4.200000", await xml("overrides", "avc_override_max"));
            t.check("values unchanged", await xml("segments", "pri_amp") === "180.000000" && await xml("segments", "pri_wire") === "66.929170");
            let after = await statuses();
            t.check("after overrides: current and voltage ok, wire still outside", after.current === "is-ok" && after.voltage === "is-ok" && after.wire === "is-fail", JSON.stringify(after));
            t.check("not solved: wire value", (await frame.textContent("#wpsFitResult")).includes("pri_wire 170 cm/min is outside the WPS"), await frame.textContent("#wpsFitResult"));
            t.check("dwell/excursion overrides always 0 %", await xml("overrides", "dwell_max") === "0.000000" && await xml("overrides", "excursion_max") === "0.000000",
                `${await xml("overrides", "dwell_max")} ${await xml("overrides", "excursion_max")}`);
            t.check("change log entries", await frame.evaluate(() => changeLog.filter(entry => entry.section === "overrides").length) === 3);

            // Fit Values fragt nach; Abbrechen aendert nichts
            await frame.click("#wpsFitValuesBtn");
            await frame.waitForFunction(() => document.activeElement.id === "wpsFitValuesCancelBtn", null, { timeout: 3000 }).catch(() => {});
            t.check("confirmation dialog", await frame.locator("#wpsFitValuesModal.show").count() === 1
                && (await frame.textContent("#wpsFitValuesText")).includes("Affected program(s) (1): 0402")
                && await frame.evaluate(() => document.activeElement.id) === "wpsFitValuesCancelBtn", JSON.stringify([await frame.locator("#wpsFitValuesModal.show").count(), await frame.textContent("#wpsFitValuesText"), await frame.evaluate(() => document.activeElement.id)]));
            await frame.click("#wpsFitValuesCancelBtn");
            t.check("cancel keeps the values", await xml("segments", "pri_wire") === "66.929170" && (await frame.textContent("#status")).includes("Fit Values cancelled"));
            await frame.click("#wpsFitValuesBtn");
            await frame.click("#wpsFitValuesConfirmBtn");
            // 1.5 m/min = 59.0551181 in/min -> abgerundet 59.055118
            t.check("pri_wire set to the WPS max", await xml("segments", "pri_wire") === "59.055118", await xml("segments", "pri_wire"));
            t.check("other values unchanged", await xml("segments", "bkg_wire") === "51.181130" && await xml("segments", "pri_amp") === "180.000000");
            after = await statuses();
            // Wert liegt jetzt auf der WPS-Grenze -> der Draht-Override (10 %) reicht noch hinaus
            t.check("after values: inside, wire override still reaches outside", after.wire === "is-warn" && Object.entries(after).every(([key, status]) => key === "wire" || status === "is-ok"), JSON.stringify(after));
            await frame.click("#wpsFitOverridesBtn");
            t.check("then fit overrides: wire_max 0", await xml("overrides", "wire_max") === "0.000000", await xml("overrides", "wire_max"));
            after = await statuses();
            t.check("all inside", Object.values(after).every(status => status === "is-ok"), JSON.stringify(after));
            t.check("summary clean", (await frame.textContent("#wpsSummary")).includes("0 value(s) outside the WPS · 0 value(s) with override range outside"), await frame.textContent("#wpsSummary"));

            await frame.evaluate(() => undoLastEdit());
            t.check("undo restores the override", await xml("overrides", "wire_max") === "10.000000");
            await frame.evaluate(() => undoLastEdit());
            t.check("undo restores the value", await xml("segments", "pri_wire") === "66.929170");
            await frame.evaluate(() => undoLastEdit());
            t.check("undo restores the overrides", await xml("overrides", "pri_amp_max") === "10.000000");
        }
    },
    {
        name: "fit overrides: heat input range reduced together",
        async run(t) {
            const { page, frame } = await t.openApp("editor");
            await frame.setInputFiles("#fileInput", [t.file(REF)]);
            await page.waitForTimeout(300);
            const heat = await frame.evaluate(() => calculateSegmentHeatInput(loadedFiles[0].sections.segments[0], loadedFiles[0].sections.overrides));
            // Max knapp ueber dem Nominalwert: nur die Heat-Input-Overrides koennen das loesen.
            const max = Number((heat.heatInput * 1.02).toFixed(3));
            await frame.evaluate(limit => localStorage.setItem("scheduleEditorWpsRanges", JSON.stringify({
                document: "test.pdf", wpsNumber: "T-2", checkMode: "separate",
                rows: [{ label: "Hotpass", passType: "Hot pass", files: ["0402"], current: { min: null, max: null }, voltage: { min: null, max: null },
                    travel: { min: null, max: null }, wire: { min: null, max: null }, heat: { min: null, max: limit } }]
            })), max);
            await openWps(frame);
            const heatStatus = () => frame.evaluate(() => document.querySelector(".wps-check-table .wps-cell[data-field=heat]").className);
            t.check("before: heat override range outside", (await heatStatus()).includes("is-warn"), await heatStatus());
            await frame.click("#wpsFitOverridesBtn");
            t.check("after: heat inside", (await heatStatus()).includes("is-ok"), await heatStatus());
            const result = await frame.evaluate(() => calculateSegmentHeatInput(loadedFiles[0].sections.segments[0], loadedFiles[0].sections.overrides));
            t.check("max heat input <= WPS max", result.maxHeatInput <= max + 1e-6 && result.heatInput === heat.heatInput, `${result.maxHeatInput} vs ${max}`);
            const amp = await frame.evaluate(() => [...loadedFiles[0].sections.overrides.children].find(child => child.tagName === "pri_amp_max").textContent);
            t.check("overrides reduced, one decimal", /^\d+\.\d0{5}$/.test(amp) && Number(amp) < 10, amp);
        }
    },
    {
        name: "travel speed is never changed; heat input corrected by the current",
        async run(t) {
            const { page, frame } = await t.openApp("editor");
            await frame.setInputFiles("#fileInput", [t.file(REF)]);
            await page.waitForTimeout(300);
            const heat = await frame.evaluate(() => calculateSegmentHeatInput(loadedFiles[0].sections.segments[0], loadedFiles[0].sections.overrides));
            // Vorschub 75 mm/min ausserhalb 80–90; Heat Input 10 % ueber dem WPS-Maximum; Strom 120–190 (pri 180, bkg 140).
            const max = Number((heat.heatInput / 1.1).toFixed(3));
            await frame.evaluate(limit => localStorage.setItem("scheduleEditorWpsRanges", JSON.stringify({
                document: "test.pdf", wpsNumber: "T-3", checkMode: "separate",
                rows: [{ label: "Hotpass", passType: "Hot pass", files: ["0402"], current: { min: 120, max: 190 }, voltage: { min: null, max: null },
                    travel: { min: 80, max: 90 }, wire: { min: null, max: null }, heat: { min: null, max: limit } }]
            })), max);
            await openWps(frame);
            const value = key => frame.evaluate(name => {
                const file = loadedFiles[0];
                const parent = name.endsWith("_max") ? file.sections.overrides : file.sections.segments[0];
                return [...parent.children].find(child => child.tagName === name).textContent;
            }, key);
            const travelBefore = [await value("pri_travel"), await value("bkg_travel"), await value("travel_max")];
            await frame.click("#wpsFitValuesBtn");
            await frame.click("#wpsFitValuesConfirmBtn");
            t.check("travel unchanged by Fit Values", JSON.stringify([await value("pri_travel"), await value("bkg_travel"), await value("travel_max")]) === JSON.stringify(travelBefore));
            const result = await frame.textContent("#wpsFitResult");
            t.check("travel reported, not changed", result.includes("pri_travel 75 mm/min is outside the WPS (travel speed is never changed)"), result);
            const after = await frame.evaluate(() => calculateSegmentHeatInput(loadedFiles[0].sections.segments[0], loadedFiles[0].sections.overrides));
            t.check("heat input inside by lower current", after.heatInput <= max + 1e-6 && Number(await value("pri_amp")) < 180 && Number(await value("bkg_amp")) < 140, `${after.heatInput} ${await value("pri_amp")} ${await value("bkg_amp")}`);
            t.check("current stays inside the WPS", Number(await value("bkg_amp")) >= 120 && Number(await value("pri_amp")) <= 190, await value("bkg_amp"));
            await frame.click("#wpsFitOverridesBtn");
            t.check("travel unchanged by Fit Overrides", JSON.stringify([await value("pri_travel"), await value("bkg_travel"), await value("travel_max")]) === JSON.stringify(travelBefore));
        }
    },
    {
        // Weite WPS: alle Heat-Input-Overrides auf 10 %, auch wenn sie vorher kleiner waren; Werte und travel_max bleiben.
        name: "fit overrides enlarges to the largest range (max 10 %)",
        async run(t) {
            const { page, frame } = await t.openApp("editor");
            await frame.evaluate(() => localStorage.setItem("scheduleEditorWpsRanges", JSON.stringify({
                document: "test.pdf", wpsNumber: "T-4", checkMode: "separate", wireUnit: "cm/min",
                rows: [{ label: "Hotpass", passType: "Hot pass", files: ["0402"], current: { min: 50, max: 400 }, voltage: { min: 5, max: 20 },
                    travel: { min: null, max: null }, wire: { min: 50, max: 500 }, heat: { min: null, max: 5 } }]
            })));
            await frame.setInputFiles("#fileInput", [t.file(REF)]);
            await page.waitForTimeout(300);
            const names = ["pri_amp_max", "bkg_amp_max", "avc_override_max", "dwell_max", "excursion_max", "travel_max", "wire_max"];
            const read = () => frame.evaluate(list => {
                const file = loadedFiles[0];
                const get = (parent, name) => [...parent.children].find(child => child.tagName === name).textContent;
                return { ...Object.fromEntries(list.map(name => [name, get(file.sections.overrides, name)])),
                    values: ["pri_amp", "bkg_amp", "pri_ahc", "pri_travel", "pri_wire"].map(name => get(file.sections.segments[0], name)).join("|") };
            }, names);
            await frame.evaluate(() => ["pri_amp_max", "bkg_amp_max", "avc_override_max", "wire_max"].forEach(name => {
                [...loadedFiles[0].sections.overrides.children].find(child => child.tagName === name).textContent = "3.000000";
            }));
            const before = await read();
            await openWps(frame);
            await frame.click("#wpsFitOverridesBtn");
            const after = await read();
            t.check("current/voltage overrides at 10 %", ["pri_amp_max", "bkg_amp_max", "avc_override_max"].every(name => after[name] === "10.000000"), JSON.stringify(after));
            t.check("dwell/excursion overrides at 0 %", after.dwell_max === "0.000000" && after.excursion_max === "0.000000", JSON.stringify(after));
            t.check("wire_max enlarged to 10 %", before.wire_max === "3.000000" && after.wire_max === "10.000000", JSON.stringify([before.wire_max, after.wire_max]));
            t.check("values and travel_max unchanged", after.values === before.values && after.travel_max === before.travel_max, JSON.stringify([before, after]));
            const cells = await frame.evaluate(checkCells);
            t.check("no override setting can leave the WPS", Object.values(cells).every(cell => cell.status === "is-ok"), JSON.stringify(cells));
        }
    },
    {
        // RCC-M-WPS (BPT-0000131115): Lauf-Tabelle "Mechanised Orbital Parameters" auf Seite 3, Zahlen Zeichen fuer
        // Zeichen gespeichert, ein Lauf ueber drei Textzeilen, getrennte Bereiche fuer Puls (P) und Grund (B).
        name: "real WPS document (run table with P/B ranges)",
        async run(t) {
            const pdf = "Schedule_editor/data/samples/BPT-0000131115_003_003 (6).PDF";
            if (!fs.existsSync(t.file(pdf))) {
                t.check("sample WPS not present – skipped", true);
                return;
            }
            const { page, frame } = await t.openApp("editor");
            const sample = name => t.file(`Schedule_editor/data/samples/04_HIC_PK_764_CS_NGRT_Rev1/${name}`);
            await frame.setInputFiles("#fileInput", [sample("0404-Fill-OUT.xml"), sample("0408-Cap.xml")]);
            await page.waitForTimeout(300);
            await openWps(frame);
            await frame.setInputFiles("#wpsFileInput", [t.file(pdf)]);
            await frame.waitForSelector(".wps-range-table tbody tr", { timeout: 30000 });
            t.check("WPS number", await frame.inputValue("#wpsNumberInput") === "HIC_O01-1 Rev 003");
            const notes = await frame.textContent("#content");
            t.check("manual table skipped", notes.includes("Manual runs skipped") && notes.includes("Run TACK (141)"), notes.slice(0, 400));
            const rows = await frame.evaluate(() => wpsDraft.rows.map(row => ({ label: row.label, current: row.current, voltage: row.voltage, travel: row.travel, wire: row.wire, heat: row.heat })));
            const run3 = rows.find(row => row.label === "Run 3+ (141-m)");
            const run4 = rows.find(row => row.label === "Run 4+ (141-m)");
            t.check("two mechanised runs", rows.length === 2 && run3 && run4, JSON.stringify(rows.map(row => row.label)));
            t.check("run 3+: current P/B", run3 && JSON.stringify(run3.current) === JSON.stringify({ min: 140, max: 290, pri: { min: 180, max: 290 }, bkg: { min: 140, max: 250 } }), JSON.stringify(run3?.current));
            t.check("run 3+: voltage, travel, heat", run3 && run3.voltage.min === 9 && run3.voltage.max === 11 && run3.travel.min === 65 && run3.travel.max === 85
                && run3.heat.min === 0.81 && run3.heat.max === 1.54, JSON.stringify(run3));
            t.check("run 3+: wire P/B (cm/min)", run3 && run3.wire.pri.min === 150 && run3.wire.pri.max === 270 && run3.wire.bkg.min === 110 && run3.wire.bkg.max === 250, JSON.stringify(run3?.wire));
            t.check("run 4+", run4 && run4.current.pri.max === 190 && run4.current.bkg.min === 110 && run4.travel.min === 90 && run4.travel.max === 110
                && run4.wire.bkg.max === 90 && run4.heat.min === 0.45 && run4.heat.max === 0.66, JSON.stringify(run4));
            t.check("split inputs shown", await frame.locator(".wps-range-table .wps-current-pri-min").count() === 2 && await frame.locator(".wps-range-table .wps-wire-bkg-max").count() === 2);
            // Pulsstrom gegen P, Grundstrom gegen B: 0408 (Run 4+): pri 180 > P 190? nein; bkg 150 = B max 150 -> innerhalb
            await frame.fill(".wps-range-table tbody tr:nth-child(1) .wps-files-input", "0404");
            await frame.fill(".wps-range-table tbody tr:nth-child(2) .wps-files-input", "0408");
            await frame.fill(".wps-range-table tbody tr:nth-child(2) .wps-current-pri-max", "170");
            await frame.click("#wpsApplyBtn");
            const store = await frame.evaluate(() => JSON.parse(localStorage.getItem("scheduleEditorWpsRanges")));
            t.check("edited P max stored, union updated", store.rows[1].current.pri.max === 170 && store.rows[1].current.max === 170, JSON.stringify(store.rows[1].current));
            const cells = await frame.evaluate(() => {
                const row = document.querySelector('.wps-check-table tr[data-file="0408-Cap.xml"]');
                return ["pri", "bkg"].map(part => row.querySelector(`[data-field=current][data-part=${part}]`).className);
            });
            t.check("pri checked against P (180 > 170), bkg against B (150 within 110–150)", cells[0].includes("is-fail") && !cells[1].includes("is-fail"), JSON.stringify(cells));
        }
    },
    {
        // 0402: indwell 0.6 s, outdwell 0.4 s, excursion 0.3 s. WPS: Dwell In 0.2–0.5, Out 0.2–0.8, Excursion 0.2–0.25.
        name: "dwell and excursion checked; their overrides always 0 %",
        async run(t) {
            const { page, frame } = await t.openApp("editor");
            await frame.evaluate(() => localStorage.setItem("scheduleEditorWpsRanges", JSON.stringify({
                document: "test.pdf", wpsNumber: "T-5", checkMode: "separate", wireUnit: "cm/min",
                rows: [{ label: "Hotpass", passType: "Hot pass", files: ["0402"], current: { min: null, max: null }, voltage: { min: null, max: null },
                    travel: { min: null, max: null }, wire: { min: null, max: null },
                    dwell: { min: 0.2, max: 0.8, in: { min: 0.2, max: 0.5 }, out: { min: 0.2, max: 0.8 } }, excursion: { min: 0.2, max: 0.25 }, heat: { min: null, max: null } }]
            })));
            await frame.setInputFiles("#fileInput", [t.file(REF)]);
            await page.waitForTimeout(300);
            await frame.evaluate(() => { [...loadedFiles[0].sections.overrides.children].find(child => child.tagName === "dwell_max").textContent = "5.000000"; });
            await openWps(frame);
            const cell = (field, part) => frame.evaluate(([name, piece]) => {
                const element = document.querySelector(`.wps-check-table [data-field="${name}"][data-part="${piece}"]`);
                return element ? { text: element.textContent, status: [...element.classList].find(item => item.startsWith("is-")) } : null;
            }, [field, part]);
            const head = await frame.textContent(".wps-check-table thead");
            t.check("columns Dwell In/Out and Excursion", head.includes("Dwell (s)") && head.includes("In") && head.includes("Out") && head.includes("Excursion (s)"), head);
            t.check("indwell 0.6 outside In 0.2–0.5", JSON.stringify(await cell("dwell", "in")) === JSON.stringify({ text: "0.6", status: "is-fail" }), JSON.stringify(await cell("dwell", "in")));
            t.check("outdwell 0.4 inside, but dwell_max 5 % reaches nothing outside", (await cell("dwell", "out")).status === "is-ok", JSON.stringify(await cell("dwell", "out")));
            t.check("excursion 0.3 outside 0.2–0.25", (await cell("excursion", "")).status === "is-fail", JSON.stringify(await cell("excursion", "")));
            const group = await frame.textContent(".wps-check-table .wps-group-row");
            t.check("group row shows In/Out ranges", group.includes("0.2 – 0.5") && group.includes("0.2 – 0.8") && group.includes("0.2 – 0.25"), group);
            await frame.click("#wpsFitOverridesBtn");
            const value = name => frame.evaluate(key => {
                const file = loadedFiles[0];
                const parent = key.endsWith("_max") ? file.sections.overrides : file.sections.segments[0];
                return [...parent.children].find(child => child.tagName === key).textContent;
            }, name);
            t.check("Fit Overrides: dwell_max and excursion_max 0", await value("dwell_max") === "0.000000" && await value("excursion_max") === "0.000000");
            await frame.click("#wpsFitValuesBtn");
            await frame.click("#wpsFitValuesConfirmBtn");
            t.check("Fit Values: indwell to 0.5, excursion to 0.25", await value("indwell") === "0.500000" && await value("excursion") === "0.250000" && await value("outdwell") === "0.400000",
                `${await value("indwell")} ${await value("excursion")} ${await value("outdwell")}`);
        }
    }
];
