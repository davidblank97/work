        /* ================================================================
           HEAT INPUT EVALUATION
           Liburdi-Log (CSV) -> Auswertung wie template_metric_Short.xlsx (Blatt "Data"),
           korrigiert (Zeitachse, Diagrammbereiche, Datenende, Einheiten) und ohne Power Query.
           Siehe WDR_converter/PLAN_Excel_Vorlage.md (Befunde zur Vorlage).
           ================================================================ */

        function wdrSplitLine(line, delimiter) {
            const result = [];
            let current = "";
            let inQuotes = false;
            for (let i = 0; i < line.length; i++) {
                const char = line[i];
                if (char === '"') {
                    if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
                    else inQuotes = !inQuotes;
                } else if (char === delimiter && !inQuotes) {
                    result.push(current.trim());
                    current = "";
                } else {
                    current += char;
                }
            }
            result.push(current.trim());
            return result;
        }

        function wdrTrimCells(cells) {
            const copy = cells.slice();
            while (copy.length && copy[copy.length - 1] === "") copy.pop();
            return copy;
        }

        const WDR_NUMBER = /^[-+]?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?$/;
        function wdrNumber(text, decimalComma) {
            if (text === undefined || text === null) return NaN;
            let value = String(text).trim();
            if (decimalComma) value = value.replace(",", ".");
            return WDR_NUMBER.test(value) ? Number(value) : NaN;
        }

        // Zerlegt ein Liburdi-Log (Version 2 und 3) in Kopf, LIMITS und die Bloecke DATA,
        // SEGMENT_AVERAGE und SETPOINT. Trennzeichen "," (Standard) oder ";" mit Dezimalkomma.
        function parseLiburdiLog(text) {
            const lines = text.split(/\r?\n/);
            const sample = lines.slice(0, 40).join("\n");
            const delimiter = (sample.match(/;/g) || []).length > (sample.match(/,/g) || []).length ? ";" : ",";
            const decimalComma = delimiter === ";";
            const log = { delimiter, decimalComma, header: {}, version: "", limits: null, blocks: {} };
            const isMarker = cells => /_TAGS$/.test(cells[0]) || /^STOP TIME$/i.test(cells[0]);
            let i = 0;
            while (i < lines.length) {
                const line = lines[i];
                if (line.trim() === "") { i++; continue; }
                const cells = wdrSplitLine(line, delimiter);
                const key = cells[0];
                const tagMatch = key.match(/^([A-Z0-9_ ]+)_TAGS$/);
                if (tagMatch) {
                    const name = tagMatch[1];
                    const tags = wdrTrimCells(wdrSplitLine(lines[i + 1] || "", delimiter));
                    i += 2;
                    let uom = [];
                    if ((wdrSplitLine(lines[i] || "", delimiter)[0] || "") === `${name}_UOM`) {
                        uom = wdrSplitLine(lines[i + 1] || "", delimiter);
                        i += 2;
                    }
                    if (name === "LIMITS") {
                        const values = wdrSplitLine(lines[i] || "", delimiter);
                        log.limits = { tags, values: tags.map((_, index) => wdrNumber(values[index], decimalComma)) };
                        i += 1;
                        continue;
                    }
                    const rows = [];
                    while (i < lines.length) {
                        const rowLine = lines[i];
                        if (rowLine.trim() === "") { i++; continue; }
                        const rowCells = wdrSplitLine(rowLine, delimiter);
                        if (isMarker(rowCells) || Number.isNaN(wdrNumber(rowCells[0], decimalComma))) break;
                        rows.push(rowCells);
                        i++;
                    }
                    log.blocks[name] = { tags, uom, rows };
                    continue;
                }
                if (key && cells.length >= 2) {
                    const value = [...cells].reverse().find(cell => cell !== "") || "";
                    log.header[key.toUpperCase()] = value;
                    if (/^LIBURDI DATA LOG$/i.test(key)) log.version = value;
                }
                i++;
            }
            return log;
        }

        // Spalte ueber den Namen (ohne Gross-/Kleinschreibung und Leerzeichen).
        function wdrColumn(block, name) {
            const wanted = name.toLowerCase().replace(/\s+/g, "");
            return block.tags.findIndex(tag => tag.toLowerCase().replace(/\s+/g, "") === wanted);
        }

        // Umrechnung auf cm/min, kJ/mm bzw. mm.
        function wdrTravelFactor(unit) {
            const u = String(unit || "").trim().toLowerCase();
            if (u === "ipm" || u === "in/min") return 2.54;
            if (u === "mm/min") return 0.1;
            return 1;
        }
        function wdrHeatFactor(unit) {
            const u = String(unit || "").trim().toLowerCase();
            if (u === "j/in") return 1 / 25400;
            if (u === "j/mm") return 1 / 1000;
            if (u === "kj/in") return 1 / 25.4;
            return 1;
        }
        function wdrLengthFactor(unit) {
            const u = String(unit || "").trim().toLowerCase();
            if (u === "mm") return 1;
            if (u === "cm") return 10;
            return 25.4; // "in"; Version 2 schreibt faelschlich "deg", die Werte sind Zoll
        }

        // Metrische Einheit fuer eine Spalte der Bloecke SEGMENT_AVERAGE/SETPOINT: { factor, unit }.
        function wdrMetricUnit(unit, tag) {
            const u = String(unit || "").trim().toLowerCase();
            if (/distance/i.test(tag || "")) return { factor: wdrLengthFactor(unit), unit: "mm" };
            if (u === "ipm" || u === "in/min") return { factor: 2.54, unit: "cm/min" };
            if (u === "in") return { factor: 25.4, unit: "mm" };
            if (u === "j/in" || u === "j/mm" || u === "kj/in") return { factor: wdrHeatFactor(unit), unit: "kJ/mm" };
            return { factor: 1, unit: unit || "" };
        }

        // Dauerbetrieb aus den Sollwerten: ab wann Strom und Vorschub ihren Dauerwert haben und
        // wann der Downslope beginnt. Version 3 liefert ausserdem die Pendelperiode.
        function wdrSetpointInfo(log) {
            const block = log.blocks.SETPOINT;
            if (!block || block.rows.length < 2) return null;
            const time = wdrColumn(block, "Time");
            const columns = ["Pri Amps", "Bkg Amps", "Pri Travel", "Bkg Travel"].map(name => wdrColumn(block, name)).filter(index => index >= 0);
            if (time < 0 || !columns.length) return null;
            const rows = block.rows.map(cells => cells.map(cell => wdrNumber(cell, log.decimalComma)));
            const lastTime = rows[rows.length - 1][time];
            const steady = columns.map(column => {
                const durations = new Map();
                rows.forEach((row, index) => {
                    const next = index + 1 < rows.length ? rows[index + 1][time] : lastTime;
                    durations.set(row[column], (durations.get(row[column]) || 0) + (next - row[time]));
                });
                return [...durations.entries()].sort((a, b) => b[1] - a[1])[0][0];
            });
            const atSteady = row => columns.every((column, index) => row[column] === steady[index]);
            const startIndex = rows.findIndex(atSteady);
            if (startIndex < 0) return null;
            let endIndex = rows.length;
            for (let index = startIndex + 1; index < rows.length; index++) {
                if (!atSteady(rows[index])) { endIndex = index; break; }
            }
            const info = { start: rows[startIndex][time], end: endIndex < rows.length ? rows[endIndex][time] : Infinity, period: null };
            const indwell = wdrColumn(block, "In-Dwell");
            const outdwell = wdrColumn(block, "Out-Dwell");
            const excursion = wdrColumn(block, "Excursion");
            if (indwell >= 0 && outdwell >= 0 && excursion >= 0) {
                const row = rows[startIndex];
                // volle Pendelperiode: In-Dwell + Excursion + Out-Dwell + Excursion
                const period = row[indwell] + row[outdwell] + 2 * row[excursion];
                if (period > 0) info.period = period;
            }
            return info;
        }

        // Auswertebereich: immer der Dauerbetrieb laut Sollwerten (ohne Up-/Downslope);
        // Fenster: immer die Pendelperiode aus dem Log (periodSeconds nur, wenn das Log keine enthaelt).
        const WDR_DEFAULT_SETTINGS = {
            processFactor: 0.6,
            periodSeconds: 1.0,
            wireDiameter: 0.8,          // mm, Schweissdraht
            wireDensity: 7.85,          // g/cm³, Stahl
            summary: true,
            useTargets: true,
            rawSheet: false             // Blatt "Raw data" mit allen Logspalten (Datei etwa doppelt so gross)
        };

        // Berechnung wie Blatt "Data" der Vorlage; Data-Zeile r entspricht Messpunkt r-4.
        function evaluateHeatInput(log, userSettings = {}) {
            const settings = { ...WDR_DEFAULT_SETTINGS, ...userSettings };
            const data = log.blocks.DATA;
            if (!data || !data.rows.length) throw new Error("No DATA block in the log.");
            const column = name => wdrColumn(data, name);
            const indexes = {
                time: column("Time"), pulse: column("PulseState"), amps: column("Amps"), volts: column("Volts"),
                travel: column("Travel"), wire: column("Wire"), heat: column("Heat Input")
            };
            ["time", "amps", "volts", "travel"].forEach(key => {
                if (indexes[key] < 0) throw new Error(`Column "${key}" missing in DATA_TAGS.`);
            });
            const travelFactor = wdrTravelFactor(data.uom[indexes.travel]);
            const wireFactor = indexes.wire >= 0 ? wdrTravelFactor(data.uom[indexes.wire]) : 1;
            const heatFactor = indexes.heat >= 0 ? wdrHeatFactor(data.uom[indexes.heat]) : 1;
            const n = data.rows.length;
            const make = () => new Float64Array(n).fill(NaN);
            const col = { time: make(), pulse: make(), amps: make(), volts: make(), travel: make(), wire: make(), heat: make() };
            const dc = log.decimalComma;
            for (let i = 0; i < n; i++) {
                const row = data.rows[i];
                col.time[i] = wdrNumber(row[indexes.time], dc);
                if (indexes.pulse >= 0) col.pulse[i] = wdrNumber(row[indexes.pulse], dc);
                col.amps[i] = wdrNumber(row[indexes.amps], dc);
                col.volts[i] = wdrNumber(row[indexes.volts], dc);
                col.travel[i] = wdrNumber(row[indexes.travel], dc) * travelFactor;
                if (indexes.wire >= 0) col.wire[i] = wdrNumber(row[indexes.wire], dc) * wireFactor;
                if (indexes.heat >= 0) col.heat[i] = wdrNumber(row[indexes.heat], dc) * heatFactor;
            }
            const k = settings.processFactor;
            const H = col.heat;                                     // Methode C (Maschine)
            const I = col.travel.map(value => value * 10);          // mm/min
            const J = col.time.map(value => value / 1000);          // s
            const K = J.map(value => value / 60);                   // min (Vorlage: (J+J_naechste)/60)
            const L = make();                                       // Methode A je Messpunkt
            for (let i = 0; i < n; i++) {
                const value = col.amps[i] * col.volts[i] / I[i] * 0.06 * k;
                if (I[i] > 0 && Number.isFinite(value)) L[i] = value;
            }
            const M = make();
            const N = make();
            for (let i = 0; i < n; i++) {
                if (col.pulse[i] === 0) M[i] = L[i];
                else if (col.pulse[i] === 1) N[i] = L[i];
            }
            // Gleitende Mittel (vorwaerts, wie AVERAGE(Lr:Lr+103)) – nur vollstaendige Fenster mit gueltigen Werten,
            // die nicht in den Downslope reichen.
            const prefix = new Float64Array(n + 1);
            const valid = new Int32Array(n + 1);
            for (let i = 0; i < n; i++) {
                const ok = Number.isFinite(L[i]);
                prefix[i + 1] = prefix[i] + (ok ? L[i] : 0);
                valid[i + 1] = valid[i] + (ok ? 1 : 0);
            }
            const setpoints = wdrSetpointInfo(log);
            // letzter Messpunkt vor dem Downslope (ohne Sollwerte: letzter Messpunkt)
            const downslopeIndex = (() => {
                if (!setpoints || !Number.isFinite(setpoints.end)) return n - 1;
                let index = n - 1;
                while (index > 0 && col.time[index] >= setpoints.end) index--;
                return index;
            })();
            const periodSeconds = setpoints?.period || settings.periodSeconds;
            // Vorwaerts-Mittel ueber ein Zeitfenster: nur vollstaendige Fenster mit gueltigen Werten vor dem Downslope.
            const rolling = seconds => {
                const out = make();
                let end = 0;
                for (let i = 0; i < n; i++) {
                    if (end < i) end = i;
                    while (end < n && J[end] < J[i] + seconds) end++;
                    if (end >= n || end > downslopeIndex + 1) break;
                    const count = end - i;
                    if (count > 0 && valid[end] - valid[i] === count) out[i] = (prefix[end] - prefix[i]) / count;
                }
                return out;
            };
            const O = rolling(periodSeconds);
            const P = rolling(periodSeconds * 10);

            // Auswertebereich a..b: Dauerbetrieb laut Sollwerten; ohne Sollwerte das ganze Log.
            let a = 0;
            const b = downslopeIndex;
            let rangeNote = "whole log (no set points in the log)";
            if (setpoints) {
                while (a < n && col.time[a] < setpoints.start) a++;
                rangeNote = "steady state from the set points (after up-slope, before down-slope)";
            }
            if (!(b >= a)) throw new Error(`The evaluation range is empty (log has ${n} data rows).`);
            const stats = values => {
                let min = Infinity; let max = -Infinity; let sum = 0; let count = 0;
                for (let i = a; i <= b; i++) {
                    const value = values[i];
                    if (!Number.isFinite(value)) continue;
                    if (value < min) min = value;
                    if (value > max) max = value;
                    sum += value; count++;
                }
                return count ? { min, max, avg: sum / count, count } : { min: NaN, max: NaN, avg: NaN, count: 0 };
            };
            const result = { sleeked: stats(P), perPeriod: stats(O), perPeak: stats(L), methodC: stats(H) };
            result.ratioAC = result.perPeak.avg / result.methodC.avg;
            // Energie/Weg ueber den Bereich (Summe U*I*dt / Summe v*dt) – unempfindlich gegen v ~ 0.
            let energy = 0;
            let distance = 0;
            for (let i = a; i < b; i++) {
                const dt = J[i + 1] - J[i];
                if (!(dt > 0) || !Number.isFinite(col.amps[i]) || !Number.isFinite(col.volts[i]) || !Number.isFinite(I[i])) continue;
                energy += col.amps[i] * col.volts[i] * dt;
                distance += Math.max(0, I[i]) / 60 * dt;
            }
            result.energyPerDistance = distance > 0 ? k * energy / distance / 1000 : NaN;
            result.machine = wdrMachineAverages(log, k);
            // Schweisszeit (Dauer des Logs) und Drahtverbrauch ueber die ganze Schweissung
            let first = 0;
            while (first < n && !Number.isFinite(J[first])) first++;
            let last = n - 1;
            while (last > first && !Number.isFinite(J[last])) last--;
            result.weldTime = last > first ? J[last] - J[first] : NaN; // s
            let wireCm = 0;
            let wireValid = false;
            for (let i = 0; i + 1 < n; i++) {
                const dt = J[i + 1] - J[i];
                if (!(dt > 0) || !Number.isFinite(col.wire[i])) continue;
                wireCm += Math.max(0, col.wire[i]) / 60 * dt; // cm/min · s
                wireValid = true;
            }
            result.wireLength = wireValid ? wireCm / 100 : NaN; // m
            const wireArea = Math.PI * (settings.wireDiameter / 2) ** 2; // mm²
            result.wireMass = wireValid ? result.wireLength * wireArea * settings.wireDensity / 1000 : NaN; // m·mm²·g/cm³ = g -> kg
            return {
                settings, n, a, b, rangeNote, periodSeconds, setpoints,
                units: { travel: data.uom[indexes.travel] || "", heat: indexes.heat >= 0 ? (data.uom[indexes.heat] || "") : "", wire: indexes.wire >= 0 ? (data.uom[indexes.wire] || "") : "" },
                columns: { time: col.time, pulse: col.pulse, amps: col.amps, volts: col.volts, travel: col.travel, wire: col.wire, H, I, J, K, L, M, N, O, P },
                result
            };
        }

        // Segment-Mittelwerte der Maschine: Energie/Weg je Segment (Distance in Zoll).
        function wdrMachineAverages(log, factor) {
            const block = log.blocks.SEGMENT_AVERAGE;
            if (!block || !block.rows.length) return null;
            const energy = wdrColumn(block, "Energy");
            const distance = wdrColumn(block, "Distance");
            const heat = wdrColumn(block, "Heat Input");
            const segment = wdrColumn(block, "Segment Number");
            if (energy < 0 || distance < 0) return null;
            const lengthFactor = wdrLengthFactor(block.uom[distance]);
            const heatFactor = heat >= 0 ? wdrHeatFactor(block.uom[heat]) : null;
            let totalEnergy = 0;
            let totalDistance = 0;
            const segments = block.rows.map(cells => {
                const e = wdrNumber(cells[energy], log.decimalComma);
                const d = wdrNumber(cells[distance], log.decimalComma) * lengthFactor;
                if (Number.isFinite(e) && Number.isFinite(d)) { totalEnergy += e; totalDistance += d; }
                const logged = heat >= 0 ? wdrNumber(cells[heat], log.decimalComma) * heatFactor : NaN;
                return { segment: segment >= 0 ? cells[segment] : "", energy: e, distanceMm: d, arcEnergy: e / d / 1000, loggedHeatInput: logged };
            });
            if (!(totalDistance > 0)) return null;
            return {
                segments,
                arcEnergy: totalEnergy / totalDistance / 1000,
                heatInput: factor * totalEnergy / totalDistance / 1000,
                loggedHeatInput: segments.length === 1 ? segments[0].loggedHeatInput : NaN
            };
        }

        /* ---- Zuordnung: Lage, Raupe, Ziel-Bereiche aus dem Schedule Editor ---- */
        const WDR_PASS_ORDER = ["Root", "Hot pass", "Fill", "Cap", "Other"];
        function wdrPassType(text) {
            const value = String(text || "").toLowerCase();
            if (/root/.test(value)) return "Root";
            if (/(^|[^a-z])hp([^a-z]|$)|hot[ _-]?pass/.test(value)) return "Hot pass";
            if (/(^|[^a-z])f-?(out|in|mid)([^a-z]|$)|fill|(^|[^a-z])comp/.test(value)) return "Fill";
            if (/cap|wing/.test(value)) return "Cap";
            return "Other";
        }

        // "…_L21_B42…" oder "Layer 7 Bead 12" -> { label, layer, bead }
        function wdrBeadId(...texts) {
            for (const text of texts) {
                const value = String(text || "");
                let match = value.match(/L(\d+)_B(\d+)(-\d+)?/i);
                if (match) return { label: `L${match[1]}_B${match[2]}${match[3] || ""}`, layer: +match[1], bead: +match[2], suffix: match[3] || "" };
                match = value.match(/Layer\s*(\d+)\s*Bead\s*(\d+)(-\d+)?/i);
                if (match) return { label: `L${match[1]}_B${match[2]}${match[3] || ""}`, layer: +match[1], bead: +match[2], suffix: match[3] || "" };
            }
            return { label: "", layer: Infinity, bead: Infinity, suffix: "" };
        }

        // Ziel-Bereiche des Schedule Editors (gleiche Herkunft, localStorage), Zuordnung ueber die
        // 4-stellige Schedule-Nummer aus dem Log-Kopf. Mehrere passende Bereiche: Schnittmenge.
        function wdrTargetsForSchedule(scheduleName) {
            let stored = [];
            try { stored = JSON.parse(localStorage.getItem("scheduleEditorHeatInputTargets") || "[]"); } catch (error) { stored = []; }
            if (!Array.isArray(stored)) return null;
            const key = (String(scheduleName || "").match(/^\d{4}/) || [null])[0];
            const parse = value => {
                const number = Number(String(value ?? "").replace(",", "."));
                return String(value ?? "").trim() !== "" && Number.isFinite(number) ? number : null;
            };
            const matching = stored.filter(item => item && typeof item === "object")
                .map(item => ({ name: String(item.name || "Target"), min: parse(item.min), max: parse(item.max), files: Array.isArray(item.files) ? item.files : null }))
                .filter(item => (item.min !== null || item.max !== null) && (item.files === null || (key && item.files.includes(key))));
            if (!matching.length) return null;
            const mins = matching.map(item => item.min).filter(value => value !== null);
            const maxs = matching.map(item => item.max).filter(value => value !== null);
            return {
                name: matching.map(item => item.name).join(" + "),
                min: mins.length ? Math.max(...mins) : null,
                max: maxs.length ? Math.min(...maxs) : null
            };
        }

        function wdrTargetStatus(evaluation, target) {
            if (!target) return { ok: null, text: "no target range" };
            const r = evaluation.result.perPeriod;
            const problems = [];
            if (target.min !== null && r.min < target.min) problems.push(`per period min ${r.min.toFixed(3)} < ${target.min}`);
            if (target.max !== null && r.max > target.max) problems.push(`per period max ${r.max.toFixed(3)} > ${target.max}`);
            return problems.length ? { ok: false, text: `outside ${target.name}: ${problems.join(", ")}` } : { ok: true, text: `within ${target.name}` };
        }

