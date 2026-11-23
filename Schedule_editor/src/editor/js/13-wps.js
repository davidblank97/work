        /* WPS IMPORT (digital PDF) + WPS CHECK */
        // Liest die Parametertabelle einer WPS (digitale PDF, Textebene ueber pdf.js – kein OCR) und
        // speichert je Lage die Bereiche fuer Strom, Spannung, Vorschub, Draht und Heat Input.
        // Der Heat-Input-Bereich wird als Ziel-Bereich (source "wps") uebernommen; "WPS Check" prueft
        // alle Segmente der geladenen Dateien gegen die Bereiche.
        const WPS_STORE_KEY = "scheduleEditorWpsRanges";
        const WPS_PASS_TYPES = ["Root", "Hot pass", "Fill", "Comp", "Cap", "Other"];
        // Felder mit Ziel-Einheit und Umrechnung (Faktor auf die Ziel-Einheit) je erkannter Einheit.
        const WPS_FIELDS = {
            current: { label: "Current", unit: "A", units: {} },
            voltage: { label: "Voltage", unit: "V", units: {} },
            travel: { label: "Travel speed", unit: "mm/min", units: { "mm/min": 1, "cm/min": 10, "m/min": 1000, "mm/s": 60, "cm/s": 600, "in/min": 25.4, "ipm": 25.4 } },
            wire: { label: "Wire feed", unit: "m/min", units: { "m/min": 1, "cm/min": 0.01, "mm/min": 0.001, "mm/s": 0.06, "in/min": 0.0254, "ipm": 0.0254 } },
            heat: { label: "Heat input", unit: "kJ/mm", units: { "kj/mm": 1, "kj/cm": 0.1, "j/mm": 0.001, "kj/in": 1 / 25.4 } }
        };
        const WPS_FIELD_KEYS = ["current", "voltage", "travel", "wire", "heat"];
        let wpsDraft = null;          // eingelesene, noch nicht uebernommene WPS
        let pdfJsPromise = null;

        function readWpsStore() {
            const stored = readStoredJson(WPS_STORE_KEY, null);
            if (!stored || typeof stored !== "object" || !Array.isArray(stored.rows)) return null;
            return { ...stored, checkMode: stored.checkMode === "mean" ? "mean" : "separate", rows: stored.rows.map(normalizeWpsRow) };
        }

        function saveWpsStore(store) {
            try { localStorage.setItem(WPS_STORE_KEY, JSON.stringify(store)); } catch (error) { console.warn("Could not store the WPS ranges.", error); }
        }

        function normalizeWpsRow(row) {
            const range = value => ({
                min: Number.isFinite(value?.min) ? value.min : null,
                max: Number.isFinite(value?.max) ? value.max : null
            });
            const result = {
                label: String(row?.label ?? ""),
                passType: WPS_PASS_TYPES.includes(row?.passType) ? row.passType : "Other",
                files: Array.isArray(row?.files) ? row.files.map(String) : []
            };
            WPS_FIELD_KEYS.forEach(key => { result[key] = range(row?.[key]); });
            return result;
        }

        // pdf.js aus dem eingebetteten Text starten (einmalig). Der Worker-Code laeuft im Haupt-Thread
        // (globalThis.pdfjsWorker), damit es offline und auch ueber file:// funktioniert.
        function loadPdfJs() {
            if (!pdfJsPromise) {
                pdfJsPromise = new Promise((resolve, reject) => {
                    try {
                        ["pdfjs-worker", "pdfjs"].forEach(name => {
                            const block = document.querySelector(`script[type="text/x-library"][data-library="${name}"]`);
                            if (!block) throw new Error(`Library ${name} is missing.`);
                            const script = document.createElement("script");
                            script.textContent = block.textContent;
                            document.head.appendChild(script);
                        });
                        const lib = window.pdfjsLib || window["pdfjs-dist/build/pdf"];
                        if (!lib || !globalThis.pdfjsWorker) throw new Error("pdf.js could not be started.");
                        resolve(lib);
                    } catch (error) {
                        pdfJsPromise = null;
                        reject(error);
                    }
                });
            }
            return pdfJsPromise;
        }

        // Textzeilen einer PDF: Textstuecke mit gleicher Hoehe (y) je Seite, nach x sortiert.
        async function readWpsPdf(file) {
            const lib = await loadPdfJs();
            const data = new Uint8Array(await file.arrayBuffer());
            const pdf = await lib.getDocument({ data, isEvalSupported: false, useSystemFonts: false }).promise;
            const lines = [];
            for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
                const page = await pdf.getPage(pageNumber);
                const content = await page.getTextContent();
                const items = content.items
                    .filter(item => item.str && item.str.trim() !== "")
                    .map(item => ({ str: item.str.trim(), x: item.transform[4], y: item.transform[5], w: item.width || 0, h: Math.abs(item.transform[3]) || 8 }));
                items.sort((a, b) => b.y - a.y || a.x - b.x);
                const pageLines = [];
                items.forEach(item => {
                    const line = pageLines.find(candidate => Math.abs(candidate.y - item.y) <= Math.max(2, item.h * 0.35));
                    if (line) line.items.push(item);
                    else pageLines.push({ page: pageNumber, y: item.y, items: [item] });
                });
                pageLines.forEach(line => {
                    line.items.sort((a, b) => a.x - b.x);
                    line.text = line.items.map(item => item.str).join(" ");
                });
                lines.push(...pageLines);
            }
            await pdf.destroy();
            return lines;
        }

        function wpsNumberValue(text) {
            const value = Number(String(text).replace(/(\d),(\d)/g, "$1.$2"));
            return Number.isFinite(value) ? value : null;
        }

        // "120 – 150", "120-150", "120 … 150", "120 bis 150", "135 ± 15", "max. 1,2", "≤ 1,2", "min 80", "130"
        function parseWpsRange(text) {
            const value = String(text || "").replace(/(\d),(\d)/g, "$1.$2").replace(/\s+/g, " ").trim();
            if (!value) return null;
            const number = "(\\d+(?:\\.\\d+)?)";
            let match = value.match(new RegExp(`${number}\\s*±\\s*${number}`));
            if (match) return { min: +match[1] - +match[2], max: +match[1] + +match[2] };
            match = value.match(new RegExp(`${number}\\s*(?:-|–|—|\\.{2,3}|…|bis|to)\\s*${number}`, "i"));
            if (match) return { min: Math.min(+match[1], +match[2]), max: Math.max(+match[1], +match[2]) };
            match = value.match(new RegExp(`(?:max\\.?|≤|<=|<|höchstens|hoechstens)\\s*${number}`, "i"));
            if (match) return { min: null, max: +match[1] };
            match = value.match(new RegExp(`(?:min\\.?|≥|>=|>|mind\\.?|ab)\\s*${number}`, "i"));
            if (match) return { min: +match[1], max: null };
            match = value.match(new RegExp(`^${number}$`)) || value.match(new RegExp(`^${number}\\s*[a-z/%]*$`, "i"));
            if (match) return { min: +match[1], max: +match[1] };
            return null;
        }

        // Spaltenart aus dem (zusammengesetzten) Kopftext.
        function classifyWpsColumn(text) {
            const value = text.toLowerCase().replace(/-\s+/g, "").replace(/\s+/g, " ");
            if (/w(ä|ae)rmeeinbring|streckenenergie|heat ?input|energy ?input|arc energy/.test(value)) return "heat";
            if (/draht|wire/.test(value)) return /vorschub|geschw|feed|speed|m\/min/.test(value) ? "wire" : null;
            if (/stromart|art des strom|polung|polarit|type of current|current type|kind of current/.test(value)) return null;
            if (/schwei(ß|ss)geschw|vorschub|travel|welding speed|geschwindigkeit/.test(value)) return "travel";
            if (/spannung|voltage|\bu\b ?\(?v\)?/.test(value)) return "voltage";
            if (/strom|current|\bi\b ?\(?a\)?|ampere/.test(value)) return "current";
            if (/raupe|lage|pass|run|layer|bead/.test(value)) return "pass";
            return null;
        }

        function detectWpsUnit(field, text) {
            const value = String(text).toLowerCase().replace(/\s+/g, "");
            return Object.keys(WPS_FIELDS[field].units).find(unit => value.includes(unit)) || null;
        }

        function wpsPassType(text) {
            const value = String(text || "").toLowerCase();
            if (/wurzel|root/.test(value)) return "Root";
            if (/hot ?pass|hotpass|st(ü|ue)tz|zwischen/.test(value)) return "Hot pass";
            if (/ausgleich|comp/.test(value)) return "Comp";
            if (/deck|cap|wing/.test(value)) return "Cap";
            if (/f(ü|ue)ll|fill/.test(value)) return "Fill";
            return "Other";
        }

        // Zerlegt die Textzeilen in Kopffelder und die Parametertabelle (eine Zeile je Lage).
        function parseWpsDocument(lines) {
            const allText = lines.map(line => line.text).join("\n");
            // WPS-Nummer: "WPS-Nr.: 0408-01", "WPS No. 12/3", "WPS: A-17" (nur innerhalb einer Zeile)
            const numberMatch = allText.match(/\b(?:p?WPS|SAA)[ \t-]*(?:Nr\.?|No\.?|Number|Nummer)[ \t]*[:.]?[ \t]*([A-Z0-9][\w./-]{0,30})/i)
                || allText.match(/\bp?WPS[ \t]*:[ \t]*([A-Z0-9][\w./-]{0,30})/i);
            const wpsNumber = numberMatch ? numberMatch[1] : "";
            const notes = [];
            const headerIndex = lines.findIndex(line => {
                const fields = new Set(line.items.map(item => classifyWpsColumn(item.str)).concat(classifyWpsColumn(line.text)).filter(Boolean));
                return WPS_FIELD_KEYS.filter(key => fields.has(key)).length >= 2;
            });
            if (headerIndex < 0) {
                notes.push("No parameter table found (header with current, voltage, travel speed …). Enter the values manually.");
                return { wpsNumber, rows: [], notes };
            }
            const hasDigits = line => /\d/.test(line.items.map(item => item.str).join(" ").replace(/\b(?:1[45]\d|13[1-8]|111|121|141)\b/g, ""));
            // Kopfblock: Kopfzeile plus angrenzende Zeilen ohne Zahlen (z. B. Einheiten, Worttrennung).
            let first = headerIndex;
            let last = headerIndex;
            const lineHeight = Math.max(8, ...lines[headerIndex].items.map(item => item.h * 1.6));
            while (first > 0 && lines[first - 1].page === lines[headerIndex].page && Math.abs(lines[first - 1].y - lines[first].y) <= lineHeight && !hasDigits(lines[first - 1])) first--;
            while (last + 1 < lines.length && lines[last + 1].page === lines[headerIndex].page && Math.abs(lines[last + 1].y - lines[last].y) <= lineHeight && !hasDigits(lines[last + 1])) last++;
            // Spalten: ueberlappende Kopf-Textstuecke (x-Bereich) zusammenfassen.
            const headerItems = lines.slice(first, last + 1).flatMap(line => line.items.map(item => ({ ...item, y: line.y })));
            headerItems.sort((a, b) => a.x - b.x);
            const columns = [];
            headerItems.forEach(item => {
                const column = columns.find(candidate => item.x <= candidate.right + 2 && item.x + item.w >= candidate.left - 2);
                if (column) {
                    column.left = Math.min(column.left, item.x);
                    column.right = Math.max(column.right, item.x + item.w);
                    column.items.push(item);
                } else {
                    columns.push({ left: item.x, right: item.x + item.w, items: [item] });
                }
            });
            columns.forEach(column => {
                column.text = column.items.sort((a, b) => b.y - a.y || a.x - b.x).map(item => item.str).join(" ").replace(/-\s+(?=[a-zäöü])/g, "");
                column.field = classifyWpsColumn(column.text);
                column.center = (column.left + column.right) / 2;
            });
            if (!columns.some(column => column.field === "pass") && columns.length) columns[0].field = "pass";
            const fieldColumns = WPS_FIELD_KEYS.filter(key => columns.some(column => column.field === key));
            const units = {};
            fieldColumns.forEach(key => { units[key] = detectWpsUnit(key, columns.find(column => column.field === key).text); });

            // Datenzeilen: Textstuecke der naechstgelegenen Spalte zuordnen.
            const rawRows = [];
            let misses = 0;
            for (let index = last + 1; index < lines.length && misses < 3; index++) {
                const cells = {};
                lines[index].items.forEach(item => {
                    const center = item.x + item.w / 2;
                    const column = columns.reduce((best, candidate) => {
                        const inside = center >= candidate.left - 4 && center <= candidate.right + 4;
                        const distance = inside ? 0 : Math.abs(candidate.center - center);
                        return !best || distance < best.distance ? { column: candidate, distance } : best;
                    }, null)?.column;
                    if (!column || !column.field) return;
                    cells[column.field] = cells[column.field] ? `${cells[column.field]} ${item.str}` : item.str;
                });
                const ranges = {};
                WPS_FIELD_KEYS.forEach(key => { if (cells[key]) ranges[key] = parseWpsRange(cells[key]); });
                const found = WPS_FIELD_KEYS.filter(key => ranges[key]).length;
                if (found >= 2) {
                    misses = 0;
                    rawRows.push({ label: cells.pass || `Row ${rawRows.length + 1}`, ranges, cells });
                } else if (rawRows.length) {
                    misses++;
                }
            }
            if (!rawRows.length) notes.push("Table header found, but no rows with values. Enter the values manually.");

            // Einheiten ohne Angabe schaetzen (typische WIG-Werte) und in die Ziel-Einheit umrechnen.
            const guess = {
                travel: values => (Math.max(...values) < 40 ? "cm/min" : "mm/min"),
                wire: values => (Math.max(...values) <= 20 ? "m/min" : "cm/min"),
                heat: values => (Math.max(...values) > 5 ? "kj/cm" : "kj/mm")
            };
            const rows = rawRows.map(raw => {
                const row = normalizeWpsRow({ label: raw.label, passType: wpsPassType(raw.label) });
                WPS_FIELD_KEYS.forEach(key => {
                    const range = raw.ranges[key];
                    if (!range) return;
                    let factor = 1;
                    if (Object.keys(WPS_FIELDS[key].units).length) {
                        const values = rawRows.map(item => item.ranges[key]).filter(Boolean).flatMap(item => [item.min, item.max]).filter(Number.isFinite);
                        const unit = units[key] || detectWpsUnit(key, raw.cells[key]) || (guess[key] && values.length ? guess[key](values) : null);
                        if (unit && !units[key] && !detectWpsUnit(key, raw.cells[key])) {
                            const note = `${WPS_FIELDS[key].label}: no unit in the document, assumed ${unit}.`;
                            if (!notes.includes(note)) notes.push(note);
                        }
                        factor = unit ? WPS_FIELDS[key].units[unit] : 1;
                    }
                    const convert = value => (value === null ? null : Number((value * factor).toPrecision(6)));
                    row[key] = { min: convert(range.min), max: convert(range.max) };
                });
                return row;
            });
            fieldColumns.forEach(key => {
                if (units[key] && WPS_FIELDS[key].units[units[key]] !== 1) notes.push(`${WPS_FIELDS[key].label}: converted from ${units[key]} to ${WPS_FIELDS[key].unit}.`);
            });
            rows.filter(row => WPS_FIELD_KEYS.some(key => row[key].min !== null && row[key].min === row[key].max))
                .slice(0, 1).forEach(() => notes.push("Some values are single values (min = max). Please check them against the document."));
            return { wpsNumber, rows, notes };
        }

        // Lagentyp eines Schedules aus dem Dateinamen (wie im WDR Converter).
        function scheduleWpsPassType(name) {
            const value = String(name || "").toLowerCase();
            if (/root|wurzel/.test(value)) return "Root";
            if (/(^|[^a-z])hp([^a-z]|$)|hot[ _-]?pass/.test(value)) return "Hot pass";
            if (/(^|[^a-z])comp|ausgleich/.test(value)) return "Comp";
            if (/cap|wing|deck/.test(value)) return "Cap";
            if (/(^|[^a-z])f-?(out|in|mid)([^a-z]|$)|fill/.test(value)) return "Fill";
            return "Other";
        }

        // Geladene Dateien den WPS-Zeilen gleichen Lagentyps zuordnen (Comp ohne eigene Zeile -> Fill).
        function assignWpsFiles(rows) {
            const types = new Set(rows.map(row => row.passType));
            rows.forEach(row => {
                if (row.files.length) return;
                const keys = loadedFiles.filter(file => {
                    let type = scheduleWpsPassType(file.name);
                    if (type === "Comp" && !types.has("Comp")) type = "Fill";
                    return type === row.passType && row.passType !== "Other";
                }).map(fileTargetKey);
                row.files = [...new Set(keys)];
            });
            return rows;
        }

        // Uebernehmen: Bereiche speichern, Heat-Input-Ziel-Bereiche (source "wps") ersetzen.
        function applyWps(working) {
            const previous = readWpsStore();
            const store = {
                document: working.document || "",
                wpsNumber: working.wpsNumber || "",
                importedAt: new Date().toISOString(),
                checkMode: previous?.checkMode || "separate",
                rows: working.rows.map(normalizeWpsRow)
            };
            saveWpsStore(store);
            const targets = readHeatInputTargets().filter(target => target.source !== "wps");
            store.rows.forEach((row, index) => {
                if (row.heat.min === null && row.heat.max === null) return;
                targets.push({
                    id: `wps-${index + 1}`,
                    name: `WPS ${store.wpsNumber || ""} ${row.label}`.replace(/\s+/g, " ").trim(),
                    min: row.heat.min, max: row.heat.max,
                    files: row.files.slice(),
                    source: "wps"
                });
            });
            saveHeatInputTargets(targets);
            wpsDraft = null;
            return store;
        }

        const wpsReadValue = (parent, name) => {
            const element = parent && [...parent.children].find(child => child.tagName === name);
            const value = Number(element?.textContent);
            return element && element.textContent.trim() !== "" && Number.isFinite(value) ? value : null;
        };

        // Bewertung eines Werts: nominal ausserhalb -> fail; Override-Bereich ragt hinaus -> warn.
        function wpsRate(nominal, percent, range) {
            if (!range || (range.min === null && range.max === null) || nominal === null) return { status: "na" };
            const outside = value => (range.min !== null && value < range.min - 1e-9) || (range.max !== null && value > range.max + 1e-9);
            if (outside(nominal)) return { status: "fail" };
            if (percent > 0) {
                const low = nominal * (1 - percent / 100);
                const high = nominal * (1 + percent / 100);
                if (outside(low) || outside(high)) return { status: "warn", low, high };
            }
            return { status: "ok" };
        }

        // Pruefung einer Datei gegen alle zugeordneten WPS-Zeilen.
        function wpsCheckFile(file, store = readWpsStore()) {
            if (!store) return { file, rows: [], entries: [] };
            const key = fileTargetKey(file);
            const rows = store.rows.filter(row => row.files.includes(key));
            const overrides = file.sections.overrides;
            const percent = name => Math.max(0, wpsReadValue(overrides, name) ?? 0);
            const entries = rows.length ? file.sections.segments.map((segment, segmentIndex) => {
                const read = name => wpsReadValue(segment, name);
                if (read("enable") === 0) return { segmentIndex, disabled: true, values: {} };
                const priTime = (read("indwell") ?? 0) + (read("outdwell") ?? 0);
                const bkgTime = read("excursion") ?? 0;
                const mean = (pri, bkg) => (pri === null || bkg === null || priTime + bkgTime <= 0 ? null : (pri * priTime + bkg * bkgTime) / (priTime + bkgTime));
                const pairs = {
                    current: [read("pri_amp"), read("bkg_amp"), percent("pri_amp_max"), percent("bkg_amp_max")],
                    voltage: [read("pri_ahc"), read("bkg_ahc"), percent("avc_override_max"), percent("avc_override_max")],
                    travel: [read("pri_travel"), read("bkg_travel"), percent("travel_max"), percent("travel_max")].map((value, index) => (index < 2 && value !== null ? value * 25.4 : value)),
                    wire: [read("pri_wire"), read("bkg_wire"), percent("wire_max"), percent("wire_max")].map((value, index) => (index < 2 && value !== null ? value * 0.0254 : value))
                };
                const heat = calculateSegmentHeatInput(segment, overrides);
                const values = {};
                WPS_FIELD_KEYS.forEach(field => {
                    const checks = [];
                    rows.forEach(row => {
                        const range = row[field];
                        if (range.min === null && range.max === null) return;
                        if (field === "heat") {
                            if (heat.disabled || heat.error) return;
                            const rating = wpsRate(heat.heatInput, 0, range);
                            if (rating.status === "ok" && ((range.min !== null && heat.minHeatInput < range.min) || (range.max !== null && heat.maxHeatInput > range.max))) {
                                rating.status = "warn"; rating.low = heat.minHeatInput; rating.high = heat.maxHeatInput;
                            }
                            checks.push({ row, part: "", value: heat.heatInput, ...rating });
                            return;
                        }
                        const [pri, bkg, priPercent, bkgPercent] = pairs[field];
                        if (store.checkMode === "mean") {
                            const value = mean(pri, bkg);
                            if (value !== null) checks.push({ row, part: "mean", value, ...wpsRate(value, Math.max(priPercent, bkgPercent), range) });
                            else {
                                if (pri !== null) checks.push({ row, part: "pri", value: pri, ...wpsRate(pri, priPercent, range) });
                                if (bkg !== null) checks.push({ row, part: "bkg", value: bkg, ...wpsRate(bkg, bkgPercent, range) });
                            }
                        } else {
                            if (pri !== null) checks.push({ row, part: "pri", value: pri, ...wpsRate(pri, priPercent, range) });
                            if (bkg !== null) checks.push({ row, part: "bkg", value: bkg, ...wpsRate(bkg, bkgPercent, range) });
                        }
                    });
                    const status = checks.some(check => check.status === "fail") ? "fail" : checks.some(check => check.status === "warn") ? "warn" : checks.length ? "ok" : "na";
                    values[field] = { status, checks };
                });
                const statuses = Object.values(values).map(value => value.status);
                return { segmentIndex, values, status: statuses.includes("fail") ? "fail" : statuses.includes("warn") ? "warn" : "ok" };
            }) : [];
            return { file, rows, entries };
        }

        function formatWpsNumber(value, field) {
            if (value === null || !Number.isFinite(value)) return "–";
            return Number(value.toFixed(DISPLAY_DECIMALS)).toString();
        }

        function describeWpsRange(range, field) {
            if (!range || (range.min === null && range.max === null)) return "–";
            if (range.min === null) return `≤ ${formatWpsNumber(range.max, field)}`;
            if (range.max === null) return `≥ ${formatWpsNumber(range.min, field)}`;
            return `${formatWpsNumber(range.min, field)} – ${formatWpsNumber(range.max, field)}`;
        }

        /* Ansicht "WPS Import / Check" */
        function renderWps() {
            commitPendingEdit();
            const content = document.getElementById("content");
            content.innerHTML = "";
            const heading = document.createElement("h2");
            heading.textContent = "WPS Import / Check";
            content.appendChild(heading);
            const store = readWpsStore();
            const working = wpsDraft || (store ? { document: store.document, wpsNumber: store.wpsNumber, rows: store.rows.map(normalizeWpsRow), notes: [], lines: null } : null);

            /* Import */
            const importPanel = document.createElement("div");
            importPanel.className = "panel wps-panel";
            const drop = document.createElement("div");
            drop.className = "wps-drop";
            const input = document.createElement("input");
            input.type = "file";
            input.accept = ".pdf,application/pdf";
            input.id = "wpsFileInput";
            input.hidden = true;
            const pick = document.createElement("button");
            pick.type = "button";
            pick.className = "btn-primary";
            pick.textContent = "Load WPS (PDF)…";
            pick.onclick = () => input.click();
            const hint = document.createElement("span");
            hint.className = "wps-hint";
            hint.textContent = "Digital PDF (text can be selected). The parameter table is read per pass; the values are shown below for checking before they are applied.";
            const status = document.createElement("span");
            status.className = "wps-status";
            status.id = "wpsStatus";
            drop.append(pick, input, hint, status);
            const load = async file => {
                if (!file) return;
                status.textContent = `Reading ${file.name}…`;
                status.classList.remove("is-error");
                try {
                    const lines = await readWpsPdf(file);
                    if (!lines.length) throw new Error("The PDF contains no text (scanned document?). Enter the values manually.");
                    const parsed = parseWpsDocument(lines);
                    wpsDraft = { document: file.name, wpsNumber: parsed.wpsNumber, rows: assignWpsFiles(parsed.rows), notes: parsed.notes, lines };
                    renderWps();
                    document.getElementById("wpsStatus").textContent = `${file.name}: ${parsed.rows.length} pass row(s) found${parsed.wpsNumber ? `, WPS ${parsed.wpsNumber}` : ""}. Check the values and click "Apply".`;
                } catch (error) {
                    // Nicht lesbar (z. B. gescannt): Tabelle zum Ausfuellen von Hand anbieten.
                    wpsDraft = { document: file.name, wpsNumber: "", rows: assignWpsFiles(["Root", "Hot pass", "Fill", "Cap"].map(type => normalizeWpsRow({ label: type, passType: type }))), notes: [], lines: null };
                    renderWps();
                    const message = document.getElementById("wpsStatus");
                    message.textContent = `Could not read ${file.name}: ${error.message}`;
                    message.classList.add("is-error");
                }
            };
            input.onchange = () => { load(input.files[0]); input.value = ""; };
            drop.addEventListener("dragover", event => { event.preventDefault(); drop.classList.add("is-over"); });
            drop.addEventListener("dragleave", () => drop.classList.remove("is-over"));
            drop.addEventListener("drop", event => {
                event.preventDefault();
                drop.classList.remove("is-over");
                const file = [...event.dataTransfer.files].find(item => /\.pdf$/i.test(item.name));
                if (file) load(file);
            });
            importPanel.appendChild(drop);
            content.appendChild(importPanel);

            if (!working) {
                const empty = document.createElement("p");
                empty.className = "wps-empty";
                empty.textContent = "No WPS imported yet.";
                const manual = document.createElement("button");
                manual.type = "button";
                manual.className = "btn-secondary";
                manual.textContent = "Enter ranges manually";
                manual.onclick = () => {
                    wpsDraft = { document: "", wpsNumber: "", rows: assignWpsFiles(["Root", "Hot pass", "Fill", "Cap"].map(type => normalizeWpsRow({ label: type, passType: type }))), notes: [], lines: null };
                    renderWps();
                };
                content.append(empty, manual);
                return;
            }

            /* Bereiche (editierbar) */
            const rangePanel = document.createElement("div");
            rangePanel.className = "panel wps-panel";
            const title = document.createElement("h3");
            title.className = "wps-title";
            title.textContent = wpsDraft ? "Ranges read from the WPS (not applied yet)" : `WPS ranges in use${store.document ? ` – ${store.document}` : ""}`;
            rangePanel.appendChild(title);
            const meta = document.createElement("label");
            meta.className = "wps-meta";
            const numberInput = document.createElement("input");
            numberInput.type = "text";
            numberInput.value = working.wpsNumber || "";
            numberInput.id = "wpsNumberInput";
            numberInput.oninput = () => { working.wpsNumber = numberInput.value.trim(); markDirty(); };
            meta.append(document.createTextNode("WPS no. "), numberInput);
            rangePanel.appendChild(meta);
            (working.notes || []).forEach(note => {
                const line = document.createElement("p");
                line.className = "wps-note";
                line.textContent = note;
                rangePanel.appendChild(line);
            });

            let dirty = Boolean(wpsDraft);
            const applyBtn = document.createElement("button");
            function markDirty() {
                dirty = true;
                applyBtn.disabled = false;
                if (!wpsDraft) wpsDraft = working;
            }
            const table = document.createElement("table");
            table.className = "heat-table wps-range-table";
            const head = document.createElement("thead");
            head.innerHTML = "<tr><th>Pass</th><th>Type</th><th>Schedules (4-digit no.)</th>"
                + WPS_FIELD_KEYS.map(key => `<th colspan="2">${WPS_FIELDS[key].label}</th>`).join("") + "<th></th></tr>"
                + "<tr class=\"heat-unit-row\"><th></th><th></th><th>comma-separated</th>"
                + WPS_FIELD_KEYS.map(key => `<th>min ${WPS_FIELDS[key].unit}</th><th>max</th>`).join("") + "<th></th></tr>";
            table.appendChild(head);
            const body = document.createElement("tbody");
            working.rows.forEach((row, rowIndex) => {
                const tr = document.createElement("tr");
                tr.dataset.row = String(rowIndex);
                const textCell = (value, onChange, className) => {
                    const td = document.createElement("td");
                    const field = document.createElement("input");
                    field.type = "text";
                    field.value = value;
                    if (className) field.className = className;
                    field.oninput = () => { onChange(field.value); markDirty(); };
                    td.appendChild(field);
                    return td;
                };
                tr.appendChild(textCell(row.label, value => { row.label = value; }, "wps-label-input"));
                const typeCell = document.createElement("td");
                const select = document.createElement("select");
                WPS_PASS_TYPES.forEach(type => select.add(new Option(type, type, false, type === row.passType)));
                select.onchange = () => { row.passType = select.value; markDirty(); };
                typeCell.appendChild(select);
                tr.appendChild(typeCell);
                tr.appendChild(textCell(row.files.join(", "), value => { row.files = value.split(/[\s,;]+/).filter(Boolean); }, "wps-files-input"));
                WPS_FIELD_KEYS.forEach(key => {
                    ["min", "max"].forEach(bound => {
                        tr.appendChild(textCell(row[key][bound] === null ? "" : String(row[key][bound]), value => {
                            const number = value.trim() === "" ? null : parseNumberInput(value);
                            row[key][bound] = Number.isFinite(number) ? number : null;
                        }, `wps-number-input wps-${key}-${bound}`));
                    });
                });
                const removeCell = document.createElement("td");
                const remove = document.createElement("button");
                remove.type = "button";
                remove.className = "btn-secondary wps-remove";
                remove.textContent = "✕";
                remove.title = "Remove row";
                remove.onclick = () => { working.rows.splice(rowIndex, 1); if (!wpsDraft) wpsDraft = working; renderWps(); };
                removeCell.appendChild(remove);
                tr.appendChild(removeCell);
                body.appendChild(tr);
            });
            table.appendChild(body);
            const wrap = document.createElement("div");
            wrap.className = "heat-table-wrap";
            wrap.appendChild(table);
            rangePanel.appendChild(wrap);

            const actions = document.createElement("div");
            actions.className = "wps-actions";
            const addRow = document.createElement("button");
            addRow.type = "button";
            addRow.className = "btn-secondary";
            addRow.textContent = "+ Add row";
            addRow.onclick = () => { working.rows.push(normalizeWpsRow({ label: "", passType: "Other" })); if (!wpsDraft) wpsDraft = working; renderWps(); };
            applyBtn.type = "button";
            applyBtn.className = "btn-primary";
            applyBtn.id = "wpsApplyBtn";
            applyBtn.textContent = "Apply";
            applyBtn.title = "Store the ranges and set the heat input ranges as target ranges (Tools › Heat Input)";
            applyBtn.disabled = !dirty;
            applyBtn.onclick = () => {
                const stored = applyWps(working);
                renderWps();
                document.getElementById("status").textContent = `WPS ranges applied (${stored.rows.length} pass row(s)); heat input target ranges updated.`;
            };
            actions.append(addRow, applyBtn);
            if (wpsDraft) {
                const discard = document.createElement("button");
                discard.type = "button";
                discard.className = "btn-secondary";
                discard.textContent = "Discard";
                discard.onclick = () => { wpsDraft = null; renderWps(); };
                actions.appendChild(discard);
            }
            rangePanel.appendChild(actions);
            if (working.lines?.length) {
                const details = document.createElement("details");
                details.className = "wps-raw";
                const summary = document.createElement("summary");
                summary.textContent = "Text read from the PDF (for comparison)";
                const pre = document.createElement("pre");
                pre.textContent = working.lines.map(line => line.text).join("\n");
                details.append(summary, pre);
                rangePanel.appendChild(details);
            }
            content.appendChild(rangePanel);

            /* Pruefung */
            if (!store) return;
            const checkPanel = document.createElement("div");
            checkPanel.className = "panel wps-panel";
            const checkTitle = document.createElement("h3");
            checkTitle.className = "wps-title";
            checkTitle.textContent = "Check of the loaded schedules";
            checkPanel.appendChild(checkTitle);
            const modeLabel = document.createElement("label");
            modeLabel.className = "wps-meta";
            const mode = document.createElement("select");
            mode.id = "wpsCheckMode";
            mode.add(new Option("Pulse and background separately", "separate", false, store.checkMode !== "mean"));
            mode.add(new Option("Time-weighted mean (dwell/excursion)", "mean", false, store.checkMode === "mean"));
            mode.onchange = () => { saveWpsStore({ ...store, checkMode: mode.value }); renderWps(); };
            modeLabel.append(document.createTextNode("Current, voltage, travel, wire: "), mode);
            checkPanel.appendChild(modeLabel);

            const results = loadedFiles.map((file, fileIndex) => ({ ...wpsCheckFile(file, store), fileIndex }));
            const checked = results.filter(result => result.rows.length);
            // Zaehlung je Wert (Segment × Parameter)
            const counts = { fail: 0, warn: 0 };
            checked.forEach(result => result.entries.forEach(entry => Object.values(entry.values || {}).forEach(value => {
                if (counts[value.status] !== undefined) counts[value.status]++;
            })));
            const summaryLine = document.createElement("p");
            summaryLine.className = "wps-summary";
            summaryLine.id = "wpsSummary";
            const unassigned = results.filter(result => !result.rows.length).map(result => fileShortLabel(result.file));
            summaryLine.textContent = loadedFiles.length
                ? `${checked.length} file(s) checked · ${counts.fail} value(s) outside the WPS · ${counts.warn} value(s) with override range outside`
                    + (unassigned.length ? ` · no WPS row: ${unassigned.join(", ")}` : "")
                : "Load schedules to check them against the WPS.";
            if (counts.fail) summaryLine.classList.add("is-fail");
            checkPanel.appendChild(summaryLine);
            if (checked.length) {
                const checkTable = document.createElement("table");
                checkTable.className = "heat-table wps-check-table";
                checkTable.innerHTML = "<thead><tr><th>Segment</th>" + WPS_FIELD_KEYS.map(key => `<th>${WPS_FIELDS[key].label}</th>`).join("") + "</tr>"
                    + "<tr class=\"heat-unit-row\"><th></th>" + WPS_FIELD_KEYS.map(key => `<th>${WPS_FIELDS[key].unit}</th>`).join("") + "</tr></thead>";
                const checkBody = document.createElement("tbody");
                checked.forEach(result => {
                    const fileRow = document.createElement("tr");
                    fileRow.className = "heat-file-row";
                    const fileCell = document.createElement("td");
                    fileCell.colSpan = WPS_FIELD_KEYS.length + 1;
                    fileCell.innerHTML = `<span class="heat-file-name"></span><span class="heat-file-limits"></span>`;
                    fileCell.firstChild.textContent = result.file.name;
                    fileCell.lastChild.textContent = `WPS: ${result.rows.map(row => `${row.label} (${WPS_FIELD_KEYS.map(key => describeWpsRange(row[key], key)).join(" · ")})`).join("; ")}`;
                    fileRow.appendChild(fileCell);
                    checkBody.appendChild(fileRow);
                    result.entries.forEach(entry => {
                        const segment = result.file.sections.segments[entry.segmentIndex];
                        const tr = document.createElement("tr");
                        tr.className = `heat-segment-row wps-segment-row is-${entry.disabled ? "off" : entry.status}`;
                        tr.tabIndex = 0;
                        tr.onclick = () => openHeatInputSegment(result.fileIndex, entry.segmentIndex);
                        tr.onkeydown = event => { if (event.key === "Enter") tr.click(); };
                        const label = document.createElement("td");
                        label.textContent = `Segment ${segmentDisplayNumber(segment, entry.segmentIndex)}${entry.disabled ? " (off)" : ""}`;
                        tr.appendChild(label);
                        WPS_FIELD_KEYS.forEach(key => {
                            const td = document.createElement("td");
                            td.className = "num wps-cell";
                            const value = entry.values[key];
                            if (!value || !value.checks.length) { td.textContent = "–"; tr.appendChild(td); return; }
                            td.classList.add(`is-${value.status}`);
                            td.dataset.field = key;
                            td.textContent = value.checks.filter((check, index, list) => list.findIndex(other => other.part === check.part) === index)
                                .map(check => `${check.part === "bkg" ? "B " : check.part === "pri" ? "P " : ""}${formatWpsNumber(check.value, key)}`).join(" / ");
                            td.title = value.checks.map(check => {
                                const part = { pri: "pulse", bkg: "background", mean: "mean", "": "nominal" }[check.part];
                                const state = { ok: "ok", warn: "override range outside", fail: "outside", na: "–" }[check.status];
                                const span = check.low !== undefined ? ` (override ${formatWpsNumber(check.low, key)} – ${formatWpsNumber(check.high, key)})` : "";
                                return `${check.row.label}: ${part} ${formatWpsNumber(check.value, key)} ${WPS_FIELDS[key].unit}, WPS ${describeWpsRange(check.row[key], key)} → ${state}${span}`;
                            }).join("\n");
                            tr.appendChild(td);
                        });
                        checkBody.appendChild(tr);
                    });
                });
                checkTable.appendChild(checkBody);
                const checkWrap = document.createElement("div");
                checkWrap.className = "heat-table-wrap";
                checkWrap.appendChild(checkTable);
                checkPanel.appendChild(checkWrap);
                const legend = document.createElement("p");
                legend.className = "wps-hint";
                legend.textContent = "P = pulse (pri), B = background (bkg). Red: value outside the WPS. Amber: value inside, but the override range (Overrides: pri/bkg_amp_max, avc_override_max, travel_max, wire_max; heat input min/max) reaches outside. Travel and wire are converted from in/min.";
                checkPanel.appendChild(legend);
            }
            content.appendChild(checkPanel);
        }

        // Batch Save: Segmente ausserhalb der WPS melden (wie die Heat-Input-Pruefung).
        const wpsSaveModal = document.getElementById("wpsSaveModal");
        let pendingWpsSave = null;
        function confirmWpsBeforeSave(files, proceed) {
            const store = readWpsStore();
            if (!store) { proceed(); return; }
            const problems = [];
            files.filter(Boolean).forEach(file => {
                wpsCheckFile(file, store).entries.filter(entry => entry.status === "fail").forEach(entry => {
                    const fields = WPS_FIELD_KEYS.filter(key => entry.values[key]?.status === "fail").map(key => WPS_FIELDS[key].label.toLowerCase());
                    const segmentNumber = segmentDisplayNumber(file.sections.segments[entry.segmentIndex], entry.segmentIndex);
                    problems.push(`${fileShortLabel(file)} · Segment ${segmentNumber}: ${fields.join(", ")}`);
                });
            });
            if (!problems.length) { proceed(); return; }
            document.getElementById("wpsSaveText").textContent = `${problems.length} segment(s) have values outside the WPS${store.wpsNumber ? ` ${store.wpsNumber}` : ""}. Save anyway?`;
            const list = document.getElementById("wpsSaveList");
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
            pendingWpsSave = proceed;
            openModal(wpsSaveModal, document.getElementById("wpsSaveCancelBtn"));
        }
        document.getElementById("wpsSaveCancelBtn").onclick = () => {
            pendingWpsSave = null;
            closeModal(wpsSaveModal);
            document.getElementById("status").textContent = "Batch save cancelled: values outside the WPS (Tools › WPS Import / Check).";
        };
        document.getElementById("wpsSaveShowBtn").onclick = () => {
            pendingWpsSave = null;
            closeModal(wpsSaveModal);
            document.getElementById("wpsBtn").click();
        };
        document.getElementById("wpsSaveConfirmBtn").onclick = () => {
            const proceed = pendingWpsSave;
            pendingWpsSave = null;
            closeModal(wpsSaveModal);
            if (proceed) proceed();
        };

        document.getElementById("wpsBtn").onclick = () => {
            commitPendingEdit();
            document.querySelectorAll("#sidebar .sidebar-item").forEach(el => el.classList.remove("active"));
            document.getElementById("wpsBtn").classList.add("active");
            renderWps();
        };
