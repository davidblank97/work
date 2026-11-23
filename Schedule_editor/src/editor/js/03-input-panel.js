        /* DYNAMIC INTERACTIVE INPUT FIELD */
        function createInputField(child, key, sectionName = lastSelectedSection, segmentIndex = "") {
            const container = document.createElement("div");
            container.className = "input-container";

            const isMultilineText = key === "note" || key === "custom_search_tag";
            // Datentyp laut aktivem XDR-Schema (z. B. "float", "ui1", "string").
            const schemaFieldType = (() => {
                try { return String(buildXdrModel(getActiveXdr()).model.get(key)?.dtType || "").toLowerCase(); } catch (error) { return ""; }
            })();
            // Textfelder: mehrzeilig (note, custom_search_tag) oder laut Schema Text (z. B. arc_type = "TOUCH").
            const isTextField = isMultilineText || schemaFieldType === "string";
            const input = isMultilineText ? document.createElement("textarea") : document.createElement("input");
            input.dataset.fieldName = key;
            input.dataset.sectionName = sectionName;
            input.dataset.fileName = loadedFiles[activeFile] ? loadedFiles[activeFile].name : "";
            input.dataset.fileIndex = activeFile;
            input.dataset.segmentIndex = segmentIndex;
            const btn = document.createElement("button");
            btn.className = "unit-toggle-btn";

            let currentInchValue = parseFloat(child.textContent) || 0;
            // Kein gueltiger Zahlenwert in der Datei (z. B. "abc"): Originaltext zeigen, nichts still auf 0 setzen.
            const isInvalidNumber = () => !isTextField && child.textContent.trim() !== "" && Number.isNaN(parseNumberInput(child.textContent));
            // Ungueltiger/leerer Dateiwert: Nachkommastellen nach XDR-Datentyp (float 6, Ganzzahl/boolean 0).
            const placesForSchemaType = () =>
                ["float", "number", "r4", "r8"].includes(schemaFieldType) || schemaFieldType.startsWith("fixed") ? 6 : 0;
            const originalPlaces = Number.isNaN(parseNumberInput(child.textContent)) ? placesForSchemaType() : getDecimalPlaces(child.textContent);

            // Hilfsfunktionen für die Wolfram-Breite (Tungsten Width)
            const r = 0.2;
            function inchToDegree(x) {
                const ratio = x / (2 * r);
                if (ratio > 1) return 180;
                if (ratio < -1) return -180;
                return 2 * Math.asin(ratio) * (180 / Math.PI);
            }
            function degreeToInch(alpha) {
                return 2 * r * Math.sin((alpha * Math.PI) / 360);
            }

            // Setze den Standardmodus für tungsten_width auf 'degree' falls noch nicht definiert
            if (key === 'tungsten_width' && !parameterUnits[key]) {
                parameterUnits[key] = 'degree';
                saveParameterUnits();
            }

            function updateDisplay() {
                input.classList.toggle("invalid-value", isInvalidNumber());
                if (isInvalidNumber()) {
                    input.value = child.textContent.trim();
                    input.title = `Invalid value in the file: "${child.textContent.trim()}" – enter a number`;
                    return;
                }
                if (isTextField) {
                    input.value = child.textContent || "";
                    btn.style.display = 'none';
                } else {
                    let currentMode = parameterUnits[key] || 'none';

                    if (key === 'tungsten_width' && currentMode === 'degree') {
                        let degVal = inchToDegree(currentInchValue);
                        input.value = degVal.toFixed(2) + " °";
                        btn.textContent = "°";
                        btn.className = "unit-toggle-btn mode-static";
                    } else if (currentMode === 'none') {
                        input.value = currentInchValue.toFixed(originalPlaces);
                        btn.textContent = "—";
                        btn.className = "unit-toggle-btn";
                    } else if (currentMode === 'in') {
                        input.value = currentInchValue.toFixed(originalPlaces) + " in";
                        btn.textContent = "IN";
                        btn.className = "unit-toggle-btn mode-in";
                    } else if (currentMode === 'mm') {
                        let mmVal = currentInchValue * 25.4;
                        input.value = mmVal.toFixed(2) + " mm";
                        btn.textContent = "MM";
                        btn.className = "unit-toggle-btn mode-mm";
                    } else if (currentMode === 'cmmin') {
                        let cmVal = currentInchValue * 2.54;
                        input.value = cmVal.toFixed(2) + " cm/min";
                        btn.textContent = "CM/MIN";
                        btn.className = "unit-toggle-btn mode-cmmin";
                    } else if (currentMode === 'ampere') {
                        input.value = currentInchValue.toFixed(originalPlaces) + " A";
                        btn.textContent = "A";
                        btn.className = "unit-toggle-btn mode-static";
                    } else if (currentMode === 'volt') {
                        input.value = currentInchValue.toFixed(originalPlaces) + " V";
                        btn.textContent = "V";
                        btn.className = "unit-toggle-btn mode-static";
                    } else if (currentMode === 'seconds') {
                        input.value = currentInchValue.toFixed(originalPlaces) + " s";
                        btn.textContent = "S";
                        btn.className = "unit-toggle-btn mode-static";
                    } else if (currentMode === 'degree') {
                        input.value = currentInchValue.toFixed(originalPlaces) + " °";
                        btn.textContent = "°";
                        btn.className = "unit-toggle-btn mode-static";
                    }
                    styleInput(input);
                }
            }

            if (isLocked(key)) {
                input.readOnly = true;
                input.classList.add("is-locked");
            }
            input.dataset.originalValue = child.textContent;
            input.dataset.valueAtFocus = child.textContent;
            input.addEventListener("focus", () => { input.dataset.valueAtFocus = child.textContent; });
            const savedValue = getSavedValue(sectionName, segmentIndex, key);
            input.dataset.hasSavedValue = savedValue === null ? "0" : "1";
            input.dataset.savedValue = savedValue ?? "";

            btn.onclick = (e) => {
                e.preventDefault();
                if (isTextField) return;
                recordHistoryAction("Change unit", () => {
                    const modes = getUnitModesFor(key);
                    const idx = modes.indexOf(parameterUnits[key] || 'none');
                    const currentMode = modes[(idx + 1) % modes.length];

                    parameterUnits[key] = currentMode;
                    saveParameterUnits();

                    document.querySelectorAll(`[data-param-name="${key}"]`).forEach(el => {
                        if (el.updateDisplay) el.updateDisplay();
                    });
                });
            };

            input.onblur = () => {
                if (isLocked(key)) { updateDisplay(); return; }
                // Ungueltiger Dateiwert unveraendert gelassen bzw. erneut ungueltige Eingabe: nichts schreiben.
                if (!isTextField && Number.isNaN(parseNumberInput(input.value))) { updateDisplay(); return; }
                if (isTextField) {
                    child.textContent = isMultilineText ? input.value : input.value.trim();
                    registerChange(input, input.dataset.originalValue, child.textContent);
                    // Einzeilige Textwerte (z. B. arc_type) wie Zahlen auf markierte Dateien uebertragen.
                    if (!isMultilineText) propagateValueToSelectedFiles(sectionName, key, child.textContent);
                    commitPendingEdit();
                    return;
                }

                let currentMode = parameterUnits[key] || 'none';
                let parsed = parseNumberInput(input.value);

                if (!isNaN(parsed)) {
                    const isConvertedUnit = (key === 'tungsten_width' && currentMode === 'degree')
                        || currentMode === 'mm' || currentMode === 'cmmin';
                    if (key === 'tungsten_width' && currentMode === 'degree') {
                        currentInchValue = degreeToInch(parsed);
                    } else if (currentMode === 'mm') {
                        currentInchValue = parsed / 25.4;
                    } else if (currentMode === 'cmmin') {
                        currentInchValue = parsed / 2.54;
                    } else {
                        currentInchValue = parsed;
                    }
                    child.textContent = currentInchValue.toFixed(originalPlaces);
                    registerChange(input, input.dataset.originalValue, child.textContent);
                    propagateValueToSelectedFiles(sectionName, key, child.textContent);
                    let rebalanceMessage = "";
                    if (key === "segment_time" && sectionName === "segments" && child.textContent !== input.dataset.valueAtFocus) {
                        const file = loadedFiles[activeFile];
                        const position = file ? file.sections.segments.findIndex(segment => segment.getAttribute("index") === segmentIndex) : -1;
                        if (file) rebalanceMessage = rebalanceAfterManualEdit(file, position);
                        input.dataset.valueAtFocus = child.textContent;
                        const visualization = document.querySelector(".segment-visualization");
                        const weldTimeSummary = document.querySelector(".segment-weld-time-summary");
                        if (file && visualization && weldTimeSummary) renderSegmentVisualization(file, visualization, weldTimeSummary);
                    }
                    commitPendingEdit();
                    if (rebalanceMessage) document.getElementById("status").textContent = rebalanceMessage;
                    // Hinweis, wenn die Eingabe auf das Format der Datei gerundet wurde.
                    if (!isConvertedUnit && Number(child.textContent) !== parsed) {
                        document.getElementById("status").textContent =
                            `Note: ${key} was rounded to ${child.textContent} (${originalPlaces} decimal places).`;
                    }
                }
                updateDisplay();
            };

            input.oninput = () => {
                if (isLocked(key)) { updateDisplay(); return; }
                if (isTextField) {
                    child.textContent = isMultilineText ? input.value : input.value.trim();
                    registerChange(input, input.dataset.originalValue, child.textContent);
                    return;
                }
                let currentMode = parameterUnits[key] || 'none';
                let parsed = parseNumberInput(input.value);
                if (!isNaN(parsed)) {
                    let calculatedInch = parsed;
                    if (key === 'tungsten_width' && currentMode === 'degree') {
                        calculatedInch = degreeToInch(parsed);
                    } else if (currentMode === 'mm') calculatedInch = parsed / 25.4;
                    else if (currentMode === 'cmmin') calculatedInch = parsed / 2.54;

                    child.textContent = calculatedInch.toFixed(originalPlaces);
                    if (sectionName === "segments" && ["segment_time", "layer_diameter", "enable", "pri_travel", "bkg_travel", "excursion", "indwell", "outdwell"].includes(key)) {
                        const visualization = document.querySelector(".segment-visualization");
                        const weldTimeSummary = document.querySelector(".segment-weld-time-summary");
                        const file = loadedFiles[activeFile];
                        if (visualization && weldTimeSummary && file) renderSegmentVisualization(file, visualization, weldTimeSummary);
                    }
                    styleInput(input);
                    registerChange(input, input.dataset.originalValue, child.textContent);
                    propagateValueToSelectedFiles(sectionName, key, child.textContent);
                }
            };

            // outer_diameter: Auswahl der Rohrgroesse (G10…G38) setzt den Wert in Zoll.
            let diameterSelect = null;
            if (key === "outer_diameter" && sectionName === "description") {
                container.classList.add("has-preset");
                diameterSelect = document.createElement("select");
                diameterSelect.className = "diameter-select";
                diameterSelect.title = "Pipe size (outer diameter in mm)";
                diameterSelect.setAttribute("aria-label", "Pipe size for outer_diameter");
                const customOption = document.createElement("option");
                customOption.value = "";
                customOption.textContent = "Custom";
                diameterSelect.appendChild(customOption);
                Object.entries(OUTER_DIAMETERS).forEach(([name, mm]) => {
                    const option = document.createElement("option");
                    option.value = name;
                    option.textContent = `${name} · ${mm} mm`;
                    diameterSelect.appendChild(option);
                });
                diameterSelect.disabled = isLocked(key);
                diameterSelect.onchange = () => {
                    const name = diameterSelect.value;
                    if (!name || isLocked(key)) { updateDisplay(); return; }
                    commitPendingEdit();
                    const places = Math.max(originalPlaces, 6);
                    currentInchValue = OUTER_DIAMETERS[name] / 25.4;
                    child.textContent = currentInchValue.toFixed(places);
                    registerChange(input, input.dataset.originalValue, child.textContent);
                    propagateValueToSelectedFiles(sectionName, key, child.textContent);
                    commitPendingEdit();
                    updateDisplay();
                    updateChangedMarker(input, child.textContent);
                    document.getElementById("status").textContent = `outer_diameter set to ${name} (${OUTER_DIAMETERS[name]} mm = ${child.textContent} in).`;
                };
                const baseUpdateDisplay = updateDisplay;
                updateDisplay = () => {
                    if (document.activeElement !== input) currentInchValue = parseFloat(child.textContent) || 0;
                    baseUpdateDisplay();
                    diameterSelect.value = matchOuterDiameter(child.textContent);
                };
            }

            container.setAttribute("data-param-name", key);
            container.updateDisplay = () => updateDisplay();

            updateDisplay();
            updateChangedMarker(input, child.textContent);
            if (isLocked(key)) input.title = `Locked – unlock with 🔒 to edit${input.title ? ` (${input.title})` : ""}`;

            container.appendChild(input);
            if (!isTextField) container.appendChild(btn);
            if (diameterSelect) container.appendChild(diameterSelect);
            return { container, input };
        }

        function renderPanel(title, xmlNode) {
            const content = document.getElementById("content");
            const panel = document.createElement("div"); panel.className = "panel";
            const header = document.createElement("div"); header.className = "panel-header"; header.textContent = title;
            const body = document.createElement("div"); body.className = "panel-content open";
            const table = document.createElement("table"); table.className = "param-table"; const tbody = document.createElement("tbody");

            const section = title.toLowerCase();
            const refresh = () => showSection(section);
            const allKeys = [...xmlNode.children].map(c => c.tagName);
            const keys = orderedParameterKeys(section, allKeys);
            addResetOrderButton(header, section, refresh);

            keys.forEach(key => {
                if (hiddenFields.has(key)) return;
                const child = xmlNode.querySelector(key);
                const tr = document.createElement("tr");

                const tdName = buildParamNameCell(key, refresh);
                attachParameterReorder(tr, tdName, section, key, allKeys, refresh);

                const tdVal = document.createElement("td");
                const fieldObj = createInputField(child, key);

                if (importantFields.has(key)) { tdVal.classList.add("important-cell"); tr.classList.add("important-cell"); }

                tdVal.appendChild(fieldObj.container); tr.appendChild(tdName); tr.appendChild(tdVal); tbody.appendChild(tr);
            });

            table.appendChild(tbody); body.appendChild(table); panel.appendChild(header); panel.appendChild(body); content.appendChild(panel);
            applyTableSearch();
        }

