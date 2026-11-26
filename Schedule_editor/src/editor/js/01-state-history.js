        /* STATE */
        let loadedFiles = [];
        let selectedFiles = new Set();
        let activeFile = -1;
        let lastSelectedSection = "segments";
        let selectedSegmentPosition = 0; // Position des geoeffneten Segments in file.sections.segments
        let comparisonDifferencesOnly = false;
        let heatInputHiddenFileIds = new Set(); // im Heat Input ausgeblendete Dateien (nur fuer diese Sitzung)
        const SEGMENT_SORTING_CONFIG = {
            "version": 1,
            // Spalten der Segmentansicht: jede Liste steht untereinander (z. B. pri_/bkg_amp zusammen).
            "segmentColumns": [
                [
                    "pri_amp",
                    "bkg_amp",
                    "pri_ahc",
                    "bkg_ahc",
                    "pri_travel",
                    "bkg_travel"
                ],
                [
                    "pri_wire",
                    "bkg_wire",
                    "indwell",
                    "excursion",
                    "outdwell",
                    "tungsten_width"
                ],
                [
                    "layer_diameter",
                    "segment_time",
                    "sync_mode",
                    "slope",
                    "osc_width",
                    "wire_manipulator_in_out_width"
                ]
            ],
            "segmentPriorityOrder": [
                "pri_amp",
                "bkg_amp",
                "pri_ahc",
                "bkg_ahc",
                "pri_travel",
                "bkg_travel",
                "pri_wire",
                "bkg_wire",
                "indwell",
                "excursion",
                "outdwell",
                "tungsten_width",
                "layer_diameter",
                "segment_time",
                "sync_mode",
                "slope",
                "osc_width",
                "wire_manipulator_in_out_width"
            ]
        };
        let segmentPriorityOrder = [...SEGMENT_SORTING_CONFIG.segmentPriorityOrder];
        let segmentColumns = SEGMENT_SORTING_CONFIG.segmentColumns.map(column => [...column]);

        // Liest JSON aus localStorage; bei defekten oder unpassenden Daten wird der Fallback genutzt.
        function readStoredJson(key, fallback) {
            try {
                const raw = localStorage.getItem(key);
                if (raw === null) return fallback;
                const value = JSON.parse(raw);
                if (Array.isArray(fallback) !== Array.isArray(value)) return fallback;
                if (value === null || typeof value !== "object") return fallback;
                return value;
            } catch (error) {
                console.warn(`Ignoring invalid localStorage entry "${key}".`, error);
                return fallback;
            }
        }

        let hiddenFields = new Set(readStoredJson("hiddenFields", []));
        // Gesperrte Parameter (je Name, fuer alle Dateien): schreibgeschuetzt gegen versehentliche Aenderung.
        let lockedFields = new Set(readStoredJson("lockedFields", []));
        let changeLog = readStoredJson("scheduleEditorChangeLog", []);
        let undoStack = [];
        let redoStack = [];
        let pendingEdit = null;
        let draggedFileIndex = -1;
        let comparisonHiddenFileNames = new Set();

        let parameterUnits = readStoredJson("parameterUnits", {});

        let defaultImportant = [
            "pri_amp", "bkg_amp",
            "pri_travel", "bkg_travel",
            "pulse_freq", "pulse_width",
            "pri_wire", "bkg_wire"
        ];
        let importantFields = new Set(readStoredJson("importantFields", defaultImportant));

        const MODES_ORDER = ['none', 'in', 'mm', 'cmmin', 'ampere', 'volt', 'seconds', 'degree'];

        // Sinnvolle Anzeige-Einheiten je Parameter; unbekannte Parameter behalten alle Einheiten.
        function getUnitModesFor(key) {
            if (key === "tungsten_width") return ["degree", "none", "in", "mm"];
            if (/^(pri|bkg)_amp$|_amps$/.test(key)) return ["none", "ampere"];
            if (/^(pri|bkg)_ahc$|^volts$/.test(key)) return ["none", "volt"];
            if (/^(pri|bkg)_(travel|wire2?)$/.test(key)) return ["none", "cmmin"];
            if (/diameter$/.test(key)) return ["none", "in", "mm"];
            if (/^(indwell|outdwell|excursion)$/.test(key)) return ["none", "seconds"];
            return MODES_ORDER;
        }
        const DEFAULT_HEADS = ["NGRT + H-HEAD", "H2-FV-100S"];
        const NGRT_HEAD_PRESET = {
            travel_jog: "20",
            wire_jog_fwd: "100",
            wire_jog_rev: "100",
            ahc_jog: "60",
            osc_jog: "50",
            wire_manipulator_in_out_jog: "243.75",
            wire_manipulator_up_down_jog: "3.4",
            tungsten_jog: "163.36"
        };
        const HEAD_PARAMETER_PRESETS = {
            "NGRT + H-HEAD": NGRT_HEAD_PRESET,
            "NGRT-Head": NGRT_HEAD_PRESET,
            "H2-FV-100S": {
                travel_jog: "20",
                wire_jog_fwd: "100",
                wire_jog_rev: "100",
                ahc_jog: "60",
                osc_jog: "50",
                wire_manipulator_in_out_jog: "60",
                wire_manipulator_up_down_jog: "60"
            }
        };
        let customHeads = readStoredJson("scheduleEditorCustomHeads", []);
        // Rohr-Aussendurchmesser in mm (wie batch_editor); im XML steht outer_diameter in Zoll.
        const OUTER_DIAMETERS = {
            G10: 330, G12: 381, G18: 514, G20: 565, G22: 615, G24: 666,
            G26: 717, G28: 768, G30: 819, G34: 920, G36: 971, G38: 1022
        };
        function matchOuterDiameter(inchValue) {
            const mm = Number(inchValue) * 25.4;
            return Object.keys(OUTER_DIAMETERS).find(name => Math.abs(OUTER_DIAMETERS[name] - mm) < 0.5) || "";
        }
        // Manuelle Reihenfolge der Parameterzeilen je Bereich ({ global: [...], segments: [...] }).
        let parameterOrder = readStoredJson("scheduleEditorParameterOrder", {});

        /* HELPERS */
        function saveHidden() { localStorage.setItem("hiddenFields", JSON.stringify([...hiddenFields])); }
        function saveLocked() { localStorage.setItem("lockedFields", JSON.stringify([...lockedFields])); }
        const isLocked = key => lockedFields.has(key);
        function saveImportant() { localStorage.setItem("importantFields", JSON.stringify([...importantFields])); }
        function saveParameterUnits() { localStorage.setItem("parameterUnits", JSON.stringify(parameterUnits)); }
        function saveChangeLog() { localStorage.setItem("scheduleEditorChangeLog", JSON.stringify(changeLog.slice(0, 200))); }
        function saveCustomHeads() { localStorage.setItem("scheduleEditorCustomHeads", JSON.stringify(customHeads)); }
        function saveParameterOrder() { localStorage.setItem("scheduleEditorParameterOrder", JSON.stringify(parameterOrder)); }
        function getHeadOptions(currentHead = "") {
            return [...new Set([...DEFAULT_HEADS, ...customHeads, currentHead].filter(Boolean))];
        }

        // One oscillation period = In-Dwell + Excursion + Out-Dwell + Excursion: the torch crosses the joint twice.
        // Confirmed with the machine data logs (0404, 0408, 0409): with 2 excursions the prediction matches the measured
        // and logged heat input within about 0.5 %; with 1 excursion it was 3–5 % too high.
        const EXCURSIONS_PER_CYCLE = 2;

        function calculateSegmentHeatInput(segment, overrides) {
            const readValue = (parent, name) => {
                const element = parent && [...parent.children].find(child => child.tagName === name);
                if (!element || element.textContent.trim() === "") return null;
                const value = Number(element.textContent);
                return Number.isFinite(value) ? value : null;
            };
            const enabled = readValue(segment, "enable");
            if (enabled === 0) return { disabled: true };
            const values = {
                backgroundVoltage: readValue(segment, "bkg_ahc"),
                backgroundAmps: readValue(segment, "bkg_amp"),
                backgroundTravel: readValue(segment, "bkg_travel"),
                excursion: readValue(segment, "excursion"),
                indwell: readValue(segment, "indwell"),
                outdwell: readValue(segment, "outdwell"),
                primaryVoltage: readValue(segment, "pri_ahc"),
                primaryAmps: readValue(segment, "pri_amp"),
                primaryTravel: readValue(segment, "pri_travel")
            };
            const missing = Object.entries(values)
                .filter(([, value]) => value === null)
                .map(([name]) => name);
            if (missing.length) return { error: `Missing/invalid values: ${missing.join(", ")}` };
            if (values.backgroundVoltage <= 0 || values.primaryVoltage <= 0
                || values.backgroundAmps < 0 || values.primaryAmps < 0) {
                return { error: "Voltage must be > 0 and current >= 0." };
            }
            if (values.backgroundTravel <= 0 || values.primaryTravel <= 0) {
                return { error: "Travel speed must be > 0." };
            }
            if (values.excursion < 0 || values.indwell < 0 || values.outdwell < 0) {
                return { error: "Dwell and excursion times must be >= 0." };
            }

            const backgroundTime = EXCURSIONS_PER_CYCLE * values.excursion;
            const cycleTime = backgroundTime + values.indwell + values.outdwell;
            if (cycleTime <= 0) return { error: "Total cycle time must be > 0." };

            const readOverride = name => {
                const element = overrides && [...overrides.children].find(child => child.tagName === name);
                if (!element) return 0;
                const value = readValue(overrides, name);
                return value !== null && value >= 0 ? value : null;
            };
            const percentages = {
                voltage: readOverride("avc_override_max"),
                backgroundAmps: readOverride("bkg_amp_max"),
                primaryAmps: readOverride("pri_amp_max"),
                travel: readOverride("travel_max"),
                dwell: readOverride("dwell_max"),
                excursion: readOverride("excursion_max")
            };
            const invalidOverride = Object.entries(percentages).find(([, value]) => value === null);
            if (invalidOverride) return { error: `Invalid override value: ${invalidOverride[0]}` };

            const getRange = (value, percentage) => {
                const delta = value * percentage / 100;
                return { min: Math.max(0, value - delta), max: value + delta };
            };
            const ranges = {
                backgroundVoltage: getRange(values.backgroundVoltage, percentages.voltage),
                primaryVoltage: getRange(values.primaryVoltage, percentages.voltage),
                backgroundAmps: getRange(values.backgroundAmps, percentages.backgroundAmps),
                primaryAmps: getRange(values.primaryAmps, percentages.primaryAmps),
                backgroundTravel: getRange(values.backgroundTravel, percentages.travel),
                primaryTravel: getRange(values.primaryTravel, percentages.travel),
                excursion: getRange(values.excursion, percentages.excursion),
                indwell: getRange(values.indwell, percentages.dwell),
                outdwell: getRange(values.outdwell, percentages.dwell)
            };
            if (!Object.values(ranges).every(range => Number.isFinite(range.min) && Number.isFinite(range.max))) {
                return { error: "Calculation not possible; please check the override values." };
            }
            if (ranges.backgroundTravel.min <= 0 || ranges.primaryTravel.min <= 0) {
                return { error: "Travel override must not allow a travel speed of 0 or less." };
            }

            const primaryTime = values.indwell + values.outdwell;
            const averageAmps = (
                values.backgroundAmps * backgroundTime
                + values.primaryAmps * primaryTime
            ) / cycleTime;
            const backgroundTravelMmPerSecond = values.backgroundTravel * 25.4 / 60;
            const primaryTravelMmPerSecond = values.primaryTravel * 25.4 / 60;
            const travelDistanceMm = backgroundTravelMmPerSecond * backgroundTime
                + primaryTravelMmPerSecond * primaryTime;
            const averageTravelMmPerMinute = travelDistanceMm / cycleTime * 60;
            const heatInputFor = (backgroundVoltage, backgroundAmps, backgroundTravel,
                primaryVoltage, primaryAmps, primaryTravel, excursion, indwell, outdwell) => {
                const primaryPhaseTime = indwell + outdwell;
                const backgroundPhaseTime = EXCURSIONS_PER_CYCLE * excursion;
                const energyJoules = backgroundVoltage * backgroundAmps * backgroundPhaseTime
                    + primaryVoltage * primaryAmps * primaryPhaseTime;
                const distanceMm = (backgroundTravel * backgroundPhaseTime + primaryTravel * primaryPhaseTime) * 25.4 / 60;
                if (!Number.isFinite(energyJoules) || !Number.isFinite(distanceMm) || distanceMm <= 0) return null;
                const result = 0.6 * energyJoules / (distanceMm * 1000);
                return Number.isFinite(result) ? result : null;
            };
            const heatInput = heatInputFor(
                values.backgroundVoltage, values.backgroundAmps, values.backgroundTravel,
                values.primaryVoltage, values.primaryAmps, values.primaryTravel,
                values.excursion, values.indwell, values.outdwell
            );
            if (![averageAmps, averageTravelMmPerMinute, heatInput].every(Number.isFinite)) {
                return { error: "Calculation not possible; please check the values." };
            }

            let minHeatInput = Infinity;
            let maxHeatInput = -Infinity;
            for (const excursion of [ranges.excursion.min, ranges.excursion.max]) {
                for (const indwell of [ranges.indwell.min, ranges.indwell.max]) {
                    for (const outdwell of [ranges.outdwell.min, ranges.outdwell.max]) {
                        if (excursion + indwell + outdwell <= 0) continue;
                        const minimum = heatInputFor(
                            ranges.backgroundVoltage.min, ranges.backgroundAmps.min, ranges.backgroundTravel.max,
                            ranges.primaryVoltage.min, ranges.primaryAmps.min, ranges.primaryTravel.max,
                            excursion, indwell, outdwell
                        );
                        const maximum = heatInputFor(
                            ranges.backgroundVoltage.max, ranges.backgroundAmps.max, ranges.backgroundTravel.min,
                            ranges.primaryVoltage.max, ranges.primaryAmps.max, ranges.primaryTravel.min,
                            excursion, indwell, outdwell
                        );
                        if (minimum === null || maximum === null) {
                            return { error: "Calculation not possible; please check the override values." };
                        }
                        minHeatInput = Math.min(minHeatInput, minimum);
                        maxHeatInput = Math.max(maxHeatInput, maximum);
                    }
                }
            }
            if (![minHeatInput, maxHeatInput].every(Number.isFinite)) {
                return { error: "Calculation not possible; please check the override values." };
            }
            return { averageAmps, averageTravelMmPerMinute, heatInput, minHeatInput, maxHeatInput };
        }

        function setupSidebarToggles() {
            const savedState = readStoredJson("scheduleEditorSidebarState", {});
            document.querySelectorAll(".sidebar-section-toggle").forEach(toggle => {
                const target = document.getElementById(toggle.getAttribute("aria-controls"));
                if (!target) return;
                const stateKey = toggle.getAttribute("aria-controls");
                const isExpanded = savedState[stateKey] !== false;
                toggle.setAttribute("aria-expanded", String(isExpanded));
                target.hidden = !isExpanded;

                const setExpanded = () => {
                    const nextExpanded = toggle.getAttribute("aria-expanded") !== "true";
                    toggle.setAttribute("aria-expanded", String(nextExpanded));
                    target.hidden = !nextExpanded;
                    savedState[stateKey] = nextExpanded;
                    localStorage.setItem("scheduleEditorSidebarState", JSON.stringify(savedState));
                };

                toggle.onclick = setExpanded;
                toggle.onkeydown = event => {
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setExpanded();
                    }
                };
            });
        }

        const xmlSerializer = new XMLSerializer();
        const serializeXml = doc => xmlSerializer.serializeToString(doc);
        const parseXml = text => new DOMParser().parseFromString(text, "application/xml");

        // originalXml wird nie veraendert; seine Serialisierung wird einmal zwischengespeichert.
        function createFileRecord(name, xml, originalXml = xml,
            id = `${Date.now()}-${Math.random().toString(16).slice(2)}`,
            originalXmlString = serializeXml(originalXml)) {
            return {
                id,
                name,
                xml,
                originalXml,
                originalXmlString,
                sections: {
                    description: xml.querySelector("description"),
                    global: xml.querySelector("global"),
                    limits: xml.querySelector("limits"),
                    overrides: xml.querySelector("overrides"),
                    segments: [...xml.querySelectorAll("segment")]
                },
                // Stand der zuletzt heruntergeladenen Datei (Laden bzw. Batch Save); Save laedt nicht herunter.
                exportedXmlString: originalXmlString,
                // Feste Schweissnahtlaenge (Zoll) und von Hand gesetzte Segmente (Positionen).
                seamLengthIn: sumSegmentTimeOf([...xml.querySelectorAll("segment")]),
                manualSegments: new Set()
            };
        }

        // true, wenn der aktuelle Stand noch nicht ueber Batch Save heruntergeladen wurde.
        function needsDownload(file) {
            return Boolean(file) && serializeXml(file.xml) !== file.exportedXmlString;
        }

        function isFileDirty(file) {
            return Boolean(file) && serializeXml(file.xml) !== file.originalXmlString;
        }

        // Snapshots speichern das aktuelle XML als Text (kleiner und schneller als DOM-Klone).
        // originalXml wird nur referenziert, da es nie veraendert wird.
        function createHistorySnapshot() {
            return {
                files: loadedFiles.map(file => ({
                    id: file.id,
                    name: file.name,
                    xmlString: serializeXml(file.xml),
                    originalXml: file.originalXml,
                    originalXmlString: file.originalXmlString,
                    exportedXmlString: file.exportedXmlString,
                    seamLengthIn: file.seamLengthIn,
                    manualSegments: [...file.manualSegments]
                })),
                selectedFiles: [...selectedFiles],
                activeFile,
                lastSelectedSection,
                hiddenFields: [...hiddenFields],
                lockedFields: [...lockedFields],
                importantFields: [...importantFields],
                parameterOrder: JSON.parse(JSON.stringify(parameterOrder)),
                parameterUnits: { ...parameterUnits },
                customHeads: [...customHeads],
                changeLog: JSON.parse(JSON.stringify(changeLog))
            };
        }

        function historySnapshotKey(snapshot) {
            return JSON.stringify({
                files: snapshot.files.map(file => ({ name: file.name, xml: file.xmlString })),
                selectedFiles: snapshot.selectedFiles,
                activeFile: snapshot.activeFile,
                lastSelectedSection: snapshot.lastSelectedSection,
                hiddenFields: snapshot.hiddenFields,
                lockedFields: snapshot.lockedFields,
                importantFields: snapshot.importantFields,
                parameterOrder: snapshot.parameterOrder,
                parameterUnits: snapshot.parameterUnits,
                customHeads: snapshot.customHeads,
                changeLog: snapshot.changeLog
            });
        }

        function pushHistorySnapshot(label, beforeSnapshot) {
            const afterSnapshot = createHistorySnapshot();
            if (historySnapshotKey(beforeSnapshot) === historySnapshotKey(afterSnapshot)) return false;
            undoStack.push({ type: "snapshot", label, before: beforeSnapshot, after: afterSnapshot });
            if (undoStack.length > 200) undoStack.shift();
            redoStack = [];
            updateUndoRedoButtons();
            if (document.getElementById("fileList")) renderFileList();
            return true;
        }

        function recordHistoryAction(label, callback) {
            commitPendingEdit();
            const beforeSnapshot = createHistorySnapshot();
            callback();
            pushHistorySnapshot(label, beforeSnapshot);
        }

        function restoreHistorySnapshot(snapshot) {
            loadedFiles = snapshot.files.map(file => {
                const record = createFileRecord(
                    file.name,
                    parseXml(file.xmlString),
                    file.originalXml,
                    file.id,
                    file.originalXmlString
                );
                if (Number.isFinite(file.seamLengthIn)) record.seamLengthIn = file.seamLengthIn;
                record.manualSegments = new Set(file.manualSegments || []);
                if (typeof file.exportedXmlString === "string") record.exportedXmlString = file.exportedXmlString;
                return record;
            });
            selectedFiles = new Set(snapshot.selectedFiles);
            activeFile = snapshot.activeFile;
            lastSelectedSection = snapshot.lastSelectedSection;
            hiddenFields = new Set(snapshot.hiddenFields);
            lockedFields = new Set(snapshot.lockedFields || []);
            saveLocked();
            importantFields = new Set(snapshot.importantFields);
            parameterOrder = JSON.parse(JSON.stringify(snapshot.parameterOrder || {}));
            saveParameterOrder();
            parameterUnits = { ...snapshot.parameterUnits };
            customHeads = [...snapshot.customHeads];
            changeLog = JSON.parse(JSON.stringify(snapshot.changeLog));
            pendingEdit = null;
            updateUI();
            saveHidden();
            saveImportant();
            saveParameterUnits();
            saveCustomHeads();
            saveChangeLog();
        }

        function updateUndoRedoButtons() {
            const undoBtn = document.getElementById("returnBtn");
            const redoBtn = document.getElementById("redoBtn");
            if (undoBtn) undoBtn.disabled = undoStack.length === 0;
            if (redoBtn) redoBtn.disabled = redoStack.length === 0;
        }

        function commitPendingEdit() {
            if (!pendingEdit) return;
            const action = pendingEdit;
            if (!action || !action.changes || !action.changes.length) {
                pendingEdit = null;
                return;
            }
            const hasEffectiveChange = action.changes.some(change => change.oldValue !== change.newValue);
            if (hasEffectiveChange) {
                undoStack.push(action);
                if (undoStack.length > 200) undoStack.shift();
                redoStack = [];
                updateUndoRedoButtons();
                renderFileList();
            }
            pendingEdit = null;
        }

        function applyChangeAction(action, reverse = false) {
            if (action?.type === "snapshot") {
                restoreHistorySnapshot(reverse ? action.before : action.after);
                return;
            }
            if (!action || !action.changes) return;
            action.changes.forEach(change => {
                const file = loadedFiles[change.fileIndex];
                if (!file) return;
                const sectionName = change.sectionName;
                let targetNode = null;
                if (sectionName === "segments") {
                    targetNode = file.sections.segments.find(seg => seg.getAttribute("index") === change.segmentIndex);
                    if (targetNode) targetNode = targetNode.querySelector(change.key);
                } else if (file.sections[sectionName]) {
                    targetNode = file.sections[sectionName].querySelector(change.key);
                }
                if (!targetNode) return;
                const targetValue = reverse ? change.oldValue : change.newValue;
                targetNode.textContent = targetValue;
                updateChangeLogEntry({
                    fileIndex: change.fileIndex,
                    fileName: loadedFiles[change.fileIndex]?.name || change.fileName || "unknown",
                    sectionName,
                    key: change.key,
                    segmentIndex: change.segmentIndex,
                    oldValue: change.oldValue,
                    newValue: targetValue
                });
            });
            if (activeFile >= 0 && activeFile < loadedFiles.length) {
                const sectionName = lastSelectedSection;
                if (sectionName === action.changes[0]?.sectionName) {
                    showSection(sectionName);
                }
            }
            saveChangeLog();
            updateChangeCounter();
        }

        function undoLastEdit() {
            commitPendingEdit();
            if (!undoStack.length) return;
            const action = undoStack.pop();
            applyChangeAction(action, true);
            redoStack.push(action);
            updateUndoRedoButtons();
            renderFileList();
        }

        function redoLastEdit() {
            if (!redoStack.length) return;
            const action = redoStack.pop();
            applyChangeAction(action, false);
            undoStack.push(action);
            updateUndoRedoButtons();
            renderFileList();
        }

        // Eintraege werden ueber die Datei-ID der aktuellen Sitzung zugeordnet, damit alte
        // Eintraege (fruehere Sitzungen, andere Datei am selben Index) nicht vermischt werden.
        function findChangeLogIndex({ fileIndex, sectionName, key, segmentIndex }) {
            const fileId = loadedFiles[fileIndex]?.id;
            return changeLog.findIndex(entry => {
                const sameIndex = Boolean(fileId) && entry.fileId === fileId;
                const sameSection = entry.section === sectionName;
                const sameKey = entry.key === key;
                const sameSegment = (entry.segmentIndex || "") === (segmentIndex || "");
                // Bereits gespeicherte Eintraege bleiben unveraendert; neue Aenderungen bekommen eigene Zeilen.
                return !entry.savedIn && sameIndex && sameSection && sameKey && sameSegment;
            });
        }

        function updateChangeLogEntry({ fileIndex, fileName, sectionName, key, segmentIndex, oldValue, newValue }) {
            const idx = findChangeLogIndex({ fileIndex, sectionName, key, segmentIndex });
            const entry = {
                id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
                timestamp: new Date().toISOString(),
                fileId: loadedFiles[fileIndex]?.id || "",
                fileIndex,
                fileName,
                section: sectionName || "unknown",
                key,
                segmentIndex: segmentIndex || "",
                // Der urspruengliche Altwert bleibt erhalten, auch wenn ein Feld mehrfach geaendert wird.
                oldValue: idx >= 0 ? changeLog[idx].oldValue : String(oldValue ?? ""),
                newValue: String(newValue ?? "")
            };
            if (entry.newValue === entry.oldValue) {
                if (idx >= 0) {
                    changeLog.splice(idx, 1);
                }
            } else if (idx >= 0) {
                entry.id = changeLog[idx].id;
                entry.timestamp = changeLog[idx].timestamp;
                changeLog[idx] = entry;
            } else {
                changeLog.unshift(entry);
            }
            changeLog = changeLog.slice(0, 200);
            saveChangeLog();
            updateChangeCounter();
        }

        function clearChangeLog() {
            if (!changeLog.length) return;
            if (!window.confirm(`Delete all ${changeLog.length} change log entries? (Undo restores them.)`)) return;
            recordHistoryAction("Clear change log", () => {
                changeLog = [];
                saveChangeLog();
            });
            document.getElementById("status").textContent = "Change log cleared.";
            renderChangeLog();
        }

        function renderChangeLog() {
            const content = document.getElementById("content");
            content.innerHTML = "";
            const top = document.createElement("div");
            top.className = "changelog-top";
            const heading = document.createElement("h2");
            heading.textContent = "Change Log";
            top.appendChild(heading);
            if (changeLog.length) {
                const count = document.createElement("span");
                count.className = "changelog-count";
                const visible = changeLog.filter(entry => !entry.savedIn).length;
                count.textContent = `${visible} entr${visible === 1 ? "y" : "ies"}`;
                const clearButton = document.createElement("button");
                clearButton.type = "button";
                clearButton.className = "btn-secondary changelog-clear-btn";
                clearButton.textContent = "Clear log";
                clearButton.title = "Delete all change log entries (can be undone)";
                clearButton.onclick = clearChangeLog;
                top.append(count, clearButton);
            }
            content.appendChild(top);

            if (!changeLog.length) {
                const empty = document.createElement("p");
                empty.style.color = "var(--text-muted)";
                empty.textContent = "No changes recorded yet.";
                content.appendChild(empty);
                return;
            }

            const table = document.createElement("table");
            table.className = "diff-table";
            table.innerHTML = "<tr><th>Time</th><th>File</th><th>Section</th><th>Parameter</th><th>Old</th><th>New</th></tr>";

            changeLog.filter(entry => !entry.savedIn).forEach(entry => {
                const tr = document.createElement("tr");
                if (entry.section === "save") {
                    tr.className = "changelog-save-row";
                    const details = Array.isArray(entry.details) ? entry.details : [];
                    if (details.length) {
                        tr.classList.add("is-expandable");
                        tr.tabIndex = 0;
                        tr.setAttribute("role", "button");
                        tr.setAttribute("aria-expanded", "false");
                        tr.title = "Show the individual changes";
                        const toggle = () => {
                            const open = tr.getAttribute("aria-expanded") !== "true";
                            tr.setAttribute("aria-expanded", String(open));
                            let next = tr.nextElementSibling;
                            while (next && next.classList.contains("changelog-detail-row")) {
                                next.hidden = !open;
                                next = next.nextElementSibling;
                            }
                        };
                        tr.onclick = toggle;
                        tr.onkeydown = event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); toggle(); } };
                    }
                }
                [
                    new Date(entry.timestamp).toLocaleString(),
                    entry.fileName,
                    entry.section,
                    entry.key,
                    entry.oldValue || "-",
                    entry.newValue || "-"
                ].forEach(value => {
                    const td = document.createElement("td");
                    td.textContent = String(value ?? "");
                    tr.appendChild(td);
                });
                table.appendChild(tr);
                if (entry.section === "save" && Array.isArray(entry.details)) {
                    entry.details.forEach(change => {
                        const detailRow = document.createElement("tr");
                        detailRow.className = `changelog-detail-row is-${change.kind || "changed"}`;
                        detailRow.hidden = true;
                        [
                            change.kind === "added" ? "+ added" : change.kind === "removed" ? "− removed" : "~ changed",
                            "",
                            change.section,
                            change.segmentIndex !== "" && change.segmentIndex !== undefined ? `${change.key} (segment ${Number(change.segmentIndex) + 1})` : change.key,
                            change.oldValue || "-",
                            change.newValue || "-"
                        ].forEach(value => {
                            const td = document.createElement("td");
                            td.textContent = String(value ?? "");
                            detailRow.appendChild(td);
                        });
                        table.appendChild(detailRow);
                    });
                }
            });

            content.appendChild(table);
        }

        function styleInput(input) {
            const pureVal = input.value.replace(/\s*(in|mm|cm\/min|A|V|s|°)$/i, "").trim();
            if (pureVal === "0") input.classList.add("zero");
            else input.classList.remove("zero");
        }

