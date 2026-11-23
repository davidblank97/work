        // Liest einen Grenzwert aus <limits>; nur plausible Werte (> 0 und < 9999) gelten als gesetzt.
        function readHeatInputLimit(file, name) {
            const node = file.sections.limits ? [...file.sections.limits.children].find(child => child.tagName === name) : null;
            const value = Number(node?.textContent);
            return Number.isFinite(value) && value > 0 && value < 9999 ? value : null;
        }

        // Kurzbezeichnung einer Datei: die 4 Ziffern am Anfang des Namens (z. B. "0303").
        // Fehlen sie oder sind sie nicht eindeutig, wird der volle Name verwendet.
        function fileShortLabel(file) {
            const prefixOf = name => (String(name).match(/^\d{4}/) || [null])[0];
            const prefix = prefixOf(file.name);
            if (!prefix) return file.name;
            const sameCount = loadedFiles.filter(other => prefixOf(other.name) === prefix).length;
            return sameCount > 1 ? file.name : prefix;
        }

        // Ziel-Bereiche (Target ranges) fuer den Heat Input: mehrere Bereiche mit Name, Min, Max und
        // Dateizuordnung ueber die 4-stellige Nummer (files = null: alle Dateien). Im Browser gespeichert.
        const HEAT_TARGET_KEY = "scheduleEditorHeatInputTarget";      // alt: ein einzelner Bereich (wird uebernommen)
        const HEAT_TARGETS_KEY = "scheduleEditorHeatInputTargets";

        function parseTargetNumber(value) {
            if (value === undefined || value === null || String(value).trim() === "") return null;
            const number = parseNumberInput(value);
            return Number.isFinite(number) && number >= 0 ? number : null;
        }

        // Zuordnungsschluessel einer Datei: 4-stellige Nummer am Namensanfang, sonst der Dateiname.
        function fileTargetKey(file) {
            return (String(file.name).match(/^\d{4}/) || [file.name])[0];
        }

        function readHeatInputTargets() {
            let stored = null;
            try { stored = localStorage.getItem(HEAT_TARGETS_KEY); } catch (error) { /* ignore */ }
            let list = [];
            if (stored === null) {
                // Uebernahme des frueheren einzelnen Ziel-Bereichs
                const old = readStoredJson(HEAT_TARGET_KEY, {});
                if (parseTargetNumber(old.min) !== null || parseTargetNumber(old.max) !== null) {
                    list = [{ id: "target-1", name: "Target", min: String(old.min ?? ""), max: String(old.max ?? ""), files: null }];
                }
            } else {
                list = readStoredJson(HEAT_TARGETS_KEY, []);
            }
            return list.filter(item => item && typeof item === "object").map((item, index) => ({
                id: String(item.id || `target-${index + 1}`),
                name: String(item.name || `Target ${index + 1}`).trim() || `Target ${index + 1}`,
                min: parseTargetNumber(item.min),
                max: parseTargetNumber(item.max),
                files: Array.isArray(item.files) ? item.files.map(String) : null,
                ...(item.source ? { source: String(item.source) } : {})
            }));
        }

        function saveHeatInputTargets(targets) {
            try {
                localStorage.setItem(HEAT_TARGETS_KEY, JSON.stringify(targets.map(target => ({
                    id: target.id, name: target.name,
                    min: target.min === null ? "" : String(target.min),
                    max: target.max === null ? "" : String(target.max),
                    files: target.files,
                    ...(target.source ? { source: target.source } : {})
                }))));
                localStorage.removeItem(HEAT_TARGET_KEY);
            } catch (error) {
                console.warn("Could not store the heat input target ranges.", error);
            }
        }

        // Bereiche, die fuer eine Datei gelten (nur Bereiche mit mindestens Min oder Max).
        function targetsForFile(file, targets) {
            const key = fileTargetKey(file);
            return targets.filter(target => (target.min !== null || target.max !== null)
                && (target.files === null || target.files.includes(key)));
        }

        function describeTarget(target) {
            return `${target.name} ${target.min ?? "–"} – ${target.max ?? "–"}`;
        }

        // Heat Input je Segment einer Datei, geprueft gegen <limits> (heat_input_fault_low/high)
        // und den Ziel-Bereich (Min/Max unter Tools > Heat Input).
        function heatInputCheck(file, allTargets = readHeatInputTargets()) {
            const targets = targetsForFile(file, allTargets);
            const limitLow = readHeatInputLimit(file, "heat_input_fault_low");
            const limitHigh = readHeatInputLimit(file, "heat_input_fault_high");
            const entries = file.sections.segments.map((segment, segmentIndex) => {
                const result = calculateSegmentHeatInput(segment, file.sections.overrides);
                const valid = !result.disabled && !result.error;
                const outsideLimit = valid && (
                    (limitLow !== null && result.minHeatInput < limitLow)
                    || (limitHigh !== null && result.maxHeatInput > limitHigh));
                // Alle zugeordneten Bereiche muessen eingehalten werden.
                const targetViolations = valid ? targets.flatMap(target => [
                    target.max !== null && result.maxHeatInput > target.max ? { target, bound: "max", value: target.max } : null,
                    target.min !== null && result.minHeatInput < target.min ? { target, bound: "min", value: target.min } : null
                ].filter(Boolean)) : [];
                const outsideTarget = targetViolations.length > 0;
                return { result, segmentIndex, outsideLimit, outsideTarget, targetViolations, outside: outsideLimit || outsideTarget };
            });
            return { file, limitLow, limitHigh, targets, entries };
        }

        // Batch Save: Segmente ausserhalb der Heat-Input-Grenzen melden (Fehlermeldung mit Rueckfrage).
        const heatSaveModal = document.getElementById("heatSaveModal");
        let pendingHeatSave = null;
        function confirmHeatInputBeforeSave(files, proceed) {
            const format = value => value.toFixed(DISPLAY_DECIMALS);
            const problems = [];
            files.filter(Boolean).forEach(file => {
                const check = heatInputCheck(file);
                check.entries.filter(entry => entry.outside).forEach(entry => {
                    const { result } = entry;
                    const reasons = [];
                    if (entry.outsideLimit) {
                        if (check.limitHigh !== null && result.maxHeatInput > check.limitHigh) reasons.push(`limit max ${format(check.limitHigh)}`);
                        if (check.limitLow !== null && result.minHeatInput < check.limitLow) reasons.push(`limit min ${format(check.limitLow)}`);
                    }
                    entry.targetViolations.forEach(violation => reasons.push(`${violation.target.name} ${violation.bound} ${format(violation.value)}`));
                    const segmentNumber = segmentDisplayNumber(file.sections.segments[entry.segmentIndex], entry.segmentIndex);
                    problems.push(`${fileShortLabel(file)} · Segment ${segmentNumber}: ${format(result.minHeatInput)} – ${format(result.maxHeatInput)} kJ/mm (${reasons.join(", ")})`);
                });
            });
            if (!problems.length) { proceed(); return; }
            document.getElementById("heatSaveText").textContent =
                `${problems.length} segment(s) are outside the heat input limits. Save anyway?`;
            const list = document.getElementById("heatSaveList");
            list.replaceChildren();
            problems.slice(0, 8).forEach(text => {
                const line = document.createElement("div");
                line.className = "schema-save-line";
                line.textContent = text;
                list.appendChild(line);
            });
            if (problems.length > 8) {
                const more = document.createElement("div");
                more.className = "schema-save-line";
                more.textContent = `… and ${problems.length - 8} more`;
                list.appendChild(more);
            }
            pendingHeatSave = proceed;
            openModal(heatSaveModal, document.getElementById("heatSaveCancelBtn"));
        }
        document.getElementById("heatSaveCancelBtn").onclick = () => {
            pendingHeatSave = null;
            closeModal(heatSaveModal);
            document.getElementById("status").textContent = "Batch save cancelled: heat input outside the limits (Tools › Heat Input).";
        };
        document.getElementById("heatSaveShowBtn").onclick = () => {
            pendingHeatSave = null;
            closeModal(heatSaveModal);
            document.getElementById("heatInputBtn").click();
        };
        document.getElementById("heatSaveConfirmBtn").onclick = () => {
            const proceed = pendingHeatSave;
            pendingHeatSave = null;
            closeModal(heatSaveModal);
            if (proceed) proceed();
        };

        // Bearbeitung der Ziel-Bereiche: je Zeile Name, Min, Max, Dateien (Chips), Entfernen.
        function buildHeatTargetControls(targets) {
            const box = document.createElement("div");
            box.className = "heat-targets";
            const head = document.createElement("div");
            head.className = "heat-target-controls";
            const caption = document.createElement("span");
            caption.className = "heat-target-caption";
            caption.textContent = "Target ranges (red lines)";
            const add = document.createElement("button");
            add.type = "button";
            add.className = "btn-secondary heat-target-clear heat-target-add";
            add.textContent = "+ Add target range";
            add.onclick = () => {
                const next = readHeatInputTargets();
                const number = next.length + 1;
                next.push({ id: `target-${Date.now()}`, name: `Target ${number}`, min: null, max: null, files: null });
                saveHeatInputTargets(next);
                renderHeatInput();
                document.querySelector(`.heat-target-row:last-child .heat-target-name`)?.focus();
            };
            head.append(caption, add);
            box.appendChild(head);
            if (!targets.length) {
                const empty = document.createElement("div");
                empty.className = "heat-target-empty";
                empty.textContent = "No target range – add one to check the heat input of selected files against it.";
                box.appendChild(empty);
            }
            const fileKeys = [...new Set(loadedFiles.map(fileTargetKey))];
            targets.forEach(target => box.appendChild(buildHeatTargetRow(target, fileKeys)));
            return box;
        }

        function updateHeatTarget(id, change) {
            const status = document.getElementById("status");
            const next = readHeatInputTargets();
            const target = next.find(item => item.id === id);
            if (!target) return;
            const candidate = { ...target, ...change };
            if (candidate.min !== null && candidate.max !== null && candidate.min >= candidate.max) {
                status.textContent = `${candidate.name}: min must be smaller than max.`;
                renderHeatInput();
                return;
            }
            Object.assign(target, candidate);
            saveHeatInputTargets(next);
            status.textContent = `Target range "${target.name}" updated.`;
            renderHeatInput();
        }

        function buildHeatTargetRow(target, fileKeys) {
            const row = document.createElement("div");
            row.className = "heat-target-row heat-target-controls";
            row.dataset.targetId = target.id;
            const name = document.createElement("input");
            name.type = "text";
            name.className = "heat-target-name";
            name.value = target.name;
            name.setAttribute("aria-label", "Target range name");
            name.onkeydown = event => { if (event.key === "Enter") { event.preventDefault(); name.blur(); } };
            name.onchange = () => updateHeatTarget(target.id, { name: name.value.trim() || target.name });
            row.appendChild(name);
            ["min", "max"].forEach(key => {
                const label = document.createElement("label");
                label.className = "heat-target-field";
                label.textContent = key === "min" ? "Min" : "Max";
                const input = document.createElement("input");
                input.type = "text";
                input.inputMode = "decimal";
                input.className = `heat-target-${key}`;
                input.placeholder = "–";
                input.value = target[key] === null ? "" : String(target[key]);
                input.onkeydown = event => { if (event.key === "Enter") { event.preventDefault(); input.blur(); } };
                input.onchange = () => {
                    const text = input.value.trim();
                    const value = text === "" ? null : parseTargetNumber(text);
                    if (text !== "" && value === null) {
                        document.getElementById("status").textContent = "Please enter heat input values >= 0 (kJ/mm).";
                        input.value = target[key] === null ? "" : String(target[key]);
                        return;
                    }
                    updateHeatTarget(target.id, { [key]: value });
                };
                label.appendChild(input);
                row.appendChild(label);
            });
            const unit = document.createElement("span");
            unit.className = "heat-target-unit";
            unit.textContent = "kJ/mm";
            row.appendChild(unit);

            // Dateizuordnung
            const files = document.createElement("span");
            files.className = "heat-target-files";
            const chip = (text, checked, onChange, title) => {
                const label = document.createElement("label");
                label.className = "heat-target-chip" + (checked ? " is-on" : "");
                label.title = title || text;
                const box = document.createElement("input");
                box.type = "checkbox";
                box.checked = checked;
                box.onchange = () => onChange(box.checked);
                label.append(box, document.createTextNode(text));
                return label;
            };
            const allFiles = target.files === null;
            files.appendChild(chip("All files", allFiles, checked => updateHeatTarget(target.id, { files: checked ? null : [] }),
                "Use this range for every file"));
            fileKeys.forEach(key => {
                const on = allFiles || target.files.includes(key);
                const element = chip(key, on, checked => {
                    const current = allFiles ? [...fileKeys] : [...target.files];
                    const nextFiles = checked ? [...new Set([...current, key])] : current.filter(item => item !== key);
                    updateHeatTarget(target.id, { files: nextFiles });
                }, `File ${key}`);
                if (allFiles) element.classList.add("is-implied");
                files.appendChild(element);
            });
            // Zugeordnete, aber nicht geladene Dateien bleiben sichtbar
            if (!allFiles) target.files.filter(key => !fileKeys.includes(key)).forEach(key => {
                const element = chip(key, true, checked => {
                    if (!checked) updateHeatTarget(target.id, { files: target.files.filter(item => item !== key) });
                }, `File ${key} (not loaded)`);
                element.classList.add("is-absent");
                files.appendChild(element);
            });
            row.appendChild(files);

            const remove = document.createElement("button");
            remove.type = "button";
            remove.className = "btn-secondary heat-target-clear heat-target-remove";
            remove.textContent = "Remove";
            remove.title = `Remove target range "${target.name}"`;
            remove.onclick = () => {
                saveHeatInputTargets(readHeatInputTargets().filter(item => item.id !== target.id));
                document.getElementById("status").textContent = `Target range "${target.name}" removed.`;
                renderHeatInput();
            };
            row.appendChild(remove);
            return row;
        }

        // Ein gemeinsames Diagramm fuer alle Dateien: x-Achse nach Datei gruppiert, je Segment Balken
        // Min->Max (Override-Grenzen) und Punkt fuer den Nominalwert; Grenzwerte je Datei-Gruppe.
        function renderHeatInputChart(entriesByFile, container) {
            const svgNs = "http://www.w3.org/2000/svg";
            const allEntries = entriesByFile.flatMap(group => group.entries);
            const valid = allEntries.filter(entry => !entry.result.disabled && !entry.result.error);

            const wrap = document.createElement("div");
            wrap.className = "heat-chart";
            const title = document.createElement("div");
            title.className = "heat-chart-title";
            title.textContent = "Heat input per segment (kJ/mm) — bar: min–max from overrides, dot: nominal";
            wrap.appendChild(title);
            const targets = readHeatInputTargets();
            wrap.appendChild(buildHeatTargetControls(targets));

            // Keine separate Legende: jede Zeile traegt Farbpunkt und Segmentnamen direkt.

            if (!valid.length) {
                const empty = document.createElement("p");
                empty.className = "heat-chart-empty";
                empty.textContent = "No segment with a valid heat input to chart.";
                wrap.appendChild(empty);
                container.appendChild(wrap);
                return;
            }

            // Skala (x): 0 bis Maximum (inkl. Grenzwerte), auf "schoene" Schritte gerundet.
            const limitValues = entriesByFile.flatMap(group => [group.limitLow, group.limitHigh]).filter(value => value !== null);
            const targetValues = entriesByFile.flatMap(group => (group.targets || []).flatMap(item => [item.min, item.max])).filter(value => value !== null);
            const rawMax = Math.max(...valid.map(entry => entry.result.maxHeatInput), ...limitValues, ...targetValues) * 1.1;
            // Gitter in 0,1-Schritten (bei sehr grossen Werten groeber, damit es lesbar bleibt).
            let step = 0.1;
            if (rawMax / step > 60) {
                const rough = rawMax / 6;
                const magnitude = 10 ** Math.floor(Math.log10(rough));
                step = [1, 2, 2.5, 5, 10].map(f => f * magnitude).find(s => s >= rough);
            }
            const xMax = Math.ceil(rawMax / step - 1e-9) * step;

            // Horizontal: je Segment eine Zeile, nach Datei gruppiert; Hoehe waechst mit der Zeilenzahl.
            const contentWidth = document.getElementById("content")?.clientWidth || 760;
            const width = Math.max(320, Math.min(1400, contentWidth - 74));
            const rowHeight = 28;
            // Kurze Dateibezeichnungen (z. B. "0303") stehen direkt in der Zeile, ohne eigene Kopfzeile.
            const compactLabels = entriesByFile.length > 1 && entriesByFile.every(group => fileShortLabel(group.file).length <= 8);
            const groupHeaderHeight = entriesByFile.length > 1 && !compactLabels ? 24 : 0;
            const groupGap = entriesByFile.length > 1 ? 10 : 0;
            const margin = { top: targetValues.length ? 24 : 12, right: 24, bottom: 30, left: compactLabels ? 140 : 100 };
            // Zusaetzlicher Platz ueber Gruppen, deren Ziel-Bereiche sich gegenueber der vorigen Gruppe aendern (Beschriftung).
            const targetSignatures = entriesByFile.map(group => (group.targets || []).map(item => item.id).join("|"));
            const targetLabelSpace = 16;
            const extraLabelSpace = targetSignatures.filter((signature, index) => index > 0 && signature && signature !== targetSignatures[index - 1]).length * targetLabelSpace;
            const plotH = entriesByFile.reduce((sum, group) => sum + groupHeaderHeight + group.entries.length * rowHeight, 0)
                + groupGap * (entriesByFile.length - 1) + extraLabelSpace;
            const height = margin.top + plotH + margin.bottom;
            const plotW = width - margin.left - margin.right;
            const x = value => margin.left + value / xMax * plotW;

            const svg = document.createElementNS(svgNs, "svg");
            svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
            svg.setAttribute("width", String(width));
            svg.setAttribute("height", String(height));
            svg.setAttribute("role", "img");
            svg.setAttribute("aria-label", "Heat input per segment for all loaded files; values are listed in the table below.");
            const make = (tag, attributes, parent = svg) => {
                const element = document.createElementNS(svgNs, tag);
                Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, String(value)));
                parent.appendChild(element);
                return element;
            };

            // Gitter + x-Achse (zurueckhaltend)
            const axisY = margin.top + plotH;
            const tickCount = Math.round(xMax / step);
            // Beschriftung jedes k-ten Strichs, damit sich die Zahlen nicht ueberlappen.
            const labelEvery = [1, 2, 5, 10, 20].find(k => plotW / tickCount * k >= 34) || 20;
            for (let i = 0; i <= tickCount; i++) {
                const value = i * step;
                const labelled = i % labelEvery === 0;
                make("line", { x1: x(value), x2: x(value), y1: margin.top, y2: axisY, class: i === 0 ? "heat-axis" : labelled ? "heat-grid" : "heat-grid heat-grid-minor" });
                if (labelled) {
                    const label = make("text", { x: x(value), y: axisY + 16, class: "heat-tick", "text-anchor": "middle" });
                    label.textContent = Number(value.toFixed(DISPLAY_DECIMALS)).toString();
                }
            }
            const axisTitle = make("text", { x: width - margin.right, y: axisY + 28, class: "heat-tick", "text-anchor": "end" });
            axisTitle.textContent = "kJ/mm";

            // Ziel-Bereiche: rote Linien ueber den Gruppen der zugeordneten Dateien (siehe unten je Gruppe)
            let previousTargetSignature = "";

            const tooltip = document.createElement("div");
            tooltip.className = "heat-tooltip";
            tooltip.hidden = true;

            let cursor = margin.top;
            entriesByFile.forEach((group, groupIndex) => {
                if (groupIndex > 0) {
                    const dividerY = cursor + groupGap / 2;
                    make("line", { x1: 8, x2: width - margin.right, y1: dividerY, y2: dividerY, class: "heat-group-divider" });
                    cursor += groupGap;
                }
                if (groupHeaderHeight) {
                    const groupLabel = make("text", { x: 8, y: cursor + 16, class: "heat-group-label" });
                    const maxChars = Math.max(10, Math.floor((width - 16) / 7));
                    const groupName = fileShortLabel(group.file);
                    groupLabel.textContent = groupName.length > maxChars ? `${groupName.slice(0, maxChars - 1)}…` : groupName;
                    const fullName = document.createElementNS(svgNs, "title");
                    fullName.textContent = group.file.name;
                    groupLabel.appendChild(fullName);
                    cursor += groupHeaderHeight;
                }
                if (groupIndex > 0 && targetSignatures[groupIndex] && targetSignatures[groupIndex] !== targetSignatures[groupIndex - 1]) {
                    cursor += targetLabelSpace;
                }
                const groupTop = cursor;
                const groupBottom = groupTop + group.entries.length * rowHeight;

                // Ziel-Bereiche dieser Datei als rote Linien ueber ihrer Gruppe; Beschriftung, wenn sie sich aendern
                const groupTargets = group.targets || [];
                const signature = groupTargets.map(item => item.id).join("|");
                const labelTargets = signature !== previousTargetSignature && groupTargets.length > 0;
                previousTargetSignature = signature;
                groupTargets.forEach(item => {
                    [[item.min, "min"], [item.max, "max"]].forEach(([value, bound]) => {
                        if (value === null) return;
                        make("line", { x1: x(value), x2: x(value), y1: groupTop - (labelTargets ? 4 : 2), y2: groupBottom, class: "heat-target-line" });
                        if (labelTargets) {
                            const label = make("text", { x: x(value) + (bound === "min" ? -4 : 4), y: groupTop - 7, class: "heat-target-label", "text-anchor": bound === "min" ? "end" : "start" });
                            label.textContent = `${item.name} ${bound} ${value}`;
                        }
                    });
                });

                // Grenzwerte dieser Datei nur ueber ihrer Gruppe (senkrecht)
                [[group.limitLow, "low"], [group.limitHigh, "high"]].forEach(([value, name]) => {
                    if (value === null) return;
                    make("line", { x1: x(value), x2: x(value), y1: groupTop - 2, y2: groupBottom, class: "heat-limit" });
                    const label = make("text", { x: x(value) + 4, y: groupTop + 9, class: "heat-limit-label", "text-anchor": "start" });
                    label.textContent = `${name} ${value}`;
                });

                group.entries.forEach(entry => {
                    const { result, segmentIndex } = entry;
                    const cy = cursor + rowHeight / 2;
                    cursor += rowHeight;
                    const segmentNumber = segmentDisplayNumber(group.file.sections.segments[segmentIndex], segmentIndex);
                    const color = SEGMENT_COLORS[segmentIndex % SEGMENT_COLORS.length];
                    const rowGroup = make("g", { class: "heat-column" });
                    rowGroup.dataset.fileIndex = String(group.fileIndex);
                    rowGroup.dataset.segmentPosition = String(segmentIndex);

                    // Zeilenbeschriftung mit Farbpunkt
                    make("circle", { cx: 14, cy, r: 4.5, fill: color }, rowGroup);
                    const yLabel = make("text", { x: 24, y: cy + 4, class: "heat-tick heat-row-label" }, rowGroup);
                    yLabel.textContent = compactLabels ? `${fileShortLabel(group.file)} · Segment ${segmentNumber}` : `Segment ${segmentNumber}`;
                    if (compactLabels) {
                        const fullName = document.createElementNS(svgNs, "title");
                        fullName.textContent = group.file.name;
                        yLabel.appendChild(fullName);
                    }

                    if (result.disabled || result.error) {
                        const note = make("text", { x: margin.left + 8, y: cy + 4, class: "heat-column-note" }, rowGroup);
                        note.textContent = result.disabled ? "disabled" : "not calculable";
                    } else {
                        if (entry.outside) rowGroup.classList.add("is-outside");
                        const barHeight = 12;
                        make("rect", {
                            x: x(result.minHeatInput), y: cy - barHeight / 2,
                            width: Math.max(2, x(result.maxHeatInput) - x(result.minHeatInput)), height: barHeight,
                            rx: 4, class: "heat-range", fill: color
                        }, rowGroup);
                        make("circle", { cx: x(result.heatInput), cy, r: 6, class: "heat-nominal", fill: color }, rowGroup);
                        if (entry.outside) {
                            const warn = make("text", { x: x(result.maxHeatInput) + 8, y: cy + 4, class: "heat-warning" }, rowGroup);
                            warn.textContent = [entry.outsideLimit ? "! outside limit" : "", entry.outsideTarget ? "! outside target" : ""]
                                .filter(Boolean).join(" · ");
                        }
                    }

                    // Trefferflaeche: ganze Zeile
                    const hit = make("rect", { x: 0, y: cy - rowHeight / 2, width, height: rowHeight, class: "heat-hit" }, rowGroup);
                    const lines = result.disabled ? ["Segment disabled"]
                        : result.error ? [result.error]
                            : [`Nominal: ${result.heatInput.toFixed(DISPLAY_DECIMALS)} kJ/mm`, `Range: ${result.minHeatInput.toFixed(DISPLAY_DECIMALS)} – ${result.maxHeatInput.toFixed(DISPLAY_DECIMALS)} kJ/mm`,
                                `Avg. current: ${result.averageAmps.toFixed(1)} A`];
                    hit.addEventListener("mouseenter", () => {
                        rowGroup.classList.add("is-hover");
                        tooltip.replaceChildren();
                        const head = document.createElement("strong");
                        head.textContent = `Segment ${segmentNumber}`;
                        const fileLine = document.createElement("div");
                        fileLine.className = "heat-tooltip-file";
                        fileLine.textContent = group.file.name;
                        tooltip.append(head, fileLine);
                        lines.forEach(line => {
                            const row = document.createElement("div");
                            row.textContent = line;
                            tooltip.appendChild(row);
                        });
                        if (entry.outside) {
                            const row = document.createElement("div");
                            row.className = "heat-tooltip-warning";
                            row.textContent = [entry.outsideLimit ? "! Range outside the <limits> values" : "", entry.outsideTarget ? "! Range outside the target range" : ""]
                                .filter(Boolean).join(" / ");
                            tooltip.appendChild(row);
                        }
                        tooltip.hidden = false;
                        // Rechts neben dem Balken, sonst links davon; Balken bleibt sichtbar.
                        const barEnd = result.disabled || result.error ? margin.left + 80 : x(result.maxHeatInput) + (entry.outside ? 120 : 0);
                        const onRight = barEnd + 230 < width;
                        const barStart = result.disabled || result.error ? margin.left : x(result.minHeatInput);
                        tooltip.style.left = `${onRight ? barEnd + 16 : barStart - 16}px`;
                        tooltip.style.transform = onRight ? "none" : "translateX(-100%)";
                        tooltip.style.top = `${Math.max(0, cy - 24)}px`;
                    });
                    hit.addEventListener("mouseleave", () => { rowGroup.classList.remove("is-hover"); tooltip.hidden = true; });
                    hit.addEventListener("click", () => openHeatInputSegment(group.fileIndex, segmentIndex));
                });
            });

            const plot = document.createElement("div");
            plot.className = "heat-chart-plot";
            plot.append(svg, tooltip);
            wrap.appendChild(plot);
            container.appendChild(wrap);
        }

        function openHeatInputSegment(fileIndex, segmentIndex) {
            activeFile = fileIndex;
            selectedSegmentPosition = segmentIndex;
            renderFileList();
            renderSidebar();
            showSection("segments");
        }

        // Heat-Input-Diagramm bei Groessenaenderung des Fensters neu zeichnen.
        let heatInputResizeTimer = null;
        window.addEventListener("resize", () => {
            window.clearTimeout(heatInputResizeTimer);
            heatInputResizeTimer = window.setTimeout(() => {
                if (document.getElementById("heatInputBtn")?.classList.contains("active")) renderHeatInput();
            }, 150);
        });

        function renderHeatInput() {
            commitPendingEdit();
            const content = document.getElementById("content");
            content.innerHTML = "";

            const heading = document.createElement("h2");
            heading.textContent = "Heat Input";
            content.appendChild(heading);

            if (activeFile < 0 || activeFile >= loadedFiles.length) {
                const message = document.createElement("p");
                message.textContent = "Please load an XML file first.";
                content.appendChild(message);
                return;
            }

            // Ergebnisse aller sichtbaren Dateien; geprueft gegen <limits> und die zugeordneten Ziel-Bereiche.
            const targets = readHeatInputTargets();
            const visibleFiles = loadedFiles
                .map((file, fileIndex) => ({ file, fileIndex }))
                .filter(({ file }) => !heatInputHiddenFileIds.has(file.id));
            const entriesByFile = visibleFiles.map(({ file, fileIndex }) => ({ ...heatInputCheck(file, targets), fileIndex }));

            const panel = document.createElement("div");
            panel.className = "panel";
            const body = document.createElement("div");
            body.className = "panel-content open";

            // Dateien ein-/ausblenden
            if (loadedFiles.length > 1) {
                const fileControls = document.createElement("div");
                fileControls.className = "heat-file-controls";
                loadedFiles.forEach(file => {
                    const label = document.createElement("label");
                    label.className = "comparison-file-control";
                    const checkbox = document.createElement("input");
                    checkbox.type = "checkbox";
                    checkbox.checked = !heatInputHiddenFileIds.has(file.id);
                    checkbox.onchange = () => {
                        if (checkbox.checked) heatInputHiddenFileIds.delete(file.id);
                        else heatInputHiddenFileIds.add(file.id);
                        renderHeatInput();
                    };
                    label.title = file.name;
                    label.append(checkbox, document.createTextNode(fileShortLabel(file)));
                    fileControls.appendChild(label);
                });
                // Alle Dateien auf einmal ein-/ausblenden
                const hiddenCount = loadedFiles.filter(file => heatInputHiddenFileIds.has(file.id)).length;
                const showAll = document.createElement("button");
                showAll.type = "button";
                showAll.className = "btn-secondary heat-file-toggle";
                showAll.textContent = "Show all";
                showAll.disabled = hiddenCount === 0;
                showAll.onclick = () => { heatInputHiddenFileIds.clear(); renderHeatInput(); };
                const hideAll = document.createElement("button");
                hideAll.type = "button";
                hideAll.className = "btn-secondary heat-file-toggle";
                hideAll.textContent = "Hide all";
                hideAll.disabled = hiddenCount === loadedFiles.length;
                hideAll.onclick = () => { heatInputHiddenFileIds = new Set(loadedFiles.map(file => file.id)); renderHeatInput(); };
                fileControls.append(showAll, hideAll);
                body.appendChild(fileControls);
            }

            if (!entriesByFile.length) {
                const empty = document.createElement("p");
                empty.className = "heat-chart-empty heat-no-files";
                empty.textContent = "All files are hidden. Tick a file above to show it.";
                body.appendChild(empty);
                panel.appendChild(body);
                content.appendChild(panel);
                return;
            }
            renderHeatInputChart(entriesByFile, body);

            // Eine Tabelle: je Datei eine Kopfzeile, darunter die Segmente.
            const table = document.createElement("table");
            table.className = "heat-table";
            const thead = document.createElement("thead");
            const headRow = document.createElement("tr");
            [["Segment", ""], ["Heat input", "num"], ["Range (min – max)", "num"], ["Avg. current", "num"], ["Travel speed", "num"], ["Status", ""]]
                .forEach(([text, className]) => {
                    const th = document.createElement("th");
                    th.textContent = text;
                    if (className) th.className = className;
                    headRow.appendChild(th);
                });
            const unitRow = document.createElement("tr");
            unitRow.className = "heat-unit-row";
            ["", "kJ/mm", "kJ/mm", "A", "mm/min", ""].forEach((text, index) => {
                const th = document.createElement("th");
                th.textContent = text;
                if (index > 0 && index < 5) th.className = "num";
                unitRow.appendChild(th);
            });
            thead.append(headRow, unitRow);
            table.appendChild(thead);

            entriesByFile.forEach(group => {
                const tbody = document.createElement("tbody");
                const fileRow = document.createElement("tr");
                fileRow.className = "heat-file-row";
                const fileCell = document.createElement("td");
                fileCell.colSpan = 6;
                const fileName = document.createElement("span");
                fileName.className = "heat-file-name";
                fileName.textContent = fileShortLabel(group.file);
                fileName.title = group.file.name;
                fileCell.appendChild(fileName);
                if (group.fileIndex === activeFile && loadedFiles.length > 1) {
                    const activeBadge = document.createElement("span");
                    activeBadge.className = "heat-file-active";
                    activeBadge.textContent = "active";
                    fileCell.appendChild(activeBadge);
                }
                if (group.limitLow !== null || group.limitHigh !== null) {
                    const limitInfo = document.createElement("span");
                    limitInfo.className = "heat-file-limits";
                    limitInfo.textContent = `limits ${group.limitLow ?? "–"} – ${group.limitHigh ?? "–"} kJ/mm`;
                    fileCell.appendChild(limitInfo);
                }
                fileRow.appendChild(fileCell);
                tbody.appendChild(fileRow);

                group.entries.forEach(({ result, segmentIndex, outsideLimit, outsideTarget, targetViolations }) => {
                    const segment = group.file.sections.segments[segmentIndex];
                    const row = document.createElement("tr");
                    row.className = "heat-segment-row" + (result.disabled || result.error ? " is-muted" : "");
                    row.tabIndex = 0;
                    row.title = "Open segment";
                    row.onclick = () => openHeatInputSegment(group.fileIndex, segmentIndex);
                    row.onkeydown = event => {
                        if (event.key === "Enter" || event.key === " ") { event.preventDefault(); row.click(); }
                    };

                    const segmentCell = document.createElement("td");
                    const swatch = document.createElement("span");
                    swatch.className = "segment-visualization-swatch heat-table-swatch";
                    swatch.style.backgroundColor = SEGMENT_COLORS[segmentIndex % SEGMENT_COLORS.length];
                    segmentCell.append(swatch, document.createTextNode(`Segment ${segmentDisplayNumber(segment, segmentIndex)}`));
                    row.appendChild(segmentCell);

                    const valid = !result.disabled && !result.error;
                    [
                        valid ? result.heatInput.toFixed(DISPLAY_DECIMALS) : "–",
                        valid ? `${result.minHeatInput.toFixed(DISPLAY_DECIMALS)} – ${result.maxHeatInput.toFixed(DISPLAY_DECIMALS)}` : "–",
                        valid ? result.averageAmps.toFixed(1) : "–",
                        valid ? result.averageTravelMmPerMinute.toFixed(1) : "–"
                    ].forEach((text, index) => {
                        const cell = document.createElement("td");
                        cell.className = "num" + (index === 0 && valid ? " heat-nominal-cell" : "");
                        cell.textContent = text;
                        row.appendChild(cell);
                    });

                    const statusCell = document.createElement("td");
                    const status = document.createElement("span");
                    if (result.disabled) {
                        status.className = "heat-status is-off";
                        status.textContent = "disabled";
                    } else if (result.error) {
                        status.className = "heat-status is-error";
                        status.textContent = "! not calculable";
                        status.title = result.error;
                    } else if (outsideLimit || outsideTarget) {
                        status.className = "heat-status is-outside";
                        status.textContent = [outsideLimit ? "! outside limit" : "", outsideTarget ? "! outside target" : ""]
                            .filter(Boolean).join(" · ");
                        if (outsideTarget) status.title = targetViolations.map(v => `${v.target.name}: ${v.bound} ${v.value}`).join(", ");
                    } else {
                        status.className = "heat-status is-ok";
                        const hasLimits = group.limitLow !== null || group.limitHigh !== null;
                        const hasTarget = group.targets.length > 0;
                        status.textContent = hasLimits || hasTarget ? "✓ OK" : "—";
                        status.title = [hasLimits ? "within limits" : "", hasTarget ? `within ${group.targets.map(item => item.name).join(", ")}` : ""].filter(Boolean).join(", ");
                    }
                    statusCell.appendChild(status);
                    row.appendChild(statusCell);
                    tbody.appendChild(row);
                });
                table.appendChild(tbody);
            });

            const tableWrap = document.createElement("div");
            tableWrap.className = "heat-table-wrap";
            tableWrap.appendChild(table);
            body.appendChild(tableWrap);
            panel.appendChild(body);
            content.appendChild(panel);
        }

