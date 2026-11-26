        /* CHANGES */
        // Badge zeigt die Anzahl ungespeicherter Dateien (Wert wird in renderFileList berechnet).
        function updateChangeCounter() {
            const unsaved = loadedFiles.filter(file => file.unsaved).length;
            const badge = document.getElementById("changeCounter");
            const notDownloaded = loadedFiles.filter(file => !file.unsaved && needsDownload(file)).length;
            badge.textContent = unsaved ? `${unsaved} unsaved file${unsaved === 1 ? "" : "s"}`
                : notDownloaded ? `${notDownloaded} not downloaded` : "No changes";
            badge.title = notDownloaded ? "Saved files that were not downloaded yet – use Batch Save" : "";
            badge.classList.toggle("has-changes", unsaved > 0 || notDownloaded > 0);
        }

        // storedValue: der tatsaechlich ins XML geschriebene Wert (bei Zahlenfeldern immer in XML-Einheit).
        function registerChange(input, original, storedValue) {
            const key = input.dataset.fieldName;
            const isTextField = input.tagName === 'TEXTAREA' || key === 'note' || key === 'custom_search_tag';
            const cleanVal = storedValue !== undefined
                ? String(storedValue).trim()
                : isTextField ? input.value.trim() : input.value.replace(/\s*(in|mm|cm\/min|A|V|s|°)$/i, "").trim();
            const changed = cleanVal !== String(original || "").trim();
            const fileIndex = parseInt(input.dataset.fileIndex, 10);
            const sectionName = input.dataset.sectionName || lastSelectedSection || "unknown";
            const segmentIndex = input.dataset.segmentIndex || "";
            const fileName = input.dataset.fileName || (loadedFiles[fileIndex] ? loadedFiles[fileIndex].name : "unknown");

            updateChangeLogEntry({
                fileIndex,
                fileName,
                sectionName,
                key,
                segmentIndex,
                oldValue: original || "",
                newValue: cleanVal
            });

            if (!pendingEdit) {
                pendingEdit = { changes: [] };
            }
            const existingChange = pendingEdit.changes.find(c => c.fileIndex === fileIndex && c.sectionName === sectionName && c.key === key && (c.segmentIndex || "") === (segmentIndex || ""));
            if (existingChange) {
                existingChange.newValue = cleanVal;
            } else {
                pendingEdit.changes.push({ fileIndex, fileName, sectionName, key, segmentIndex, oldValue: original || "", newValue: cleanVal });
            }

            if (input.dataset.hasSavedValue !== undefined) updateChangedMarker(input, cleanVal);
            else input.classList.toggle("changed", changed);
        }

        const searchBox = document.getElementById("searchBox");
        const searchClearBtn = document.getElementById("searchClearBtn");
        const searchCount = document.getElementById("searchCount");

        // Durchsucht Parametername und angezeigten Wert jeder Tabellenzeile.
        function rowSearchText(tr) {
            const values = [...tr.querySelectorAll("input, textarea")].map(field => field.value).join(" ");
            return `${tr.innerText} ${values}`.toLowerCase();
        }

        function applyTableSearch() {
            const term = searchBox.value.trim().toLowerCase();
            let matches = 0;
            document.querySelectorAll("#content table tr").forEach(tr => {
                if (tr.parentElement.tagName === "THEAD" || tr.parentElement.tagName === "TFOOT"
                    || tr.firstElementChild?.tagName === "TH" || tr.closest(".segment-overview-table")) return;
                const visible = !term || rowSearchText(tr).includes(term);
                tr.style.display = visible ? "" : "none";
                if (visible) matches++;
            });
            searchClearBtn.hidden = !term;
            searchCount.textContent = term ? `${matches} match${matches === 1 ? "" : "es"}` : "";
        }

        function clearSearch() {
            searchBox.value = "";
            applyTableSearch();
        }

        function focusSearch() {
            searchBox.focus();
            searchBox.select();
        }

        searchBox.oninput = applyTableSearch;
        searchClearBtn.onclick = () => { clearSearch(); searchBox.focus(); };

        window.addEventListener("beforeunload", e => {
            commitPendingEdit();
            if (loadedFiles.some(file => isFileDirty(file) || needsDownload(file))) { e.preventDefault(); e.returnValue = ""; }
        });

        /* ORIGINAL RESTORE INTEGRATION */
        document.getElementById('selectAllBtn').onclick = () => { selectedFiles.clear(); loadedFiles.forEach((f, i) => selectedFiles.add(i)); renderFileList(); updateSelectionStatus(); };
        document.getElementById('clearSelectionBtn').onclick = () => { selectedFiles.clear(); renderFileList(); updateSelectionStatus(); };
        document.getElementById('invertSelectionBtn').onclick = () => {
            recordHistoryAction("Invert file selection", () => {
                const nextSelection = new Set();
                loadedFiles.forEach((file, index) => { if (!selectedFiles.has(index)) nextSelection.add(index); });
                selectedFiles = nextSelection;
                renderFileList();
                updateSelectionStatus();
            });
        };
        document.getElementById('returnBtn').onclick = () => undoLastEdit();
        document.getElementById('redoBtn').onclick = () => redoLastEdit();
        document.getElementById('openFilesBtn').onclick = () => document.getElementById('fileInput').click();
        const helpModal = document.getElementById('helpModal');
        document.getElementById('helpBtn').onclick = () => openModal(helpModal, document.getElementById('helpCloseBtn'));
        document.getElementById('helpCloseBtn').onclick = () => closeModal(helpModal);

        const LOCAL_STORAGE_BACKUP_KEYS = [
            "scheduleSuiteLanguage",
            "hiddenFields",
            "lockedFields",
            "scheduleEditorChangeLog",
            "parameterUnits",
            "importantFields",
            "scheduleEditorCustomHeads",
            "scheduleEditorSidebarState",
            "scheduleEditorBatchSave",
            "scheduleEditorHeatInputTarget",
            "scheduleEditorHeatInputTargets",
            "scheduleEditorWpsRanges",
            "scheduleEditorHeatMargin",
            "scheduleEditorOverviewSeamName",
            "scheduleEditorOverviewPreparedBy",
            "scheduleEditorParameterOrder",
            "scheduleEditorXdrSchemas",
            "scheduleEditorActiveXdr",
            "scheduleEditorLayoutTemplates"
        ];
        // Keys stored as plain text (not JSON).
        const LOCAL_STORAGE_TEXT_KEYS = ["scheduleSuiteLanguage", "scheduleEditorOverviewSeamName", "scheduleEditorOverviewPreparedBy"];
        const localStorageBackupModal = document.getElementById("localStorageBackupModal");
        const localStorageBackupStatus = document.getElementById("localStorageBackupStatus");
        const localStorageBackupFile = document.getElementById("localStorageBackupFile");

        function validateLocalStorageBackup(backup) {
            if (!backup || typeof backup !== "object" || Array.isArray(backup) ||
                backup.format !== "liburdi-schedule-editor-local-storage" || backup.version !== 1 ||
                !backup.data || typeof backup.data !== "object" || Array.isArray(backup.data)) {
                throw new Error("The file is not a valid Schedule Editor backup.");
            }

            for (const [key, value] of Object.entries(backup.data)) {
                if (!LOCAL_STORAGE_BACKUP_KEYS.includes(key)) {
                    throw new Error(`Unknown backup entry: ${key}`);
                }
                const isStringArray = Array.isArray(value) && value.every(item => typeof item === "string");
                const isObject = value !== null && typeof value === "object" && !Array.isArray(value);
                const isStringMap = isObject && Object.values(value).every(item => typeof item === "string");
                const isBooleanMap = isObject && Object.values(value).every(item => typeof item === "boolean");
                const isChangeLog = Array.isArray(value) && value.every(item =>
                    item !== null && typeof item === "object" && !Array.isArray(item)
                );
                const validValue = {
                    hiddenFields: isStringArray,
                    lockedFields: isStringArray,
                    scheduleEditorChangeLog: isChangeLog,
                    parameterUnits: isStringMap,
                    importantFields: isStringArray,
                    scheduleEditorCustomHeads: isStringArray,
                    scheduleEditorSidebarState: isBooleanMap,
                    scheduleEditorBatchSave: isStringMap,
                    scheduleEditorHeatInputTarget: isStringMap,
                    scheduleEditorHeatInputTargets: Array.isArray(value) && value.every(item => item && typeof item === "object" && !Array.isArray(item)),
                    scheduleEditorParameterOrder: isObject && Object.values(value).every(item =>
                        Array.isArray(item) && item.every(entry => typeof entry === "string")),
                    scheduleEditorXdrSchemas: Array.isArray(value) && value.every(item => isXdrRecord(item)
                        && /<Schema\b/.test(item.xml)),
                    scheduleEditorActiveXdr: isObject && typeof value.id === "string",
                    scheduleEditorWpsRanges: isObject && Array.isArray(value.rows),
                    scheduleEditorHeatMargin: isObject,
                    scheduleEditorOverviewSeamName: typeof value === "string",
                    scheduleEditorOverviewPreparedBy: typeof value === "string",
                    scheduleSuiteLanguage: value === "en" || value === "de",
                    scheduleEditorLayoutTemplates: isObject && Object.values(value).every(item => item && typeof item === "object"
                        && typeof item.xml === "string" && typeof item.name === "string")
                }[key];
                if (!validValue) throw new Error(`Invalid data for backup entry: ${key}`);
            }
            return backup.data;
        }

        function openSettings() {
            localStorageBackupStatus.textContent = "";
            renderXdrManager();
            openModal(localStorageBackupModal, document.getElementById("localStorageBackupCloseBtn"));
        }
        document.getElementById("localStorageBackupBtn").onclick = openSettings;
        document.getElementById("localStorageBackupCloseBtn").onclick = () => closeModal(localStorageBackupModal);
        document.getElementById("localStorageBackupExportBtn").onclick = () => {
            try {
                const data = {};
                for (const key of LOCAL_STORAGE_BACKUP_KEYS) {
                    const storedValue = localStorage.getItem(key);
                    if (storedValue === null) continue;
                    data[key] = LOCAL_STORAGE_TEXT_KEYS.includes(key) ? storedValue : JSON.parse(storedValue);
                }
                const backup = {
                    format: "liburdi-schedule-editor-local-storage",
                    version: 1,
                    createdAt: new Date().toISOString(),
                    data
                };
                const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `schedule-editor-local-storage-${new Date().toISOString().slice(0, 10)}.json`;
                link.click();
                window.setTimeout(() => URL.revokeObjectURL(url), 1000);
                localStorageBackupStatus.textContent = "JSON backup downloaded.";
            } catch (error) {
                localStorageBackupStatus.textContent = `Export failed: ${error.message}`;
            }
        };
        document.getElementById("localStorageBackupImportBtn").onclick = () => localStorageBackupFile.click();
        localStorageBackupFile.onchange = async event => {
            const file = event.target.files[0];
            if (!file) return;
            try {
                const backup = JSON.parse(await file.text());
                const data = validateLocalStorageBackup(backup);
                if (!window.confirm("The local editor settings will be replaced by the backup. Continue?")) return;

                const previousValues = LOCAL_STORAGE_BACKUP_KEYS.map(key => [key, localStorage.getItem(key)]);
                try {
                    for (const key of LOCAL_STORAGE_BACKUP_KEYS) {
                        if (Object.prototype.hasOwnProperty.call(data, key)) {
                            localStorage.setItem(key, LOCAL_STORAGE_TEXT_KEYS.includes(key) ? data[key] : JSON.stringify(data[key]));
                        } else {
                            localStorage.removeItem(key);
                        }
                    }
                } catch (error) {
                    for (const [key, value] of previousValues) {
                        if (value === null) localStorage.removeItem(key);
                        else localStorage.setItem(key, value);
                    }
                    throw error;
                }
                window.location.reload();
            } catch (error) {
                localStorageBackupStatus.textContent = `Import failed: ${error.message}`;
            } finally {
                localStorageBackupFile.value = "";
            }
        };

        window.addEventListener("keydown", e => {
            const target = e.target;
            const isTextEntry = target instanceof HTMLTextAreaElement
                || (target instanceof HTMLInputElement && !["checkbox", "radio", "button", "file"].includes(target.type));
            const modalOpen = Boolean(document.querySelector(".modal-overlay.show"));

            if (e.key === "Escape") {
                if (closeTopModal()) { e.preventDefault(); return; }
                if (target === searchBox || (!isTextEntry && searchBox.value)) { e.preventDefault(); clearSearch(); }
                return;
            }
            if (modalOpen) return;
            if (e.key === "/" && !isTextEntry && !e.ctrlKey && !e.metaKey && !e.altKey) {
                e.preventDefault();
                focusSearch();
                return;
            }
            if (!(e.ctrlKey || e.metaKey)) return;

            const key = e.key.toLowerCase();
            if (key === "s") {
                e.preventDefault();
                // Laufende Eingabe abschliessen (onblur schreibt und protokolliert den Wert).
                if (isTextEntry && target !== searchBox) target.blur();
                saveActiveFileChecked();
                return;
            }
            if (key === "f") {
                e.preventDefault();
                focusSearch();
                return;
            }
            // In Text-/Zahlenfeldern bleibt das native Undo des Browsers aktiv.
            if (isTextEntry) return;
            if (e.key.toLowerCase() === "z") {
                e.preventDefault();
                if (e.shiftKey) redoLastEdit();
                else undoLastEdit();
            } else if (e.key.toLowerCase() === "y") {
                e.preventDefault();
                redoLastEdit();
            }
        });

        // Sidebar-Eintraege mit role="button" per Enter/Leertaste bedienbar machen.
        document.getElementById("sidebar").addEventListener("keydown", event => {
            const item = event.target.closest?.('.sidebar-item[role="button"]');
            if (!item || event.target !== item) return;
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                item.click();
            }
        });

        setupSidebarToggles();
        loadSegmentPriorityConfig();

        // Setzt alle geladenen Dateien auf den zuletzt gespeicherten (bzw. geladenen) Stand zurueck.
        function revertToLastSaved() {
            commitPendingEdit();
            if (!loadedFiles.some(isFileDirty)) {
                document.getElementById('status').textContent = 'Nothing to revert.';
                return;
            }
            recordHistoryAction("Revert to last saved", () => {
                const loadedIds = new Set(loadedFiles.map(file => file.id));
                loadedFiles = loadedFiles.map(file => {
                    const xml = file.originalXml.cloneNode(true);
                    return createFileRecord(file.name, xml, file.originalXml, file.id, file.originalXmlString);
                });
                pendingEdit = null;
                changeLog = changeLog.filter(entry => !loadedIds.has(entry.fileId));
                saveChangeLog();
                updateUI();
                document.getElementById('status').textContent = 'All files reverted to the last saved state.';
            });
        }

        document.getElementById('resetChangesBtn').onclick = revertToLastSaved;

