        // Anzeige: hoechstens 2 Nachkommastellen. Gespeichert wird weiter mit den Stellen der Datei
        // (z. B. 180.000000); geschrieben wird nur, wenn der Nutzer tatsaechlich etwas eingibt.
        const DISPLAY_DECIMALS = 2;
        function displayPlaces(places) {
            return Math.min(Number.isFinite(places) ? places : DISPLAY_DECIMALS, DISPLAY_DECIMALS);
        }

        // Wandelt eine Eingabe wie "12,5 mm" oder "0.125" in eine Zahl um.
        // Akzeptiert Dezimal-Komma; teilweise ungueltige Eingaben (z. B. "12abc") ergeben NaN.
        function parseNumberInput(text) {
            const numericText = String(text ?? "")
                .replace(/\s*(in|mm|cm\/min|A|V|s|°)$/i, "")
                .trim()
                .replace(",", ".");
            if (!/^[-+]?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?$/.test(numericText)) return NaN;
            return Number(numericText);
        }

        function getDecimalPlaces(value) {
            const match = ('' + value).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
            if (!match) { return 0; }
            return Math.max(0, (match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0));
        }

        function toggleImportant(key, refreshCallback) {
            recordHistoryAction("Toggle important field", () => {
                if (importantFields.has(key)) importantFields.delete(key);
                else importantFields.add(key);
                saveImportant();
                refreshCallback();
            });
        }

        // Standardreihenfolge: XML-Reihenfolge; bei Segmenten zuerst die Felder aus segments_sorting.json.
        function defaultParameterOrder(section, keys) {
            if (section !== "segments") return keys;
            const priority = new Map(segmentPriorityOrder.map((key, index) => [key, index]));
            return keys.map((key, index) => ({ key, index }))
                .sort((a, b) => (priority.get(a.key) ?? Infinity) - (priority.get(b.key) ?? Infinity) || a.index - b.index)
                .map(entry => entry.key);
        }

        // Gespeicherte (per Drag & Drop festgelegte) Reihenfolge zuerst, unbekannte Felder danach.
        function orderedParameterKeys(section, keys) {
            const unique = [...new Set(keys)];
            const base = defaultParameterOrder(section, unique);
            const stored = Array.isArray(parameterOrder[section]) ? parameterOrder[section] : null;
            if (!stored) return base;
            const present = new Set(unique);
            const head = stored.filter(key => present.has(key));
            const headSet = new Set(head);
            return [...head, ...base.filter(key => !headSet.has(key))];
        }

        function moveParameter(section, allKeys, key, targetKey, placeAfter, refresh) {
            if (key === targetKey) return false;
            if (isLocked(key)) {
                document.getElementById("status").textContent = `${key} is locked and cannot be moved.`;
                return false;
            }
            const current = orderedParameterKeys(section, allKeys);
            const moved = current.filter(entry => entry !== key);
            const targetIndex = moved.indexOf(targetKey);
            if (targetIndex < 0) return false;
            moved.splice(targetIndex + (placeAfter ? 1 : 0), 0, key);
            // Gesperrte Parameter bleiben an ihrer Position stehen.
            const order = moved.filter(entry => !isLocked(entry));
            current.forEach((entry, index) => { if (isLocked(entry)) order.splice(index, 0, entry); });
            if (order.every((entry, index) => entry === current[index])) return false;
            recordHistoryAction("Move parameter", () => {
                // Felder, die nur in anderen Dateien vorkommen, behalten ihren Eintrag am Ende.
                const previous = Array.isArray(parameterOrder[section]) ? parameterOrder[section] : [];
                const inOrder = new Set(order);
                parameterOrder = { ...parameterOrder, [section]: [...order, ...previous.filter(entry => !inOrder.has(entry))] };
                saveParameterOrder();
                refresh();
            });
            document.getElementById("status").textContent = `${key} moved.`;
            return true;
        }

        function resetParameterOrder(section, refresh) {
            recordHistoryAction("Reset parameter order", () => {
                const next = { ...parameterOrder };
                delete next[section];
                parameterOrder = next;
                saveParameterOrder();
                refresh();
            });
            document.getElementById("status").textContent = "Parameter order reset.";
        }

        function addResetOrderButton(header, section, refresh) {
            if (!Array.isArray(parameterOrder[section])) return;
            header.classList.add("panel-header-with-action");
            const button = document.createElement("button");
            button.type = "button";
            button.className = "btn-secondary panel-header-btn";
            button.textContent = "Reset order";
            button.title = "Restore the default parameter order for this section";
            button.onclick = () => resetParameterOrder(section, refresh);
            header.appendChild(button);
        }

        // Eigenes Ziehen per Pointer-Events (statt HTML5-Drag & Drop): funktioniert in allen Browsern,
        // auch auf Buttons, in eingebetteten Browsern und per Touch. Griff ist der Name oder ⠿.
        let parameterDrag = null;
        function clearParameterDropMarkers() {
            document.querySelectorAll(".param-drop-before, .param-drop-after, .param-dragging")
                .forEach(row => row.classList.remove("param-drop-before", "param-drop-after", "param-dragging"));
            document.body.classList.remove("param-reordering");
        }
        function parameterDropTarget(event) {
            const element = document.elementFromPoint(event.clientX, event.clientY);
            const row = element?.closest("tr[data-param-key]");
            if (!row || row === parameterDrag.row || row.dataset.paramSection !== parameterDrag.section) return null;
            const rect = row.getBoundingClientRect();
            return { row, after: event.clientY > rect.top + rect.height / 2 };
        }
        document.addEventListener("pointermove", event => {
            if (!parameterDrag) return;
            if (!parameterDrag.active) {
                if (Math.hypot(event.clientX - parameterDrag.startX, event.clientY - parameterDrag.startY) < 5) return;
                parameterDrag.active = true;
                parameterDrag.row.classList.add("param-dragging");
                document.body.classList.add("param-reordering");
                window.getSelection()?.removeAllRanges();
            }
            event.preventDefault();
            document.querySelectorAll(".param-drop-before, .param-drop-after")
                .forEach(row => row.classList.remove("param-drop-before", "param-drop-after"));
            const target = parameterDropTarget(event);
            if (target) target.row.classList.add(target.after ? "param-drop-after" : "param-drop-before");
        });
        document.addEventListener("pointerup", event => {
            if (!parameterDrag) return;
            const drag = parameterDrag;
            const target = drag.active ? parameterDropTarget(event) : null;
            parameterDrag = null;
            clearParameterDropMarkers();
            if (!drag.active) return;
            // Den folgenden click (z. B. auf ★) nach dem Ziehen unterdruecken.
            const swallowClick = clickEvent => { clickEvent.stopPropagation(); clickEvent.preventDefault(); };
            window.addEventListener("click", swallowClick, { capture: true, once: true });
            window.setTimeout(() => window.removeEventListener("click", swallowClick, { capture: true }), 0);
            if (target) moveParameter(drag.section, drag.allKeys, drag.key, target.row.dataset.paramKey, target.after, drag.refresh);
        });
        document.addEventListener("pointercancel", () => { parameterDrag = null; clearParameterDropMarkers(); });
        document.addEventListener("keydown", event => {
            if (event.key === "Escape" && parameterDrag) { parameterDrag = null; clearParameterDropMarkers(); }
        });

        function attachParameterReorder(tr, tdName, section, key, allKeys, refresh) {
            tr.dataset.paramKey = key;
            tr.dataset.paramSection = section;
            const handle = document.createElement("button");
            handle.type = "button";
            handle.className = "param-drag-handle";
            handle.textContent = "⠿";
            handle.title = "Drag (or drag the name) to reorder · Alt+↑/↓ moves the row";
            handle.setAttribute("aria-label", `Move ${key} (Alt+Arrow keys)`);
            handle.dataset.key = key;
            if (isLocked(key)) {
                tr.classList.add("param-order-locked");
                handle.title = "Locked – cannot be moved (unlock with 🔒)";
                handle.setAttribute("aria-label", `${key} is locked and cannot be moved`);
            }
            handle.onclick = event => event.stopPropagation();
            handle.ondblclick = event => event.stopPropagation();
            handle.onkeydown = event => {
                if (!event.altKey || (event.key !== "ArrowUp" && event.key !== "ArrowDown")) return;
                event.preventDefault();
                const up = event.key === "ArrowUp";
                if (isLocked(key)) { document.getElementById("status").textContent = `${key} is locked and cannot be moved.`; return; }
                let neighbor = up ? tr.previousElementSibling : tr.nextElementSibling;
                // Ausgeblendete (Suche) und gesperrte Zeilen werden uebersprungen.
                while (neighbor && (neighbor.style.display === "none" || isLocked(neighbor.dataset.paramKey))) neighbor = up ? neighbor.previousElementSibling : neighbor.nextElementSibling;
                if (!neighbor?.dataset.paramKey) return;
                if (moveParameter(section, allKeys, key, neighbor.dataset.paramKey, !up, refresh)) {
                    document.querySelector(`.param-drag-handle[data-key="${CSS.escape(key)}"]`)?.focus();
                }
            };
            // Name oder Griff starten das Ziehen; die Knoepfe ★/🔒/⊘ nicht.
            tdName.addEventListener("pointerdown", event => {
                if (event.button !== 0 || event.target.closest(".param-action-btn")) return;
                if (isLocked(key)) return;
                if (event.pointerType === "mouse") event.preventDefault();
                parameterDrag = { section, key, allKeys, refresh, row: tr, startX: event.clientX, startY: event.clientY, active: false };
            });
            tdName.prepend(handle);
        }

        // Laedt segments_sorting.json, wenn der Editor ueber einen Webserver laeuft.
        // Beim direkten Oeffnen (file://) oder bei Fehlern gilt die eingebaute Standardreihenfolge.
        async function loadSegmentPriorityConfig() {
            let config = SEGMENT_SORTING_CONFIG;
            const sortingUrl = new URL("segments_sorting.json", document.baseURI);
            if (/^https?:$/.test(sortingUrl.protocol) && typeof window.fetch === "function") {
                try {
                    const response = await window.fetch(sortingUrl, { cache: "no-store" });
                    if (response.ok) config = await response.json();
                } catch (error) {
                    console.warn("Could not load segments_sorting.json; using the default order.", error);
                }
            }
            const order = config && config.version === 1
                ? config.segmentPriorityOrder
                : null;
            if (!Array.isArray(order) || !order.every(field => typeof field === "string" && field.trim())) {
                console.warn("Using default segment field order: Invalid segment sorting configuration");
                return;
            }
            segmentPriorityOrder = [...new Set(order.map(field => field.trim()))];
            const columns = config.segmentColumns;
            segmentColumns = Array.isArray(columns) && columns.every(column => Array.isArray(column) && column.every(field => typeof field === "string"))
                ? columns.map(column => column.map(field => field.trim()))
                : [segmentPriorityOrder];

            if (activeFile < 0 || lastSelectedSection !== "segments" || !document.querySelector(".segment-panel")) return;
            const selectedSegment = loadedFiles[activeFile]?.sections.segments[selectedSegmentPosition];
            if (selectedSegment) renderSegment(selectedSegment);
        }

        // Sortiert die geladenen Dateien nach den ersten 4 Zeichen des Namens (z. B. 0303, 0304, ...).
        // Auswahl und aktive Datei werden auf die neuen Positionen umgerechnet.
        function sortLoadedFilesByPrefix() {
            const activeRecord = loadedFiles[activeFile];
            const selectedRecords = new Set([...selectedFiles].map(index => loadedFiles[index]).filter(Boolean));
            // Dateien mit 4-stelliger Nummer zuerst (numerisch), alle anderen danach in Ladereihenfolge.
            const prefix = name => (String(name).match(/^\d{4}/) || [null])[0];
            loadedFiles = loadedFiles
                .map((file, index) => ({ file, index, key: prefix(file.name) }))
                .sort((a, b) => {
                    if (a.key && b.key) return a.key.localeCompare(b.key, undefined, { numeric: true }) || a.index - b.index;
                    if (a.key || b.key) return a.key ? -1 : 1;
                    return a.index - b.index;
                })
                .map(({ file }) => file);
            selectedFiles = new Set(loadedFiles.map((file, index) => selectedRecords.has(file) ? index : -1).filter(index => index >= 0));
            activeFile = activeRecord ? loadedFiles.indexOf(activeRecord) : activeFile;
        }

        /* FILE LOADING */
        document.getElementById("fileInput").addEventListener("change", e => {
            const files = e.target.files;
            if (!files || files.length === 0) return;

            let loadedCounter = 0;
            const targetCount = files.length;
            const currentSelectionStart = loadedFiles.length;
            const failedFiles = [];
            // Laden wird als ein Undo-Schritt erfasst, damit spaetere Undo-Schritte
            // nachgeladene Dateien nicht unbemerkt wieder entfernen.
            commitPendingEdit();
            const beforeSnapshot = createHistorySnapshot();

            const finishLoading = () => {
                loadedCounter++;
                if (loadedCounter !== targetCount) return;
                const successCount = targetCount - failedFiles.length;
                const newRecords = new Set(loadedFiles.slice(currentSelectionStart));
                sortLoadedFilesByPrefix();
                // Aktiv wird die erste neu geladene Datei in sortierter Reihenfolge.
                if (successCount > 0) activeFile = loadedFiles.findIndex(file => newRecords.has(file));
                updateUI();
                pushHistorySnapshot("Load files", beforeSnapshot);
                document.getElementById("status").textContent = failedFiles.length
                    ? `${successCount} of ${targetCount} file(s) loaded. Rejected: ${failedFiles.join("; ")}`
                    : `${successCount} file(s) loaded successfully.`;
                document.getElementById("status").textContent += schemaLoadSummary([...newRecords]);
                offerUpgradeForNewFiles([...newRecords]);
                e.target.value = "";
            };

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const reader = new FileReader();

                reader.onload = () => {
                    const xml = new DOMParser().parseFromString(reader.result, "application/xml");
                    if (xml.querySelector("parsererror")) {
                        failedFiles.push(`${file.name} (not valid XML)`);
                    } else if (xml.documentElement.tagName !== "sched" || !xml.querySelector("segment")) {
                        failedFiles.push(`${file.name} (not a Liburdi schedule)`);
                    } else {
                        loadedFiles.push(createFileRecord(file.name, xml, xml.cloneNode(true)));
                        selectedFiles.add(loadedFiles.length - 1);
                    }
                    finishLoading();
                };
                reader.onerror = () => {
                    failedFiles.push(`${file.name} (read error)`);
                    finishLoading();
                };
                reader.readAsText(file);
            }
        });

        const fileDropZone = document.getElementById("fileDropZone");
        fileDropZone.ondragover = event => {
            event.preventDefault();
            fileDropZone.classList.add("dragover");
        };
        fileDropZone.ondragleave = () => fileDropZone.classList.remove("dragover");
        fileDropZone.ondrop = event => {
            event.preventDefault();
            fileDropZone.classList.remove("dragover");
            const droppedFiles = [...event.dataTransfer.files].filter(file => file.name.toLowerCase().endsWith(".xml"));
            if (!droppedFiles.length) return;
            const input = document.getElementById("fileInput");
            const dataTransfer = new DataTransfer();
            droppedFiles.forEach(file => dataTransfer.items.add(file));
            input.files = dataTransfer.files;
            input.dispatchEvent(new Event("change", { bubbles: true }));
        };

        function updateUI() {
            const batchSaveBtn = document.getElementById("batchSaveBtn");
            const resetBtn = document.getElementById("resetChangesBtn");
            if (loadedFiles.length > 0) {
                if (activeFile < 0 || activeFile >= loadedFiles.length) activeFile = 0;
                renderFileList();
                renderSidebar();
                if (document.getElementById("heatInputBtn").classList.contains("active")) renderHeatTool();
                else showSection(lastSelectedSection);
                document.getElementById("saveBtn").disabled = false;
                batchSaveBtn.disabled = false;
                if (resetBtn) resetBtn.disabled = false;
                updateUndoRedoButtons();
            } else {
                activeFile = -1;
                document.getElementById("fileList").innerHTML = "";
                document.getElementById("sidebarItems").innerHTML = "";
                document.getElementById("saveBtn").disabled = true;
                batchSaveBtn.disabled = true;
                if (resetBtn) resetBtn.disabled = true;
                updateUndoRedoButtons();
                document.getElementById("heatInputBtn").classList.remove("active");
                resetContentToPlaceholder();
            }
            updateSelectionStatus();
        }

        function resetContentToPlaceholder() {
            document.getElementById("content").innerHTML = `
                <div style="text-align: center; margin-top: 80px; color: var(--text-muted);">
                    <h3 style="color: #fff;">No file loaded</h3>
                    <p>Please select one or more Liburdi XML schedule files above to begin.</p>
                </div>
            `;
        }

        function renderFileList() {
            const list = document.getElementById("fileList");
            list.innerHTML = "";
            loadedFiles.forEach((f, i) => {
                const div = document.createElement("div");
                div.className = "sidebar-item" + (i === activeFile ? " active" : "");
                div.setAttribute("role", "button");
                div.tabIndex = 0;
                div.title = f.name;
                div.draggable = true;
                div.ondragstart = event => {
                    draggedFileIndex = i;
                    event.dataTransfer.effectAllowed = "move";
                };
                div.ondragover = event => event.preventDefault();
                div.ondrop = event => {
                    event.preventDefault();
                    if (draggedFileIndex < 0 || draggedFileIndex === i) return;
                    recordHistoryAction("Sort files", () => {
                        const [movedFile] = loadedFiles.splice(draggedFileIndex, 1);
                        loadedFiles.splice(i, 0, movedFile);
                        const remap = index => index === draggedFileIndex ? i : index > draggedFileIndex && index <= i ? index - 1 : index < draggedFileIndex && index >= i ? index + 1 : index;
                        selectedFiles = new Set([...selectedFiles].map(remap));
                        activeFile = remap(activeFile);
                        draggedFileIndex = -1;
                        updateUI();
                    });
                };
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = selectedFiles.has(i);
                checkbox.title = "Include in batch actions";
                checkbox.setAttribute("aria-label", `Select ${f.name}`);
                checkbox.onclick = (e) => { e.stopPropagation(); if (checkbox.checked) selectedFiles.add(i); else selectedFiles.delete(i); updateSelectionStatus(); };
                checkbox.onkeydown = e => e.stopPropagation();
                const textSpan = document.createElement("span");
                textSpan.className = "file-name";
                textSpan.textContent = f.name; textSpan.style.flex = "1";
                div.onclick = () => {
                    commitPendingEdit();
                    activeFile = i;
                    renderFileList();
                    renderSidebar();
                    if (document.getElementById("heatInputBtn").classList.contains("active")) renderHeatTool();
                    else showSection(lastSelectedSection);
                };
                const statusSpan = document.createElement("span");
                const dirty = isFileDirty(f);
                f.unsaved = dirty;
                const pendingDownload = !dirty && needsDownload(f);
                statusSpan.className = "file-status" + (dirty ? " changed" : pendingDownload ? " pending-download" : "");
                statusSpan.textContent = dirty ? "Unsaved" : pendingDownload ? "Saved ↓" : "Saved";
                if (pendingDownload) statusSpan.title = "Saved in the editor, not downloaded yet – use Batch Save to download";
                const delBtn = document.createElement("button");
                delBtn.className = "delete-file-btn"; delBtn.innerHTML = "&times;";
                delBtn.title = "Remove file from the editor";
                delBtn.setAttribute("aria-label", `Remove ${f.name}`);
                delBtn.onkeydown = e => e.stopPropagation();
                delBtn.onclick = (e) => { e.stopPropagation(); removeFile(i); };
                div.appendChild(checkbox); div.appendChild(textSpan);
                const schemaResult = getSchemaResult(f);
                if (schemaResult?.errors) {
                    const schemaBadge = document.createElement("span");
                    schemaBadge.className = "file-schema-badge";
                    schemaBadge.textContent = `! ${schemaResult.errors}`;
                    schemaBadge.title = `${schemaResult.errors} schema error(s) – ${schemaResult.findings.find(finding => finding.severity === "error")?.message || ""}\nDetails: Tools › Schema Check`;
                    schemaBadge.setAttribute("aria-label", `${schemaResult.errors} schema errors`);
                    div.appendChild(schemaBadge);
                }
                div.appendChild(statusSpan); div.appendChild(delBtn);
                list.appendChild(div);
            });
            updateChangeCounter();
            if (typeof refreshUpgradeBanner === "function" && upgradeBannerIds.length) refreshUpgradeBanner();
        }

        function normalizeSelectionIndexes() {
            const nextSelection = new Set();
            loadedFiles.forEach((_, index) => {
                if (selectedFiles.has(index)) nextSelection.add(index);
            });
            selectedFiles = nextSelection;
        }

        function updateSelectionStatus() {
            const count = selectedFiles.size;
            const status = document.getElementById("status");
            const label = loadedFiles.length ? `${count} file(s) selected` : "Ready.";
            if (status) status.textContent = label;
        }

        function removeFile(index) {
            const file = loadedFiles[index];
            const dirty = isFileDirty(file) || needsDownload(file);
            if (dirty && !window.confirm(`"${file.name}" has changes that were not downloaded (Batch Save). Remove it anyway?`)) return;
            recordHistoryAction("Remove file", () => {
                loadedFiles.splice(index, 1);
                normalizeSelectionIndexes();
                if (activeFile === index) activeFile = Math.max(0, index - 1);
                else if (activeFile > index) activeFile--;
                updateUI();
                document.getElementById("status").textContent = "File removed.";
            });
        }

        function renderSidebar() {
            const s = document.getElementById("sidebarItems");
            s.innerHTML = "";
            ["description", "global", "limits", "overrides", "segments"].forEach(sec => {
                const div = document.createElement("div");
                div.className = "sidebar-item" + (sec === lastSelectedSection ? " active" : "");
                div.setAttribute("role", "button");
                div.tabIndex = 0;
                div.textContent = sec.charAt(0).toUpperCase() + sec.slice(1);
                div.onclick = () => showSection(sec);
                s.appendChild(div);
            });
        }

        function injectFileTitleHeader(container) {
            if (activeFile < 0 || activeFile >= loadedFiles.length) return;
            const file = loadedFiles[activeFile];

            const titleWrap = document.createElement("div");
            titleWrap.className = "file-title-container";

            const label = document.createElement("div");
            label.className = "file-title-label";
            label.textContent = "File name";

            const input = document.createElement("input");
            input.type = "text";
            input.className = "file-title-input";
            input.value = file.name;
            let fileNameBeforeEdit = null;

            input.onfocus = () => {
                commitPendingEdit();
                fileNameBeforeEdit = createHistorySnapshot();
            };

            input.oninput = () => {
                let currentVal = input.value.trim();
                if (currentVal !== "") {
                    file.name = currentVal;
                    const fileItems = document.querySelectorAll("#fileList .sidebar-item");
                    if (fileItems[activeFile]) {
                        fileItems[activeFile].querySelector(".file-name").textContent = currentVal;
                    }
                }
            };

            input.onblur = () => {
                if (input.value.trim() === "") {
                    input.value = file.name;
                } else if (!input.value.toLowerCase().endsWith(".xml")) {
                    input.value += ".xml";
                    file.name = input.value;
                    renderFileList();
                }
                if (fileNameBeforeEdit) {
                    pushHistorySnapshot("Rename file", fileNameBeforeEdit);
                    fileNameBeforeEdit = null;
                }
            };

            const titleMain = document.createElement("div");
            titleMain.className = "file-title-main";
            titleMain.append(label, input);
            titleWrap.appendChild(titleMain);

            const root = file.xml.querySelector("sched") || file.xml.documentElement;
            const currentHead = root ? root.getAttribute("head") || "" : "";
            const headWrap = document.createElement("div");
            headWrap.className = "head-selector";
            const headLabel = document.createElement("div");
            headLabel.className = "head-selector-label";
            headLabel.textContent = "Head";
            headWrap.appendChild(headLabel);

            getHeadOptions(currentHead).forEach(head => {
                const headButton = document.createElement("button");
                headButton.type = "button";
                headButton.className = "head-option-btn" + (head === currentHead ? " selected" : "");
                headButton.textContent = head;
                headButton.onclick = () => applyHeadValue(head);
                headWrap.appendChild(headButton);
            });

            const newHeadButton = document.createElement("button");
            newHeadButton.type = "button";
            newHeadButton.className = "head-option-btn btn-secondary";
            newHeadButton.textContent = "Add new head...";
            newHeadButton.onclick = openNewHeadModal;
            headWrap.appendChild(newHeadButton);
            titleWrap.appendChild(headWrap);
            container.appendChild(titleWrap);
        }

        function showSection(name) {
            commitPendingEdit();
            lastSelectedSection = name;
            document.getElementById("heatInputBtn").classList.remove("active");
            document.getElementById("schemaCheckBtn")?.classList.remove("active");
            document.querySelectorAll("#sidebarItems .sidebar-item").forEach(el => el.classList.remove("active"));

            const sectionItems = document.querySelectorAll("#sidebarItems .sidebar-item");
            const secNames = ["description", "global", "limits", "overrides", "segments"];
            const targetIdx = secNames.indexOf(name);
            if (sectionItems[targetIdx]) sectionItems[targetIdx].classList.add("active");

            if (activeFile < 0 || activeFile >= loadedFiles.length) return;
            const file = loadedFiles[activeFile];
            const content = document.getElementById("content");
            content.innerHTML = "";

            injectFileTitleHeader(content);

            if (name === "segments") { renderSegmentList(file); return; }
            const node = file.sections[name];
            if (!node) {
                const errMsg = document.createElement("p");
                errMsg.textContent = "Section not available.";
                content.appendChild(errMsg);
                return;
            }
            renderPanel(name.charAt(0).toUpperCase() + name.slice(1), node);
        }

        // Wert desselben Parameters im zuletzt gespeicherten (bzw. geladenen) Stand der aktiven Datei.
        function getSavedValue(sectionName, segmentIndex, key) {
            const file = loadedFiles[activeFile];
            if (!file) return null;
            const parent = sectionName === "segments"
                ? [...file.originalXml.querySelectorAll("segment")].find(segment => segment.getAttribute("index") === segmentIndex)
                : file.originalXml.querySelector(sectionName);
            const node = parent ? [...parent.children].find(child => child.tagName === key) : null;
            return node ? node.textContent : null;
        }

        // Markiert ein Feld als geaendert, wenn es vom gespeicherten Stand abweicht; Tooltip zeigt den alten Wert.
        function updateChangedMarker(input, currentValue) {
            const hasSavedValue = input.dataset.hasSavedValue === "1";
            const savedValue = input.dataset.savedValue || "";
            const changed = !hasSavedValue || String(currentValue ?? "").trim() !== savedValue.trim();
            input.classList.toggle("changed", changed);
            if (!changed) {
                input.removeAttribute("title");
            } else if (!hasSavedValue) {
                input.title = "New value (not in the last saved file)";
            } else {
                const key = input.dataset.fieldName;
                const shown = input.tagName === "TEXTAREA"
                    ? (savedValue.length > 200 ? `${savedValue.slice(0, 200)}…` : savedValue || "(empty)")
                    : formatComparisonValue(key, savedValue);
                input.title = `Last saved: ${shown}`;
            }
        }

        function buildParamNameCell(key, refresh) {
            const td = document.createElement("td");
            td.className = "param-name-cell";
            const isImportant = importantFields.has(key);
            if (isImportant) td.classList.add("important-name");

            const name = document.createElement("span");
            name.className = "param-name";
            name.textContent = key;
            name.title = `${key}\nDouble-click: mark as important · Right-click: hide`;
            td.appendChild(name);

            const hideField = () => recordHistoryAction("Hide field", () => {
                hiddenFields.add(key);
                saveHidden();
                refresh();
            });
            td.ondblclick = () => toggleImportant(key, refresh);
            td.oncontextmenu = event => { event.preventDefault(); hideField(); };

            const actions = document.createElement("span");
            actions.className = "param-actions";
            const starButton = document.createElement("button");
            starButton.type = "button";
            starButton.className = "param-action-btn" + (isImportant ? " is-important" : "");
            starButton.textContent = isImportant ? "★" : "☆";
            starButton.title = isImportant ? "Unmark as important" : "Mark as important";
            starButton.setAttribute("aria-label", `${starButton.title}: ${key}`);
            starButton.onclick = event => { event.stopPropagation(); toggleImportant(key, refresh); };
            const hideButton = document.createElement("button");
            hideButton.type = "button";
            hideButton.className = "param-action-btn";
            hideButton.textContent = "⊘";
            hideButton.title = "Hide parameter (restore via Tools › Hidden Parameters)";
            hideButton.setAttribute("aria-label", `Hide ${key}`);
            hideButton.onclick = event => { event.stopPropagation(); hideField(); };
            const locked = isLocked(key);
            const lockButton = document.createElement("button");
            lockButton.type = "button";
            lockButton.className = "param-action-btn param-lock-btn" + (locked ? " is-locked" : "");
            lockButton.textContent = locked ? "🔒" : "🔓";
            lockButton.title = locked ? "Unlock parameter (allow editing)" : "Lock parameter (protect against changes)";
            lockButton.setAttribute("aria-label", `${locked ? "Unlock" : "Lock"} ${key}`);
            lockButton.setAttribute("aria-pressed", String(locked));
            lockButton.onclick = event => {
                event.stopPropagation();
                recordHistoryAction(locked ? "Unlock field" : "Lock field", () => {
                    if (locked) lockedFields.delete(key);
                    else lockedFields.add(key);
                    saveLocked();
                    refresh();
                });
                document.getElementById("status").textContent = locked ? `${key} unlocked.` : `${key} locked against changes.`;
            };
            actions.append(starButton, lockButton, hideButton);
            td.appendChild(actions);
            return td;
        }

