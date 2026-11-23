// WDR Converter: Heat-Input-Auswertung (ersetzt die Excel-Vorlage template_metric_Short.xlsx).
const fs = require("fs");
const path = require("path");

const near = (actual, expected, tolerance = 1e-6) => typeof actual === "number" && Math.abs(actual - expected) <= tolerance;

// Synthetisches Log Version 2 (metrisch): Pulsstrom 150/50 A, 10 V, 10 cm/min -> Methode A 0.54 / 0.18 kJ/mm (k = 0.6),
// Mittel 0.36. Ab 28 s Downslope mit 20 A (darf nicht in die Kennwerte eingehen).
function syntheticV2Log() {
    const lines = [
        "LIBURDI DATA LOG,2",
        "SCHEDULE,0408-WPQ_O01_ext_CAP_1_PK_764_N1_L21_B42",
        "USER,Test",
        "DATE, YYYY-MM-DD,2026-07-09",
        "START TIME, HH-MM-SS,02-37-06",
        "LIMITS_TAGS",
        " Pri Amps Error, Pri Amps Fault, Volts High, Volts Low",
        "300.000000,300.000000,50.000000,6.000000",
        "DATA_TAGS",
        " Time, PulseState, Amps, Volts, Travel, Wire, OscState, OscPos, Motion PulseState, Heat Input, WM In/Out Pos, Tungsten Pos",
        "DATA_UOM",
        "ms,,A,V,cm/min,cm/min,,mm,,kJ/mm,mm,deg"
    ];
    for (let i = 0; i < 3000; i++) {
        const pulse = i % 2;
        const amps = i >= 2800 ? 20 : (pulse ? 150 : 50);
        lines.push(`${i * 10},${pulse},${amps.toFixed(6)},10.000000,10.000000,0.000000,0,0.000000,${pulse},0.360000,0.000000,0.000000`);
    }
    const inches = 100 * 28 / 60 / 25.4; // 100 mm/min ueber 28 s
    lines.push(
        "SEGMENT_AVERAGE_TAGS",
        " Time, Segment Number, Pri Amps, Bkg Amps, Pri Volts, Bkg Volts, Pri Travel, Bkg Travel, Pri Wire, Bkg Wire, Energy, Distance",
        "SEGMENT_AVERAGE_UOM",
        "ms,,A,A,V,V,cm/min,cm/min,cm/min,cm/min,J,deg",
        `28000,0,150.000000,50.000000,10.000000,10.000000,10.000000,10.000000,0.000000,0.000000,28000.000000,${inches.toFixed(6)}`,
        "SETPOINT_TAGS",
        " Time, Pri Amps, Bkg Amps, Pri Volts, Bkg Volts, Pri Travel, Bkg Travel, Pri Wire, Bkg Wire",
        "SETPOINT_UOM",
        "ms,A,A,V,V,cm/min,cm/min,cm/min,cm/min",
        "0,40.000000,40.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000",
        "200,150.000000,50.000000,10.000000,10.000000,10.000000,10.000000,0.000000,0.000000",
        "28000,30.000000,20.000000,10.000000,10.000000,10.000000,10.000000,0.000000,0.000000",
        "STOP TIME, HH-MM-SS,02-37-36"
    );
    return lines.join("\r\n") + "\r\n";
}

// Downloads und Meldungen im Frame abfangen und die Konvertierung starten.
async function convert(frame, files) {
    await frame.evaluate(() => {
        window.showDirectoryPicker = undefined;
        window.__zips = [];
        window.__alerts = [];
        window.downloadBlob = (name, blob) => window.__zips.push({ name, blob });
        window.alert = message => window.__alerts.push(String(message));
    });
    await frame.setInputFiles("#file-input", files);
    await frame.click("#convert-btn");
    await frame.waitForFunction(() => window.__alerts.length > 0, null, { timeout: 180000 });
}

// Liest alle erzeugten Dateien im Frame (JSZip + SheetJS) und liefert eine kompakte Beschreibung.
function inspectOutputs(frame) {
    return frame.evaluate(async () => {
        const result = { alerts: window.__alerts, zips: window.__zips.map(item => item.name), files: {} };
        const cell = (sheet, ref) => {
            const value = sheet && sheet[ref];
            return value ? { v: value.v, f: value.f || null, t: value.t } : null;
        };
        const columns = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "AA", "AB", "AC", "AD", "AE", "AF"];
        for (const { blob } of window.__zips) {
            const zip = await JSZip.loadAsync(blob);
            for (const name of Object.keys(zip.files)) {
                if (zip.files[name].dir) continue;
                const buffer = await zip.file(name).async("arraybuffer");
                const info = { size: buffer.byteLength };
                result.files[name] = info;
                if (!name.endsWith(".xlsx")) continue;
                const inner = await JSZip.loadAsync(buffer);
                const chartNames = Object.keys(inner.files).filter(item => /^xl\/charts\/chart\d+\.xml$/.test(item)).sort();
                info.charts = await Promise.all(chartNames.map(item => inner.file(item).async("string")));
                const workbook = XLSX.read(buffer, { type: "array", cellFormula: true, sheets: ["Data", "Factors and limits", "Machine averages", "Heat input", "Chart data"] });
                info.sheetNames = workbook.SheetNames;
                const data = workbook.Sheets.Data;
                if (data) {
                    const range = XLSX.utils.decode_range(data["!ref"]);
                    info.lastRow = range.e.r + 1;
                    info.row4 = Object.fromEntries(columns.map(column => [column, cell(data, `${column}4`)]));
                    info.rows = [5, 6, 1003, 2803, 2804].map(row => Object.fromEntries(columns.slice(0, 16).map(column => [column, cell(data, `${column}${row}`)])));
                    info.headers = columns.map(column => cell(data, `${column}2`)?.v || "");
                    info.units = columns.map(column => cell(data, `${column}3`)?.v || "");
                    let errors = 0;
                    let kMismatch = 0;
                    for (const ref of Object.keys(data)) {
                        if (ref[0] === "!") continue;
                        if (data[ref].t === "e") errors++;
                        const match = ref.match(/^K(\d+)$/);
                        if (match && +match[1] >= 4) {
                            const time = data[`A${match[1]}`];
                            if (!time || Math.abs(data[ref].v - time.v / 60000) > 1e-9) kMismatch++;
                        }
                    }
                    info.errors = errors;
                    info.kMismatch = kMismatch;
                }
                ["Factors and limits", "Machine averages", "Heat input"].forEach(sheetName => {
                    if (workbook.Sheets[sheetName]) info[sheetName] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1, defval: "" });
                });
                const chartData = workbook.Sheets["Chart data"];
                if (chartData) info.chartDataRows = XLSX.utils.decode_range(chartData["!ref"]).e.r + 1;
            }
        }
        return result;
    });
}

const factorValue = (rows, label) => (rows.find(row => row[0] === label) || [])[1];

module.exports = [
    {
        name: "metric log: statistics, time axis, charts, target range, summary",
        async run(t) {
            const { frame } = await t.openApp("wdr");
            t.check("evaluation panel", (await frame.$$eval(".panel-header", headers => headers.map(h => h.textContent))).some(text => text.includes("Heat input evaluation")));
            t.check("evaluation is the default format", await frame.$eval('input[name="format"]:checked', input => input.value) === "evaluation");
            // Ziel-Bereich aus dem Schedule Editor (gleiche Herkunft): 0408 soll 0.40–0.60 haben -> per period MIN 0.36 liegt darunter.
            await frame.evaluate(() => {
                localStorage.setItem("scheduleEditorHeatInputTargets", JSON.stringify([
                    { id: "t1", name: "Cap", min: "0.40", max: "0.60", files: ["0408"] },
                    { id: "t2", name: "Other", min: "1.0", max: "2.0", files: ["0999"] }
                ]));
                window.dispatchEvent(new Event("focus"));
            });
            t.check("target ranges found", (await frame.textContent("#eval-targets-info")).includes("2 target ranges"));

            await frame.check("#eval-raw");
            const logPath = path.join(t.tmpDir, "DL_2026-07-09_02-37-06_0408-WPQ_O01_ext_CAP_1_PK_764_N1_L21_B42.csv");
            fs.writeFileSync(logPath, syntheticV2Log());
            const plainPath = path.join(t.tmpDir, "plain.csv");
            fs.writeFileSync(plainPath, "a,b\n1,2\n");
            const started = Date.now();
            await convert(frame, [logPath, plainPath]);
            const out = await inspectOutputs(frame);
            const names = Object.keys(out.files);
            const evalName = names.find(name => name.endsWith("_heat-input.xlsx"));
            const summaryName = names.find(name => /^Heat_input_summary_\d{4}-\d{2}-\d{2}\.xlsx$/.test(name));
            t.check("outputs", evalName && summaryName && names.includes("plain.xlsx") && names.length === 3, names.join(", "));
            t.check("conversion time", Date.now() - started < 30000, `${Date.now() - started} ms`);
            const alert = out.alerts[0] || "";
            t.check("message: plain.csv not evaluated", alert.includes("evaluation not possible") && alert.includes("plain.csv"), alert);
            t.check("message: outside target range", alert.includes("outside the target range") && alert.includes("L21_B42.csv"), alert);
            if (!evalName) return;

            const book = out.files[evalName];
            t.check("sheets", book.sheetNames.join("|") === "Data|Charts|Chart data|Factors and limits|Machine averages|Raw data", book.sheetNames.join("|"));
            t.check("all data rows", book.lastRow === 3003, book.lastRow);
            t.check("no error values", book.errors === 0, book.errors);
            t.check("time axis K = time / 60000 (template: (J + J_next) / 60)", book.kMismatch === 0, book.kMismatch);
            const r4 = book.row4;
            // Bereich: Zeile 1000 bis zum letzten Messpunkt vor dem Downslope (Index 2799 -> Zeile 2803).
            t.check("formula over the actual range", r4.Q.f === "MIN(P1000:P2803)" && r4.W.f === "MIN(L1000:L2803)" && r4.AB.f === "AVERAGE(H1000:H2803)", JSON.stringify([r4.Q, r4.W, r4.AB]));
            t.check("per 10 periods", near(r4.Q.v, 0.36) && near(r4.R.v, 0.36) && near(r4.S.v, 0.36), JSON.stringify([r4.Q, r4.R, r4.S]));
            t.check("per period", near(r4.T.v, 0.36) && near(r4.U.v, 0.36) && near(r4.V.v, 0.36), JSON.stringify([r4.T, r4.U, r4.V]));
            t.check("instantaneous without down-slope", near(r4.W.v, 0.18) && near(r4.X.v, 0.54) && near(r4.Y.v, 0.36, 1e-3), JSON.stringify([r4.W, r4.X, r4.Y]));
            t.check("method C", near(r4.Z.v, 0.36) && near(r4.AA.v, 0.36) && near(r4.AB.v, 0.36), JSON.stringify([r4.Z, r4.AA, r4.AB]));
            t.check("ratio A/C formula", r4.AC.f === "Y4/AB4" && near(r4.AC.v, 1, 3e-3), JSON.stringify(r4.AC));
            t.check("energy / distance", near(r4.AD.v, 0.36, 2e-3), JSON.stringify(r4.AD));
            t.check("machine segment average", near(r4.AE.v, 0.36, 1e-4), JSON.stringify(r4.AE));
            const row5 = book.rows[0];
            t.check("data columns", row5.A.v === 10 && row5.C.v === 150 && near(row5.I.v, 100) && near(row5.J.v, 0.01) && near(row5.L.v, 0.54) && row5.M === null && near(row5.N.v, 0.54), JSON.stringify(row5));
            const lastRow = book.rows[4];
            t.check("rolling averages do not reach into the down-slope", lastRow.O === null && lastRow.P === null && near(lastRow.L.v, 0.072), JSON.stringify(lastRow));
            t.check("corrected headers", book.headers[24].includes("instantaneous") && book.headers[25].includes("Method C"), book.headers.slice(16, 28).join(" / "));
            t.check("5 charts", book.charts.length === 5, book.charts.length);
            t.check("charts use the thinned chart data", book.charts.every(xml => xml.includes("'Chart data'!$") && !xml.includes("<c:numCache>")));
            t.check("time axis in minutes", book.charts.every(xml => xml.includes("Time (min)")));
            t.check("target lines on the rolling average charts", book.charts[1].includes("Target min") && book.charts[3].includes("Target max") && !book.charts[0].includes("Target"));
            t.check("chart data thinned", book.chartDataRows > 100 && book.chartDataRows <= 3002, book.chartDataRows);
            const factors = book["Factors and limits"];
            t.check("factors: process factor", factorValue(factors, "Process factor k") === 0.6, JSON.stringify(factors.slice(0, 4)));
            t.check("factors: target", factorValue(factors, "Min (kJ/mm)") === 0.4 && factorValue(factors, "Max (kJ/mm)") === 0.6, JSON.stringify(factors));
            t.check("factors: result", String(factorValue(factors, "Result (per period min/max)")).startsWith("outside Cap"), factorValue(factors, "Result (per period min/max)"));
            t.check("factors: machine limits", factorValue(factors, "Volts High") === 50);
            const machine = book["Machine averages"];
            t.check("machine averages sheet", machine[0][0] === "Segment averages (machine)" && near(machine[3][13], 0.36, 1e-4), JSON.stringify(machine.slice(0, 4)));

            const summary = out.files[summaryName]["Heat input"];
            const row = summary[2];
            t.check("summary row", row[0] === "Cap" && row[1] === "L21_B42" && near(row[6], 0.36) && near(row[8], 0.36), JSON.stringify(row));
            t.check("summary status", String(row[18]).startsWith("outside Cap") && String(row[17]) === "Cap 0.4 – 0.6", JSON.stringify(row.slice(15)));
            const blockIndex = summary.findIndex(line => line[3] === "MIN" && line[4] === "MAX" && line[5] === "AVERAGE");
            const group = summary[blockIndex + 1] || [];
            t.check("summary group block", blockIndex > 2 && group[0] === "Cap" && near(group[3], 0.36) && near(group[5], 0.36) && group[6] === 1, JSON.stringify(summary.slice(3)));
        }
    },
    {
        name: "imperial log (version 3): units, automatic range, oscillation period",
        async run(t) {
            const { frame } = await t.openApp("wdr");
            await frame.check('input[name="eval-range"][value="auto"]');
            await frame.check('input[name="eval-window"][value="time"]');
            await frame.uncheck("#eval-summary");
            const stored = await frame.evaluate(() => JSON.parse(localStorage.getItem("wdrEvaluationSettings") || "null"));
            t.check("settings stored", stored && stored.rangeMode === "auto" && stored.windowMode === "time" && stored.summary === false, JSON.stringify(stored));
            const csvPath = t.file("WDR_converter/DL_2026-11-10_14-16-55_Layer 7 Bead 12 Out _764.000_712.000_0.csv");
            const csvLines = fs.readFileSync(csvPath, "utf8").split(/\r?\n/);
            const rawRow5 = csvLines[csvLines.indexOf("DATA_UOM") + 3].split(",").map(Number); // zweite Datenzeile
            const started = Date.now();
            await convert(frame, [csvPath]);
            const duration = Date.now() - started;
            const out = await inspectOutputs(frame);
            const names = Object.keys(out.files);
            t.check("only the evaluation (no summary)", names.length === 1 && names[0].endsWith("Out _764.000_712.000_0_heat-input.xlsx"), names.join(", "));
            t.check("conversion time (138 000 rows)", duration < 60000, `${duration} ms`);
            const book = out.files[names[0]];
            t.check("sheets without raw data", book.sheetNames.join("|") === "Data|Charts|Chart data|Factors and limits|Machine averages", book.sheetNames.join("|"));
            t.check("file size", book.size < 12 * 1024 * 1024, book.size);
            t.check("no error values", book.errors === 0, book.errors);
            t.check("time axis", book.kMismatch === 0, book.kMismatch);
            const row5 = book.rows[0];
            // Rohwert Travel in IPM, Heat Input in J/in -> cm/min bzw. kJ/mm
            t.check("raw values", row5.A.v === rawRow5[0] && near(row5.C.v, rawRow5[2], 1e-9), JSON.stringify([row5.A, row5.C, rawRow5]));
            // A–G wie im Log (IPM, J/in), H und I umgerechnet
            t.check("travel IPM -> mm/min", near(row5.E.v, rawRow5[4], 1e-9) && near(row5.I.v, rawRow5[4] * 25.4, 1e-9), JSON.stringify([row5.E, row5.I, rawRow5[4]]));
            t.check("heat input J/in -> kJ/mm", near(row5.G.v, rawRow5[9], 1e-6) && near(row5.H.v, rawRow5[9] / 25400, 1e-9), JSON.stringify([row5.G, row5.H, rawRow5[9]]));
            t.check("units row", book.units[4] === "IPM" && book.units[6] === "J/in" && book.units[7] === "kJ/mm" && book.units[8] === "mm/min", book.units.slice(0, 16).join("|"));
            const r4 = book.row4;
            // automatischer Bereich: Dauerbetrieb laut Sollwerten (Index 196..138178 -> Zeilen 200..138182)
            t.check("automatic range", r4.Z.f === "MIN(H200:H138182)", JSON.stringify(r4.Z));
            t.check("method C average (kJ/mm)", near(r4.AB.v, 1.184291, 1e-5), JSON.stringify(r4.AB));
            t.check("per period (1.6 s windows)", near(r4.T.v, 1.156326, 1e-5) && near(r4.U.v, 1.286748, 1e-5), JSON.stringify([r4.T, r4.U]));
            t.check("machine heat input (logged)", near(r4.AF.v, 1.184824, 1e-5) && near(r4.AE.v, 1.184824, 1e-5), JSON.stringify([r4.AE, r4.AF]));
            const factors = book["Factors and limits"];
            t.check("factors: window from oscillation", factorValue(factors, "Window per period") === "1.6 s", JSON.stringify(factors));
            t.check("factors: log header", factorValue(factors, "Power supply") === "GT7-254201" && factorValue(factors, "Log version") === "3");
            t.check("factors: no target range", factorValue(factors, "Target range") === "none");
            t.check("no target lines", book.charts.every(xml => !xml.includes("Target")));
        }
    },
    {
        name: "raw data only (as before)",
        async run(t) {
            const { frame } = await t.openApp("wdr");
            await frame.check('input[name="format"][value="Excel"]');
            t.check("evaluation panel inactive", await frame.$eval("#evaluation-panel", panel => panel.classList.contains("is-inactive")));
            const logPath = path.join(t.tmpDir, "raw-only.csv");
            fs.writeFileSync(logPath, syntheticV2Log());
            await convert(frame, [logPath]);
            const out = await inspectOutputs(frame);
            const names = Object.keys(out.files);
            t.check("raw workbook only", names.length === 1 && names[0] === "raw-only.xlsx", names.join(", "));
            t.check("no evaluation sheets", out.files["raw-only.xlsx"].charts.length === 0 && !out.files["raw-only.xlsx"].sheetNames.includes("Charts"));
        }
    },
    {
        // Abgleich mit der Excel-Vorlage (60 MB, nicht im Repository): Rohdaten aus Blatt 1 der Vorlage
        // (Text mit Dezimalkomma), Kennwerte wie in Zeile 4 von "Data" bzw. Zeile L21_B42 der WPQ-Sammeltabelle.
        name: "same values as the Excel template (optional)",
        async run(t) {
            const templatePath = "WDR_converter/template_metric_Short.xlsx";
            if (!fs.existsSync(t.file(templatePath))) {
                t.check("template not present – comparison skipped", true);
                return;
            }
            const { frame } = await t.openApp("wdr");
            const values = await frame.evaluate(async url => {
                const zip = await JSZip.loadAsync(await (await fetch(url)).arrayBuffer());
                const strings = [];
                const shared = await zip.file("xl/sharedStrings.xml").async("string");
                const decode = text => text.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, "&");
                for (const match of shared.matchAll(/<si>(.*?)<\/si>/gs)) {
                    strings.push(decode([...match[1].matchAll(/<t[^>]*>(.*?)<\/t>/gs)].map(part => part[1]).join("")));
                }
                const sheet = await zip.file("xl/worksheets/sheet1.xml").async("string");
                const lines = [];
                for (const row of sheet.matchAll(/<row r="(\d+)"[^>]*>(.*?)<\/row>/gs)) {
                    if (row[1] === "1") continue; // Power-Query-Ueberschrift Column1..Column13
                    const cells = [];
                    for (const c of row[2].matchAll(/<c r="([A-Z]+)\d+"([^>]*?)(?:\/>|>(.*?)<\/c>)/gs)) {
                        const index = c[1].split("").reduce((sum, char) => sum * 26 + char.charCodeAt(0) - 64, 0) - 1;
                        const value = (c[3] || "").match(/<v>(.*?)<\/v>/);
                        cells[index] = value ? (/t="s"/.test(c[2]) ? strings[+value[1]] : value[1]) : "";
                    }
                    lines.push(Array.from(cells, cell => cell ?? "").join(";"));
                }
                const log = parseLiburdiLog(lines.join("\n"));
                const pick = evaluation => {
                    const r = evaluation.result;
                    return { range: [evaluation.a + 4, evaluation.b + 4], sleeked: r.sleeked, perPeriod: r.perPeriod, perPeak: r.perPeak, methodC: r.methodC, ratioAC: r.ratioAC };
                };
                return {
                    decimalComma: log.decimalComma,
                    rows: log.blocks.DATA.rows.length,
                    factor1: pick(evaluateHeatInput(log, { processFactor: 1 })),
                    factor06: pick(evaluateHeatInput(log, { processFactor: 0.6 }))
                };
            }, `${t.baseUrl}/${templatePath}`);
            t.check("raw data from the template (decimal comma)", values.decimalComma && values.rows === 126662, JSON.stringify([values.decimalComma, values.rows]));
            const f1 = values.factor1;
            t.check("range rows 1000–121000", f1.range[0] === 1000 && f1.range[1] === 121000, f1.range);
            // Zeile 4 der Vorlage (Faktor 1). T4 (per period MIN 0.999283) ist in der Vorlage ein veralteter Cache-Wert.
            const expected1 = [["sleeked", "min", 1.159930], ["sleeked", "max", 1.189174], ["sleeked", "avg", 1.173225], ["perPeriod", "max", 1.243791], ["perPeriod", "avg", 1.173220],
                ["perPeak", "min", 0.734405], ["perPeak", "max", 2.471318], ["perPeak", "avg", 1.173217], ["methodC", "min", 0.321496], ["methodC", "max", 2.137905], ["methodC", "avg", 0.695846]];
            expected1.forEach(([group, kind, value]) => t.check(`template ${group} ${kind}`, near(f1[group][kind], value, 2e-5), `${f1[group][kind]} vs ${value}`));
            t.check("template ratio A/C", near(f1.ratioAC, 1.686031, 2e-6), f1.ratioAC);
            // Sammeltabelle WPQ_O01-EXT_PK_Heat-input.xlsx, Zeile L21_B42 (Faktor 0.6). G (0.59957) ist dort veraltet.
            const f6 = values.factor06;
            const expected6 = [["sleeked", "min", 0.69595], ["perPeriod", "max", 0.74627], ["perPeriod", "avg", 0.70393], ["perPeak", "min", 0.44064], ["perPeak", "max", 1.48279], ["perPeak", "avg", 0.70393], ["methodC", "avg", 0.69584]];
            expected6.forEach(([group, kind, value]) => t.check(`summary ${group} ${kind}`, near(f6[group][kind], value, 1e-5), `${f6[group][kind]} vs ${value}`));
        }
    }
];
