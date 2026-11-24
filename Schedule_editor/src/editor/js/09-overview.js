        /* PROGRAM OVERVIEW (PDF) */
        // Druckansicht aller geladenen Dateien: hervorgehobene (★) Global- und Segmentwerte, Heat-Input-Diagramm
        // mit Tabelle und alle Overrides. Speichern als PDF ueber den Druckdialog des Browsers.
        function escapeHtml(text) {
            return String(text ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
        }

        function directChildValue(node, key) {
            const child = node ? [...node.children].find(element => element.tagName === key) : null;
            return child ? child.textContent.trim() : null;
        }

        // Tabelle Parameter × Spalten; bei vielen Spalten in mehrere Bloecke aufgeteilt. rows: Schluessel oder
        // { group: "Titel" } fuer eine Gruppenzeile. Zeilen mit ueberall gleichem Wert erscheinen grau.
        function overviewMatrix(rows, columns, valueOf, maxColumns = 8, format = (key, value) => formatComparisonValue(key, value)) {
            if (!rows.some(row => typeof row === "string") || !columns.length) return '<p class="muted">No values.</p>';
            let html = "";
            for (let start = 0; start < columns.length; start += maxColumns) {
                const chunk = columns.slice(start, start + maxColumns);
                html += '<table class="matrix"><thead><tr><th>Parameter</th>'
                    + chunk.map(column => `<th class="num">${escapeHtml(column.label)}</th>`).join("") + "</tr></thead><tbody>";
                rows.forEach(row => {
                    if (typeof row !== "string") {
                        html += `<tr class="group"><td colspan="${chunk.length + 1}">${escapeHtml(row.group)}</td></tr>`;
                        return;
                    }
                    const values = chunk.map(column => valueOf(column, row));
                    const distinct = new Set(values.filter(value => value !== null));
                    html += `<tr${distinct.size <= 1 && chunk.length > 1 ? ' class="same"' : ""}><td class="key">${escapeHtml(row)}</td>`
                        + values.map(value => {
                            const text = value === null ? "–" : format(row, value);
                            const zero = value !== null && Number(value) === 0;
                            return `<td class="num${zero ? " zero" : ""}">${escapeHtml(text)}</td>`;
                        }).join("") + "</tr>";
                });
                html += "</tbody></table>";
            }
            return html;
        }

        // Segmentfelder in Gruppen (Strom, Spannung, Vorschub, Draht, Pendeln, weitere) mit Gruppenzeilen.
        function overviewSegmentRows(keys) {
            const groups = [
                ["Current (A)", key => /^(pri|bkg)_amp$/.test(key)],
                ["Voltage / AHC (V)", key => /^(pri|bkg)_ahc$/.test(key)],
                ["Travel speed (in/min)", key => /^(pri|bkg)_travel$/.test(key)],
                ["Wire feed (in/min)", key => /^(pri|bkg)_wire2?$/.test(key)],
                ["Oscillation (s)", key => /^(indwell|excursion|outdwell)$/.test(key)]
            ];
            const rows = [];
            const used = new Set();
            groups.forEach(([title, test]) => {
                const members = keys.filter(test);
                if (!members.length) return;
                rows.push({ group: title }, ...members);
                members.forEach(key => used.add(key));
            });
            const rest = keys.filter(key => !used.has(key));
            if (rest.length) rows.push({ group: "Further values" }, ...rest);
            return rows;
        }

        // WPS: Bereiche je Lage und Pruefung der Schedules (wie im Editor, Reiter WPS Import / Check).
        function buildOverviewWps(files) {
            const store = readWpsStore();
            if (!store || !store.rows.length) return "";
            const fields = WPS_FIELD_KEYS;
            const pairFields = fields.filter(key => key !== "heat");
            const ranges = '<table class="wps"><thead><tr><th>Pass</th><th>Schedules</th>'
                + fields.map(key => `<th class="num">${escapeHtml(WPS_FIELDS[key].label)}<br><small>${escapeHtml(WPS_FIELDS[key].unit)}</small></th>`).join("")
                + "</tr></thead><tbody>"
                + store.rows.map(row => `<tr><td><strong>${escapeHtml(row.label)}</strong></td><td>${escapeHtml(row.files.join(", ") || "–")}</td>`
                    + fields.map(key => `<td class="num">${escapeHtml(describeWpsRange(row[key], key))}</td>`).join("") + "</tr>").join("")
                + "</tbody></table>";
            const mean = store.checkMode === "mean";
            const results = files.map(file => wpsCheckFile(file, store)).filter(result => result.rows.length);
            const unassigned = files.filter(file => !store.rows.some(row => row.files.includes(fileTargetKey(file)))).map(fileShortLabel);
            const word = { ok: "OK", warn: "Override", fail: "Outside", off: "Off", na: "–" };
            const worst = list => (list.some(item => item.status === "fail") ? "fail" : list.some(item => item.status === "warn") ? "warn" : list.length ? "ok" : "na");
            let check = '<table class="wps check"><thead><tr><th rowspan="2">Schedule</th>'
                + pairFields.map(key => `<th colspan="2" class="num sep">${escapeHtml(WPS_FIELDS[key].label)} <small>${escapeHtml(WPS_FIELDS[key].unit)}</small></th>`).join("")
                + `<th class="num sep">${escapeHtml(WPS_FIELDS.heat.label)} <small>${escapeHtml(WPS_FIELDS.heat.unit)}</small></th><th rowspan="2">Status</th></tr><tr>`
                + pairFields.map(() => (mean ? '<th colspan="2" class="num sep"><small>mean</small></th>' : '<th class="num sep"><small>P</small></th><th class="num"><small>B</small></th>')).join("")
                + '<th class="num sep"><small>nominal</small></th></tr></thead><tbody>';
            store.rows.forEach(wpsRow => {
                const members = results.filter(result => result.rows[0] === wpsRow);
                if (!members.length) return;
                check += `<tr class="group"><td>${escapeHtml(wpsRow.label)}</td>`
                    + pairFields.map(key => `<td colspan="2" class="num sep range">${escapeHtml(describeWpsRange(wpsRow[key], key))}</td>`).join("")
                    + `<td class="num sep range">${escapeHtml(describeWpsRange(wpsRow.heat, "heat"))}</td><td class="range">WPS range</td></tr>`;
                members.forEach(result => {
                    result.entries.forEach(entry => {
                        const segment = result.file.sections.segments[entry.segmentIndex];
                        const status = entry.disabled ? "off" : entry.status;
                        const name = result.file.sections.segments.length > 1
                            ? `${fileShortLabel(result.file)} · S${segmentDisplayNumber(segment, entry.segmentIndex)}` : result.file.name.replace(/\.xml$/i, "");
                        const cell = (key, checks, span, separator) => (checks.length
                            ? `<td class="num ${separator ? "sep " : ""}is-${worst(checks)}"${span ? ` colspan="${span}"` : ""}>${escapeHtml(formatWpsNumber(checks[0].value, key))}</td>`
                            : `<td class="num${separator ? " sep" : ""}"${span ? ` colspan="${span}"` : ""}>–</td>`);
                        check += `<tr><td>${escapeHtml(name)}</td>`
                            + pairFields.map(key => {
                                const checks = entry.disabled ? [] : entry.values[key]?.checks || [];
                                if (mean && checks.some(item => item.part === "mean")) return cell(key, checks.filter(item => item.part === "mean"), 2, true);
                                return cell(key, checks.filter(item => item.part === "pri"), 0, true) + cell(key, checks.filter(item => item.part === "bkg"), 0, false);
                            }).join("")
                            + cell("heat", entry.disabled ? [] : entry.values.heat?.checks || [], 0, true)
                            + `<td class="status is-${status}">${word[status] || "–"}</td></tr>`;
                    });
                });
            });
            check += "</tbody></table>";
            const source = [store.wpsNumber ? `WPS ${store.wpsNumber}` : "", store.document ? `${store.document}${store.page ? `, page ${store.page}` : ""}` : ""].filter(Boolean).join(" · ");
            // Zwei Bloecke: Ueberschrift + Bereiche bleiben zusammen, die Pruefung als eigener Block (nicht zerschnitten).
            return `<section class="block">
    <h2>WPS – ranges and check</h2>
    <div class="muted">${escapeHtml(source)}${mean ? " · current, voltage, travel and wire checked as time-weighted mean" : ""}</div>
    ${ranges}
    </section>
    <section class="block">
    ${results.length ? check : '<p class="muted">No loaded schedule is assigned to a WPS pass.</p>'}
    <p class="legend">P = pulse, B = background. Outside: value outside the WPS. Override: value inside, but value ± override reaches outside.${unassigned.length ? ` Not assigned to a WPS pass: ${escapeHtml(unassigned.join(", "))}.` : ""}</p>
    </section>`;
        }

        function buildOverviewHeatChart(entriesByFile) {
            const holder = document.createElement("div");
            holder.style.cssText = "position:absolute;left:-10000px;top:0;width:1100px;";
            document.body.appendChild(holder);
            try {
                renderHeatInputChart(entriesByFile, holder);
                const svg = holder.querySelector("svg");
                if (!svg) return '<p class="muted">No segment with a valid heat input to chart.</p>';
                svg.querySelectorAll(".heat-hit").forEach(element => element.remove());
                svg.removeAttribute("height");
                svg.setAttribute("width", "100%");
                return svg.outerHTML;
            } finally {
                holder.remove();
            }
        }

        function buildOverviewHeatTable(entriesByFile) {
            let html = '<table class="heat"><thead><tr><th>Schedule</th><th class="num">Heat input<br><small>kJ/mm</small></th>'
                + '<th class="num">Range with overrides<br><small>kJ/mm</small></th><th class="num">Target range<br><small>kJ/mm</small></th>'
                + '<th class="num">Avg. current<br><small>A</small></th><th class="num">Travel<br><small>mm/min</small></th><th>Status</th></tr></thead><tbody>';
            entriesByFile.forEach(group => {
                const targetText = [
                    group.limitLow !== null || group.limitHigh !== null ? `limits ${group.limitLow ?? "–"} – ${group.limitHigh ?? "–"}` : "",
                    ...group.targets.map(target => `${target.min ?? "–"} – ${target.max ?? "–"}`)
                ].filter(Boolean).join(" · ") || "–";
                group.entries.forEach(entry => {
                    const { result } = entry;
                    const segment = group.file.sections.segments[entry.segmentIndex];
                    const valid = !result.disabled && !result.error;
                    const status = result.disabled ? "Off" : result.error ? "Not calculable"
                        : entry.outside ? "Outside" : (group.limitLow !== null || group.limitHigh !== null || group.targets.length) ? "OK" : "–";
                    const color = SEGMENT_COLORS[entry.segmentIndex % SEGMENT_COLORS.length];
                    const name = group.file.sections.segments.length > 1
                        ? `${fileShortLabel(group.file)} · S${segmentDisplayNumber(segment, entry.segmentIndex)}` : group.file.name.replace(/\.xml$/i, "");
                    html += `<tr class="${entry.outside ? "outside" : ""}">`
                        + `<td><span class="swatch" style="background:${color}"></span>${escapeHtml(name)}</td>`
                        + `<td class="num"><strong>${valid ? result.heatInput.toFixed(DISPLAY_DECIMALS) : "–"}</strong></td>`
                        + `<td class="num">${valid ? `${result.minHeatInput.toFixed(DISPLAY_DECIMALS)} – ${result.maxHeatInput.toFixed(DISPLAY_DECIMALS)}` : "–"}</td>`
                        + `<td class="num">${escapeHtml(targetText)}</td>`
                        + `<td class="num">${valid ? result.averageAmps.toFixed(1) : "–"}</td>`
                        + `<td class="num">${valid ? result.averageTravelMmPerMinute.toFixed(1) : "–"}</td>`
                        + `<td class="status is-${status === "OK" ? "ok" : status === "Outside" ? "fail" : "na"}">${escapeHtml(status)}</td></tr>`;
                });
            });
            return html + "</tbody></table>";
        }

        // Overrides, aus denen calculateSegmentHeatInput den Min/Max-Bereich berechnet (gruppiert: Strom, Spannung, Bewegung),
        // dazu wire_max (WPS-Pruefung des Drahtvorschubs).
        const HEAT_INPUT_OVERRIDE_KEYS = ["pri_amp_max", "bkg_amp_max", "avc_override_max", "travel_max", "dwell_max", "excursion_max"];
        const OVERVIEW_OVERRIDE_KEYS = [...HEAT_INPUT_OVERRIDE_KEYS, "wire_max"];

        function buildProgramOverviewHtml() {
            const files = loadedFiles;
            // Ziel-Bereiche aus der WPS: im Diagramm ohne WPS-Nummer (steht im Kopf), damit die Beschriftung passt.
            const wpsStore = readWpsStore();
            const targets = readHeatInputTargets().map(target => (target.source === "wps"
                ? { ...target, name: target.name.replace(/^WPS\s+/, "").replace(wpsStore?.wpsNumber ? `${wpsStore.wpsNumber} ` : "\u0000", "").trim() || target.name }
                : target));
            const fileColumns = files.map(file => ({ label: fileShortLabel(file), file }));
            const keysOf = node => node ? [...node.children].map(child => child.tagName) : [];
            const unionKeys = list => [...new Set(list.flat())];

            // Global: hervorgehobene Werte (★)
            const globalKeys = unionKeys(files.map(file => keysOf(file.sections.global))).filter(key => importantFields.has(key));
            // Segmente: die Feldgruppen der Segmentansicht, danach weitere hervorgehobene (★) Werte; in Gruppen mit Titel.
            const presentSegmentKeys = unionKeys(files.map(file => file.sections.segments.flatMap(keysOf)));
            const groupedSegmentKeys = segmentColumns.flat().filter(key => presentSegmentKeys.includes(key));
            const segmentKeys = [...groupedSegmentKeys,
                ...presentSegmentKeys.filter(key => importantFields.has(key) && !groupedSegmentKeys.includes(key))];
            const segmentColumnsList = files.flatMap(file => file.sections.segments.map((segment, index) => ({
                label: `${fileShortLabel(file)} · S${segmentDisplayNumber(segment, index)}`, segment
            })));
            const presentOverrideKeys = unionKeys(files.map(file => keysOf(file.sections.overrides)));
            const overrideKeys = OVERVIEW_OVERRIDE_KEYS.filter(key => presentOverrideKeys.includes(key));
            const entriesByFile = files.map((file, fileIndex) => ({ ...heatInputCheck(file, targets), fileIndex }));
            const schema = getActiveXdr();
            const now = new Date();
            const activeTargets = targets.filter(item => item.min !== null || item.max !== null);
            const targetText = activeTargets.length
                ? `Target ranges (red lines): ${activeTargets.map(item => `${describeTarget(item)} for ${item.files === null ? "all files" : item.files.join(", ") || "no file"}`).join("; ")}`
                : "No target range set";

            const versions = [...new Set(files.map(file => getFileVersion(file).version || "–"))];
            const showVersion = versions.length > 1;
            const wpsPassOf = file => wpsStore?.rows.filter(row => row.files.includes(fileTargetKey(file))).map(row => row.label).join(", ") || "–";
            const fileList = files.map(file => {
                const head = file.xml.documentElement.getAttribute("head") || "–";
                const result = getSchemaResult(file);
                const schemaText = result ? (result.errors ? `${result.errors} error(s)` : "OK") : "–";
                const fileTargets = targetsForFile(file, targets).map(target => `${target.min ?? "–"} – ${target.max ?? "–"}`).join(" · ") || "–";
                return `<tr><td><strong>${escapeHtml(fileShortLabel(file))}</strong></td><td>${escapeHtml(file.name)}</td><td>${escapeHtml(head)}</td>`
                    + `<td class="num">${file.sections.segments.length}</td>`
                    + (wpsStore ? `<td>${escapeHtml(wpsPassOf(file))}</td>` : "")
                    + `<td class="num">${escapeHtml(fileTargets)}</td>`
                    + (showVersion ? `<td>v${escapeHtml(getFileVersion(file).version || "–")}</td>` : "")
                    + `<td class="${result?.errors ? "is-fail" : ""}">${escapeHtml(schemaText)}</td>`
                    + `<td>${isFileDirty(file) ? "unsaved changes" : needsDownload(file) ? "saved, not downloaded" : "saved"}</td></tr>`;
            }).join("");
            const fileHead = '<tr><th>No.</th><th>File</th><th>Head</th><th class="num">Segments</th>'
                + (wpsStore ? "<th>WPS pass</th>" : "") + '<th class="num">Heat input target<br><small>kJ/mm</small></th>'
                + (showVersion ? "<th>Version</th>" : "") + "<th>Schema</th><th>State</th></tr>";
            const metaLines = [now.toLocaleString(),
                [schema ? `Schema v${schema.version}` : "", !showVersion && versions[0] !== "–" ? `files v${versions[0]}` : ""].filter(Boolean).join(" · "),
                wpsStore?.wpsNumber ? `WPS ${wpsStore.wpsNumber}` : ""].filter(Boolean);
            const percent = (key, value) => `${Number(Number(value).toFixed(DISPLAY_DECIMALS))} %`;

            return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><title>Program overview – ${escapeHtml(now.toLocaleDateString())}</title>
<style>
    @page { size: A4 landscape; margin: 10mm; }
    * { box-sizing: border-box; }
    body { margin: 0; padding: 18px; background: #f4f1ec; color: #1d1a17; font: 11px/1.4 -apple-system, "Segoe UI", Arial, sans-serif; }
    .toolbar { position: sticky; top: 0; display: flex; gap: 8px; justify-content: flex-end; padding: 8px 0 12px; background: #f4f1ec; }
    .toolbar button { padding: 7px 14px; border: 1px solid #805236; border-radius: 7px; background: #fff; color: #9a4a12; font-weight: 600; cursor: pointer; }
    .toolbar button.primary { background: #f28a3d; border-color: #d9702c; color: #24150d; }
    header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid #f28a3d; padding-bottom: 6px; margin-bottom: 12px; }
    h1 { margin: 0; font-size: 20px; } h1 span { color: #d9702c; }
    h2 { margin: 20px 0 6px; font-size: 14px; color: #9a4a12; border-bottom: 1px solid #e0d6cc; padding-bottom: 3px; break-after: avoid; }
    .meta { text-align: right; color: #6b5f55; }
    .muted, small { color: #6b5f55; }
    table { width: 100%; border-collapse: collapse; margin: 6px 0 10px; background: #fff; break-inside: avoid; page-break-inside: avoid; }
    thead { display: table-header-group; }
    section.block { break-inside: avoid; page-break-inside: avoid; }
    tr.group { break-after: avoid; page-break-after: avoid; }
    th, td { padding: 3px 7px; border-bottom: 1px solid #ece3da; text-align: left; vertical-align: top; }
    th { background: #f6ebe1; font-weight: 700; border-bottom: 1px solid #d8c8b9; vertical-align: bottom; }
    tr { break-inside: avoid; }
    td.num, th.num { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
    td.key { font-family: Consolas, monospace; white-space: nowrap; }
    .sep { border-left: 1px solid #e0d6cc; }
    tr.group td { padding-top: 7px; background: #faf4ee; color: #9a4a12; font-weight: 700; border-top: 1px solid #d8c8b9; }
    tr.group td.range { color: #6b5f55; font-weight: 600; }
    tr.same td { color: #8c8178; }
    td.zero { color: #a99d93; }
    tr.outside td { background: #fdecec; }
    .is-warn { color: #a15c07; font-weight: 700; }
    .is-fail { color: #b42318; font-weight: 700; }
    td.status { white-space: nowrap; font-weight: 700; }
    td.status.is-ok, td.status.is-na, td.status.is-off { color: #6b5f55; }
    .swatch { display: inline-block; width: 9px; height: 9px; margin-right: 5px; border-radius: 50%; vertical-align: middle; }
    .chart { background: #fff; border: 1px solid #e3d9cf; padding: 6px; break-inside: avoid; }
    .chart svg { display: block; width: 100%; height: auto; }
    .chart text { font-family: -apple-system, "Segoe UI", Arial, sans-serif; }
    .heat-grid { stroke: #e6ded6; stroke-width: 1; } .heat-axis { stroke: #b9a99b; stroke-width: 1; }
    .heat-tick, .heat-limit-label, .heat-column-note { fill: #5f544b; font-size: 11px; }
    .heat-limit { stroke: #6b5f55; stroke-width: 1.5; stroke-dasharray: 5 4; }
    .heat-range { opacity: 0.55; } .heat-nominal { stroke: #fff; stroke-width: 2; }
    .heat-column.is-outside .heat-range { stroke: #b42318; stroke-width: 2; } .heat-column.is-outside .heat-nominal { stroke: #b42318; }
    .heat-target-line { stroke: #d92d20; stroke-width: 2; }
    .heat-target-label, .heat-group-label, .heat-warning { fill: #1d1a17; font-size: 11px; font-weight: 700; }
    .heat-group-divider { stroke: #b9a99b; stroke-dasharray: 2 3; }
    .legend { margin: 2px 0 0; color: #6b5f55; }
    .page-break { break-before: page; }
    @media print { body { background: #fff; padding: 0; } .toolbar { display: none; } }
</style></head>
<body>
    <div class="toolbar"><button class="primary" onclick="window.print()">Print / Save as PDF</button><button onclick="window.close()">Close</button></div>
    <header>
        <div><h1>Program overview <span>· ${files.length} file(s)</span></h1>
            <div class="muted">Files, segments, ${globalKeys.length ? "global (★), " : ""}overrides, heat input${wpsStore ? ", WPS" : ""}</div></div>
        <div class="meta">${metaLines.map(escapeHtml).join("<br>")}</div>
    </header>

    <section class="block">
    <h2>Files</h2>
    <table><thead>${fileHead}</thead>
    <tbody>${fileList}</tbody></table>
    </section>

    <section class="block">
    <h2>Segments – main values</h2>
    ${overviewMatrix(overviewSegmentRows(segmentKeys), segmentColumnsList, (column, key) => directChildValue(column.segment, key))}
    <p class="legend">Grey rows: same value in all files.</p>
    </section>
${globalKeys.length ? `
    <section class="block">
    <h2>Global – highlighted values</h2>
    ${overviewMatrix(globalKeys, fileColumns, (column, key) => directChildValue(column.file.sections.global, key))}
    </section>` : ""}

    <section class="block">
    <h2>Overrides</h2>
    ${overviewMatrix(overrideKeys, fileColumns, (column, key) => directChildValue(column.file.sections.overrides, key), 10, percent)}
    <p class="legend">Range the welder may change the value by (±). Used for the heat input range; wire_max for the WPS check of the wire feed.</p>
    </section>

    <section class="block">
    <h2>Heat input</h2>
    <div class="muted">Bar: min–max with the overrides, dot: nominal. ${escapeHtml(targetText)}.</div>
    <div class="chart">${buildOverviewHeatChart(entriesByFile)}</div>
    ${buildOverviewHeatTable(entriesByFile)}
    </section>

    ${buildOverviewWps(files)}
</body></html>`;
        }

        function openProgramOverview() {
            commitPendingEdit();
            if (!loadedFiles.length) {
                document.getElementById("status").textContent = "Please load at least one XML file for the program overview.";
                return;
            }
            const overviewWindow = window.open("", "_blank");
            if (!overviewWindow) {
                document.getElementById("status").textContent = "Could not open the program overview. Please allow pop-ups for this page.";
                return;
            }
            overviewWindow.document.open();
            overviewWindow.document.write(buildProgramOverviewHtml());
            overviewWindow.document.close();
            overviewWindow.focus();
            document.getElementById("status").textContent = `Program overview of ${loadedFiles.length} file(s) opened – use "Print / Save as PDF".`;
        }
        document.getElementById("programOverviewBtn").onclick = openProgramOverview;

