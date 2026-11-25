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
            wire: { label: "Wire feed", unit: "cm/min", units: { "cm/min": 1, "m/min": 100, "mm/min": 0.1, "mm/s": 6, "in/min": 2.54, "ipm": 2.54 } },
            heat: { label: "Heat input", unit: "kJ/mm", units: { "kj/mm": 1, "kj/cm": 0.1, "j/mm": 0.001, "kj/in": 1 / 25.4 } }
        };
        WPS_FIELDS.dwell = { label: "Dwell", unit: "s", units: {} };
        WPS_FIELDS.excursion = { label: "Excursion", unit: "s", units: {} };
        const WPS_FIELD_KEYS = ["current", "voltage", "travel", "wire", "dwell", "excursion", "heat"];
        // Pruefspalten je Feld: Teilbereich (part), Schedule-Feld, Faktor in die WPS-Einheit, Override, Kurzzeichen.
        const WPS_CHECK_PARTS = {
            current: [{ part: "pri", key: "pri_amp", override: "pri_amp_max", tag: "P" }, { part: "bkg", key: "bkg_amp", override: "bkg_amp_max", tag: "B" }],
            voltage: [{ part: "pri", key: "pri_ahc", override: "avc_override_max", tag: "P" }, { part: "bkg", key: "bkg_ahc", override: "avc_override_max", tag: "B" }],
            travel: [{ part: "pri", key: "pri_travel", override: "travel_max", tag: "P", factor: 25.4 }, { part: "bkg", key: "bkg_travel", override: "travel_max", tag: "B", factor: 25.4 }],
            wire: [{ part: "pri", key: "pri_wire", override: "wire_max", tag: "P", factor: 2.54 }, { part: "bkg", key: "bkg_wire", override: "wire_max", tag: "B", factor: 2.54 }],
            dwell: [{ part: "in", key: "indwell", override: "dwell_max", tag: "In" }, { part: "out", key: "outdwell", override: "dwell_max", tag: "Out" }],
            excursion: [{ part: "", key: "excursion", override: "excursion_max", tag: "" }],
            heat: [{ part: "", key: null, override: null, tag: "nominal" }]
        };
        const WPS_SUB_PARTS = ["pri", "bkg", "in", "out"];
        const WPS_PART_TAGS = { pri: "P", bkg: "B", in: "In", out: "Out" };
        let wpsDraft = null;          // eingelesene, noch nicht uebernommene WPS
        let pdfJsPromise = null;

        function readWpsStore() {
            const stored = readStoredJson(WPS_STORE_KEY, null);
            if (!stored || typeof stored !== "object" || !Array.isArray(stored.rows)) return null;
            const rows = stored.rows.map(normalizeWpsRow);
            // Fruehere Versionen speicherten den Drahtvorschub in m/min -> cm/min
            if (stored.wireUnit !== "cm/min") {
                const scale = range => ["min", "max"].forEach(bound => { if (range && range[bound] !== null) range[bound] = Number((range[bound] * 100).toPrecision(6)); });
                rows.forEach(row => { scale(row.wire); scale(row.wire.pri); scale(row.wire.bkg); });
            }
            return { ...stored, wireUnit: "cm/min", checkMode: stored.checkMode === "mean" ? "mean" : "separate", rows };
        }

        function saveWpsStore(store) {
            try { localStorage.setItem(WPS_STORE_KEY, JSON.stringify({ ...store, wireUnit: "cm/min" })); } catch (error) { console.warn("Could not store the WPS ranges.", error); }
        }

        // Bereich {min, max}; optional getrennt fuer Puls (pri) und Grund (bkg), z. B. Strom "B 140–250 / P 180–290".
        // min/max ist dann die Vereinigung beider Teilbereiche.
        function normalizeWpsRow(row) {
            const simple = value => ({
                min: Number.isFinite(value?.min) ? value.min : null,
                max: Number.isFinite(value?.max) ? value.max : null
            });
            const range = value => {
                const result = simple(value);
                WPS_SUB_PARTS.forEach(part => {
                    const sub = value?.[part] && simple(value[part]);
                    if (sub && (sub.min !== null || sub.max !== null)) result[part] = sub;
                });
                return result;
            };
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
                    // Aneinanderstossende Textstuecke zu Woertern zusammenfuegen ("1" "4" "0" "-" -> "140-"):
                    // manche PDFs speichern Zahlen Zeichen fuer Zeichen.
                    const merged = [];
                    line.items.forEach(item => {
                        const last = merged[merged.length - 1];
                        if (last && Math.abs(last.y - item.y) < 0.6 && item.x >= last.x && item.x - (last.x + last.w) <= 0.6) {
                            last.str += item.str;
                            last.w = item.x + item.w - last.x;
                        } else {
                            merged.push({ ...item });
                        }
                    });
                    line.items = merged;
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
            if (/\bwfs\b/.test(value)) return "wire";
            if (/\bdwell|haltez/.test(value)) return "dwell";
            if (/oscillation|excursion|weave/.test(value) && !/width|breite|ampl|\(mm\)/.test(value)) return "excursion";
            if (/^(process|prozess|verfahren)\b/.test(value)) return "process";
            if (/stromart|art des strom|polung|polarit|type of current|current type|kind of current/.test(value)) return null;
            if (/schwei(ß|ss)geschw|vorschub|travel|welding speed|geschwindigkeit/.test(value)) return "travel";
            if (/spannung|voltage|\bu\b ?\(?v\)?/.test(value)) return "voltage";
            if (/strom|current|\bi\b ?\(?a\)?|ampere|amperage/.test(value)) return "current";
            if (/raupe|lage|pass|run|layer|bead/.test(value)) return "pass";
            return null;
        }

        function detectWpsUnit(field, text) {
            const value = String(text).toLowerCase().replace(/\s*\/\s*/g, "/");
            // Einheit nicht als Teil einer anderen lesen ("m/min" in "cm/min"): kein Buchstabe davor.
            return Object.keys(WPS_FIELDS[field].units).find(unit => {
                const index = value.indexOf(unit);
                return index >= 0 && !/[a-z]/.test(value[index - 1] || "");
            }) || null;
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
        // WPS-Formulare "quer" (z. B. Bilfinger/Liburdi-Vordruck): Lagen als Spalten (Wurzel-/Stuetzlage,
        // Fuellage, Decklage), Parameter als Zeilen mit je einer "min."- und "max."-Zeile. Ein Formular je Seite;
        // ein Dokument kann mehrere WPS enthalten. Uebernommen werden nur mechanisierte Prozesse (m-141 …),
        // wenn das Formular solche enthaelt.
        const WPS_FORM_LABELS = {
            current: /^(schwei(ß|ss)strom|weld(ing)? current)/i,
            voltage: /^(schwei(ß|ss)spannung|(arc )?voltage)/i,
            travel: /^(schwei(ß|ss)s?geschw|welding speed|travel speed)/i,
            wire: /^(drahtgeschw|drahtvorschub|wire (feed )?speed)/i,
            heat: /^(w(ä|ae)rmeeinbringung|streckenenergie|heat input)/i
        };
        function parseWpsForms(lines) {
            const pages = [...new Set(lines.map(line => line.page))];
            const forms = [];
            pages.forEach(pageNumber => {
                const items = lines.filter(line => line.page === pageNumber).flatMap(line => line.items);
                // Kopfzeile der Lagen: mindestens zwei Lagenbezeichnungen in einer Zeile, rechts der Beschriftungen.
                const passWord = /wurzel|st(ü|ue)tz|f(ü|ue)ll|deck|root|hot.?pass|fill|cap/i;
                const passItems = items.filter(item => item.x > 200 && passWord.test(item.str));
                const headerY = [...new Set(passItems.map(item => Math.round(item.y)))]
                    .sort((a, b) => b - a)
                    .find(y => passItems.filter(item => Math.abs(item.y - y) <= 2).length >= 2);
                if (headerY === undefined) return;
                const columns = passItems.filter(item => Math.abs(item.y - headerY) <= 2).sort((a, b) => a.x - b.x)
                    .map((item, index, list) => ({ label: item.str.trim(), left: item.x - 4, right: index + 1 < list.length ? list[index + 1].x - 4 : Infinity }));
                const inColumn = (item, column) => item.x >= column.left && item.x < column.right;
                const near = (a, b, tolerance) => Math.abs(a - b) <= tolerance;
                // Prozess je Spalte (z. B. "141", "m-141") aus der naechsten Zeile mit Prozessnummern unter dem Kopf.
                const processItems = items.filter(item => /^m?-?\d{2,3}$/i.test(item.str.trim()) && item.y < headerY && item.y > headerY - 40 && item.x > 200);
                columns.forEach(column => {
                    column.process = processItems.filter(item => inColumn(item, column)).sort((a, b) => b.y - a.y || a.x - b.x)[0]?.str.trim() || "";
                });
                // Parameterzeilen: Beschriftung links, Zeilen "min." und "max." daneben, Werte in den Lagenspalten.
                const values = {};
                const units = {};
                Object.entries(WPS_FORM_LABELS).forEach(([field, pattern]) => {
                    const label = items.find(item => item.x < 170 && item.y < headerY && pattern.test(item.str.trim()));
                    if (!label) return;
                    const unitText = items.filter(item => item.x < 200 && near(item.y, label.y, 3)).map(item => item.str).join(" ");
                    units[field] = detectWpsUnit(field, unitText) || null;
                    const minMarker = items.find(item => /^min\.?$/i.test(item.str.trim()) && item.x > 140 && near(item.y, label.y, 3));
                    const maxMarker = minMarker && items.find(item => /^max\.?$/i.test(item.str.trim()) && item.x > 140 && item.y < minMarker.y - 3 && item.y > minMarker.y - 15);
                    const rowValue = (y, column) => items
                        .filter(item => near(item.y, y, 2) && inColumn(item, column) && wpsNumberValue(item.str.trim()) !== null)
                        .sort((a, b) => a.x - b.x)[0];
                    values[field] = columns.map(column => {
                        if (minMarker) {
                            const min = rowValue(minMarker.y, column);
                            const max = maxMarker ? rowValue(maxMarker.y, column) : null;
                            return { min: min ? wpsNumberValue(min.str.trim()) : null, max: max ? wpsNumberValue(max.str.trim()) : null };
                        }
                        const single = items.filter(item => near(item.y, label.y, 2) && inColumn(item, column)).map(item => item.str).join(" ");
                        return parseWpsRange(single) || { min: null, max: null };
                    });
                });
                // Pulszeiten: "Haltez. in / geschw. Rate / Haltez. Aussen" mit den Unterspalten dwell in / weave rate /
                // dwell out je Lage; dwell in/out -> Dwell (indwell/outdwell), weave rate -> Excursion.
                const dwellLabel = items.find(item => item.x < 170 && item.y < headerY && /^(haltez|dwell in)/i.test(item.str.trim()));
                if (dwellLabel) {
                    const subs = items.filter(item => item.x > 200 && near(item.y, dwellLabel.y, 4)
                        && /^(dwell in|weave rate|dwell out|haltez\.? ?(in|au(ß|ss)en)|geschw\.? ?rate)$/i.test(item.str.trim()));
                    const valueItems = items.filter(item => item.x > 200 && item.y < dwellLabel.y - 3 && item.y > dwellLabel.y - 16 && parseWpsRange(item.str));
                    const dwell = [];
                    const excursion = [];
                    columns.forEach(column => {
                        const own = subs.filter(sub => inColumn(sub, column));
                        const found = {};
                        valueItems.filter(item => inColumn(item, column)).forEach(item => {
                            const center = item.x + item.w / 2;
                            const sub = own.reduce((best, candidate) => (!best || Math.abs(candidate.x + candidate.w / 2 - center) < Math.abs(best.x + best.w / 2 - center) ? candidate : best), null);
                            if (!sub) return;
                            const kind = /out|au(ß|ss)en/i.test(sub.str) ? "out" : /weave|rate/i.test(sub.str) ? "exc" : "in";
                            found[kind] = parseWpsRange(item.str);
                        });
                        const parts = ["in", "out"].filter(kind => found[kind]);
                        const union = bound => (parts.length ? (bound === "min" ? Math.min(...parts.map(kind => found[kind].min)) : Math.max(...parts.map(kind => found[kind].max))) : null);
                        const range = { min: union("min"), max: union("max") };
                        const same = parts.length === 2 && found.in.min === found.out.min && found.in.max === found.out.max;
                        if (parts.length && !same) parts.forEach(kind => { range[kind] = found[kind]; });
                        dwell.push(range);
                        excursion.push(found.exc || { min: null, max: null });
                    });
                    if (dwell.some(range => range.min !== null || range.max !== null)) values.dwell = dwell;
                    if (excursion.some(range => range.min !== null || range.max !== null)) values.excursion = excursion;
                }
                const fields = Object.keys(values);
                if (fields.length < 2) return;
                // WPS-Nummer: Wert rechts neben "Sp.-Nr.:" bzw. "WPS-no.:" (ggf. mit "Rev.…").
                const numberLabel = items.find(item => /^(sp\.?-?nr\.?|wps[ -]?(no|nr)\.?):?$/i.test(item.str.trim()));
                let wpsNumber = "";
                if (numberLabel) {
                    const right = items.filter(item => item.x > numberLabel.x + numberLabel.w && near(item.y, numberLabel.y, 8) && !/^(sp\.?-?nr|wps)/i.test(item.str.trim()))
                        .sort((a, b) => a.x - b.x);
                    wpsNumber = right.map(item => item.str.trim()).join(" ").replace(/-\s+/g, "-").trim();
                }
                const mechanized = columns.some(column => /^m-/i.test(column.process));
                const notes = [];
                const rows = [];
                columns.forEach((column, index) => {
                    if (mechanized && !/^m-/i.test(column.process)) {
                        notes.push(`${column.label} (${column.process || "no process"}) skipped: only mechanized processes (m-…) are imported.`);
                        return;
                    }
                    const row = normalizeWpsRow({ label: `${column.label}${column.process ? ` (${column.process})` : ""}`, passType: wpsPassType(column.label) });
                    fields.forEach(field => {
                        const range = values[field][index];
                        const factor = units[field] && WPS_FIELDS[field].units[units[field]] ? WPS_FIELDS[field].units[units[field]] : 1;
                        const convert = value => (value === null ? null : Number((value * factor).toPrecision(6)));
                        row[field] = normalizeWpsRow({ [field]: { ...range, min: convert(range.min), max: convert(range.max) } })[field];
                    });
                    if (WPS_FIELD_KEYS.some(field => row[field].min !== null || row[field].max !== null)) rows.push(row);
                });
                Object.entries(units).forEach(([field, unit]) => {
                    if (unit && WPS_FIELDS[field].units[unit] !== 1) notes.push(`${WPS_FIELDS[field].label}: converted from ${unit} to ${WPS_FIELDS[field].unit}.`);
                });
                if (rows.length) forms.push({ page: pageNumber, wpsNumber, rows, notes });
            });
            return forms;
        }

        // Lauf-Tabellen (z. B. RCC-M-WPS "Mechanised Orbital Parameters"): eine Zeile je Lauf ("3+", "4+"), ein Lauf
        // ueber mehrere Textzeilen, Unterspalten B/P (Grund/Puls) oder Min/Max, Angaben wie "B=110-250 P=150-270".
        // Je Seite und Tabelle ein Formular; nur mechanisierte Prozesse (141-m), wenn das Dokument solche enthaelt.
        function parseWpsRunTables(lines) {
            const forms = [];
            [...new Set(lines.map(line => line.page))].forEach(pageNumber => {
                const pageLines = lines.filter(line => line.page === pageNumber);
                const items = pageLines.flatMap(line => line.items);
                const numberLine = pageLines.map(line => line.text.match(/^\s*p?WPS\s+([A-Z0-9][\w./-]{2,30})(?:\s+(Rev\.?\s*\w+))?/i)).find(Boolean);
                const wpsNumber = numberLine ? [numberLine[1], numberLine[2]].filter(Boolean).join(" ") : "";
                items.filter(item => /^(amperage|current|strom|stromst(ä|ae)rke)$/i.test(item.str)).forEach(anchor => {
                    const near = (item, distance) => Math.abs(item.y - anchor.y) <= distance;
                    if (!items.some(item => /^(voltage|spannung)$/i.test(item.str) && near(item, 12))) return;
                    if (!items.some(item => /^heat ?input$|w(ä|ae)rmeeinbringung/i.test(item.str) && near(item, 12))) return;
                    if (!items.some(item => /^(run|pass|lage|raupe)$/i.test(item.str) && near(item, 14))) return;
                    // Kopf: Zeilen um die Ueberschriften bis zur Zeile mit den Unterspalten (B/P, Min/Max)
                    const subLabel = /^(b|p|min|max)$/i;
                    const subs = items.filter(item => subLabel.test(item.str) && item.y < anchor.y && item.y > anchor.y - 25);
                    const bottom = subs.length ? Math.min(...subs.map(item => item.y)) : anchor.y - 14;
                    const headerItems = items.filter(item => item.y <= anchor.y + 14 && item.y >= bottom - 1 && !subs.includes(item));
                    const columns = [];
                    [...headerItems].sort((a, b) => a.x - b.x).forEach(item => {
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
                        column.text = column.items.sort((a, b) => b.y - a.y || a.x - b.x).map(item => item.str).join(" ");
                        column.field = classifyWpsColumn(column.text);
                        column.center = (column.left + column.right) / 2;
                        column.subs = subs.filter(sub => sub.x + sub.w / 2 >= column.left - 3 && sub.x + sub.w / 2 <= column.right + 3)
                            .map(sub => ({ label: sub.str.toLowerCase(), x: sub.x + sub.w / 2 }));
                    });
                    const passColumn = columns.find(column => column.field === "pass");
                    if (!passColumn) return;
                    const columnOf = item => {
                        const center = item.x + item.w / 2;
                        return columns.reduce((best, candidate) => {
                            const distance = center >= candidate.left - 3 && center <= candidate.right + 3 ? 0 : Math.abs(candidate.center - center);
                            return !best || distance < best.distance ? { column: candidate, distance } : best;
                        }, null)?.column;
                    };
                    // Datenbereich bis zur naechsten Ueberschrift (Notes, General …)
                    const stopY = Math.max(-Infinity, ...items.filter(item => item.y < bottom - 1 && /^(general|notes?|remarks|bemerkung)/i.test(item.str)).map(item => item.y));
                    const dataItems = items.filter(item => item.y < bottom - 1 && item.y > stopY);
                    const labels = dataItems.filter(item => columnOf(item) === passColumn && /^[A-Za-z0-9+]{1,8}$/.test(item.str)).sort((a, b) => b.y - a.y);
                    if (!labels.length) return;
                    const notes = [];
                    const rawRows = labels.map((label, index) => {
                        const top = index > 0 ? (labels[index - 1].y + label.y) / 2 : label.y + 12;
                        const low = index + 1 < labels.length ? (label.y + labels[index + 1].y) / 2 : label.y - 12;
                        const cells = {};
                        dataItems.filter(item => item.y < top && item.y >= low && item !== label).sort((a, b) => b.y - a.y || a.x - b.x).forEach(item => {
                            const column = columnOf(item);
                            if (!column || !column.field || column === passColumn) return;
                            let key = column.field;
                            if (column.subs.length) {
                                const center = item.x + item.w / 2;
                                key += `:${column.subs.reduce((best, sub) => (Math.abs(sub.x - center) < Math.abs(best.x - center) ? sub : best)).label}`;
                            }
                            cells[key] = cells[key] ? `${cells[key]} ${item.str}` : item.str;
                        });
                        return { label: label.str, cells };
                    });
                    const units = {};
                    ["travel", "wire", "heat"].forEach(field => {
                        const column = columns.find(item => item.field === field);
                        units[field] = column ? detectWpsUnit(field, column.text) : null;
                    });
                    const factorOf = field => (units[field] && WPS_FIELDS[field].units[units[field]]) || 1;
                    const convert = (range, field) => (range ? {
                        min: range.min === null ? null : Number((range.min * factorOf(field)).toPrecision(6)),
                        max: range.max === null ? null : Number((range.max * factorOf(field)).toPrecision(6))
                    } : null);
                    const partRange = (text, part) => {
                        const match = String(text || "").match(new RegExp(`(?:^|\\s)${part}\\s*=\\s*([^=]+?)(?=\\s+[BP]\\s*=|$)`, "i"));
                        return match ? parseWpsRange(match[1]) : null;
                    };
                    const rows = [];
                    rawRows.forEach(raw => {
                        const row = normalizeWpsRow({ label: `Run ${raw.label}`, passType: wpsPassType(raw.label) });
                        const process = raw.cells.process || "";
                        let found = 0;
                        WPS_FIELD_KEYS.forEach(field => {
                            let pri = null;
                            let bkg = null;
                            let range = null;
                            if (raw.cells[`${field}:p`] || raw.cells[`${field}:b`]) {
                                pri = parseWpsRange(raw.cells[`${field}:p`]);
                                bkg = parseWpsRange(raw.cells[`${field}:b`]);
                            } else if (raw.cells[`${field}:min`] || raw.cells[`${field}:max`]) {
                                range = { min: wpsNumberValue((raw.cells[`${field}:min`] || "").match(/\d+(?:[.,]\d+)?/)?.[0] ?? ""), max: wpsNumberValue((raw.cells[`${field}:max`] || "").match(/\d+(?:[.,]\d+)?/)?.[0] ?? "") };
                            } else if (raw.cells[field]) {
                                pri = partRange(raw.cells[field], "P");
                                bkg = partRange(raw.cells[field], "B");
                                if (!pri && !bkg) range = parseWpsRange(raw.cells[field]);
                            }
                            pri = convert(pri, field);
                            bkg = convert(bkg, field);
                            range = convert(range, field);
                            if (pri || bkg) {
                                const parts = [pri, bkg].filter(Boolean);
                                const mins = parts.map(part => part.min).filter(value => value !== null);
                                const maxs = parts.map(part => part.max).filter(value => value !== null);
                                range = { min: mins.length ? Math.min(...mins) : null, max: maxs.length ? Math.max(...maxs) : null };
                                if (pri) range.pri = pri;
                                if (bkg) range.bkg = bkg;
                            }
                            if (range && (range.min !== null || range.max !== null)) {
                                row[field] = normalizeWpsRow({ [field]: range })[field];
                                found++;
                            }
                        });
                        if (found < 2) return;
                        row.process = process;
                        rows.push(row);
                    });
                    if (!rows.length) return;
                    Object.entries(units).forEach(([field, unit]) => {
                        if (unit && WPS_FIELDS[field].units[unit] !== 1) notes.push(`${WPS_FIELDS[field].label}: converted from ${unit} to ${WPS_FIELDS[field].unit}.`);
                    });
                    if (rows.some(row => row.current.pri || row.wire.pri)) notes.push("Current and wire feed have separate ranges for pulse (P) and background (B): pri values are checked against P, bkg values against B.");
                    forms.push({ page: pageNumber, wpsNumber, rows, notes });
                });
            });
            // Nur mechanisierte Prozesse (z. B. "141-m"), wenn das Dokument solche enthaelt
            const mechanized = row => /(^|[^a-z])m([^a-z]|$)/i.test(row.process || "");
            if (forms.some(form => form.rows.some(mechanized))) {
                const skipped = [];
                forms.forEach(form => {
                    const manual = form.rows.filter(row => !mechanized(row));
                    if (manual.length) skipped.push(`page ${form.page}: ${manual.map(row => `${row.label} (${row.process || "no process"})`).join(", ")}`);
                    form.rows = form.rows.filter(mechanized);
                });
                if (skipped.length) {
                    forms.forEach(form => form.notes.unshift(`Manual runs skipped (only mechanized processes, 141-m, are imported) – ${skipped.join("; ")}.`));
                }
            }
            forms.forEach(form => form.rows.forEach(row => { if (row.process) row.label = `${row.label} (${row.process})`; delete row.process; }));
            return forms.filter(form => form.rows.length);
        }

        function parseWpsDocument(lines) {
            const forms = [...parseWpsForms(lines), ...parseWpsRunTables(lines)].sort((a, b) => a.page - b.page);
            if (forms.length) {
                return { wpsNumber: forms[0].wpsNumber, rows: forms[0].rows, notes: forms[0].notes, forms, formIndex: 0 };
            }
            return parseWpsRowTable(lines);
        }

        // Tabelle mit einer Zeile je Lage (Kopfzeile mit Strom, Spannung, … als Spalten).
        function parseWpsRowTable(lines) {
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
                page: working.page ?? null,
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

        // Teilbereich fuer Puls/Grund, falls die WPS ihn getrennt angibt; sonst der gemeinsame Bereich.
        const wpsPartRange = (range, part) => (part && range?.[part] ? range[part] : range);
        const wpsKeyPart = key => (/^pri_/.test(key) ? "pri" : /^bkg_/.test(key) ? "bkg" : key === "indwell" ? "in" : key === "outdwell" ? "out" : "");

        const wpsReadValue = (parent, name) => {
            const element = parent && [...parent.children].find(child => child.tagName === name);
            const value = Number(element?.textContent);
            return element && element.textContent.trim() !== "" && Number.isFinite(value) ? value : null;
        };

        // Bewertung eines Werts: nominal ausserhalb -> fail; Override-Bereich ragt hinaus -> warn.
        function wpsRate(nominal, percent, range) {
            if (!range || (range.min === null && range.max === null) || nominal === null) return { status: "na" };
            // Kleine relative Toleranz: Umrechnungsreste (3.937008 in/min = 100.0000003 mm/min) zaehlen nicht als ausserhalb.
            const eps = bound => Math.max(1e-6, Math.abs(bound) * 1e-6);
            const outside = value => (range.min !== null && value < range.min - eps(range.min)) || (range.max !== null && value > range.max + eps(range.max));
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
                        const parts = WPS_CHECK_PARTS[field].map(item => {
                            const raw = read(item.key);
                            return { ...item, value: raw === null ? null : raw * (item.factor || 1), percent: percent(item.override) };
                        });
                        // Mittelwert-Modus nur fuer Puls/Grund-Paare (zeitgewichtet ueber Dwell/Excursion)
                        if (store.checkMode === "mean" && parts.length === 2 && parts[0].part === "pri") {
                            const value = mean(parts[0].value, parts[1].value);
                            if (value !== null) {
                                checks.push({ row, part: "mean", value, ...wpsRate(value, Math.max(parts[0].percent, parts[1].percent), range) });
                                return;
                            }
                        }
                        parts.forEach(item => {
                            if (item.value !== null) checks.push({ row, part: item.part, value: item.value, ...wpsRate(item.value, item.percent, wpsPartRange(range, item.part)) });
                        });
                    });
                    const status = checks.some(check => check.status === "fail") ? "fail" : checks.some(check => check.status === "warn") ? "warn" : checks.length ? "ok" : "na";
                    values[field] = { status, checks };
                });
                const statuses = Object.values(values).map(value => value.status);
                return { segmentIndex, values, status: statuses.includes("fail") ? "fail" : statuses.includes("warn") ? "warn" : "ok" };
            }) : [];
            return { file, rows, entries };
        }

        /* Anpassen an die WPS: Overrides verkleinern ("Fit overrides") bzw. Werte in den Bereich setzen ("Fit values") */
        // Overrides je WPS-Feld und die Segmentwerte, die sie betreffen (Faktor: Schedule-Einheit -> WPS-Einheit).
        // fixed: wird nie veraendert (Schweissgeschwindigkeit), nur geprueft und gemeldet.
        const WPS_OVERRIDE_MAP = [
            { field: "current", override: "pri_amp_max", keys: ["pri_amp"], factor: 1 },
            { field: "current", override: "bkg_amp_max", keys: ["bkg_amp"], factor: 1 },
            { field: "voltage", override: "avc_override_max", keys: ["pri_ahc", "bkg_ahc"], factor: 1 },
            { field: "travel", override: "travel_max", keys: ["pri_travel", "bkg_travel"], factor: 25.4, fixed: true },
            { field: "wire", override: "wire_max", keys: ["pri_wire", "bkg_wire"], factor: 2.54 },
            { field: "dwell", override: "dwell_max", keys: ["indwell", "outdwell"], factor: 1 },
            { field: "excursion", override: "excursion_max", keys: ["excursion"], factor: 1 }
        ];
        // Gemeinsam reduzierbare Heat-Input-Overrides (travel_max bleibt unveraendert).
        const WPS_HEAT_OVERRIDES = ["pri_amp_max", "bkg_amp_max", "avc_override_max"];
        // Dwell/Excursion: Werte werden geprueft, die Overrides immer auf 0 % gesetzt (kein Spielraum fuer den Schweisser).
        const WPS_ZERO_OVERRIDES = ["dwell_max", "excursion_max"];

        // Gleiche Toleranz wie die Pruefung (wpsRate): Werte genau auf der Grenze gelten als innerhalb.
        const wpsEps = bound => Math.max(1e-6, Math.abs(bound) * 1e-6);
        const wpsAbove = (value, range) => range.max !== null && value > range.max + wpsEps(range.max);
        const wpsBelow = (value, range) => range.min !== null && value < range.min - wpsEps(range.min);

        // Gemeinsamer Bereich aller zugeordneten WPS-Zeilen (Schnittmenge).
        function wpsCombinedRange(rows, field, part = "") {
            const ranges = rows.map(row => wpsPartRange(row[field], part));
            const mins = ranges.map(range => range.min).filter(value => value !== null);
            const maxs = ranges.map(range => range.max).filter(value => value !== null);
            if (!mins.length && !maxs.length) return null;
            return { min: mins.length ? Math.max(...mins) : null, max: maxs.length ? Math.min(...maxs) : null };
        }

        // Wert schreiben (Stellen der Datei, Change Log); liefert true bei einer Aenderung.
        function wpsWriteValue(file, parent, sectionName, segmentIndex, key, text, changes) {
            const node = parent && [...parent.children].find(child => child.tagName === key);
            if (!node || node.textContent === text) return false;
            const oldValue = node.textContent;
            node.textContent = text;
            const fileIndex = loadedFiles.indexOf(file);
            updateChangeLogEntry({ fileIndex, fileName: file.name, sectionName, key, segmentIndex, oldValue, newValue: text });
            changes.push({ file: file.name, key, segmentIndex, oldValue, newValue: text });
            return true;
        }

        // Zahl mit den Nachkommastellen des bisherigen Werts, Rundung in Richtung "down" (abrunden) oder "up".
        function wpsFormatLike(oldText, value, direction) {
            const places = getDecimalPlaces(String(oldText).trim());
            const scale = 10 ** places;
            const rounded = direction === "down" ? Math.floor(value * scale + 1e-9) / scale
                : direction === "up" ? Math.ceil(value * scale - 1e-9) / scale : Math.round(value * scale) / scale;
            return rounded.toFixed(places);
        }

        function wpsSegmentsOf(file) {
            return file.sections.segments.filter(segment => wpsReadValue(segment, "enable") !== 0);
        }

        // Overrides so gross wie moeglich (hoechstens WPS_OVERRIDE_TARGET %), ohne dass der Schweisser mit irgendeiner
        // Override-Stellung die WPS verletzen kann: je Wert (Nominal ± Override) und beim Heat Input (alle Overrides
        // gleichzeitig im unguenstigsten Fall). Werte werden nie geaendert; travel_max bleibt. wire_max ebenso bis 10 %
        // (nur gegen den WPS-Drahtbereich, kein Einfluss auf den Heat Input).
        const WPS_OVERRIDE_TARGET = 10;
        function fitWpsOverrides(file, rows, changes, issues) {
            const overrides = file.sections.overrides;
            if (!overrides) return;
            const label = fileShortLabel(file);
            const nodeOf = (parent, name) => [...parent.children].find(child => child.tagName === name);
            const targets = {};
            WPS_OVERRIDE_MAP.forEach(({ field, override, keys, factor, fixed }) => {
                const current = wpsReadValue(overrides, override);
                if (current === null || WPS_ZERO_OVERRIDES.includes(override)) return;
                const maximize = WPS_HEAT_OVERRIDES.includes(override) || override === "wire_max";
                let allowed = maximize ? WPS_OVERRIDE_TARGET : current;
                if (wpsCombinedRange(rows, field)) {
                    wpsSegmentsOf(file).forEach(segment => keys.forEach(key => {
                        // Puls-/Grundwert gegen seinen Teilbereich, falls die WPS ihn getrennt angibt
                        const range = wpsCombinedRange(rows, field, wpsKeyPart(key));
                        const raw = wpsReadValue(segment, key);
                        if (raw === null || raw <= 0) return;
                        const value = raw * factor;
                        if (wpsBelow(value, range) || wpsAbove(value, range)) {
                            issues.push(fixed
                                ? `${label}: ${key} ${formatWpsNumber(value, field)} ${WPS_FIELDS[field].unit} is outside the WPS (travel speed is never changed)`
                                : `${label}: ${key} ${formatWpsNumber(value, field)} ${WPS_FIELDS[field].unit} is outside the WPS (use Fit Values)`);
                            return;
                        }
                        const up = range.max !== null ? Math.max(0, (range.max - value) / value * 100) : Infinity;
                        const down = range.min !== null ? Math.max(0, (value - range.min) / value * 100) : Infinity;
                        allowed = Math.min(allowed, up, down);
                    }));
                }
                if (fixed) {
                    if (allowed < current) issues.push(`${label}: ${override} ${formatWpsNumber(current, field)} % reaches outside the WPS (travel speed is never changed)`);
                    return;
                }
                const next = Math.floor(Math.max(0, allowed) * 10 + 1e-9) / 10;   // abgerundet auf 0.1 %: sicher innerhalb
                if (maximize || next < current) targets[override] = next;
            });
            WPS_ZERO_OVERRIDES.forEach(name => { if (nodeOf(overrides, name)) targets[name] = 0; });
            Object.keys(targets).forEach(name => {
                const current = wpsReadValue(overrides, name);
                if (isLocked(name) && targets[name] !== current) {
                    issues.push(`${label}: ${name} is locked`);
                    targets[name] = current;
                }
            });

            // Heat Input: min/max (alle Overrides gleichzeitig) muss in der WPS liegen; sonst die Heat-Overrides gemeinsam
            // so wenig wie noetig skalieren (groesster gemeinsamer Bereich).
            const scalable = WPS_HEAT_OVERRIDES.filter(name => name in targets && !isLocked(name));
            const build = scale => {
                const copy = overrides.cloneNode(true);
                Object.entries(targets).forEach(([name, value]) => {
                    const node = nodeOf(copy, name);
                    if (node) node.textContent = String(scalable.includes(name) ? Math.floor(value * scale * 10 + 1e-9) / 10 : value);
                });
                return copy;
            };
            let scale = 1;
            const heatRange = wpsCombinedRange(rows, "heat");
            if (heatRange) {
                const heatOutside = (testOverrides, nominalOnly) => wpsSegmentsOf(file).some(segment => {
                    const result = calculateSegmentHeatInput(segment, testOverrides);
                    if (result.disabled || result.error) return false;
                    return wpsBelow(nominalOnly ? result.heatInput : result.minHeatInput, heatRange)
                        || wpsAbove(nominalOnly ? result.heatInput : result.maxHeatInput, heatRange);
                });
                if (heatOutside(overrides, true)) {
                    issues.push(`${label}: nominal heat input is outside the WPS (use Fit Values)`);
                } else if (heatOutside(build(1), false)) {
                    let low = 0;
                    let high = 1;
                    for (let step = 0; step < 30; step++) {
                        const middle = (low + high) / 2;
                        if (heatOutside(build(middle), false)) high = middle; else low = middle;
                    }
                    scale = low;
                    // Kontrolle: niemals mit Override-Bereich ausserhalb (sonst schrittweise weiter verkleinern)
                    while (scale > 0 && heatOutside(build(scale), false)) scale = Math.max(0, scale - 0.01);
                    if (heatOutside(build(scale), false)) issues.push(`${label}: heat input min/max outside the WPS also without heat input overrides (locked overrides or travel_max)`);
                }
            }

            // Einmal schreiben (Change Log, Undo ueber applyWpsFit)
            const final = build(scale);
            Object.keys(targets).forEach(name => {
                const node = nodeOf(overrides, name);
                const value = Number(nodeOf(final, name).textContent);
                if (node) wpsWriteValue(file, overrides, "overrides", "", name, wpsFormatLike(node.textContent, value, "down"), changes);
            });
        }

        // Nominalwerte in den WPS-Bereich setzen (nie den Vorschub); Heat Input danach ueber den Strom korrigieren.
        function fitWpsValues(file, rows, changes, issues) {
            const label = fileShortLabel(file);
            wpsSegmentsOf(file).forEach(segment => {
                const segmentIndex = segment.getAttribute("index") || "";
                const segmentLabel = `${label} · Segment ${segmentDisplayNumber(segment, file.sections.segments.indexOf(segment))}`;
                WPS_OVERRIDE_MAP.forEach(({ field, keys, factor, fixed }) => {
                    if (!wpsCombinedRange(rows, field)) return;
                    keys.forEach(key => {
                        const range = wpsCombinedRange(rows, field, wpsKeyPart(key));
                        const raw = wpsReadValue(segment, key);
                        if (raw === null) return;
                        const node = [...segment.children].find(child => child.tagName === key);
                        const value = raw * factor;
                        let text = null;
                        if (wpsAbove(value, range)) text = wpsFormatLike(node.textContent, range.max / factor, "down");
                        else if (wpsBelow(value, range)) text = wpsFormatLike(node.textContent, range.min / factor, "up");
                        if (text === null) return;
                        if (fixed) { issues.push(`${segmentLabel}: ${key} ${formatWpsNumber(value, field)} ${WPS_FIELDS[field].unit} is outside the WPS (travel speed is never changed)`); return; }
                        if (isLocked(key)) { issues.push(`${segmentLabel}: ${key} is locked`); return; }
                        wpsWriteValue(file, segment, "segments", segmentIndex, key, text, changes);
                    });
                });
                const heatRange = wpsCombinedRange(rows, "heat");
                if (!heatRange) return;
                const result = calculateSegmentHeatInput(segment, file.sections.overrides);
                if (result.disabled || result.error) return;
                let target = null;
                if (wpsAbove(result.heatInput, heatRange)) target = heatRange.max * (1 - 1e-4);
                else if (wpsBelow(result.heatInput, heatRange)) target = heatRange.min * (1 + 1e-4);
                if (target === null) return;
                // Heat Input ~ Strom (U·I): Puls- und Grundstrom mit demselben Faktor aendern, im WPS-Strombereich.
                let ratio = target / result.heatInput;
                const amps = ["pri_amp", "bkg_amp"].map(key => ({ key, value: wpsReadValue(segment, key) })).filter(item => item.value > 0);
                if (!amps.length || amps.some(item => isLocked(item.key))) { issues.push(`${segmentLabel}: heat input outside, current cannot be changed`); return; }
                amps.forEach(({ key, value }) => {
                    const currentRange = wpsCombinedRange(rows, "current", wpsKeyPart(key));
                    if (!currentRange) return;
                    if (currentRange.max !== null && ratio > 1) ratio = Math.min(ratio, currentRange.max / value);
                    if (currentRange.min !== null && ratio < 1) ratio = Math.max(ratio, currentRange.min / value);
                });
                amps.forEach(({ key, value }) => {
                    const node = [...segment.children].find(child => child.tagName === key);
                    wpsWriteValue(file, segment, "segments", segmentIndex, key, wpsFormatLike(node.textContent, value * ratio, ratio < 1 ? "down" : "up"), changes);
                });
                const after = calculateSegmentHeatInput(segment, file.sections.overrides);
                if (wpsAbove(after.heatInput, heatRange) || wpsBelow(after.heatInput, heatRange)) {
                    issues.push(`${segmentLabel}: heat input ${formatWpsNumber(after.heatInput, "heat")} kJ/mm still outside (current at the WPS limit)`);
                }
            });
        }

        // Auf die markierten Dateien mit WPS-Zeile anwenden (keine Markierung: alle), mit Undo.
        // Fit Values ist ein tiefer Eingriff ins Programm: vorher bestaetigen lassen (Cancel ist vorausgewaehlt).
        const wpsFitValuesModal = document.getElementById("wpsFitValuesModal");
        function confirmWpsFitValues() {
            const store = readWpsStore();
            if (!store) return;
            const affected = loadedFiles.filter((file, index) => (!selectedFiles.size || selectedFiles.has(index))
                && store.rows.some(row => row.files.includes(fileTargetKey(file))));
            document.getElementById("wpsFitValuesText").textContent = affected.length
                ? `Affected program(s) (${affected.length}): ${affected.map(fileShortLabel).join(", ")}. Every change is listed in the change log and can be undone with Ctrl+Z.`
                : "No selected program is assigned to a WPS pass – nothing will be changed.";
            document.getElementById("wpsFitValuesConfirmBtn").disabled = !affected.length;
            const cancel = document.getElementById("wpsFitValuesCancelBtn");
            openModal(wpsFitValuesModal, cancel);
            // erst sichtbar, dann fokussieren: Enter bestaetigt so nie versehentlich
            window.setTimeout(() => cancel.focus(), 60);
        }
        document.getElementById("wpsFitValuesCancelBtn").onclick = () => {
            closeModal(wpsFitValuesModal);
            document.getElementById("status").textContent = "Fit Values cancelled – no values changed.";
        };
        document.getElementById("wpsFitValuesConfirmBtn").onclick = () => {
            closeModal(wpsFitValuesModal);
            applyWpsFit("values");
        };

        function applyWpsFit(mode) {
            const store = readWpsStore();
            if (!store) return;
            const selected = loadedFiles.filter((file, index) => !selectedFiles.size || selectedFiles.has(index));
            const targets = selected.map(file => ({ file, rows: store.rows.filter(row => row.files.includes(fileTargetKey(file))) })).filter(item => item.rows.length);
            const changes = [];
            const issues = [];
            recordHistoryAction(mode === "overrides" ? "Fit overrides to WPS" : "Fit values to WPS", () => {
                targets.forEach(({ file, rows }) => (mode === "overrides" ? fitWpsOverrides : fitWpsValues)(file, rows, changes, issues));
            });
            renderFileList();
            renderWps();
            const files = new Set(changes.map(change => change.file)).size;
            const what = mode === "overrides" ? "Overrides fitted" : "Values fitted";
            document.getElementById("status").textContent = `${what} to the WPS: ${changes.length} value(s) changed in ${files} file(s) (undo with Ctrl+Z).`
                + (issues.length ? ` Not solved: ${issues.slice(0, 4).join("; ")}${issues.length > 4 ? ` … (+${issues.length - 4})` : ""}` : "");
            const list = document.getElementById("wpsFitResult");
            if (list) {
                list.replaceChildren(...[...changes.map(change => `${change.file}${change.segmentIndex !== "" ? ` · segment ${Number(change.segmentIndex) + 1}` : ""}: ${change.key} ${change.oldValue} → ${change.newValue}`),
                    ...issues.map(issue => `Not solved – ${issue}`)].map(text => {
                    const line = document.createElement("div");
                    line.className = text.startsWith("Not solved") ? "wps-fit-line is-issue" : "wps-fit-line";
                    line.textContent = text;
                    return line;
                }));
                if (!changes.length && !issues.length) list.textContent = "Nothing to change: all values and override ranges are inside the WPS.";
            }
        }

        function formatWpsNumber(value, field) {
            if (value === null || !Number.isFinite(value)) return "–";
            return Number(value.toFixed(DISPLAY_DECIMALS)).toString();
        }

        function describeWpsRange(range, field) {
            if (!range || (range.min === null && range.max === null)) return "–";
            // Getrennte Puls-/Grundbereiche: "P 180 – 290 · B 140 – 250"
            if (WPS_SUB_PARTS.some(part => range[part])) {
                return WPS_SUB_PARTS.filter(part => range[part]).map(part => `${WPS_PART_TAGS[part]} ${describeWpsRange({ min: range[part].min, max: range[part].max }, field)}`).join(" · ");
            }
            if (range.min === null) return `≤ ${formatWpsNumber(range.max, field)}`;
            if (range.max === null) return `≥ ${formatWpsNumber(range.min, field)}`;
            return `${formatWpsNumber(range.min, field)} – ${formatWpsNumber(range.max, field)}`;
        }

        /* Ansicht "WPS Import / Check" */
        function renderWps() {
            commitPendingEdit();
            const content = document.getElementById("content");
            content.innerHTML = "";
            appendHeatToolHeader(content);
            const store = readWpsStore();
            const working = wpsDraft || (store ? { document: store.document, wpsNumber: store.wpsNumber, page: store.page ?? null, rows: store.rows.map(normalizeWpsRow), notes: [], lines: null } : null);

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
                    wpsDraft = {
                        document: file.name, wpsNumber: parsed.wpsNumber, page: parsed.forms?.[0]?.page ?? null,
                        rows: assignWpsFiles(parsed.rows.map(normalizeWpsRow)), notes: parsed.notes, lines,
                        forms: parsed.forms || null, formIndex: 0
                    };
                    renderWps();
                    const formInfo = parsed.forms?.length > 1 ? ` ${parsed.forms.length} WPS forms in the document (pages ${parsed.forms.map(form => form.page).join(", ")}); showing page ${parsed.forms[0].page}.` : "";
                    document.getElementById("wpsStatus").textContent = `${file.name}: ${parsed.rows.length} pass row(s) found${parsed.wpsNumber ? `, WPS ${parsed.wpsNumber}` : ""}.${formInfo} Check the values and click "Apply".`;
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
            title.textContent = wpsDraft ? "Ranges read from the WPS (not applied yet)" : `WPS ranges in use${store.document ? ` – ${store.document}${store.page ? `, page ${store.page}` : ""}` : ""}`;
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
            // Mehrere WPS-Formulare im Dokument: Auswahl
            if (working.forms?.length > 1) {
                const formLabel = document.createElement("label");
                formLabel.className = "wps-meta wps-form-choice";
                const formSelect = document.createElement("select");
                formSelect.id = "wpsFormSelect";
                working.forms.forEach((form, index) => formSelect.add(new Option(
                    `Page ${form.page}${form.wpsNumber ? ` – ${form.wpsNumber}` : ""} (${form.rows.length} pass row(s))`, String(index), false, index === working.formIndex)));
                formSelect.onchange = () => {
                    const form = working.forms[Number(formSelect.value)];
                    Object.assign(working, {
                        formIndex: Number(formSelect.value), page: form.page, wpsNumber: form.wpsNumber,
                        rows: assignWpsFiles(form.rows.map(normalizeWpsRow)), notes: form.notes
                    });
                    wpsDraft = working;
                    renderWps();
                };
                formLabel.append(document.createTextNode("WPS in the document: "), formSelect);
                rangePanel.appendChild(formLabel);
            }
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
                    const parts = WPS_SUB_PARTS.filter(part => row[key][part]);
                    ["min", "max"].forEach(bound => {
                        if (!parts.length) {
                            tr.appendChild(textCell(row[key][bound] === null ? "" : String(row[key][bound]), value => {
                                const number = value.trim() === "" ? null : parseNumberInput(value);
                                row[key][bound] = Number.isFinite(number) ? number : null;
                            }, `wps-number-input wps-${key}-${bound}`));
                            return;
                        }
                        // Getrennte Bereiche fuer Puls (P) und Grund (B): je eine Eingabe, min/max = Vereinigung
                        const td = document.createElement("td");
                        td.className = "wps-split-cell";
                        parts.forEach(part => {
                            const line = document.createElement("label");
                            line.className = "wps-split-line";
                            const tag = document.createElement("span");
                            tag.textContent = WPS_PART_TAGS[part];
                            const field = document.createElement("input");
                            field.type = "text";
                            field.className = `wps-number-input wps-${key}-${part}-${bound}`;
                            field.value = row[key][part][bound] === null ? "" : String(row[key][part][bound]);
                            field.oninput = () => {
                                const number = field.value.trim() === "" ? null : parseNumberInput(field.value);
                                row[key][part][bound] = Number.isFinite(number) ? number : null;
                                const values = parts.map(name => row[key][name][bound]).filter(value => value !== null);
                                row[key][bound] = values.length ? (bound === "min" ? Math.min(...values) : Math.max(...values)) : null;
                                markDirty();
                            };
                            line.append(tag, field);
                            td.appendChild(line);
                        });
                        tr.appendChild(td);
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
            applyBtn.title = "Store the ranges and set the heat input ranges as target ranges (Heat Input tab)";
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
                summary.textContent = `Text read from the PDF${working.page ? ` (page ${working.page})` : ""} for comparison`;
                const pre = document.createElement("pre");
                pre.textContent = working.lines.filter(line => !working.page || line.page === working.page).map(line => line.text).join("\n");
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
                const fitActions = document.createElement("div");
                fitActions.className = "wps-actions wps-fit-actions";
                const fitOverrides = document.createElement("button");
                fitOverrides.type = "button";
                fitOverrides.className = "btn-secondary";
                fitOverrides.id = "wpsFitOverridesBtn";
                fitOverrides.textContent = "Fit Overrides";
                fitOverrides.title = "Set the current and voltage overrides of the selected files to the largest range up to 10 % so that no override setting can leave the WPS (each value and the heat input); dwell_max and excursion_max are set to 0 %. wire_max likewise up to 10 % within the WPS wire range. Values and travel_max are not changed.";
                fitOverrides.onclick = () => applyWpsFit("overrides");
                const fitValues = document.createElement("button");
                fitValues.type = "button";
                fitValues.className = "btn-secondary";
                fitValues.id = "wpsFitValuesBtn";
                fitValues.textContent = "Fit Values";
                fitValues.title = "Set current, voltage, wire, dwell and excursion of the selected files to the nearest WPS limit; then correct the heat input with the current (within the WPS current range). The travel speed is never changed.";
                fitValues.onclick = confirmWpsFitValues;
                const fitHint = document.createElement("span");
                fitHint.className = "wps-hint";
                fitHint.textContent = "Applies to the selected files with a WPS row · undo with Ctrl+Z · listed in the change log";
                fitActions.append(fitOverrides, fitValues, fitHint);
                checkPanel.appendChild(fitActions);
                const fitResult = document.createElement("div");
                fitResult.className = "wps-fit-result";
                fitResult.id = "wpsFitResult";
                checkPanel.appendChild(fitResult);
            }
            if (checked.length) {
                // Tabelle: je WPS-Lage eine Gruppenzeile mit den Bereichen, darunter je Datei/Segment eine Zeile;
                // Puls (P) und Grund (B) in eigenen Spalten, Status als Wort.
                const mean = store.checkMode === "mean";
                // Spalten je Feld (P/B, In/Out oder ein Wert); im Mittelwert-Modus P/B zusammengefasst
                const fieldParts = key => (mean && WPS_CHECK_PARTS[key][0].part === "pri" ? [{ part: "mean", tag: "mean" }] : WPS_CHECK_PARTS[key]);
                const columnCount = 2 + WPS_FIELD_KEYS.reduce((sum, key) => sum + fieldParts(key).length, 0);
                const checkTable = document.createElement("table");
                checkTable.className = "heat-table wps-check-table";
                checkTable.innerHTML = "<thead><tr><th rowspan=\"2\">Schedule</th>"
                    + WPS_FIELD_KEYS.map(key => `<th colspan="${fieldParts(key).length}" class="wps-col-group">${WPS_FIELDS[key].label} (${WPS_FIELDS[key].unit})</th>`).join("")
                    + "<th rowspan=\"2\">Status</th></tr><tr class=\"heat-unit-row\">"
                    + WPS_FIELD_KEYS.map(key => fieldParts(key).map((item, index) => `<th class="num${index === 0 ? " wps-col-group" : ""}">${item.tag}</th>`).join("")).join("")
                    + "</tr></thead>";
                const checkBody = document.createElement("tbody");
                const statusWord = { ok: "OK", warn: "Override", fail: "Outside", na: "–", off: "Off" };
                const worst = list => (list.some(item => item.status === "fail") ? "fail" : list.some(item => item.status === "warn") ? "warn" : list.length ? "ok" : "na");
                const describeCheck = (check, key) => {
                    const part = { pri: "pulse", bkg: "background", in: "in-dwell", out: "out-dwell", mean: "mean", "": "nominal" }[check.part];
                    const state = { ok: "inside", warn: "override range outside", fail: "outside", na: "–" }[check.status];
                    const span = check.low !== undefined ? ` (override ${formatWpsNumber(check.low, key)} – ${formatWpsNumber(check.high, key)})` : "";
                    return `${check.row.label}: ${part} ${formatWpsNumber(check.value, key)} ${WPS_FIELDS[key].unit}, WPS ${describeWpsRange(check.row[key], key)} → ${state}${span}`;
                };
                // Gruppen nach zugeordneten WPS-Zeilen (Reihenfolge wie in der WPS)
                const groups = [];
                checked.forEach(result => {
                    const key = result.rows.map(row => store.rows.indexOf(row)).join("+");
                    let group = groups.find(item => item.key === key);
                    if (!group) groups.push(group = { key, rows: result.rows, results: [] });
                    group.results.push(result);
                });
                groups.sort((x, y) => store.rows.indexOf(x.rows[0]) - store.rows.indexOf(y.rows[0]));
                groups.forEach(group => {
                    const groupRow = document.createElement("tr");
                    groupRow.className = "wps-group-row";
                    const name = document.createElement("td");
                    name.className = "wps-group-name";
                    name.textContent = group.rows.map(row => row.label).join(" + ");
                    groupRow.appendChild(name);
                    const rangeCell = (key, span, part = "", separator = true) => {
                        const td = document.createElement("td");
                        td.className = `num wps-range-cell${separator ? " wps-col-group" : ""}`;
                        if (span) td.colSpan = span;
                        const range = wpsCombinedRange(group.rows, key, part);
                        td.textContent = describeWpsRange(range, key);
                        return td;
                    };
                    // Getrennte Teilbereiche (P/B, In/Out) unter ihren Spalten, sonst ein Bereich ueber alle Spalten des Felds
                    WPS_FIELD_KEYS.forEach(key => {
                        const parts = fieldParts(key);
                        const split = parts.length > 1 && group.rows.some(row => parts.some(item => row[key][item.part]));
                        if (split) parts.forEach((item, index) => groupRow.appendChild(rangeCell(key, 0, item.part, index === 0)));
                        else groupRow.appendChild(rangeCell(key, parts.length > 1 ? parts.length : 0));
                    });
                    const rangeLabel = document.createElement("td");
                    rangeLabel.className = "wps-range-label";
                    rangeLabel.textContent = "WPS range";
                    groupRow.appendChild(rangeLabel);
                    checkBody.appendChild(groupRow);
                    group.results.forEach(result => {
                        const segmentCount = result.file.sections.segments.length;
                        result.entries.forEach(entry => {
                            const segment = result.file.sections.segments[entry.segmentIndex];
                            const tr = document.createElement("tr");
                            const status = entry.disabled ? "off" : entry.status;
                            tr.className = `heat-segment-row wps-segment-row is-${status}`;
                            tr.dataset.file = result.file.name;
                            tr.tabIndex = 0;
                            tr.title = "Open segment";
                            tr.onclick = () => openHeatInputSegment(result.fileIndex, entry.segmentIndex);
                            tr.onkeydown = event => { if (event.key === "Enter") tr.click(); };
                            const label = document.createElement("td");
                            label.className = "wps-schedule-name";
                            label.textContent = result.file.name.replace(/\.xml$/i, "")
                                + (segmentCount > 1 ? ` · Seg ${segmentDisplayNumber(segment, entry.segmentIndex)}` : "");
                            tr.appendChild(label);
                            const valueCell = (key, checks, part, span, first) => {
                                const td = document.createElement("td");
                                td.className = "num wps-cell";
                                if (span) td.colSpan = span;
                                if (first) td.classList.add("wps-col-group");
                                if (!checks.length) { td.textContent = "–"; return td; }
                                td.classList.add(`is-${worst(checks)}`);
                                td.dataset.field = key;
                                td.dataset.part = part;
                                td.textContent = formatWpsNumber(checks[0].value, key);
                                td.title = checks.map(check => describeCheck(check, key)).join("\n");
                                return td;
                            };
                            WPS_FIELD_KEYS.forEach(key => {
                                const parts = fieldParts(key);
                                const checks = entry.values[key]?.checks || [];
                                if (entry.disabled) { tr.appendChild(valueCell(key, [], "", parts.length > 1 ? parts.length : 0, true)); return; }
                                parts.forEach((item, index) => tr.appendChild(valueCell(key, checks.filter(check => check.part === item.part), item.part, 0, index === 0)));
                            });
                            const statusCell = document.createElement("td");
                            statusCell.className = `wps-status-cell is-${status}`;
                            statusCell.textContent = statusWord[status] || "–";
                            tr.appendChild(statusCell);
                            checkBody.appendChild(tr);
                        });
                    });
                });
                if (unassigned.length) {
                    const row = document.createElement("tr");
                    row.className = "wps-unassigned-row";
                    const cell = document.createElement("td");
                    cell.colSpan = columnCount;
                    cell.textContent = `Not checked (no WPS pass assigned): ${unassigned.join(", ")}`;
                    row.appendChild(cell);
                    checkBody.appendChild(row);
                }
                checkTable.appendChild(checkBody);
                const checkWrap = document.createElement("div");
                checkWrap.className = "heat-table-wrap";
                checkWrap.appendChild(checkTable);
                checkPanel.appendChild(checkWrap);
                const legend = document.createElement("p");
                legend.className = "wps-hint";
                legend.textContent = "P = pulse (pri), B = background (bkg). Outside: value outside the WPS. Override: value inside, but value ± override (pri/bkg_amp_max, avc_override_max, travel_max, wire_max, dwell_max, excursion_max; heat input min/max) reaches outside. Dwell: In = indwell, Out = outdwell. Travel and wire converted from in/min. Click a row to open the segment; hover a value for details.";
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
            document.getElementById("status").textContent = "Batch save cancelled: values outside the WPS (Tools › Heat Input & WPS).";
        };
        document.getElementById("wpsSaveShowBtn").onclick = () => {
            pendingWpsSave = null;
            closeModal(wpsSaveModal);
            openHeatTool("wps");
        };
        document.getElementById("wpsSaveConfirmBtn").onclick = () => {
            const proceed = pendingWpsSave;
            pendingWpsSave = null;
            closeModal(wpsSaveModal);
            if (proceed) proceed();
        };

