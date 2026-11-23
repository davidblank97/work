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

        // Tabelle Parameter × Spalten; bei vielen Spalten in mehrere Bloecke aufgeteilt.
        function overviewMatrix(rows, columns, valueOf, maxColumns = 8) {
            if (!rows.length || !columns.length) return '<p class="muted">No values.</p>';
            let html = "";
            for (let start = 0; start < columns.length; start += maxColumns) {
                const chunk = columns.slice(start, start + maxColumns);
                html += '<table class="matrix"><thead><tr><th>Parameter</th>'
                    + chunk.map(column => `<th class="num">${escapeHtml(column.label)}</th>`).join("") + "</tr></thead><tbody>";
                rows.forEach(key => {
                    const values = chunk.map(column => valueOf(column, key));
                    const distinct = new Set(values.filter(value => value !== null));
                    html += `<tr${distinct.size > 1 ? ' class="differs"' : ""}><td class="key">${escapeHtml(key)}</td>`
                        + values.map(value => `<td class="num">${value === null ? "–" : escapeHtml(formatComparisonValue(key, value))}</td>`).join("") + "</tr>";
                });
                html += "</tbody></table>";
            }
            return html;
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
            let html = '<table class="heat"><thead><tr><th>File</th><th>Segment</th><th class="num">Heat input<br><small>kJ/mm</small></th>'
                + '<th class="num">Range<br><small>kJ/mm</small></th><th class="num">Avg. current<br><small>A</small></th>'
                + '<th class="num">Travel<br><small>mm/min</small></th><th>Status</th></tr></thead><tbody>';
            entriesByFile.forEach(group => {
                const limits = group.limitLow !== null || group.limitHigh !== null
                    ? ` <small>(limits ${group.limitLow ?? "–"} – ${group.limitHigh ?? "–"})</small>` : "";
                group.entries.forEach((entry, index) => {
                    const { result } = entry;
                    const segment = group.file.sections.segments[entry.segmentIndex];
                    const valid = !result.disabled && !result.error;
                    const status = result.disabled ? "disabled" : result.error ? "! not calculable"
                        : entry.outside ? [entry.outsideLimit ? "! outside limit" : "", entry.outsideTarget ? `! outside ${entry.targetViolations.map(v => v.target.name).filter((n, i, a) => a.indexOf(n) === i).join(", ")}` : ""].filter(Boolean).join(" · ")
                            : (group.limitLow !== null || group.limitHigh !== null || group.targets.length) ? "✓ OK" : "—";
                    const color = SEGMENT_COLORS[entry.segmentIndex % SEGMENT_COLORS.length];
                    html += `<tr class="${entry.outside ? "outside" : ""}">`
                        + `<td>${index === 0 ? `<strong>${escapeHtml(fileShortLabel(group.file))}</strong>${limits}` : ""}</td>`
                        + `<td><span class="swatch" style="background:${color}"></span>Segment ${escapeHtml(segmentDisplayNumber(segment, entry.segmentIndex))}</td>`
                        + `<td class="num"><strong>${valid ? result.heatInput.toFixed(DISPLAY_DECIMALS) : "–"}</strong></td>`
                        + `<td class="num">${valid ? `${result.minHeatInput.toFixed(DISPLAY_DECIMALS)} – ${result.maxHeatInput.toFixed(DISPLAY_DECIMALS)}` : "–"}</td>`
                        + `<td class="num">${valid ? result.averageAmps.toFixed(1) : "–"}</td>`
                        + `<td class="num">${valid ? result.averageTravelMmPerMinute.toFixed(1) : "–"}</td>`
                        + `<td class="status">${escapeHtml(status)}</td></tr>`;
                });
            });
            return html + "</tbody></table>";
        }

        // Overrides, aus denen calculateSegmentHeatInput den Min/Max-Bereich berechnet (gruppiert: Strom, Spannung, Bewegung).
        const HEAT_INPUT_OVERRIDE_KEYS = ["pri_amp_max", "bkg_amp_max", "avc_override_max", "travel_max", "dwell_max", "excursion_max"];

        function buildProgramOverviewHtml() {
            const files = loadedFiles;
            const targets = readHeatInputTargets();
            const fileColumns = files.map(file => ({ label: fileShortLabel(file), file }));
            const keysOf = node => node ? [...node.children].map(child => child.tagName) : [];
            const unionKeys = list => [...new Set(list.flat())];

            // Global: hervorgehobene Werte (★)
            const globalKeys = unionKeys(files.map(file => keysOf(file.sections.global))).filter(key => importantFields.has(key));
            // Segmente: die Feldgruppen der Segmentansicht (pri/bkg zusammen, indwell-excursion-outdwell untereinander),
            // danach weitere hervorgehobene (★) Werte. Eine per Ziehen gespeicherte Reihenfolge gilt hier nicht.
            const presentSegmentKeys = unionKeys(files.map(file => file.sections.segments.flatMap(keysOf)));
            const groupedSegmentKeys = segmentColumns.flat().filter(key => presentSegmentKeys.includes(key));
            const segmentKeys = [...groupedSegmentKeys,
                ...presentSegmentKeys.filter(key => importantFields.has(key) && !groupedSegmentKeys.includes(key))];
            const segmentColumnsList = files.flatMap(file => file.sections.segments.map((segment, index) => ({
                label: `${fileShortLabel(file)} · S${segmentDisplayNumber(segment, index)}`, segment
            })));
            // Overrides: nur die fuer die Heat-Input-Berechnung verwendeten (siehe calculateSegmentHeatInput)
            const presentOverrideKeys = unionKeys(files.map(file => keysOf(file.sections.overrides)));
            const overrideKeys = HEAT_INPUT_OVERRIDE_KEYS.filter(key => presentOverrideKeys.includes(key));
            const entriesByFile = files.map((file, fileIndex) => ({ ...heatInputCheck(file, targets), fileIndex }));
            const schema = getActiveXdr();
            const now = new Date();
            const activeTargets = targets.filter(item => item.min !== null || item.max !== null);
            const targetText = activeTargets.length
                ? `Target ranges (red lines, kJ/mm): ${activeTargets.map(item => `${describeTarget(item)} for ${item.files === null ? "all files" : item.files.join(", ") || "no file"}`).join("; ")}`
                : "No target range set";

            const fileList = files.map(file => {
                const head = file.xml.documentElement.getAttribute("head") || "–";
                const version = getFileVersion(file).version || "–";
                const result = getSchemaResult(file);
                const schemaText = result ? (result.errors ? `${result.errors} schema error(s)` : "schema ✓") : "";
                return `<tr><td><strong>${escapeHtml(fileShortLabel(file))}</strong></td><td>${escapeHtml(file.name)}</td><td>${escapeHtml(head)}</td>`
                    + `<td class="num">${file.sections.segments.length}</td><td>v${escapeHtml(version)}</td><td>${escapeHtml(schemaText)}</td>`
                    + `<td>${isFileDirty(file) ? "unsaved changes" : needsDownload(file) ? "saved, not downloaded" : "saved"}</td></tr>`;
            }).join("");

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
    h2 { margin: 18px 0 6px; font-size: 14px; color: #9a4a12; border-bottom: 1px solid #e0d6cc; padding-bottom: 3px; break-after: avoid; }
    .meta { text-align: right; color: #6b5f55; }
    .muted, small { color: #6b5f55; }
    table { width: 100%; border-collapse: collapse; margin: 4px 0 10px; background: #fff; break-inside: auto; }
    th, td { padding: 3px 6px; border: 1px solid #e3d9cf; text-align: left; vertical-align: top; }
    th { background: #f6ebe1; font-weight: 700; }
    tr { break-inside: avoid; }
    td.num, th.num { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
    td.key { font-family: Consolas, monospace; white-space: nowrap; }
    tr.differs td { background: #fff6ec; }
    tr.outside td { background: #fdecec; }
    td.status { white-space: nowrap; }
    tr.outside td.status { color: #b42318; font-weight: 700; }
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
    .legend { margin: 4px 0 0; color: #6b5f55; }
    .page-break { break-before: page; }
    @media print { body { background: #fff; padding: 0; } .toolbar { display: none; } }
</style></head>
<body>
    <div class="toolbar"><button class="primary" onclick="window.print()">Print / Save as PDF</button><button onclick="window.close()">Close</button></div>
    <header>
        <div><h1>Program overview <span>· ${files.length} file(s)</span></h1>
            <div class="muted">Segments, Global (★), overrides for the heat input, heat input</div></div>
        <div class="meta">${escapeHtml(now.toLocaleString())}<br>${schema ? `Schema v${escapeHtml(schema.version)}` : ""}</div>
    </header>

    <h2>Files</h2>
    <table><thead><tr><th>No.</th><th>File</th><th>Head</th><th class="num">Segments</th><th>Version</th><th>Schema</th><th>State</th></tr></thead>
    <tbody>${fileList}</tbody></table>

    <h2>Segments – main values</h2>
    ${overviewMatrix(segmentKeys, segmentColumnsList, (column, key) => directChildValue(column.segment, key))}
    <p class="legend">Rows with different values are shaded.</p>

    <h2>Global – highlighted values</h2>
    ${overviewMatrix(globalKeys, fileColumns, (column, key) => directChildValue(column.file.sections.global, key))}

    <h2>Overrides used for the heat input</h2>
    ${overviewMatrix(overrideKeys, fileColumns, (column, key) => directChildValue(column.file.sections.overrides, key), 10)}

    <h2 class="page-break">Heat input</h2>
    <div class="muted">Bar: min–max from the overrides, dot: nominal. ${escapeHtml(targetText)}.</div>
    <div class="chart">${buildOverviewHeatChart(entriesByFile)}</div>
    ${buildOverviewHeatTable(entriesByFile)}
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

