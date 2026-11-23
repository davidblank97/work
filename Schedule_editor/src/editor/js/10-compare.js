        /* COMPARE & CONVERTER TOOLS */
        function collectComparisonEntries(file) {
            const entries = [];
            ["description", "global", "limits", "overrides"].forEach(sectionName => {
                const section = file.sections[sectionName];
                if (!section) return;
                [...section.children].forEach(node => entries.push({ key: `${sectionName}.${node.tagName}`, sectionName, segmentIndex: "", parameter: node.tagName, value: node.textContent }));
            });
            file.sections.segments.forEach(segment => {
                const segmentIndex = segment.getAttribute("index") || "";
                [...segment.children].forEach(node => entries.push({ key: `segments[${segmentIndex}].${node.tagName}`, sectionName: "segments", segmentIndex, parameter: node.tagName, value: node.textContent }));
            });
            return entries;
        }

        function findComparisonNode(file, entry) {
            if (entry.sectionName === "segments") {
                const segment = file.sections.segments.find(item => item.getAttribute("index") === entry.segmentIndex);
                return segment ? [...segment.children].find(node => node.tagName === entry.parameter) : null;
            }
            const section = file.sections[entry.sectionName];
            return section ? [...section.children].find(node => node.tagName === entry.parameter) : null;
        }

        function applyComparisonValueToAll(sourceFile, targetFiles, entry) {
            const sourceNode = findComparisonNode(sourceFile, entry);
            if (!sourceNode || isLocked(entry.parameter)) return;
            recordHistoryAction("Apply comparison value", () => {
                targetFiles.forEach(targetFile => {
                    const targetNode = findComparisonNode(targetFile, entry);
                    if (!targetNode || targetNode.textContent === sourceNode.textContent) return;
                    const targetIndex = loadedFiles.indexOf(targetFile);
                    const oldValue = targetNode.textContent;
                    targetNode.textContent = sourceNode.textContent;
                    updateChangeLogEntry({
                        fileIndex: targetIndex,
                        fileName: targetFile.name,
                        sectionName: entry.sectionName,
                        key: entry.parameter,
                        segmentIndex: entry.segmentIndex,
                        oldValue,
                        newValue: targetNode.textContent
                    });
                });
                updateChangeCounter();
                renderComparison();
            });
        }

        function formatComparisonValue(parameter, value) {
            const number = parseFloat(value);
            if (!Number.isFinite(number)) return value || "-";
            const places = displayPlaces(getDecimalPlaces(value));
            const mode = parameterUnits[parameter] || "none";

            if (parameter === "tungsten_width" && mode === "degree") {
                const r = 0.2;
                const ratio = number / (2 * r);
                const degrees = ratio > 1 ? 180 : ratio < -1 ? -180 : 2 * Math.asin(ratio) * (180 / Math.PI);
                return `${degrees.toFixed(2)} °`;
            }
            if (mode === "mm") return `${(number * 25.4).toFixed(2)} mm`;
            if (mode === "cmmin") return `${(number * 2.54).toFixed(2)} cm/min`;
            if (mode === "in") return `${number.toFixed(places)} in`;
            if (mode === "ampere") return `${number.toFixed(places)} A`;
            if (mode === "volt") return `${number.toFixed(places)} V`;
            if (mode === "seconds") return `${number.toFixed(places)} s`;
            if (mode === "degree") return `${number.toFixed(places)} °`;
            return number.toFixed(places);
        }

        function parseComparisonValue(parameter, inputValue) {
            const mode = parameterUnits[parameter] || "none";
            const number = parseNumberInput(inputValue);
            if (!Number.isFinite(number)) return null;

            if (parameter === "tungsten_width" && mode === "degree") {
                const r = 0.2;
                return 2 * r * Math.sin((number * Math.PI) / 360);
            }
            if (mode === "mm") return number / 25.4;
            if (mode === "cmmin") return number / 2.54;
            return number;
        }

        function updateComparisonValue(file, entry, input) {
            const node = findComparisonNode(file, entry);
            if (!node) return;
            if (isLocked(entry.parameter)) {
                input.value = formatComparisonValue(entry.parameter, node.textContent);
                document.getElementById("status").textContent = `${entry.parameter} is locked.`;
                return;
            }
            const parsedValue = parseComparisonValue(entry.parameter, input.value);
            if (parsedValue === null) {
                input.value = formatComparisonValue(entry.parameter, node.textContent);
                return;
            }
            const places = getDecimalPlaces(node.textContent);
            const oldValue = node.textContent;
            const newValue = parsedValue.toFixed(places);
            if (oldValue === newValue) return;

            recordHistoryAction("Edit comparison value", () => {
                node.textContent = newValue;
                updateChangeLogEntry({
                    fileIndex: loadedFiles.indexOf(file),
                    fileName: file.name,
                    sectionName: entry.sectionName,
                    key: entry.parameter,
                    segmentIndex: entry.segmentIndex,
                    oldValue,
                    newValue
                });
                updateChangeCounter();
                renderComparison();
            });
        }

        function renderComparison() {
            commitPendingEdit();
            document.querySelectorAll("#sidebar .sidebar-item").forEach(el => el.classList.remove("active"));
            document.getElementById("compareBtn").classList.add("active");
            const content = document.getElementById("content");
            content.innerHTML = "";

            const heading = document.createElement("h2");
            heading.textContent = "Schedule Comparison";
            content.appendChild(heading);

            const fileControls = document.createElement("div");
            fileControls.className = "comparison-file-controls";
            loadedFiles.forEach(file => {
                const label = document.createElement("label");
                label.className = "comparison-file-control";
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = !comparisonHiddenFileNames.has(file.name);
                checkbox.onchange = () => {
                    if (checkbox.checked) comparisonHiddenFileNames.delete(file.name);
                    else comparisonHiddenFileNames.add(file.name);
                    renderComparison();
                };
                label.appendChild(checkbox);
                label.title = file.name;
                label.appendChild(document.createTextNode(fileShortLabel(file)));
                fileControls.appendChild(label);
            });

            if (loadedFiles.length > 0) {
                const showAll = document.createElement("button");
                showAll.type = "button";
                showAll.className = "btn-secondary";
                showAll.textContent = "Show all";
                showAll.onclick = () => { comparisonHiddenFileNames.clear(); renderComparison(); };
                fileControls.appendChild(showAll);

                const hideAll = document.createElement("button");
                hideAll.type = "button";
                hideAll.className = "btn-secondary";
                hideAll.textContent = "Hide all";
                hideAll.onclick = () => {
                    comparisonHiddenFileNames = new Set(loadedFiles.map(file => file.name));
                    renderComparison();
                };
                fileControls.appendChild(hideAll);

                const differencesLabel = document.createElement("label");
                differencesLabel.className = "comparison-file-control comparison-diff-toggle";
                const differencesCheckbox = document.createElement("input");
                differencesCheckbox.type = "checkbox";
                differencesCheckbox.checked = comparisonDifferencesOnly;
                differencesCheckbox.onchange = () => {
                    comparisonDifferencesOnly = differencesCheckbox.checked;
                    renderComparison();
                };
                differencesLabel.append(differencesCheckbox, document.createTextNode("Show differences only"));
                fileControls.appendChild(differencesLabel);
            }
            content.appendChild(fileControls);

            const filesToCompare = loadedFiles.filter(file => !comparisonHiddenFileNames.has(file.name));

            if (filesToCompare.length < 2) {
                const message = document.createElement("p");
                message.style.color = "var(--text-muted)";
                message.textContent = filesToCompare.length === 0
                    ? "Please show at least two files to compare them."
                    : "Please show at least one more file to compare them.";
                content.appendChild(message);
                return;
            }

            const entryMaps = filesToCompare.map(file => new Map(collectComparisonEntries(file).map(entry => [entry.key, entry])));
            const keys = [...new Set(entryMaps.flatMap(map => [...map.keys()]))].sort();
            const table = document.createElement("table");
            table.className = "diff-table";

            const headerRow = document.createElement("tr");
            [["Status", ""], ["Parameter", ""], ...filesToCompare.map(file => [fileShortLabel(file), file.name])].forEach(([text, fullName]) => {
                const th = document.createElement("th");
                th.textContent = text;
                if (fullName) th.title = fullName;
                headerRow.appendChild(th);
            });
            table.appendChild(headerRow);

            let visibleParameterCount = 0;
            let differentParameterCount = 0;
            keys.forEach(key => {
                const baseEntry = entryMaps.find(map => map.has(key))?.get(key);
                if (!baseEntry || hiddenFields.has(baseEntry.parameter)) return;
                const row = document.createElement("tr");
                const rawValues = filesToCompare.map((file, index) => entryMaps[index].get(key)?.value ?? "");
                const formattedValues = rawValues.map(value => formatComparisonValue(baseEntry.parameter, value));
                const unique = [...new Set(formattedValues)];
                const status = unique.length <= 1 ? "Same" : "Different";
                visibleParameterCount++;
                if (status === "Different") differentParameterCount++;
                if (comparisonDifferencesOnly && status === "Same") return;
                // Haeufigster Wert der Zeile; abweichende Zellen werden hervorgehoben.
                const valueCounts = new Map();
                formattedValues.forEach(value => valueCounts.set(value, (valueCounts.get(value) || 0) + 1));
                const mostCommonValue = [...valueCounts.entries()].sort((a, b) => b[1] - a[1])[0][0];

                const diffCell = document.createElement("td");
                diffCell.textContent = status;
                diffCell.className = `diff-status ${status === "Same" ? "same" : ""}`.trim();
                row.appendChild(diffCell);

                const nameCell = document.createElement("td");
                // Anzeige ab 1: "segments[0].x" -> "segment 1.x"
                nameCell.textContent = key.replace(/^segments\[(\d+)\]/, (match, index) => `segment ${Number(index) + 1}`);
                if (importantFields.has(baseEntry.parameter)) nameCell.classList.add("important-name");
                row.appendChild(nameCell);

                filesToCompare.forEach((file, valueIndex) => {
                    const valueEntry = entryMaps[valueIndex].get(key);
                    const valueCell = document.createElement("td");
                    if (status === "Different" && formattedValues[valueIndex] !== mostCommonValue) {
                        valueCell.classList.add("comparison-diff-cell");
                    }
                    const valueWrap = document.createElement("div");
                    valueWrap.className = "comparison-value";

                    if (valueEntry) {
                        const input = document.createElement("input");
                        input.type = "text";
                        input.className = "comparison-edit-input";
                        input.value = formatComparisonValue(baseEntry.parameter, valueEntry.value);
                        if (isLocked(baseEntry.parameter)) {
                            input.readOnly = true;
                            input.classList.add("is-locked");
                            input.title = "Locked parameter";
                        }
                        input.onchange = () => updateComparisonValue(file, valueEntry, input);
                        input.onkeydown = event => {
                            if (event.key === "Enter") input.blur();
                            if (event.key === "Escape") {
                                input.value = formatComparisonValue(baseEntry.parameter, valueEntry.value);
                                input.blur();
                            }
                        };
                        valueWrap.appendChild(input);

                        if (status === "Different" && !isLocked(baseEntry.parameter)) {
                            const transferButton = document.createElement("button");
                            transferButton.type = "button";
                            transferButton.className = "comparison-apply-btn";
                            transferButton.textContent = "Apply to all";
                            transferButton.title = `Apply the value of ${fileShortLabel(file)} to all visible files`;
                            transferButton.onclick = () => applyComparisonValueToAll(
                                file,
                                filesToCompare.filter(targetFile => targetFile !== file),
                                valueEntry
                            );
                            valueWrap.appendChild(transferButton);
                        }
                    } else {
                        valueWrap.textContent = "-";
                    }

                    valueCell.appendChild(valueWrap);
                    row.appendChild(valueCell);
                });

                table.appendChild(row);
            });

            const comparisonSummary = document.createElement("p");
            comparisonSummary.className = "comparison-summary";
            comparisonSummary.textContent = `${differentParameterCount} of ${visibleParameterCount} parameters differ.`;
            content.appendChild(comparisonSummary);

            // Nur die Tabelle scrollt (beide Richtungen, eigene Scrollleisten); Kopfzeile und die Spalten
            // Status/Parameter bleiben stehen. Die Hoehe wird an den freien Platz angepasst, damit die Seite
            // selbst nicht zusaetzlich scrollt.
            const comparisonTableWrap = document.createElement("div");
            comparisonTableWrap.className = "comparison-table-wrap";
            const comparisonTableViewport = document.createElement("div");
            comparisonTableViewport.className = "comparison-table-viewport";
            comparisonTableViewport.appendChild(table);
            comparisonTableWrap.appendChild(comparisonTableViewport);
            content.appendChild(comparisonTableWrap);
            requestAnimationFrame(() => {
                fitComparisonTable();
                const firstCell = table.querySelector("tr > :first-child");
                const offset = firstCell ? firstCell.getBoundingClientRect().width : 0;
                table.querySelectorAll("tr > :nth-child(2)").forEach(cell => { cell.style.left = `${offset}px`; });
            });
        }

        function fitComparisonTable() {
            const wrap = document.querySelector("#content .comparison-table-wrap");
            if (!wrap) return;
            const content = document.getElementById("content");
            const paddingBottom = parseFloat(getComputedStyle(content).paddingBottom) || 0;
            const available = content.getBoundingClientRect().bottom - wrap.getBoundingClientRect().top - paddingBottom - 2 + content.scrollTop;
            wrap.style.maxHeight = `${Math.max(240, Math.floor(available))}px`;
        }
        window.addEventListener("resize", fitComparisonTable);

        function loadSavedXdrSchemas() {
            return new Promise((resolve, reject) => {
                if (!window.indexedDB) {
                    reject(new Error("This browser does not support IndexedDB."));
                    return;
                }
                const request = window.indexedDB.open("ScheduleProgramDatabase");
                request.onupgradeneeded = () => {
                    const database = request.result;
                    if (!database.objectStoreNames.contains("programs")) {
                        database.createObjectStore("programs", { keyPath: "id" });
                    }
                    if (!database.objectStoreNames.contains("schemas")) {
                        database.createObjectStore("schemas", { keyPath: "id" });
                    }
                };
                request.onsuccess = () => {
                    const database = request.result;
                    if (!database.objectStoreNames.contains("schemas")) {
                        database.close();
                        resolve([]);
                        return;
                    }
                    const transaction = database.transaction("schemas", "readonly");
                    const getAllRequest = transaction.objectStore("schemas").getAll();
                    let result = [];
                    getAllRequest.onsuccess = () => { result = getAllRequest.result; };
                    getAllRequest.onerror = () => reject(getAllRequest.error || new Error("Could not read saved XDR schemas."));
                    transaction.oncomplete = () => {
                        database.close();
                        resolve(result.filter(schema => schema.format === "xdr"));
                    };
                    transaction.onerror = () => {
                        database.close();
                        reject(transaction.error || new Error("Could not read saved XDR schemas."));
                    };
                    transaction.onabort = () => {
                        database.close();
                        reject(transaction.error || new Error("Reading saved XDR schemas was aborted."));
                    };
                };
                request.onerror = () => {
                    if (request.error?.name === "AbortError") resolve([]);
                    else reject(request.error || new Error("Could not open the saved schema database."));
                };
                request.onblocked = () => reject(new Error("The saved schema database is busy. Close other application tabs and try again."));
            });
        }

        function parseViewerXdr(xmlText, schemaName) {
            const schemaDocument = new DOMParser().parseFromString(xmlText, "application/xml");
            const parseError = schemaDocument.querySelector("parsererror");
            if (parseError) throw new Error(`${schemaName}: invalid XDR XML.`);
            const root = schemaDocument.documentElement;
            if (!root || root.localName !== "Schema") throw new Error(`${schemaName}: expected an XDR <Schema> root.`);
            const definitions = new Map();
            Array.from(root.getElementsByTagName("*"))
                .filter(element => element.localName === "ElementType")
                .forEach(definition => {
                    const name = definition.getAttribute("name");
                    if (!name || definitions.has(name)) throw new Error(`${schemaName}: XDR element definitions must have unique names.`);
                    definitions.set(name, definition);
                });
            if (!definitions.has("sched")) throw new Error(`${schemaName}: XDR schema does not define <sched>.`);
            return { definitions };
        }

