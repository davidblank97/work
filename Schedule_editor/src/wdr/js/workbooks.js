        // Ausduennen fuer Diagramme: je Abschnitt Minimum und Maximum (Spitzen bleiben sichtbar).
        function wdrDecimate(x, y, from, to, buckets = 1500) {
            const points = [];
            const span = to - from + 1;
            if (span <= buckets * 2) {
                for (let i = from; i <= to; i++) if (Number.isFinite(x[i]) && Number.isFinite(y[i])) points.push([x[i], y[i]]);
                return points;
            }
            const size = span / buckets;
            for (let bucket = 0; bucket < buckets; bucket++) {
                const start = from + Math.floor(bucket * size);
                const end = Math.min(to, from + Math.floor((bucket + 1) * size) - 1);
                let minIndex = -1;
                let maxIndex = -1;
                for (let i = start; i <= end; i++) {
                    if (!Number.isFinite(y[i]) || !Number.isFinite(x[i])) continue;
                    if (minIndex < 0 || y[i] < y[minIndex]) minIndex = i;
                    if (maxIndex < 0 || y[i] > y[maxIndex]) maxIndex = i;
                }
                if (minIndex < 0) continue;
                if (minIndex === maxIndex) points.push([x[minIndex], y[minIndex]]);
                else if (minIndex < maxIndex) points.push([x[minIndex], y[minIndex]], [x[maxIndex], y[maxIndex]]);
                else points.push([x[maxIndex], y[maxIndex]], [x[minIndex], y[minIndex]]);
            }
            return points;
        }

        const WDR_STAT_COLUMNS = [
            // [Spalte Data, Ueberschrift, Quelle, Kennwert]
            ["Q", "Heat Input sleeked\nMIN (per 10 periods)", "P", "min"],
            ["R", "Heat Input sleeked\nMAX (per 10 periods)", "P", "max"],
            ["S", "Heat Input average\nper 10 periods\nMethod A", "P", "avg"],
            ["T", "Heat Input per period\nMIN", "O", "min"],
            ["U", "Heat Input per period\nMAX", "O", "max"],
            ["V", "Heat Input average\nper period\nMethod A", "O", "avg"],
            ["W", "Heat Input per peak\nMIN (instantaneous)\nMethod A", "L", "min"],
            ["X", "Heat Input per peak\nMAX (instantaneous)\nMethod A", "L", "max"],
            ["Y", "Heat Input average\nof instantaneous values\nMethod A", "L", "avg"],
            ["Z", "Heat Input\nMIN\nMethod C (machine)", "H", "min"],
            ["AA", "Heat Input\nMAX\nMethod C (machine)", "H", "max"],
            ["AB", "Heat Input average\nMethod C (machine)", "H", "avg"]
        ];
        const WDR_STAT_SOURCE = { P: "sleeked", O: "perPeriod", L: "perPeak", H: "methodC" };

        // Auswertungs-Excel einer CSV.
        async function buildEvaluationWorkbook(fileName, text, log, evaluation, target, onStep = () => {}) {
            const { columns: c, a, b, n, settings, result } = evaluation;
            const firstRow = a + 4;
            const lastRow = b + 4;
            const schedule = log.header.SCHEDULE || "";
            const statusInfo = wdrTargetStatus(evaluation, target);
            const num = value => Number.isFinite(value) ? { v: value, s: XL_STYLE.number } : null;

            /* Data */
            const data = new XlSheet("Data", { selected: true, freezeRows: 3, ignoreFormulaRange: "Q4:AF4", widths: [10, 11, 10, 10, 10, 10, 11, 12, 10, 10, 10, 14, 14, 14, 14, 14, ...Array(12).fill(14), 10, 16, 16, 16] });
            // Zeile 1: eine Zeile ohne Umbruch (laeuft ueber die leeren Nachbarzellen)
            data.row(1, [{ v: `Heat input evaluation – ${schedule || fileName} · process factor ${settings.processFactor} · ${evaluation.rangeNote} · statistics over rows ${firstRow}–${lastRow} (${c.J[a].toFixed(1)}–${c.J[b].toFixed(1)} s) · windows ${evaluation.periodSeconds} s / ${evaluation.periodSeconds * 10} s`, s: XL_STYLE.bold }]);
            const headers = ["Time", "PulseState", "Amps", "Volts", "Travel", "Wire", "Heat Input\n(log)", "Heat Input\nMethod C\n(machine)", "Travel", "Time", "Time", "Heat Input\ninstantaneous\nMethod A", "Heat Input\nBackground\nMethod A", "Heat Input\nPulse\nMethod A", "Heat Input\nrolling average\nper period\nMethod A", "Heat Input\nrolling average\nper 10 periods\nMethod A",
                ...WDR_STAT_COLUMNS.map(item => item[1]), "Ratio\nMethod A / C", "Energy / distance\nk·ΣU·I·Δt / Σv·Δt", "Machine segment average\nk·Energy / Distance", "Machine heat input\n(logged)"];
            data.row(2, headers.map(text => ({ v: text, s: XL_STYLE.header })), 75);
            const units = ["ms", "", "A", "V", "cm/min", "cm/min", "kJ/mm", "kJ/mm", "mm/min", "s", "min", "kJ/mm", "kJ/mm", "kJ/mm", "kJ/mm", "kJ/mm", ...WDR_STAT_COLUMNS.map(() => "kJ/mm"), "", "kJ/mm", "kJ/mm", "kJ/mm"];
            data.row(3, units.map(text => ({ v: text, s: XL_STYLE.header })));
            const statCells = WDR_STAT_COLUMNS.map(([, , source, kind]) => {
                const value = result[WDR_STAT_SOURCE[source]][kind];
                const fn = { min: "MIN", max: "MAX", avg: "AVERAGE" }[kind];
                return Number.isFinite(value) ? { f: `${fn}(${source}${firstRow}:${source}${lastRow})`, v: value, s: XL_STYLE.stat } : { v: "n/a", s: XL_STYLE.stat };
            });
            const ratio = Number.isFinite(result.ratioAC) ? { f: "Y4/AB4", v: result.ratioAC, s: XL_STYLE.stat } : { v: "n/a", s: XL_STYLE.stat };
            const numberCell = value => Number.isFinite(value) ? { v: value, s: XL_STYLE.stat } : { v: "n/a", s: XL_STYLE.stat };
            const extra = [ratio, numberCell(result.energyPerDistance), numberCell(result.machine?.heatInput), numberCell(result.machine?.loggedHeatInput)];
            for (let i = 0; i < n; i++) {
                // A, B unformatiert; C–P metrisch mit zwei Nachkommastellen (volle Genauigkeit bleibt in der Zelle)
                const cells = [c.time[i], c.pulse[i], num(c.amps[i]), num(c.volts[i]), num(c.travel[i]), num(c.wire[i]), num(c.H[i]), num(c.H[i]), num(c.I[i]), num(c.J[i]), num(c.K[i]), num(c.L[i]), num(c.M[i]), num(c.N[i]), num(c.O[i]), num(c.P[i])];
                if (i === 0) cells.push(...statCells, ...extra);
                data.row(i + 4, cells);
                if (i % 20000 === 19999) await onStep(`Writing data row ${i + 1} of ${n}…`);
            }

            /* Chart data (ausgeduennt) + Diagramme */
            const chartData = new XlSheet("Chart data", { freezeRows: 1, widths: Array(18).fill(11) });
            const seriesDefs = [
                ["L", "Method A instantaneous", c.L], ["O", "Method A per period", c.O], ["H", "Method C (machine)", c.H],
                ["P", "Method A per 10 periods", c.P], ["C", "Amps", c.amps], ["D", "Volts", c.volts], ["I", "Travel (mm/min)", c.I]
            ];
            const decimated = seriesDefs.map(([, , values]) => wdrDecimate(c.K, values, a, b));
            const maxLength = Math.max(...decimated.map(points => points.length), 2);
            const limitColumns = [];
            const x0 = c.K[a];
            const x1 = c.K[b];
            if (target && target.min !== null) limitColumns.push(["Target min", [[x0, target.min], [x1, target.min]]]);
            if (target && target.max !== null) limitColumns.push(["Target max", [[x0, target.max], [x1, target.max]]]);
            const allSeries = [...seriesDefs.map(([, name], index) => [name, decimated[index]]), ...limitColumns];
            chartData.row(1, allSeries.flatMap(([name]) => [{ v: `${name} – time (min)`, s: XL_STYLE.header }, { v: name, s: XL_STYLE.header }]));
            for (let row = 0; row < maxLength; row++) {
                chartData.row(row + 2, allSeries.flatMap(([, points]) => points[row] ? [points[row][0], points[row][1]] : [null, null]));
            }
            const ref = (seriesIndex, axis) => {
                const columnIndex = seriesIndex * 2 + (axis === "y" ? 1 : 0);
                const length = allSeries[seriesIndex][1].length;
                const columnName = xlColumnName(columnIndex);
                return `'Chart data'!$${columnName}$2:$${columnName}$${length + 1}`;
            };
            const serie = (index, color, width) => ({ name: allSeries[index][0], x: ref(index, "x"), y: ref(index, "y"), color, width });
            const limitSeries = limitColumns.map((_, offset) => ({ ...serie(seriesDefs.length + offset, "C00000", 19050), dash: "dash" }));
            const chartSpecs = [
                { title: "Heat input instantaneous – Method A", yTitle: "kJ/mm", series: [serie(0, "F28A3D")] },
                { title: "Heat input rolling average per period – Method A", yTitle: "kJ/mm", series: [serie(1, "D9702C", 12700), ...limitSeries] },
                { title: "Heat input instantaneous – Method A vs. Method C (machine)", yTitle: "kJ/mm", series: [serie(0, "F28A3D"), serie(2, "477BD1")] },
                { title: "Heat input rolling average per 10 periods (sleeked) – Method A", yTitle: "kJ/mm", series: [serie(3, "D9702C", 15875), ...limitSeries] },
                { title: "Amps, Volts, Travel", yTitle: "A · V · mm/min", series: [serie(4, "D9702C"), serie(5, "477BD1"), serie(6, "16A085")] }
            ];
            const charts = chartSpecs.map((spec, index) => ({
                xml: xlScatterChartXml({ ...spec, xTitle: "Time (min)" }),
                from: [0, 1 + index * 24], to: [16, 1 + index * 24 + 22]
            }));
            const chartSheet = new XlSheet("Charts", {});
            chartSheet.row(1, [{ v: `Charts of rows ${firstRow}–${lastRow} (thinned for display: minimum and maximum of each section; statistics use all data)`, s: XL_STYLE.note }]);

            /* Factors and limits */
            const factors = new XlSheet("Factors and limits", { widths: [34, 22, 70] });
            let row = 1;
            const put = (label, value, note, style) => factors.row(row++, [{ v: label, s: XL_STYLE.bold },
                typeof value === "number" ? (Number.isInteger(value) ? value : { v: value, s: XL_STYLE.number })
                    : (value && typeof value === "object" ? value : { v: value ?? "", s: style || 0 }),
                note ? { v: note, s: XL_STYLE.note } : null]);
            factors.row(row++, [{ v: "Settings of this evaluation", s: XL_STYLE.header }, { v: "", s: XL_STYLE.header }, { v: "", s: XL_STYLE.header }]);
            put("Process factor k", settings.processFactor, "0.6 = heat input for TIG (EN ISO 1011-1, also used by the machine and the Schedule Editor); 1 = arc energy");
            put("Evaluation range", evaluation.rangeNote, `Data rows ${firstRow}–${lastRow}, ${c.J[a].toFixed(2)}–${c.J[b].toFixed(2)} s`);
            put("Window per period", `${evaluation.periodSeconds} s`, evaluation.setpoints?.period ? "oscillation period from the set points: In-Dwell + Out-Dwell + 2 × Excursion" : "set value in the converter (no oscillation set points in the log)");
            put("Window per 10 periods", `${evaluation.periodSeconds * 10} s`);
            put("Units in the log", `travel ${evaluation.units.travel || "?"}, heat input ${evaluation.units.heat || "?"}`, "all values in this workbook are metric: cm/min, mm/min, mm, kJ/mm");
            put("Formula Method A", "U · I / v · 0.06 · k", "v in mm/min → kJ/mm; per measuring point");
            put("Formula Energy / distance", "k · Σ U·I·Δt / Σ v·Δt", "over the evaluation range; robust against travel ≈ 0");
            row++;
            factors.row(row++, [{ v: "Log", s: XL_STYLE.header }, { v: "", s: XL_STYLE.header }, { v: "", s: XL_STYLE.header }]);
            put("File", fileName);
            put("Log version", log.version || "?");
            ["SCHEDULE", "POWER SUPPLY", "WELD HEAD", "TRACK DIAMETER", "USER", "DATE", "START TIME", "STOP TIME"].forEach(key => {
                if (log.header[key] !== undefined) put(key.charAt(0) + key.slice(1).toLowerCase(), log.header[key]);
            });
            put("Data rows", n);
            put("Weld time", Number.isFinite(result.weldTime) ? `${Math.floor(result.weldTime / 3600)}:${String(Math.floor(result.weldTime % 3600 / 60)).padStart(2, "0")}:${String(Math.round(result.weldTime % 60)).padStart(2, "0")} (h:mm:ss)` : "n/a", "duration of the log");
            put("Wire length (m)", Number.isFinite(result.wireLength) ? result.wireLength : "n/a", "wire feed speed integrated over the whole weld");
            put("Wire (kg)", Number.isFinite(result.wireMass) ? { v: result.wireMass, s: XL_STYLE.number3 } : "n/a", `Ø ${settings.wireDiameter} mm, density ${settings.wireDensity} g/cm³`);
            if (evaluation.setpoints) put("Steady state (set points)", `${(evaluation.setpoints.start / 1000).toFixed(2)} s – ${Number.isFinite(evaluation.setpoints.end) ? (evaluation.setpoints.end / 1000).toFixed(2) + " s" : "end"}`, "after up-slope, before down-slope");
            row++;
            factors.row(row++, [{ v: "Heat input limits", s: XL_STYLE.header }, { v: "", s: XL_STYLE.header }, { v: "", s: XL_STYLE.header }]);
            if (target) {
                put("Target range", target.name, "from the Schedule Editor (Tools › Heat Input), matched by the schedule number");
                put("Min (kJ/mm)", target.min ?? "–");
                put("Max (kJ/mm)", target.max ?? "–");
            } else {
                put("Target range", "none", "set target ranges in the Schedule Editor (Heat Input) to check the beads");
            }
            put("Result (per period min/max)", statusInfo.text, "", statusInfo.ok === false ? XL_STYLE.flag : statusInfo.ok ? XL_STYLE.ok : 0);
            if (log.limits) {
                row++;
                factors.row(row++, [{ v: "Machine limits (LIMITS_TAGS)", s: XL_STYLE.header }, { v: "", s: XL_STYLE.header }, { v: "", s: XL_STYLE.header }]);
                // Travel/Wire-Grenzen stehen in der Einheit des Vorschubs im Log -> cm/min
                const travelFactor = wdrTravelFactor(evaluation.units.travel);
                log.limits.tags.forEach((tag, index) => {
                    const value = log.limits.values[index];
                    const isSpeed = /travel|wire/i.test(tag);
                    put(isSpeed ? `${tag} (cm/min)` : tag, Number.isFinite(value) ? (isSpeed ? value * travelFactor : value) : "");
                });
            }

            /* Machine averages + set points */
            const machine = new XlSheet("Machine averages", { widths: Array(17).fill(12) });
            row = 1;
            const writeBlock = (title, block, extraHeader, extraValues) => {
                const metric = block.tags.map((tag, index) => wdrMetricUnit(block.uom[index], tag));
                const format = value => Number.isInteger(value) ? value : { v: value, s: XL_STYLE.number };
                machine.row(row++, [{ v: title, s: XL_STYLE.bold }]);
                machine.row(row++, [...block.tags, ...(extraHeader || [])].map(text => ({ v: text, s: XL_STYLE.header })));
                machine.row(row++, [...metric.map(item => item.unit), ...(extraHeader ? extraHeader.map(() => "kJ/mm") : [])].map(text => ({ v: text, s: XL_STYLE.header })));
                block.rows.forEach((cells, rowIndex) => {
                    machine.row(row++, [...block.tags.map((_, index) => {
                        const value = wdrNumber(cells[index], log.decimalComma);
                        return Number.isFinite(value) ? format(value * metric[index].factor) : (cells[index] || "");
                    }), ...(extraValues ? extraValues(rowIndex).map(value => Number.isFinite(value) ? format(value) : "") : [])]);
                });
                row++;
            };
            if (log.blocks.SEGMENT_AVERAGE && result.machine) {
                writeBlock("Segment averages (machine)", log.blocks.SEGMENT_AVERAGE, ["Arc energy\nEnergy / Distance", `Heat input\n× k = ${settings.processFactor}`],
                    index => [result.machine.segments[index].arcEnergy, result.machine.segments[index].arcEnergy * settings.processFactor]);
            } else {
                machine.row(row++, [{ v: "No segment averages in the log.", s: XL_STYLE.note }]);
                row++;
            }
            if (log.blocks.SETPOINT) writeBlock("Set points", log.blocks.SETPOINT);

            const sheets = [{ sheet: data }, { sheet: chartSheet, charts }, { sheet: chartData }, { sheet: factors }, { sheet: machine }];

            /* Raw data (optional): komplette CSV mit allen Logspalten */
            if (settings.rawSheet) {
                const raw = new XlSheet("Raw data", { widths: Array(16).fill(12) });
                const lines = text.split(/\r?\n/);
                let rawRow = 1;
                for (let index = 0; index < lines.length; index++) {
                    if (lines[index].trim() === "") continue;
                    const cells = wdrSplitLine(lines[index], log.delimiter).map(cell => {
                        const value = wdrNumber(cell, log.decimalComma);
                        return Number.isFinite(value) && !/^[-+]?0\d/.test(cell) ? value : cell;
                    });
                    raw.row(rawRow++, cells);
                    if (index % 30000 === 29999) await onStep(`Writing raw data line ${index + 1}…`);
                }
                sheets.push({ sheet: raw });
            }

            await onStep("Compressing workbook…");
            return xlBuildWorkbook(sheets);
        }

        // Sammeltabelle aller Raupen (Aufbau wie WPQ_…_Heat-input.xlsx, korrigierte Ueberschriften).
        async function buildSummaryWorkbook(entries, settings) {
            const sheet = new XlSheet("Heat input", { selected: true, freezeRows: 2, widths: [11, 11, 9, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 13, 13, 11, 10, 10, 16, 34, 30, 40, 12] });
            const statHeaders = WDR_STAT_COLUMNS.map(item => item[1]);
            sheet.row(1, ["Pass", "Bead", "Preheat", ...statHeaders, "Energy / distance\nk·ΣU·I·Δt / Σv·Δt", "Machine segment\naverage", "Weld time", "Wire length", "Wire\nconsumption", "Target range", "Status (per period min/max)", "Schedule", "File", "Date"].map(text => ({ v: text, s: XL_STYLE.header })), 75);
            sheet.row(2, ["", "", "°C", ...statHeaders.map(() => "kJ/mm"), "kJ/mm", "kJ/mm", "h:mm:ss", "m", "kg", "kJ/mm", "", "", "", ""].map(text => ({ v: text, s: XL_STYLE.header })));
            const sorted = [...entries].sort((x, y) => WDR_PASS_ORDER.indexOf(x.pass) - WDR_PASS_ORDER.indexOf(y.pass)
                || x.bead.layer - y.bead.layer || x.bead.bead - y.bead.bead || x.bead.suffix.localeCompare(y.bead.suffix) || x.fileName.localeCompare(y.fileName));
            const groups = new Map();
            sorted.forEach((entry, index) => {
                const rowNumber = index + 3;
                const r = entry.evaluation.result;
                const values = WDR_STAT_COLUMNS.map(([, , source, kind]) => r[WDR_STAT_SOURCE[source]][kind]);
                const status = wdrTargetStatus(entry.evaluation, entry.target);
                const statusStyle = status.ok === false ? XL_STYLE.flag : status.ok ? XL_STYLE.ok : XL_STYLE.note;
                const rangeStyle = index => {
                    if (!entry.target || status.ok !== false) return XL_STYLE.number;
                    if (index === 3 && entry.target.min !== null && values[3] < entry.target.min) return XL_STYLE.flagNumber;
                    if (index === 4 && entry.target.max !== null && values[4] > entry.target.max) return XL_STYLE.flagNumber;
                    return XL_STYLE.number;
                };
                sheet.row(rowNumber, [
                    entry.pass, entry.bead.label || "–", null,
                    ...values.map((value, valueIndex) => Number.isFinite(value) ? { v: value, s: rangeStyle(valueIndex) } : "n/a"),
                    Number.isFinite(r.energyPerDistance) ? { v: r.energyPerDistance, s: XL_STYLE.number } : "n/a",
                    Number.isFinite(r.machine?.heatInput) ? { v: r.machine.heatInput, s: XL_STYLE.number } : "n/a",
                    Number.isFinite(r.weldTime) ? { v: r.weldTime / 86400, s: XL_STYLE.duration } : "n/a",
                    Number.isFinite(r.wireLength) ? { v: r.wireLength, s: XL_STYLE.number } : "n/a",
                    Number.isFinite(r.wireMass) ? { v: r.wireMass, s: XL_STYLE.number3 } : "n/a",
                    entry.target ? `${entry.target.name} ${entry.target.min ?? "–"} – ${entry.target.max ?? "–"}` : "–",
                    { v: status.text, s: statusStyle },
                    entry.schedule, entry.fileName, entry.date
                ]);
                if (!groups.has(entry.pass)) groups.set(entry.pass, { first: rowNumber, last: rowNumber });
                groups.get(entry.pass).last = rowNumber;
            });
            const lastDataRow = sorted.length + 2;
            const sumOf = (key, from, to) => sorted.slice(from - 3, to - 2).map(entry => entry.evaluation.result[key]).filter(Number.isFinite).reduce((sum, value) => sum + value, 0);
            // Summenzeile: gesamte Schweisszeit und Drahtverbrauch
            sheet.row(lastDataRow + 1, [{ v: "Total", s: XL_STYLE.bold }, ...Array(16).fill(null),
                { f: `SUM(R3:R${lastDataRow})`, v: sumOf("weldTime", 3, lastDataRow) / 86400, s: XL_STYLE.boldDuration },
                { f: `SUM(S3:S${lastDataRow})`, v: sumOf("wireLength", 3, lastDataRow), s: XL_STYLE.boldNumber },
                { f: `SUM(T3:T${lastDataRow})`, v: sumOf("wireMass", 3, lastDataRow), s: XL_STYLE.boldNumber }]);
            // Gruppenblock: Mittel je Lage (Spalte I = average per period, wie in der WPQ-Datei), Schweisszeit und Draht je Lage
            const blockRow = lastDataRow + 3;
            sheet.row(blockRow, ["Per pass (average per period, column I)", null, null, "MIN", "MAX", "AVERAGE", "Beads", "Weld time", "Wire (kg)"].map((text, index) => text === null ? null : { v: text, s: index === 0 ? XL_STYLE.bold : XL_STYLE.header }));
            let groupRow = blockRow + 1;
            groups.forEach((range, pass) => {
                const ref = `I${range.first}:I${range.last}`;
                const values = sorted.slice(range.first - 3, range.last - 2).map(entry => entry.evaluation.result.perPeriod.avg).filter(Number.isFinite);
                sheet.row(groupRow++, [{ v: pass, s: XL_STYLE.bold }, null, null,
                    values.length ? { f: `MIN(${ref})`, v: Math.min(...values), s: XL_STYLE.number } : "n/a",
                    values.length ? { f: `MAX(${ref})`, v: Math.max(...values), s: XL_STYLE.number } : "n/a",
                    values.length ? { f: `AVERAGE(${ref})`, v: values.reduce((sum, value) => sum + value, 0) / values.length, s: XL_STYLE.number } : "n/a",
                    range.last - range.first + 1,
                    { f: `SUM(R${range.first}:R${range.last})`, v: sumOf("weldTime", range.first, range.last) / 86400, s: XL_STYLE.duration },
                    { f: `SUM(T${range.first}:T${range.last})`, v: sumOf("wireMass", range.first, range.last), s: XL_STYLE.number3 }]);
            });
            sheet.row(groupRow + 1, [{ v: `Process factor k = ${settings.processFactor}. Columns D–O correspond to row 4 (Q–AB) of each evaluation workbook; headers corrected (W–Y: instantaneous Method A, Z–AB: Method C). Bead from the file name (L…_B… or "Layer … Bead …"), pass from the schedule name. Weld time = duration of the log; wire = wire feed integrated over the whole weld, Ø ${settings.wireDiameter} mm, density ${settings.wireDensity} g/cm³.`, s: XL_STYLE.note }]);
            return xlBuildWorkbook([{ sheet }]);
        }
