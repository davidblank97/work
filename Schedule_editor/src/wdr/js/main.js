        let wdrSelectedFiles = [];

        const dropZone = document.getElementById('drop-zone');
        const fileInput = document.getElementById('file-input');
        const folderInput = document.getElementById('folder-input');
        const browseFiles = document.getElementById('browse-files');
        const browseFolder = document.getElementById('browse-folder');
        const clearSelectionBtn = document.getElementById('clear-selection');
        const fileCountLabel = document.getElementById('file-count-label');
        const fileListbox = document.getElementById('file-listbox');
        const convertBtn = document.getElementById('convert-btn');

        const progressContainer = document.getElementById('progress-container');
        const progressBarFill = document.getElementById('progress-bar-fill');
        const progressStatus = document.getElementById('progress-status');
        const progressPercent = document.getElementById('progress-percent');

        const downloadContainer = document.getElementById('download-container');
        const downloadBtn = document.getElementById('download-btn');
        const downloadInfo = document.getElementById('download-info');

        /* Einstellungen der Heat-Input-Auswertung (bleiben im Browser gespeichert) */
        const WDR_SETTINGS_KEY = 'wdrEvaluationSettings';
        const evaluationPanel = document.getElementById('evaluation-panel');
        const evalInput = id => document.getElementById(id);

        function readEvaluationSettings() {
            const number = (id, fallback) => {
                const value = Number(String(evalInput(id).value).replace(',', '.'));
                return Number.isFinite(value) && value > 0 ? value : fallback;
            };
            return {
                processFactor: number('eval-factor', WDR_DEFAULT_SETTINGS.processFactor),
                periodSeconds: number('eval-period', WDR_DEFAULT_SETTINGS.periodSeconds),
                wireDiameter: number('eval-wire-diameter', WDR_DEFAULT_SETTINGS.wireDiameter),
                wireDensity: number('eval-wire-density', WDR_DEFAULT_SETTINGS.wireDensity),
                summary: evalInput('eval-summary').checked,
                useTargets: evalInput('eval-targets').checked,
                rawSheet: evalInput('eval-raw').checked
            };
        }

        function applyEvaluationSettings(settings) {
            evalInput('eval-factor').value = settings.processFactor;
            evalInput('eval-period').value = settings.periodSeconds;
            evalInput('eval-wire-diameter').value = settings.wireDiameter;
            evalInput('eval-wire-density').value = settings.wireDensity;
            evalInput('eval-summary').checked = settings.summary !== false;
            evalInput('eval-targets').checked = settings.useTargets !== false;
            evalInput('eval-raw').checked = settings.rawSheet === true;
        }

        function selectedFormat() {
            return document.querySelector('input[name="format"]:checked')?.value || 'evaluation';
        }

        function updateEvaluationPanel() {
            evaluationPanel.classList.toggle('is-inactive', selectedFormat() !== 'evaluation');
            let targets = [];
            try { targets = JSON.parse(localStorage.getItem('scheduleEditorHeatInputTargets') || '[]'); } catch (error) { targets = []; }
            const count = Array.isArray(targets) ? targets.filter(item => item && (String(item.min ?? '').trim() !== '' || String(item.max ?? '').trim() !== '')).length : 0;
            evalInput('eval-targets-info').textContent = count
                ? `${count} target range${count === 1 ? '' : 's'} found in the Schedule Editor (Tools › Heat Input). Ranges are matched by the 4-digit schedule number; the per-period MIN/MAX is checked.`
                : 'No target ranges set in the Schedule Editor (Tools › Heat Input) – the beads are not checked.';
        }

        try {
            const stored = JSON.parse(localStorage.getItem(WDR_SETTINGS_KEY) || 'null');
            if (stored && typeof stored === 'object') applyEvaluationSettings({ ...WDR_DEFAULT_SETTINGS, ...stored });
        } catch (error) { /* gespeicherte Einstellungen ignorieren */ }
        document.querySelectorAll('#evaluation-panel input, input[name="format"]').forEach(input => {
            input.addEventListener('change', () => {
                try { localStorage.setItem(WDR_SETTINGS_KEY, JSON.stringify(readEvaluationSettings())); } catch (error) { /* ohne Speicher weiter */ }
                updateEvaluationPanel();
            });
        });
        window.addEventListener('focus', updateEvaluationPanel);
        updateEvaluationPanel();

        const zipFileOptions = { compression: "STORE" };
        // Fallback without folder access: the ZIP is split into parts of max. ~400 MB
        // so browser memory does not overflow with many large files.
        const MAX_ZIP_BYTES = 400 * 1024 * 1024;

        let latestZipBlob = null;
        let latestZipName = 'Excel_Converted.zip';

        function isCsvFile(name) {
            return name.toLowerCase().endsWith('.csv');
        }

        function isXmlFile(name) {
            return name.toLowerCase().endsWith('.xml');
        }

        function getOutputPath(file) {
            const relativePath = file.webkitRelativePath || file.name || '';
            const normalized = relativePath.replace(/\\/g, '/');
            if (!normalized) return 'converted.xlsx';
            if (isCsvFile(normalized)) {
                return normalized.replace(/\.csv$/i, '.xlsx');
            }
            return normalized;
        }

        // Button event listeners
        browseFiles.addEventListener('click', (e) => {
            e.stopPropagation();
            fileInput.click();
        });

        browseFolder.addEventListener('click', (e) => {
            e.stopPropagation();
            folderInput.click();
        });

        clearSelectionBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            wdrSelectedFiles = [];
            fileCountLabel.textContent = "No files selected";
            fileListbox.innerHTML = '';
            fileListbox.style.display = 'none';
            convertBtn.disabled = true;
            progressContainer.style.display = 'none';
            downloadContainer.style.display = 'none';
            latestZipBlob = null;
            updateProgressBar(0, 0);
        });

        // Clicking the neutral drop zone area opens the file dialog
        dropZone.addEventListener('click', (e) => {
            if (e.target === dropZone || e.target.tagName === 'P' || e.target === fileCountLabel) {
                fileInput.click();
            }
        });

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-over');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('drag-over');
        });

        // Recursive drag & drop for folder structures
        dropZone.addEventListener('drop', async (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');

            const items = e.dataTransfer.items;
            if (!items) return;

            let fileEntries = [];

            async function traverseFileTree(item, path = "") {
                if (item.isFile) {
                    if (isCsvFile(item.name) || isXmlFile(item.name)) {
                        const file = await new Promise((resolve) => item.file(resolve));
                        Object.defineProperty(file, 'webkitRelativePath', {
                            value: path + item.name,
                            writable: false,
                            configurable: true
                        });
                        fileEntries.push(file);
                    }
                } else if (item.isDirectory) {
                    const dirReader = item.createReader();

                    // Read ALL entries of a directory (readEntries returns them in chunks)
                    const readAllEntries = async (reader) => {
                        let allEntries = [];
                        let read = async () => {
                            let results = await new Promise((resolve) => reader.readEntries(resolve));
                            if (results.length > 0) {
                                allEntries = allEntries.concat(results);
                                await read();
                            }
                        };
                        await read();
                        return allEntries;
                    };

                    const entries = await readAllEntries(dirReader);
                    for (let entry of entries) {
                        await traverseFileTree(entry, path + item.name + "/");
                    }
                }
            }

            const promises = [];
            for (let i = 0; i < items.length; i++) {
                if (items[i].kind === 'file') {
                    const item = items[i].webkitGetAsEntry();
                    if (item) {
                        promises.push(traverseFileTree(item));
                    }
                }
            }

            await Promise.all(promises);
            addFiles(fileEntries, true);
        });

        fileInput.addEventListener('change', (e) => {
            const validFiles = Array.from(e.target.files).filter(file => isCsvFile(file.name) || isXmlFile(file.name));
            e.target.value = '';
            addFiles(validFiles, true);
        });

        folderInput.addEventListener('change', (e) => {
            const validFiles = Array.from(e.target.files).filter(file => isCsvFile(file.name) || isXmlFile(file.name));
            e.target.value = '';
            addFiles(validFiles, true);
        });

        function normalizeFileKey(file) {
            return (file.webkitRelativePath || file.name || '').toLowerCase();
        }

        function addFiles(newFiles, append) {
            const validFiles = Array.from(newFiles || [])
                .filter(file => file && file.name && (isCsvFile(file.name) || isXmlFile(file.name)));

            if (validFiles.length === 0) {
                alert("No valid .csv or .xml files were found in the selection.");
                return;
            }

            // Reset download area on new selection
            downloadContainer.style.display = 'none';
            latestZipBlob = null;

            // append=true adds the new files to the existing selection
            const combined = append ? [...wdrSelectedFiles, ...validFiles] : [...validFiles];

            const uniqueMap = new Map();
            combined.forEach(file => uniqueMap.set(normalizeFileKey(file), file));
            wdrSelectedFiles = [...uniqueMap.values()].sort((a, b) => {
                const aName = (a.webkitRelativePath || a.name || '').toLowerCase();
                const bName = (b.webkitRelativePath || b.name || '').toLowerCase();
                return aName.localeCompare(bName);
            });

            fileCountLabel.textContent = `${wdrSelectedFiles.length} file(s) loaded`;
            fileListbox.innerHTML = '';
            fileListbox.style.display = 'block';

            wdrSelectedFiles.forEach(file => {
                const item = document.createElement('div');
                item.className = 'file-item';
                item.textContent = file.webkitRelativePath ? file.webkitRelativePath : file.name;
                fileListbox.appendChild(item);
            });

            convertBtn.disabled = false;
            progressContainer.style.display = 'none';
            updateProgressBar(0, wdrSelectedFiles.length);
        }

        function updateProgressBar(current, total) {
            const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
            progressBarFill.style.width = `${percentage}%`;
            progressPercent.textContent = `${percentage}%`;
            progressStatus.textContent = `Processing file ${current} of ${total}...`;
        }

        downloadBtn.addEventListener('click', () => {
            if (!latestZipBlob) {
                alert("No ZIP file available. Please run the conversion first.");
                return;
            }
            downloadBlob(latestZipName, latestZipBlob);
        });

        function downloadBlob(filename, blob) {
            if (window.saveAs) {
                window.saveAs(blob, filename);
                return;
            }

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            setTimeout(() => {
                link.remove();
                URL.revokeObjectURL(url);
            }, 60000);
        }

        // Writes a file (incl. subfolders from the relative path) directly into the chosen target folder
        async function writeToDirectory(rootHandle, relativePath, data) {
            const parts = relativePath.split('/').filter(Boolean);
            const fileName = parts.pop();
            let dir = rootHandle;
            for (const part of parts) {
                dir = await dir.getDirectoryHandle(part, { create: true });
            }
            const fileHandle = await dir.getFileHandle(fileName, { create: true });
            const writable = await fileHandle.createWritable();
            await writable.write(data);
            await writable.close();
        }

        function parseCsv(csvText) {
            const lines = csvText.split(/\r?\n/);
            const matrix = [];

            const parseLine = (line) => {
                const result = [];
                let current = '';
                let inQuotes = false;

                for (let i = 0; i < line.length; i++) {
                    const char = line[i];
                    const next = line[i + 1];

                    if (char === '"') {
                        if (inQuotes && next === '"') {
                            current += '"';
                            i++;
                        } else {
                            inQuotes = !inQuotes;
                        }
                    } else if ((char === ';' || char === ',') && !inQuotes) {
                        result.push(current.trim());
                        current = '';
                    } else {
                        current += char;
                    }
                }

                result.push(current.trim());
                return result;
            };

            lines.forEach(line => {
                if (line.trim() === '') return;

                const row = parseLine(line);
                if (row.some(cell => cell !== '')) {
                    matrix.push(row);
                }
            });

            return matrix;
        }

        // Store numbers as real Excel numbers (smaller file, directly usable in Excel).
        // Values with a leading zero (e.g. "0404") and date/time values stay text.
        const numberPattern = /^[-+]?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?$/;
        function toCellValue(cell) {
            if (cell !== '' && numberPattern.test(cell) && !/^[-+]?0\d/.test(cell)) {
                return Number(cell);
            }
            return cell;
        }

        function convertCsvToXlsx(csvText) {
            const matrix = parseCsv(csvText);
            if (matrix.length === 0) return null;

            const typed = matrix.map(row => row.map(toCellValue));
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.aoa_to_sheet(typed);
            XLSX.utils.book_append_sheet(wb, ws, "Data");
            return XLSX.write(wb, { bookType: 'xlsx', type: 'array', compression: true });
        }

        const nextFrame = () => new Promise(resolve => setTimeout(resolve, 0));

        convertBtn.addEventListener('click', async () => {
            if (wdrSelectedFiles.length === 0) {
                alert("Error: no CSV/XML files selected.");
                return;
            }

            // Choose the target folder right on click (browsers only allow this directly after a user action).
            // Each Excel file is written there immediately -> no huge ZIP in memory.
            let targetDir = null;
            if (window.showDirectoryPicker) {
                try {
                    targetDir = await window.showDirectoryPicker({ id: 'wdr-output', mode: 'readwrite' });
                } catch (err) {
                    if (err && err.name === 'AbortError') return; // user cancelled
                    console.warn('Folder selection not available, falling back to ZIP download:', err);
                    targetDir = null;
                }
            }

            convertBtn.disabled = true;
            downloadContainer.style.display = 'none';
            progressContainer.style.display = 'block';

            const total = wdrSelectedFiles.length;
            const failed = [];
            const notEvaluated = [];
            const outOfRange = [];
            const summaryEntries = [];
            const evaluate = selectedFormat() === 'evaluation';
            const settings = evaluate ? readEvaluationSettings() : null;
            let successCount = 0;
            let zip = null;
            let zipBytes = 0;
            let zipPart = 0;

            const storeOutput = async (outPath, data) => {
                const size = data.size ?? data.byteLength ?? 0;
                if (targetDir) {
                    await writeToDirectory(targetDir, outPath, data);
                    return;
                }
                if (zip && zipBytes + size > MAX_ZIP_BYTES) {
                    await flushZip();
                }
                if (!zip) zip = new JSZip();
                zip.file(outPath, data, zipFileOptions);
                zipBytes += size;
            };

            const flushZip = async () => {
                if (!zip || zipBytes === 0) return;
                zipPart++;
                progressStatus.textContent = `Creating ZIP part ${zipPart}...`;
                await nextFrame();
                const blob = await zip.generateAsync({ type: "blob", compression: "STORE" });
                const name = `Excel_Converted_Part${zipPart}.zip`;
                latestZipBlob = blob;
                latestZipName = name;
                downloadBlob(name, blob);
                zip = null;
                zipBytes = 0;
            };

            try {
                for (let i = 0; i < total; i++) {
                    const file = wdrSelectedFiles[i];
                    updateProgressBar(i, total);
                    progressStatus.textContent = `File ${i + 1} of ${total}: ${file.name}`;
                    await nextFrame(); // let the progress display repaint

                    try {
                        let outPath = getOutputPath(file);
                        let data;

                        if (isXmlFile(file.name)) {
                            // XML files are copied unchanged
                            data = new Uint8Array(await file.arrayBuffer());
                        } else if (evaluate) {
                            const text = await file.text();
                            let log = null;
                            let evaluation = null;
                            try {
                                log = parseLiburdiLog(text);
                                evaluation = evaluateHeatInput(log, settings);
                            } catch (error) {
                                notEvaluated.push(`${file.name}: ${error.message}`);
                            }
                            if (evaluation) {
                                const schedule = log.header.SCHEDULE || '';
                                const target = settings.useTargets ? wdrTargetsForSchedule(schedule) : null;
                                data = await buildEvaluationWorkbook(file.name, text, log, evaluation, target, async message => {
                                    progressStatus.textContent = `File ${i + 1} of ${total}: ${file.name} – ${message}`;
                                    await nextFrame();
                                });
                                outPath = outPath.replace(/\.xlsx$/i, '_heat-input.xlsx');
                                const entry = {
                                    fileName: file.name, schedule, date: log.header.DATE || '',
                                    pass: wdrPassType(schedule) !== 'Other' ? wdrPassType(schedule) : wdrPassType(file.name),
                                    bead: wdrBeadId(file.name, schedule),
                                    evaluation: { result: evaluation.result }, // ohne Spalten (Speicher)
                                    target
                                };
                                summaryEntries.push(entry);
                                if (wdrTargetStatus(entry.evaluation, target).ok === false) outOfRange.push(file.name);
                            } else {
                                data = convertCsvToXlsx(text); // kein Liburdi-Log: Rohdaten wie bisher
                            }
                            if (!data) {
                                failed.push(file.name);
                                continue;
                            }
                        } else {
                            data = convertCsvToXlsx(await file.text());
                            if (!data) {
                                failed.push(file.name);
                                continue;
                            }
                        }

                        await storeOutput(outPath, data);
                        successCount++;
                    } catch (err) {
                        console.error(`Error in file ${file.name}:`, err);
                        failed.push(file.name);
                    }
                }

                let summaryName = '';
                if (evaluate && settings.summary && summaryEntries.length) {
                    progressStatus.textContent = 'Creating summary workbook...';
                    await nextFrame();
                    try {
                        summaryName = `Heat_input_summary_${new Date().toISOString().slice(0, 10)}.xlsx`;
                        await storeOutput(summaryName, await buildSummaryWorkbook(summaryEntries, settings));
                    } catch (err) {
                        console.error('Error in summary workbook:', err);
                        failed.push(`Summary workbook: ${err.message}`);
                        summaryName = '';
                    }
                }

                if (!targetDir) await flushZip();

                updateProgressBar(total, total);
                const listText = (title, items) => items.length
                    ? `\n\n${title} (${items.length}):\n${items.slice(0, 15).join('\n')}${items.length > 15 ? '\n...' : ''}`
                    : '';
                const failedText = listText('Failed', failed)
                    + listText('Heat input evaluation not possible, raw data written', notEvaluated)
                    + listText('Heat input outside the target range', outOfRange)
                    + (summaryName ? `\n\nSummary: ${summaryName}` : '');

                if (successCount === 0) {
                    progressStatus.textContent = "Conversion failed.";
                    alert("No files could be processed. Please check that the CSV files contain data." + failedText);
                } else if (targetDir) {
                    progressStatus.textContent = `Done: ${successCount} of ${total} files saved in "${targetDir.name}".`;
                    alert(`Process completed!\n\n${successCount} of ${total} files were saved in the folder "${targetDir.name}".` + failedText);
                } else {
                    progressStatus.textContent = "Conversion completed successfully!";
                    downloadInfo.textContent = zipPart > 1
                        ? `${successCount} of ${total} files were downloaded in ${zipPart} ZIP parts. If the browser asks, allow multiple downloads. The button downloads the last part again.`
                        : `ZIP archive with ${successCount} of ${total} files was created. If the download did not start automatically, click the button.`;
                    downloadContainer.style.display = 'block';
                    alert(`Process completed!\n\nSuccessfully processed: ${successCount} of ${total} files in ${zipPart} ZIP file(s).` + failedText);
                }
            } finally {
                convertBtn.disabled = false;
            }
        });
