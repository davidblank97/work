        /* SEGMENTS */
        function renderSegmentList(file) {
            const content = document.getElementById("content");
            content.querySelector(".segment-list-panel")?.remove();
            const list = document.createElement("div");
            list.className = "panel segment-list-panel";

            const header = document.createElement("div");
            header.className = "panel-header segment-overview-header";
            const title = document.createElement("span");
            title.textContent = "Segments";
            const weldTimeSummary = document.createElement("span");
            weldTimeSummary.className = "segment-weld-time-summary";
            const addBtn = document.createElement("button");
            addBtn.type = "button";
            addBtn.textContent = "+ Add segment";
            addBtn.className = "btn-secondary segment-add-btn";
            addBtn.title = "Append a copy of the last segment";
            addBtn.onclick = () => addSegment(file);
            header.append(title, weldTimeSummary, addBtn);

            const visualization = document.createElement("div");
            visualization.className = "segment-visualization";
            list.append(header, visualization);
            renderSegmentVisualization(file, visualization, weldTimeSummary);
            content.appendChild(list);

            const segments = file.sections.segments;
            if (segments.length > 0) {
                selectedSegmentPosition = Math.min(Math.max(selectedSegmentPosition, 0), segments.length - 1);
                renderSegment(segments[selectedSegmentPosition]);
            }
            applyTableSearch();
        }

        // Ring (ein Umlauf, Boegen anteilig je Segment) + Wertetabelle, die zugleich die Segmentliste ist.
        function renderSegmentVisualization(file, container, weldTimeSummary) {
            const namespace = "http://www.w3.org/2000/svg";
            const colors = SEGMENT_COLORS;
            const segments = file.sections.segments;
            const readPositiveNumber = node => {
                if (!node || node.textContent.trim() === "") return null;
                const value = Number(node.textContent);
                return Number.isFinite(value) && value > 0 ? value : null;
            };
            const diameter = segments.map(segment => readPositiveNumber(segment.querySelector("layer_diameter")))
                .find(value => value !== null) ?? null;
            const segmentData = segments.map(segment => {
                const lengthNode = segment.querySelector("segment_time");
                const rawLength = lengthNode && lengthNode.textContent.trim() !== "" ? Number(lengthNode.textContent) : null;
                const lengthIn = rawLength !== null && Number.isFinite(rawLength) && rawLength >= 0 ? rawLength : 0;
                const angle = diameter ? lengthIn / (diameter * Math.PI) * 360 : 0;
                const enabled = segment.querySelector("enable")?.textContent.trim() !== "0";
                const readNonNegativeNumber = key => {
                    const node = segment.querySelector(key);
                    if (!node || node.textContent.trim() === "") return null;
                    const value = Number(node.textContent);
                    return Number.isFinite(value) && value >= 0 ? value : null;
                };
                const backgroundTravel = readPositiveNumber(segment.querySelector("bkg_travel"));
                const primaryTravel = readPositiveNumber(segment.querySelector("pri_travel"));
                const excursion = readNonNegativeNumber("excursion");
                const indwell = readNonNegativeNumber("indwell");
                const outdwell = readNonNegativeNumber("outdwell");
                const cycleTime = excursion === null || indwell === null || outdwell === null
                    ? 0
                    : EXCURSIONS_PER_CYCLE * excursion + indwell + outdwell;
                const primaryTime = indwell === null || outdwell === null ? 0 : indwell + outdwell;
                const averageTravelMmPerMinute = backgroundTravel !== null && primaryTravel !== null && cycleTime > 0
                    ? (backgroundTravel * EXCURSIONS_PER_CYCLE * excursion + primaryTravel * primaryTime) / cycleTime * 25.4
                    : 0;
                const hasLength = rawLength !== null && Number.isFinite(rawLength) && rawLength >= 0;
                const singleSegmentTravel = segments.length === 1 && diameter !== null && primaryTravel !== null
                    ? diameter * Math.PI / primaryTravel * 60
                    : null;
                const weldTimeSeconds = !enabled
                    ? null
                    : segments.length === 1
                        ? singleSegmentTravel
                        : hasLength && averageTravelMmPerMinute > 0
                            ? lengthIn * 25.4 / averageTravelMmPerMinute * 60
                            : null;
                return { lengthIn, angle, enabled, weldTimeSeconds, averageTravelMmPerMinute };
            });
            const totalDegrees = segmentData.reduce((sum, segment) => sum + segment.angle, 0);
            const totalLengthIn = segmentData.reduce((sum, segment) => sum + segment.lengthIn, 0);
            const activeSegments = segmentData.filter(segment => segment.enabled);
            const totalWeldTimeSeconds = activeSegments.every(segment => segment.weldTimeSeconds !== null)
                ? activeSegments.reduce((sum, segment) => sum + segment.weldTimeSeconds, 0)
                : null;
            const diameterMm = diameter === null ? null : diameter * 25.4;
            const formatNumber = (value, digits = 2) => new Intl.NumberFormat("en-US", { maximumFractionDigits: digits }).format(value);
            const formatDuration = seconds => {
                if (seconds === null) return "n/a";
                const totalSeconds = Math.round(seconds);
                const hours = Math.floor(totalSeconds / 3600);
                const minutes = Math.floor(totalSeconds % 3600 / 60);
                const remainingSeconds = totalSeconds % 60;
                if (hours) return `${hours} h ${minutes} min ${remainingSeconds} s`;
                if (minutes) return `${minutes} min ${remainingSeconds} s`;
                return `${remainingSeconds} s`;
            };
            weldTimeSummary.textContent = `Estimated weld time: ${formatDuration(totalWeldTimeSeconds)}`;
            if (!segments.length) {
                container.hidden = true;
                container.replaceChildren();
                return;
            }
            container.hidden = false;

            // --- Ring: ein Umlauf = gesamte Schweisslaenge, Boegen anteilig ---
            const shareBasis = totalDegrees > 0 ? segmentData.map(s => s.angle)
                : totalLengthIn > 0 ? segmentData.map(s => s.lengthIn)
                    : segmentData.map(() => 1);
            const shareTotal = shareBasis.reduce((sum, value) => sum + value, 0) || 1;
            const svg = document.createElementNS(namespace, "svg");
            svg.setAttribute("viewBox", "0 0 220 220");
            svg.setAttribute("role", "img");
            svg.setAttribute("aria-label", `Segment layout; diameter ${diameterMm === null ? "not specified" : `${formatNumber(diameterMm)} mm`}; total angle ${formatNumber(totalDegrees)} degrees`);
            const makeCircle = (className, radius) => {
                const circle = document.createElementNS(namespace, "circle");
                circle.setAttribute("cx", "110");
                circle.setAttribute("cy", "110");
                circle.setAttribute("r", String(radius));
                circle.setAttribute("class", className);
                return circle;
            };
            const ring = document.createElementNS(namespace, "g");
            ring.setAttribute("transform", "rotate(-90 110 110)");
            ring.appendChild(makeCircle("segment-ring-background", 84));
            const gap = segments.length > 1 ? 4 : 0; // Luecke zwischen Boegen (von 1000)
            let start = 0;
            segmentData.forEach((segment, index) => {
                const length = shareBasis[index] / shareTotal * 1000;
                const arc = makeCircle("segment-ring-arc" + (segment.enabled ? "" : " is-disabled"), 84);
                arc.setAttribute("stroke", colors[index % colors.length]);
                arc.setAttribute("pathLength", "1000");
                arc.dataset.segmentPosition = String(index);
                const visible = Math.max(length - gap, length > 0 ? 1 : 0);
                if (visible < 999.999) {
                    arc.setAttribute("stroke-dasharray", `${visible} ${1000 - visible}`);
                    arc.setAttribute("stroke-dashoffset", String(-start));
                }
                const tooltip = document.createElementNS(namespace, "title");
                tooltip.textContent = `Segment ${segmentDisplayNumber(segments[index], index)}`;
                arc.appendChild(tooltip);
                arc.addEventListener("click", () => renderSegment(segments[index]));
                ring.appendChild(arc);
                start += length;
            });
            svg.appendChild(ring);
            const centerLines = [
                ["segment-ring-diameter", 104, diameterMm === null ? "Ø --" : `Ø ${formatNumber(diameterMm, 1)} mm`],
                ["segment-ring-total", 124, totalDegrees > 0 ? `${formatNumber(totalDegrees / 360)} turns` : "turns n/a"],
                ["segment-ring-total", 140, `Σ ${formatNumber(totalDegrees, 1)}°`]
            ];
            centerLines.forEach(([className, y, text]) => {
                const label = document.createElementNS(namespace, "text");
                label.setAttribute("x", "110");
                label.setAttribute("y", String(y));
                label.setAttribute("class", className);
                label.textContent = text;
                svg.appendChild(label);
            });
            const ringWrap = document.createElement("div");
            ringWrap.className = "segment-ring-wrap";
            ringWrap.appendChild(svg);

            // --- Feld: Schweissnahtlaenge, wird gleichmaessig auf segment_time verteilt ---
            const seamBox = document.createElement("div");
            seamBox.className = "segment-seam-box";
            const seamLabel = document.createElement("label");
            seamLabel.htmlFor = "seamLengthInput";
            seamLabel.textContent = "Weld seam length (mm)";
            const seamInput = document.createElement("input");
            seamInput.type = "text";
            seamInput.id = "seamLengthInput";
            seamInput.className = "seam-length-input";
            seamInput.inputMode = "decimal";
            const currentSeamMm = getSeamLength(file) * 25.4;
            seamInput.value = currentSeamMm > 0 ? String(Number(currentSeamMm.toFixed(2))) : "";
            seamInput.placeholder = "e.g. 2400";
            seamInput.title = "Enter the total weld seam length; it is split evenly into segment_time of all segments.";
            const segmentTimeLocked = isLocked("segment_time");
            if (segmentTimeLocked) {
                seamInput.readOnly = true;
                seamInput.classList.add("is-locked");
                seamInput.title = "segment_time is locked – unlock it to change the weld seam length";
            }
            const seamHint = document.createElement("div");
            seamHint.className = "segment-seam-hint";
            const segmentsTotalMm = totalLengthIn * 25.4;
            const mismatch = Math.abs(segmentsTotalMm - currentSeamMm) > 0.05;
            const customSplit = file.manualSegments.size > 0;
            if (mismatch) {
                seamHint.classList.add("is-warning");
                seamHint.textContent = `Segments total ${formatNumber(segmentsTotalMm, 1)} mm ≠ seam length`;
            } else if (customSplit) {
                seamHint.textContent = `Custom split · ${segments.length} segments`;
            } else {
                seamHint.textContent = `${segments.length} segment${segments.length === 1 ? "" : "s"} × ${formatNumber(currentSeamMm / segments.length, 1)} mm`;
            }
            const splitEvenlyBtn = document.createElement("button");
            splitEvenlyBtn.type = "button";
            splitEvenlyBtn.className = "btn-secondary seam-split-btn";
            splitEvenlyBtn.textContent = "Split evenly";
            splitEvenlyBtn.title = "Distribute the weld seam length evenly over all segments again";
            splitEvenlyBtn.hidden = !(mismatch || customSplit) || segmentTimeLocked;
            splitEvenlyBtn.onclick = () => {
                recordHistoryAction("Split weld seam evenly", () => {
                    distributeSeamLength(file, getSeamLength(file));
                    renderSegmentList(file);
                });
                document.getElementById("status").textContent = `Weld seam length split evenly into ${segments.length} segment(s).`;
            };
            seamInput.oninput = () => {
                const mm = parseNumberInput(seamInput.value);
                seamHint.textContent = mm > 0
                    ? `${segments.length} segment${segments.length === 1 ? "" : "s"} × ${formatNumber(mm / segments.length, 1)} mm`
                    : "Enter a length > 0";
            };
            seamInput.onkeydown = event => {
                if (event.key === "Enter") { event.preventDefault(); seamInput.blur(); }
                if (event.key === "Escape") {
                    event.stopPropagation();
                    seamInput.value = currentSeamMm > 0 ? String(Number(currentSeamMm.toFixed(2))) : "";
                    seamInput.blur();
                }
            };
            seamInput.onchange = () => {
                const mm = parseNumberInput(seamInput.value);
                if (!(mm > 0)) {
                    document.getElementById("status").textContent = "Please enter a weld seam length greater than 0.";
                    seamInput.value = currentSeamMm > 0 ? String(Number(currentSeamMm.toFixed(2))) : "";
                    return;
                }
                if (Math.abs(mm - currentSeamMm) < 1e-9) return;
                recordHistoryAction("Set weld seam length", () => {
                    distributeSeamLength(file, mm / 25.4);
                    renderSegmentList(file);
                });
                document.getElementById("status").textContent =
                    `Weld seam length ${formatNumber(mm, 2)} mm split into ${segments.length} segment(s) of ${formatNumber(mm / segments.length, 2)} mm.`;
            };
            seamBox.append(seamLabel, seamInput, seamHint, splitEvenlyBtn);

            // --- Wertetabelle / Segmentliste ---
            const table = document.createElement("table");
            table.className = "segment-overview-table";
            const thead = document.createElement("thead");
            const headRow = document.createElement("tr");
            [["Segment", ""], ["Length (mm)", "num"], ["Angle (°)", "num"], ["Turns", "num"], ["Weld time", "num"], ["", "actions"]]
                .forEach(([text, className]) => {
                    const th = document.createElement("th");
                    th.textContent = text;
                    if (className) th.className = className;
                    headRow.appendChild(th);
                });
            thead.appendChild(headRow);
            const tbody = document.createElement("tbody");
            segments.forEach((segment, index) => {
                const info = segmentData[index];
                const row = document.createElement("tr");
                row.className = "segment-list-item" + (info.enabled ? "" : " is-disabled")
                    + (index === selectedSegmentPosition ? " active" : "");
                row.dataset.segmentPosition = String(index);
                row.tabIndex = 0;
                row.setAttribute("role", "button");
                row.title = "Open segment";
                row.onclick = () => renderSegment(segment);
                row.onkeydown = event => {
                    if (event.target === row && (event.key === "Enter" || event.key === " ")) {
                        event.preventDefault();
                        row.click();
                    }
                };
                const nameCell = document.createElement("td");
                const swatch = document.createElement("span");
                swatch.className = "segment-visualization-swatch";
                swatch.style.backgroundColor = colors[index % colors.length];
                const name = document.createElement("span");
                name.textContent = `Segment ${segmentDisplayNumber(segment, index)}`;
                nameCell.append(swatch, name);
                if (!info.enabled) {
                    const badge = document.createElement("span");
                    badge.className = "segment-disabled-badge";
                    badge.textContent = "disabled";
                    nameCell.appendChild(badge);
                }
                if (file.manualSegments.has(index)) {
                    const badge = document.createElement("span");
                    badge.className = "segment-disabled-badge segment-manual-badge";
                    badge.textContent = "manual";
                    badge.title = "segment_time set manually; other segments adjust to keep the weld seam length";
                    nameCell.appendChild(badge);
                }
                row.appendChild(nameCell);
                // Editierbare Werte: jede Eingabe wird in segment_time (Zoll) umgerechnet.
                const circumferenceIn = diameter ? diameter * Math.PI : null;
                const canEditTime = info.enabled && segments.length > 1 && info.averageTravelMmPerMinute > 0;
                [
                    { label: "length (mm)", value: plainNumber(info.lengthIn * 25.4, 1), parse: text => parseNumberInput(text) / 25.4 },
                    circumferenceIn
                        ? { label: "angle (°)", value: plainNumber(info.angle, 1), parse: text => parseNumberInput(text) / 360 * circumferenceIn }
                        : { text: "n/a", reason: "Enter layer_diameter to edit the angle" },
                    circumferenceIn
                        ? { label: "turns", value: plainNumber(info.angle / 360, 2), parse: text => parseNumberInput(text) * circumferenceIn }
                        : { text: "n/a", reason: "Enter layer_diameter to edit the turns" },
                    canEditTime
                        ? { label: "weld time", value: formatDuration(info.weldTimeSeconds), wide: true,
                            parse: text => parseDurationInput(text) * info.averageTravelMmPerMinute / 60 / 25.4 }
                        : { text: info.enabled ? formatDuration(info.weldTimeSeconds) : "–",
                            reason: info.enabled ? "Weld time can be edited with two or more segments and valid travel/dwell values" : "Segment disabled" }
                ].forEach(column => {
                    const cell = document.createElement("td");
                    cell.className = "num";
                    if (column.parse && isLocked("segment_time")) {
                        cell.textContent = column.value;
                        cell.title = "segment_time is locked";
                    } else if (column.parse) {
                        const field = document.createElement("input");
                        field.type = "text";
                        field.className = "overview-input" + (column.wide ? " is-wide" : "");
                        field.value = column.value;
                        field.setAttribute("aria-label", `Segment ${segmentDisplayNumber(segment, index)} ${column.label}`);
                        field.title = `Edit ${column.label}; segment_time is recalculated and the other segments adjust`;
                        field.onclick = event => event.stopPropagation();
                        field.onkeydown = event => {
                            event.stopPropagation();
                            if (event.key === "Enter") { event.preventDefault(); field.blur(); }
                            if (event.key === "Escape") { field.value = column.value; field.blur(); }
                        };
                        field.onfocus = () => { if (selectedSegmentPosition !== index) renderSegment(segment); field.select(); };
                        field.onchange = () => {
                            const lengthIn = column.parse(field.value);
                            if (!(lengthIn > 0) || !Number.isFinite(lengthIn)) {
                                document.getElementById("status").textContent = `Invalid ${column.label}: "${field.value}".`;
                                field.value = column.value;
                                return;
                            }
                            applyManualSegmentLength(file, index, lengthIn);
                        };
                        cell.appendChild(field);
                    } else {
                        cell.textContent = column.text;
                        if (column.reason) cell.title = column.reason;
                    }
                    row.appendChild(cell);
                });
                const actionsCell = document.createElement("td");
                actionsCell.className = "actions";
                const actions = document.createElement("span");
                actions.className = "segment-actions";
                [["⧉", "Duplicate segment", () => duplicateSegment(file, segment)],
                ["↑", "Move up", () => moveSegment(file, segment, -1)],
                ["↓", "Move down", () => moveSegment(file, segment, 1)],
                ["×", "Delete segment", () => deleteSegment(file, segment)]].forEach(([text, title, action]) => {
                    const button = document.createElement("button");
                    button.type = "button";
                    button.className = "segment-action-btn";
                    button.textContent = text;
                    button.title = title;
                    button.setAttribute("aria-label", `${title} ${segmentDisplayNumber(segment, index)}`);
                    button.onclick = event => { event.stopPropagation(); action(); };
                    button.onkeydown = event => event.stopPropagation();
                    actions.appendChild(button);
                });
                actionsCell.appendChild(actions);
                row.appendChild(actionsCell);
                tbody.appendChild(row);
            });
            const tfoot = document.createElement("tfoot");
            const totalRow = document.createElement("tr");
            ["Total", null, diameter ? formatNumber(totalDegrees, 1) : "n/a",
                diameter ? formatNumber(totalDegrees / 360) : "n/a", formatDuration(totalWeldTimeSeconds), ""]
                .forEach((text, index) => {
                    const cell = document.createElement("td");
                    if (index > 0 && index < 5) cell.className = "num";
                    if (index === 1 && isLocked("segment_time")) {
                        cell.textContent = plainNumber(totalLengthIn * 25.4, 1);
                    } else if (index === 1) {
                        // Gesamtlaenge = Schweissnahtlaenge: Eingabe verteilt gleichmaessig (wie das Feld).
                        const field = document.createElement("input");
                        field.type = "text";
                        field.className = "overview-input";
                        const original = plainNumber(totalLengthIn * 25.4, 1);
                        field.value = original;
                        field.setAttribute("aria-label", "Total weld seam length (mm)");
                        field.title = "Edit the total weld seam length; it is split evenly over all segments";
                        field.onkeydown = event => {
                            event.stopPropagation();
                            if (event.key === "Enter") { event.preventDefault(); field.blur(); }
                            if (event.key === "Escape") { field.value = original; field.blur(); }
                        };
                        field.onchange = () => {
                            const mm = parseNumberInput(field.value);
                            if (!(mm > 0)) {
                                document.getElementById("status").textContent = "Please enter a weld seam length greater than 0.";
                                field.value = original;
                                return;
                            }
                            recordHistoryAction("Set weld seam length", () => {
                                distributeSeamLength(file, mm / 25.4);
                                renderSegmentList(file);
                            });
                            document.getElementById("status").textContent =
                                `Weld seam length ${formatNumber(mm, 2)} mm split into ${segments.length} segment(s).`;
                        };
                        cell.appendChild(field);
                    } else {
                        cell.textContent = text;
                    }
                    totalRow.appendChild(cell);
                });
            tfoot.appendChild(totalRow);
            table.append(thead, tbody, tfoot);
            const tableWrap = document.createElement("div");
            tableWrap.className = "segment-overview-table-wrap";
            tableWrap.appendChild(table);

            container.replaceChildren(ringWrap, seamBox, tableWrap);
            highlightSelectedSegment(container);
        }

        // Markiert das geoeffnete Segment in Tabelle und Ring.
        function highlightSelectedSegment(root = document) {
            root.querySelectorAll(".segment-list-item").forEach(item => {
                item.classList.toggle("active", Number(item.dataset.segmentPosition) === selectedSegmentPosition);
            });
            root.querySelectorAll(".segment-ring-arc").forEach(arc => {
                arc.classList.toggle("is-active", Number(arc.dataset.segmentPosition) === selectedSegmentPosition);
            });
        }

        // Anzeige-Nummer eines Segments (ab 1); im XML bleibt index 0-basiert.
        function segmentDisplayNumber(segment, fallbackIndex = 0) {
            const index = Number(segment?.getAttribute("index"));
            return (Number.isFinite(index) ? index : fallbackIndex) + 1;
        }

        function readSegmentTime(segment) {
            const node = [...segment.children].find(child => child.tagName === "segment_time");
            const value = Number(node?.textContent);
            return Number.isFinite(value) && value > 0 ? value : 0;
        }

        // Summe aller segment_time-Werte (Schweissnahtlaenge in Zoll).
        function sumSegmentTimeOf(segments) {
            return segments.reduce((sum, segment) => sum + readSegmentTime(segment), 0);
        }

        function sumSegmentTime(file) {
            return sumSegmentTimeOf(file.sections.segments);
        }

        // Feste Nahtlaenge der Datei (Zoll); Fallback: aktuelle Summe.
        function getSeamLength(file) {
            return file.seamLengthIn > 0 ? file.seamLengthIn : sumSegmentTime(file);
        }

        function setSegmentTime(file, segment, value, changes) {
            const node = [...segment.children].find(child => child.tagName === "segment_time");
            if (!node) return;
            const places = getDecimalPlaces(node.textContent.trim()) || 6;
            const oldValue = node.textContent;
            const newValue = value.toFixed(places);
            if (oldValue === newValue) return;
            node.textContent = newValue;
            const fileIndex = loadedFiles.indexOf(file);
            const segmentIndex = segment.getAttribute("index") || "";
            updateChangeLogEntry({ fileIndex, fileName: file.name, sectionName: "segments", key: "segment_time", segmentIndex, oldValue, newValue });
            if (changes) changes.push({ fileIndex, fileName: file.name, sectionName: "segments", key: "segment_time", segmentIndex, oldValue, newValue });
        }

        // Zahl ohne Tausendertrennzeichen (fuer Eingabefelder).
        function plainNumber(value, digits) {
            return Number.isFinite(value) ? String(Number(value.toFixed(digits))) : "";
        }

        // "320", "5:20", "1:05:20", "5 min 20 s", "1 h 2 min" -> Sekunden (NaN bei ungueltig).
        function parseDurationInput(text) {
            const value = String(text ?? "").trim().toLowerCase().replace(/,/g, ".");
            if (/^\d+(\.\d+)?$/.test(value)) return Number(value);
            const clock = value.match(/^(\d+):(\d{1,2})(?::(\d{1,2}))?$/);
            if (clock) {
                const [, a, b, c] = clock.map(Number);
                return c === undefined || Number.isNaN(c) ? a * 60 + b : a * 3600 + b * 60 + c;
            }
            const parts = [...value.matchAll(/(\d+(?:\.\d+)?)\s*(h|min|m|s)\b/g)];
            if (!parts.length || value.replace(/(\d+(?:\.\d+)?)\s*(h|min|m|s)\b/g, "").trim()) return NaN;
            return parts.reduce((sum, [, number, unit]) => sum + Number(number) * (unit === "h" ? 3600 : unit === "s" ? 1 : 60), 0);
        }

        // Setzt die Laenge eines Segments (aus der Uebersichtstabelle) wie eine manuelle segment_time-Aenderung.
        function applyManualSegmentLength(file, position, lengthIn) {
            const segment = file.sections.segments[position];
            if (!segment || !(lengthIn > 0)) return;
            if (isLocked("segment_time")) {
                document.getElementById("status").textContent = "segment_time is locked.";
                return;
            }
            commitPendingEdit();
            let message = "";
            recordHistoryAction("Edit segment length", () => {
                pendingEdit = { changes: [] };
                setSegmentTime(file, segment, lengthIn, pendingEdit.changes);
                if (file.sections.segments.length === 1) file.seamLengthIn = lengthIn;
                else message = rebalanceAfterManualEdit(file, position);
                pendingEdit = null;
                selectedSegmentPosition = position;
                renderSegmentList(file);
            });
            document.getElementById("status").textContent = message
                || `Segment ${segmentDisplayNumber(segment, position)} set to ${(lengthIn * 25.4).toFixed(1)} mm.`;
        }

        // Nach manueller Aenderung von segment_time: Nahtlaenge bleibt fest, die nicht manuell
        // gesetzten Segmente teilen sich den Rest gleichmaessig. Rueckgabe: Statusmeldung.
        function rebalanceAfterManualEdit(file, position) {
            if (isLocked("segment_time")) return "";
            const segments = file.sections.segments;
            if (segments.length < 2 || position < 0) return "";
            const seam = getSeamLength(file);
            file.manualSegments.add(position);
            let free = segments.map((_, index) => index).filter(index => !file.manualSegments.has(index));
            if (!free.length) {
                // Alle anderen waren manuell: nur das gerade bearbeitete Segment bleibt fest.
                file.manualSegments = new Set([position]);
                free = segments.map((_, index) => index).filter(index => index !== position);
            }
            const fixedSum = [...file.manualSegments].reduce((sum, index) => sum + (segments[index] ? readSegmentTime(segments[index]) : 0), 0);
            const remainder = seam - fixedSum;
            if (remainder <= 0) {
                return `Warning: fixed segments (${(fixedSum * 25.4).toFixed(1)} mm) reach the weld seam length (${(seam * 25.4).toFixed(1)} mm); other segments were not adjusted.`;
            }
            if (!pendingEdit) pendingEdit = { changes: [] };
            const perSegment = remainder / free.length;
            free.forEach(index => setSegmentTime(file, segments[index], perSegment, pendingEdit.changes));
            return `Weld seam length kept at ${(seam * 25.4).toFixed(1)} mm; ${free.length} other segment(s) set to ${(perSegment * 25.4).toFixed(1)} mm.`;
        }

        // Verteilt die Nahtlaenge (Zoll) gleichmaessig auf alle Segmente und protokolliert die Aenderungen.
        function distributeSeamLength(file, totalInches) {
            if (isLocked("segment_time")) return; // gesperrt: segment_time bleibt unveraendert
            const segments = file.sections.segments;
            if (!segments.length || !(totalInches > 0)) return;
            file.seamLengthIn = totalInches;
            file.manualSegments = new Set();
            const fileIndex = loadedFiles.indexOf(file);
            const perSegment = totalInches / segments.length;
            segments.forEach(segment => {
                const node = [...segment.children].find(child => child.tagName === "segment_time");
                if (!node) return;
                const places = getDecimalPlaces(node.textContent.trim()) || 6;
                const oldValue = node.textContent;
                node.textContent = perSegment.toFixed(places);
                updateChangeLogEntry({
                    fileIndex,
                    fileName: file.name,
                    sectionName: "segments",
                    key: "segment_time",
                    segmentIndex: segment.getAttribute("index") || "",
                    oldValue,
                    newValue: node.textContent
                });
            });
        }

        function addSegment(file) {
            const segments = file.sections.segments;
            if (!segments.length) return;

            recordHistoryAction("Add segment", () => {
                const seamLength = getSeamLength(file);
                const lastSeg = segments[segments.length - 1];
                const newSeg = lastSeg.cloneNode(true);
                const newIndex = segments.length;
                newSeg.setAttribute("index", String(newIndex));

                const root = file.xml.querySelector("sched") || file.xml.documentElement;
                if (root) root.appendChild(newSeg);

                file.sections.segments = [...file.xml.querySelectorAll("segment")];
                distributeSeamLength(file, seamLength);
                selectedSegmentPosition = file.sections.segments.indexOf(newSeg);
                renderSegmentList(file);
                document.getElementById("status").textContent =
                    `Segment ${newIndex + 1} added; weld seam length split into ${file.sections.segments.length} segments.`;
            });
        }

        function renumberSegments(file) {
            file.sections.segments = [...file.xml.querySelectorAll("segment")];
            file.sections.segments.forEach((segment, index) => segment.setAttribute("index", String(index)));
        }

        function duplicateSegment(file, segment) {
            recordHistoryAction("Duplicate segment", () => {
                const seamLength = getSeamLength(file);
                const copy = segment.cloneNode(true);
                segment.parentNode.insertBefore(copy, segment.nextSibling);
                renumberSegments(file);
                distributeSeamLength(file, seamLength);
                selectedSegmentPosition = file.sections.segments.indexOf(copy);
                renderSegmentList(file);
                document.getElementById("status").textContent = "Segment duplicated.";
            });
        }

        function deleteSegment(file, segment) {
            if (file.sections.segments.length <= 1) {
                document.getElementById("status").textContent = "The last segment cannot be deleted.";
                return;
            }
            if (!window.confirm(`Delete segment ${segmentDisplayNumber(segment)}? The weld seam length is split across the remaining segments.`)) return;
            recordHistoryAction("Delete segment", () => {
                const seamLength = getSeamLength(file);
                const deletedPosition = file.sections.segments.indexOf(segment);
                if (deletedPosition < selectedSegmentPosition) selectedSegmentPosition--;
                segment.remove();
                renumberSegments(file);
                distributeSeamLength(file, seamLength);
                renderSegmentList(file);
                document.getElementById("status").textContent = "Segment deleted.";
            });
        }

        function moveSegment(file, segment, direction) {
            const segments = file.sections.segments;
            const currentIndex = segments.indexOf(segment);
            const targetIndex = currentIndex + direction;
            if (currentIndex < 0 || targetIndex < 0 || targetIndex >= segments.length) return;
            recordHistoryAction("Move segment", () => {
                const currentManual = file.manualSegments.has(currentIndex);
                const targetManual = file.manualSegments.has(targetIndex);
                file.manualSegments.delete(currentIndex); file.manualSegments.delete(targetIndex);
                if (currentManual) file.manualSegments.add(targetIndex);
                if (targetManual) file.manualSegments.add(currentIndex);
                const target = segments[targetIndex];
                if (direction < 0) target.parentNode.insertBefore(segment, target);
                else target.parentNode.insertBefore(segment, target.nextSibling);
                renumberSegments(file);
                selectedSegmentPosition = file.sections.segments.indexOf(segment);
                renderSegmentList(file);
                document.getElementById("status").textContent = "Segment moved.";
            });
        }

        function renderSegment(seg) {
            const content = document.getElementById("content");
            const old = content.querySelector(".segment-panel"); if (old) old.remove();
            const position = loadedFiles[activeFile]?.sections.segments.indexOf(seg) ?? -1;
            if (position >= 0) selectedSegmentPosition = position;
            highlightSelectedSegment(content);

            const panel = document.createElement("div"); panel.className = "panel segment-panel";
            const header = document.createElement("div"); header.className = "panel-header"; header.textContent = `Segment ${segmentDisplayNumber(seg)}`;
            const body = document.createElement("div"); body.className = "panel-content open";
            const table = document.createElement("table"); table.className = "param-table"; const tbody = document.createElement("tbody");

            const refresh = () => renderSegment(seg);
            const allKeys = [...seg.children].map(child => child.tagName);
            const keys = orderedParameterKeys("segments", allKeys);
            addResetOrderButton(header, "segments", refresh);

            keys.forEach(key => {
                if (hiddenFields.has(key)) return;
                const child = seg.querySelector(key);
                const tr = document.createElement("tr");

                const tdName = buildParamNameCell(key, refresh);
                attachParameterReorder(tr, tdName, "segments", key, allKeys, refresh);

                const tdVal = document.createElement("td");
                const fieldObj = createInputField(child, key, "segments", seg.getAttribute("index") || "");

                if (importantFields.has(key)) { tdVal.classList.add("important-cell"); tr.classList.add("important-cell"); }

                tdVal.appendChild(fieldObj.container); tr.appendChild(tdName); tr.appendChild(tdVal); tbody.appendChild(tr);
            });

            table.appendChild(tbody); body.appendChild(table); panel.appendChild(header); panel.appendChild(body); content.appendChild(panel);
            applyTableSearch();
            // Standardanordnung: Feldgruppen spaltenweise untereinander (nur ohne eigene Reihenfolge per Ziehen).
            if (!Array.isArray(parameterOrder.segments)) {
                layoutSegmentColumns(tbody);
                if (window.ResizeObserver) {
                    let lastColumns = 0;
                    new ResizeObserver(() => {
                        const count = gridColumnCount(tbody);
                        if (count !== lastColumns) { lastColumns = count; layoutSegmentColumns(tbody); }
                    }).observe(tbody);
                }
            }
        }

        function gridColumnCount(element) {
            const template = getComputedStyle(element).gridTemplateColumns;
            return template && template !== "none" ? template.split(" ").filter(Boolean).length : 1;
        }

        // Legt die Gruppen aus segmentColumns als Spalten an: Gruppe i in Spalte (i % Spaltenzahl),
        // untereinander; alle uebrigen Felder fuellen danach die freien Zellen in normaler Reihenfolge.
        function layoutSegmentColumns(tbody) {
            const rows = new Map([...tbody.children].map(row => [row.dataset.paramKey, row]));
            [...tbody.children].forEach(row => { row.style.gridColumn = ""; row.style.gridRow = ""; });
            const columnCount = gridColumnCount(tbody);
            if (columnCount < 2) return;
            const heights = new Array(columnCount).fill(0);
            segmentColumns.forEach((group, index) => {
                const present = group.map(key => rows.get(key)).filter(Boolean);
                if (!present.length) return;
                const column = index % columnCount;
                present.forEach((row, offset) => {
                    row.style.gridColumn = String(column + 1);
                    row.style.gridRow = String(heights[column] + offset + 1);
                });
                heights[column] += present.length;
            });
        }

        // Segmentfarben (Ring, Segment-Tabelle, Heat-Input-Diagramm); fuer den dunklen Hintergrund
        // mit dem dataviz-Validator geprueft (Helligkeit, Saettigung, Farbsehschwaechen, Kontrast).
        const SEGMENT_COLORS = ["#d9702c", "#16a085", "#477bd1", "#c84d83", "#8e9420", "#7955b5", "#b98a1c", "#1f86a8"];

