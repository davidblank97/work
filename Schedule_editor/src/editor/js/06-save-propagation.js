        // Uebertraegt einen Wert (ausser Segmente) auf alle weiteren markierten Dateien, sofern die
        // aktive Datei selbst markiert ist. Jede Aenderung landet im Change Log und im Undo-Schritt.
        function propagateValueToSelectedFiles(sectionName, key, value) {
            if (isLocked(key)) return;
            if (sectionName === "segments" || !selectedFiles.has(activeFile)) return;
            let changedFiles = 0;
            selectedFiles.forEach(index => {
                if (index === activeFile) return;
                const file = loadedFiles[index];
                const section = file?.sections[sectionName];
                const node = section ? [...section.children].find(child => child.tagName === key) : null;
                if (!node) return;
                if (!pendingEdit) pendingEdit = { changes: [] };
                let change = pendingEdit.changes.find(c => c.fileIndex === index && c.sectionName === sectionName
                    && c.key === key && !c.segmentIndex);
                if (!change) {
                    if (node.textContent === value) return;
                    change = { fileIndex: index, fileName: file.name, sectionName, key, segmentIndex: "", oldValue: node.textContent, newValue: value };
                    pendingEdit.changes.push(change);
                }
                const previousValue = node.textContent;
                node.textContent = value;
                change.newValue = value;
                updateChangeLogEntry({ fileIndex: index, fileName: file.name, sectionName, key, segmentIndex: "", oldValue: previousValue, newValue: value });
                changedFiles++;
            });
            if (changedFiles) {
                document.getElementById("status").textContent = `${key} also set in ${changedFiles} other selected file(s).`;
            }
        }

        /* EXPORT & SAVE */
        function triggerDownload(filename, blob) {
            const a = document.createElement('a');
            const url = URL.createObjectURL(blob);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.setTimeout(() => URL.revokeObjectURL(url), 1000);
        }

        function ensureXmlExtension(name) {
            return name.toLowerCase().endsWith(".xml") ? name : `${name}.xml`;
        }

        function exportXmlFile(fileName, fileDoc) {
            const blob = new Blob([serializeXml(fileDoc)], { type: "application/xml" });
            triggerDownload(fileName, blob);
        }

        // Der gespeicherte Stand wird zur neuen Vergleichsbasis ("Changed", Markierungen, Revert).
        // Batch Save: Herunterladen = speichern + als heruntergeladen markieren; Eintrag im Change Log.
        function markFilesDownloaded(files) {
            files.forEach(file => {
                const count = isFileDirty(file) ? countChangesSinceSave(file) : 0;
                addSaveLogEntry(file, "Downloaded", `${ensureXmlExtension(file.name)}${count ? ` · ${count} change${count === 1 ? "" : "s"}` : ""}`);
                file.exportedXmlString = serializeXml(file.xml);
            });
            markFilesSaved(files);
        }

        function markFilesSaved(files) {
            files.forEach(file => {
                file.originalXml = file.xml.cloneNode(true);
                file.originalXmlString = serializeXml(file.xml);
            });
            renderFileList();
            refreshCurrentView();
        }

        // Rendert die aktuelle Abschnittsansicht neu (nur wenn gerade ein Abschnitt angezeigt wird).
        function refreshCurrentView() {
            if (activeFile < 0 || !loadedFiles[activeFile]) return;
            if (document.querySelector("#content .file-title-container")) showSection(lastSelectedSection);
        }

        // Zaehlt geaenderte, neue und entfernte Werte gegenueber dem gespeicherten Stand.
        function countChangesSinceSave(file) {
            const before = indexXmlForDiff(file.originalXml);
            const after = indexXmlForDiff(file.xml);
            let count = 0;
            after.forEach((element, key) => {
                const old = before.get(key);
                if (!old) { count++; return; }
                if (!element.children.length && !old.children.length && element.textContent.trim() !== old.textContent.trim()) count++;
                else if ([...element.attributes].some(attribute => old.getAttribute(attribute.name) !== attribute.value)) count++;
            });
            before.forEach((_, key) => { if (!after.has(key)) count++; });
            return count;
        }

        // Einzelne Aenderungen seit dem letzten Speichern (Werte und Attribute, auch neue/entfernte Felder).
        function collectSaveDetails(file) {
            const before = indexXmlForDiff(file.originalXml);
            const after = indexXmlForDiff(file.xml);
            const describe = key => {
                const parts = key.split("/").filter(Boolean).slice(1); // ohne "sched"
                const segmentPart = parts.find(part => part.startsWith("segment["));
                const segmentIndex = segmentPart ? segmentPart.slice(8, -1) : "";
                const section = segmentPart ? "segments" : parts.length > 1 ? parts[0] : "sched";
                const name = (parts[parts.length - 1] || "sched").replace(/#\d+$/, "");
                return { section, key: name, segmentIndex };
            };
            const leaves = map => [...map.entries()].filter(([, element]) => !element.children.length);
            const details = [];
            leaves(after).forEach(([key, element]) => {
                const old = before.get(key);
                const value = element.textContent.trim();
                if (!old) details.push({ ...describe(key), oldValue: "", newValue: value, kind: "added" });
                else if (!old.children.length && old.textContent.trim() !== value) details.push({ ...describe(key), oldValue: old.textContent.trim(), newValue: value, kind: "changed" });
            });
            leaves(before).forEach(([key, element]) => {
                if (!after.has(key)) details.push({ ...describe(key), oldValue: element.textContent.trim(), newValue: "", kind: "removed" });
            });
            after.forEach((element, key) => {
                const old = before.get(key);
                if (!old) return;
                [...new Set([...element.getAttributeNames(), ...old.getAttributeNames()])].forEach(name => {
                    if (element.getAttribute(name) !== old.getAttribute(name)) {
                        details.push({ ...describe(key), key: `${describe(key).key} @${name}`, oldValue: old.getAttribute(name) ?? "", newValue: element.getAttribute(name) ?? "", kind: "changed" });
                    }
                });
            });
            return details;
        }

        // Eintrag "Saved" im Change Log (eigene Zeile je Speichern) mit den einzelnen Aenderungen zum Aufklappen.
        // Die bisherigen Feld-Eintraege der Datei werden diesem Speichern zugeordnet (savedIn).
        function addSaveLogEntry(file, label, detail) {
            const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
            const details = isFileDirty(file) ? collectSaveDetails(file) : [];
            changeLog.forEach(entry => {
                if (entry.fileId === file.id && entry.section !== "save" && !entry.savedIn) entry.savedIn = id;
            });
            changeLog.unshift({
                id,
                details,
                timestamp: new Date().toISOString(),
                fileId: file.id,
                fileIndex: loadedFiles.indexOf(file),
                fileName: file.name,
                section: "save",
                key: label,
                segmentIndex: "",
                oldValue: "",
                newValue: detail
            });
            changeLog = changeLog.slice(0, 200);
            saveChangeLog();
        }

        // Save laedt nicht herunter: speichert alle geaenderten Dateien im Editor und traegt sie im Change Log ein.
        // Herunterladen nur ueber Batch Save.
        function saveActiveFile() {
            commitPendingEdit();
            const status = document.getElementById("status");
            const dirtyFiles = loadedFiles.filter(isFileDirty);
            if (!dirtyFiles.length) {
                const pending = loadedFiles.filter(needsDownload).length;
                status.textContent = pending
                    ? `All files are saved – ${pending} not downloaded yet (Batch Save).`
                    : "No changes to save.";
                return;
            }
            let total = 0;
            dirtyFiles.forEach(file => {
                const count = countChangesSinceSave(file);
                total += count;
                addSaveLogEntry(file, "Saved", `${count} change${count === 1 ? "" : "s"}`);
            });
            markFilesSaved(dirtyFiles);
            status.textContent = `Saved ${dirtyFiles.length} file${dirtyFiles.length === 1 ? "" : "s"} (${total} change${total === 1 ? "" : "s"} logged). Download with Batch Save.`;
        }

        // Entfernt Zeichen, die in Dateinamen nicht erlaubt sind (und Leerzeichen).
        function sanitizeRevisionTag(tag) {
            return String(tag ?? "").replace(/[\\/:*?"<>|\s]/g, "").trim();
        }

        // "Naht_A.xml" + "Rev1" -> "Naht_A_Rev1.xml"; ein vorhandenes "_Rev..."-Suffix wird ersetzt.
        function applyRevisionTag(fileName, tag) {
            const cleanTag = sanitizeRevisionTag(tag);
            if (!cleanTag) return fileName;
            const baseName = ensureXmlExtension(fileName).replace(/\.xml$/i, "");
            const withoutOldTag = /^rev/i.test(cleanTag) ? baseName.replace(/_rev[^_]*$/i, "") : baseName;
            return `${withoutOldTag}_${cleanTag}.xml`;
        }

        function getBatchSaveTargets() {
            const filesToSave = [...selectedFiles].map(index => loadedFiles[index]).filter(Boolean);
            return filesToSave.length ? filesToSave : loadedFiles;
        }

        // download = false: nur umbenennen (Revisions-Tag), nichts herunterladen; Dateien bleiben "Unsaved".
        function saveSelectedFiles(revisionTag = "", download = true) {
            commitPendingEdit();
            let targetFiles = getBatchSaveTargets();

            if (!targetFiles.length) {
                document.getElementById("status").textContent = "Please load at least one file to save.";
                return;
            }

            const cleanTag = sanitizeRevisionTag(revisionTag);
            if (cleanTag) {
                const newNames = targetFiles.map(file => applyRevisionTag(file.name, cleanTag));
                const duplicates = newNames.filter((name, index) => newNames.indexOf(name) !== index);
                if (duplicates.length) {
                    document.getElementById("status").textContent =
                        `Batch save cancelled: duplicate file name(s) ${[...new Set(duplicates)].join(", ")}.`;
                    return;
                }
                if (targetFiles.some((file, index) => file.name !== newNames[index])) {
                    const targetIds = targetFiles.map(file => file.id);
                    recordHistoryAction("Batch save rename", () => {
                        targetFiles.forEach((file, index) => { file.name = newNames[index]; });
                        renderFileList();
                        refreshCurrentView();
                    });
                    // Nach dem Snapshot sind die Datei-Objekte dieselben; sicherheitshalber neu aufloesen.
                    targetFiles = targetIds.map(id => loadedFiles.find(file => file.id === id)).filter(Boolean);
                }
            }

            if (!download) {
                document.getElementById("status").textContent = cleanTag
                    ? `${targetFiles.length} file(s) renamed with tag "${cleanTag}" (not downloaded).`
                    : "Nothing to do: no revision tag and download disabled.";
                return;
            }

            if (window.JSZip && targetFiles.length > 1) {
                const zip = new JSZip();
                targetFiles.forEach(file => zip.file(ensureXmlExtension(file.name), serializeXml(file.xml)));

                zip.generateAsync({ type: "blob" }).then(blob => {
                    const zipName = `schedule_batch_export_${new Date().toISOString().replace(/[:.]/g, "-")}.zip`;
                    triggerDownload(zipName, blob);
                    markFilesDownloaded(targetFiles);
                    document.getElementById("status").textContent = `${targetFiles.length} file(s) saved as ZIP archive.`;
                }).catch(error => {
                    document.getElementById("status").textContent = `Batch save failed: ${error.message}`;
                });
                return;
            }

            targetFiles.forEach(file => exportXmlFile(ensureXmlExtension(file.name), file.xml));
            markFilesDownloaded(targetFiles);
            document.getElementById("status").textContent = `${targetFiles.length} file(s) saved.`;
        }

        /* MODALS */
        function openModal(modal, focusElement) {
            modal.classList.add("show");
            if (focusElement) {
                focusElement.focus();
                if (typeof focusElement.select === "function") focusElement.select();
            }
        }

        function closeModal(modal) {
            modal.classList.remove("show");
        }

        // Schliesst den zuletzt geoeffneten Dialog; gibt true zurueck, wenn einer offen war.
        function closeTopModal() {
            const openModals = [...document.querySelectorAll(".modal-overlay.show")];
            if (!openModals.length) return false;
            closeModal(openModals[openModals.length - 1]);
            return true;
        }

        document.querySelectorAll(".modal-overlay").forEach(overlay => {
            overlay.addEventListener("click", event => {
                if (event.target === overlay) closeModal(overlay);
            });
        });

        function bindEnterToConfirm(input, confirmButton) {
            input.addEventListener("keydown", event => {
                if (event.key === "Enter") {
                    event.preventDefault();
                    confirmButton.click();
                }
            });
        }

        const saveActiveFileChecked = () => saveActiveFile();
        document.getElementById("saveBtn").onclick = saveActiveFileChecked;
        /* BATCH SAVE DIALOG */
        const batchSaveModal = document.getElementById("batchSaveModal");
        const revisionTagInput = document.getElementById("revisionTagInput");
        const batchSavePreview = document.getElementById("batchSavePreview");
        const batchDownloadToggle = document.getElementById("batchDownloadToggle");

        function updateBatchSavePreview() {
            const targets = getBatchSaveTargets();
            const tag = sanitizeRevisionTag(revisionTagInput.value);
            const download = batchDownloadToggle.checked;
            document.getElementById("batchSaveConfirmBtn").textContent = download ? "Save" : "Rename only";
            batchSavePreview.replaceChildren();
            const summary = document.createElement("div");
            summary.textContent = download
                ? `${targets.length} file(s)${targets.length > 1 ? " as ZIP archive" : ""}${tag ? ` with tag "${tag}"` : ""}:`
                : `${targets.length} file(s) renamed only, no download${tag ? ` (tag "${tag}")` : " — enter a tag"}:`;
            batchSavePreview.appendChild(summary);
            targets.slice(0, 3).forEach(file => {
                const line = document.createElement("div");
                line.className = "batch-save-preview-line";
                const newName = applyRevisionTag(file.name, tag);
                line.textContent = newName === file.name ? file.name : `${file.name} → ${newName}`;
                batchSavePreview.appendChild(line);
            });
            if (targets.length > 3) {
                const more = document.createElement("div");
                more.className = "batch-save-preview-line";
                more.textContent = `… and ${targets.length - 3} more`;
                batchSavePreview.appendChild(more);
            }
        }

        function openBatchSaveModal() {
            commitPendingEdit();
            if (!loadedFiles.length) return;
            revisionTagInput.value = readStoredJson("scheduleEditorBatchSave", {}).revisionTag || "";
            batchDownloadToggle.checked = true;
            updateBatchSavePreview();
            openModal(batchSaveModal, revisionTagInput);
        }

        revisionTagInput.oninput = updateBatchSavePreview;
        batchDownloadToggle.onchange = updateBatchSavePreview;
        document.getElementById("batchSaveBtn").onclick = openBatchSaveModal;
        document.getElementById("batchSaveCancelBtn").onclick = () => closeModal(batchSaveModal);
        document.getElementById("batchSaveConfirmBtn").onclick = () => {
            const tag = sanitizeRevisionTag(revisionTagInput.value);
            try {
                localStorage.setItem("scheduleEditorBatchSave", JSON.stringify({ revisionTag: tag }));
            } catch (error) {
                console.warn("Could not store the revision tag.", error);
            }
            closeModal(batchSaveModal);
            const download = batchDownloadToggle.checked;
            if (download) {
                const targets = getBatchSaveTargets();
                confirmHeatInputBeforeSave(targets, () => confirmWpsBeforeSave(targets, () => confirmSchemaBeforeSave(targets, () => saveSelectedFiles(tag, true))));
            }
            else saveSelectedFiles(tag, false);
        };
        bindEnterToConfirm(revisionTagInput, document.getElementById("batchSaveConfirmBtn"));

        const headModal = document.getElementById("headModal");
        const headInput = document.getElementById("headInput");

        function applyHeadParameterPreset(file, head) {
            const preset = HEAD_PARAMETER_PRESETS[head];
            if (!preset) return;

            Object.entries(preset).forEach(([parameter, value]) => {
                if (isLocked(parameter)) return; // gesperrte Werte bleiben unveraendert
                const node = file.xml.querySelector(`global ${parameter}`);
                if (node) node.textContent = value;
            });
        }

        function applyHeadValue(value) {
            recordHistoryAction("Change head", () => {
                if (!DEFAULT_HEADS.includes(value) && !customHeads.includes(value)) {
                    customHeads.push(value);
                    saveCustomHeads();
                }
                const targetFiles = [...selectedFiles].map(index => loadedFiles[index]).filter(Boolean);
                const filesToUpdate = targetFiles.length ? targetFiles : [loadedFiles[activeFile]].filter(Boolean);

                filesToUpdate.forEach(file => {
                    const root = file.xml.querySelector("sched") || file.xml.documentElement;
                    if (root) {
                        root.setAttribute("head", value);
                        applyHeadParameterPreset(file, value);
                    }
                });

                document.getElementById("status").textContent = `Head applied to ${filesToUpdate.length} file(s).`;
                if (activeFile >= 0 && loadedFiles[activeFile]) showSection(lastSelectedSection);
            });
        }

        function openNewHeadModal() {
            headInput.value = "";
            openModal(headModal, headInput);
        }

        document.getElementById("headCancelBtn").onclick = () => closeModal(headModal);
        document.getElementById("headConfirmBtn").onclick = () => {
            const value = headInput.value.trim();
            if (!value) {
                headInput.focus();
                return;
            }
            closeModal(headModal);
            applyHeadValue(value);
        };
        bindEnterToConfirm(headInput, document.getElementById("headConfirmBtn"));


