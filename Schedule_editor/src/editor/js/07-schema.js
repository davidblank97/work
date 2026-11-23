        /* SCHEMA CHECK (XDR) */
        // XDR-Versionen liegen im localStorage; die eingebaute WELDSCHEDULE.XDR wird beim ersten Start uebernommen.
        const XDR_STORE_KEY = "scheduleEditorXdrSchemas";
        const XDR_ACTIVE_KEY = "scheduleEditorActiveXdr";
        const BUILTIN_XDR_ID = "builtin-weldschedule";

        function readXdrVersion(xmlText) {
            const match = String(xmlText).match(/<Schema\b[^>]*\bxmlns:version\s*=\s*"([^"]*)"/i);
            return match ? match[1].trim() : "";
        }

        function compareVersions(left, right) {
            const a = String(left || "").split(".").map(part => parseInt(part, 10) || 0);
            const b = String(right || "").split(".").map(part => parseInt(part, 10) || 0);
            for (let index = 0; index < Math.max(a.length, b.length); index++) {
                const difference = (a[index] || 0) - (b[index] || 0);
                if (difference) return difference < 0 ? -1 : 1;
            }
            return 0;
        }

        function isXdrRecord(item) {
            return item && typeof item === "object" && typeof item.id === "string" && typeof item.xml === "string"
                && typeof item.name === "string";
        }

        let xdrSchemas = readStoredJson(XDR_STORE_KEY, []).filter(isXdrRecord);
        let activeXdrId = readStoredJson(XDR_ACTIVE_KEY, { id: "" }).id || "";
        const parsedXdrCache = new Map();
        const schemaResultCache = new WeakMap();

        function saveXdrSchemas() {
            try {
                localStorage.setItem(XDR_STORE_KEY, JSON.stringify(xdrSchemas));
                localStorage.setItem(XDR_ACTIVE_KEY, JSON.stringify({ id: activeXdrId }));
                return true;
            } catch (error) {
                console.warn("Could not store the XDR schemas.", error);
                return false;
            }
        }

        // Eingebaute XDR (aus <script id="defaultXdr">) einmalig aufnehmen; sie bleibt immer verfuegbar.
        (function ensureBuiltinXdr() {
            const builtinXml = document.getElementById("defaultXdr")?.textContent.trim() || "";
            if (builtinXml && !xdrSchemas.some(schema => schema.id === BUILTIN_XDR_ID)) {
                xdrSchemas.unshift({
                    id: BUILTIN_XDR_ID,
                    name: "WELDSCHEDULE.XDR (built-in)",
                    version: readXdrVersion(builtinXml),
                    loadedAt: "",
                    builtin: true,
                    xml: builtinXml
                });
            }
            if (!xdrSchemas.some(schema => schema.id === activeXdrId)) activeXdrId = xdrSchemas[0]?.id || "";
            saveXdrSchemas();
        })();

        function getActiveXdr() {
            return xdrSchemas.find(schema => schema.id === activeXdrId) || null;
        }

        // Baut aus der XDR ein Modell: je ElementType Kindelemente (min/max, Reihenfolge), Attribute, Datentyp.
        function buildXdrModel(schema) {
            if (parsedXdrCache.has(schema.id)) return parsedXdrCache.get(schema.id);
            const { definitions } = parseViewerXdr(schema.xml, schema.name);
            const schemaRoot = definitions.get("sched").ownerDocument.documentElement;
            const childrenNamed = (node, name) => [...node.children].filter(child => child.localName === name);
            const dtType = node => node.getAttribute("dt:type")
                || node.getAttributeNS("urn:schemas-microsoft-com:datatypes", "type") || "";
            const globalAttributeTypes = new Map(childrenNamed(schemaRoot, "AttributeType")
                .map(node => [node.getAttribute("name"), node]));
            const model = new Map();
            definitions.forEach((definition, name) => {
                const localAttributeTypes = new Map(childrenNamed(definition, "AttributeType")
                    .map(node => [node.getAttribute("name"), node]));
                const attributes = childrenNamed(definition, "attribute").map(node => {
                    const typeName = node.getAttribute("type");
                    const typeNode = localAttributeTypes.get(typeName) || globalAttributeTypes.get(typeName);
                    const required = (node.getAttribute("required") || typeNode?.getAttribute("required") || "no") === "yes";
                    return { name: typeName, required, dtType: (typeNode && dtType(typeNode)) || "string" };
                });
                const elements = childrenNamed(definition, "element").map(node => {
                    const maxText = node.getAttribute("maxOccurs") ?? "1";
                    return {
                        name: node.getAttribute("type"),
                        min: parseInt(node.getAttribute("minOccurs") ?? "1", 10) || 0,
                        max: maxText === "*" ? Infinity : (parseInt(maxText, 10) || 1)
                    };
                });
                model.set(name, {
                    name,
                    closed: (definition.getAttribute("model") || "closed") === "closed",
                    content: definition.getAttribute("content") || (elements.length ? "eltOnly" : "textOnly"),
                    order: definition.getAttribute("order") || "seq",
                    dtType: dtType(definition),
                    attributes,
                    elements
                });
            });
            const result = { model, version: schema.version || readXdrVersion(schema.xml) };
            parsedXdrCache.set(schema.id, result);
            return result;
        }

        const XDR_INTEGER_RANGES = {
            ui1: [0, 255], ui2: [0, 65535], ui4: [0, 4294967295], ui8: [0, Number.MAX_SAFE_INTEGER],
            i1: [-128, 127], i2: [-32768, 32767], i4: [-2147483648, 2147483647], int: [-2147483648, 2147483647],
            i8: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]
        };
        // Liefert eine Fehlermeldung oder "" (gueltig) fuer einen Wert eines XDR-Datentyps.
        function checkXdrValue(value, type) {
            const text = String(value).trim();
            const kind = String(type || "string").toLowerCase();
            if (["", "string", "id", "idref", "char", "uri", "uuid"].includes(kind)) return "";
            if (kind === "boolean") return /^[01]$/.test(text) ? "" : `expected boolean (0 or 1), found "${text}"`;
            if (XDR_INTEGER_RANGES[kind]) {
                if (!/^[-+]?\d+$/.test(text)) return `expected integer (${kind}), found "${text}"`;
                const [min, max] = XDR_INTEGER_RANGES[kind];
                const number = Number(text);
                return number < min || number > max ? `${kind} must be between ${min} and ${max}, found ${text}` : "";
            }
            if (["float", "number", "r4", "r8"].includes(kind) || kind.startsWith("fixed")) {
                return /^[-+]?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?$/.test(text) ? "" : `expected number (${kind}), found "${text}"`;
            }
            return "";
        }

        // Prueft ein Schedule-Dokument gegen die XDR. Ergebnis: Liste von Befunden.
        function validateAgainstXdr(xmlDocument, schema) {
            const { model } = buildXdrModel(schema);
            const findings = [];
            const sectionNames = ["description", "global", "limits", "overrides"];
            const add = (severity, element, message, key = "") => {
                const segment = element.closest ? element.closest("segment") : null;
                const top = [...(element.ownerDocument?.documentElement?.children || [])].find(child => child === element || child.contains(element));
                const section = segment ? "segments" : top && sectionNames.includes(top.localName) ? top.localName : "";
                findings.push({ severity, message, path: xmlPath(element) + (key ? `/${key}` : ""), section, key, segmentIndex: segment?.getAttribute("index") ?? null });
            };
            const xmlPath = element => {
                const parts = [];
                for (let node = element; node && node.nodeType === 1; node = node.parentElement) {
                    parts.unshift(node.localName === "segment" && node.hasAttribute("index") ? `segment[${node.getAttribute("index")}]` : node.localName);
                }
                return parts.join("/");
            };

            const root = xmlDocument.documentElement;
            if (!root || root.localName !== "sched") {
                findings.push({ severity: "error", message: "Root element <sched> is missing.", path: root?.localName || "", section: "", key: "", segmentIndex: null });
                return findings;
            }

            const visit = element => {
                const definition = model.get(element.localName);
                if (!definition) return;
                definition.attributes.forEach(attribute => {
                    if (!element.hasAttribute(attribute.name)) {
                        if (attribute.required) add("error", element, `Required attribute "${attribute.name}" is missing on <${element.localName}>.`);
                        return;
                    }
                    const problem = checkXdrValue(element.getAttribute(attribute.name), attribute.dtType);
                    if (problem) add("error", element, `Attribute "${attribute.name}": ${problem}.`);
                });

                const children = [...element.children];
                if (definition.content === "textOnly" || (!definition.elements.length && definition.content !== "eltOnly")) {
                    if (children.length) add("error", element, `<${element.localName}> must contain a value, not elements.`);
                    const text = element.textContent.trim();
                    const fieldElement = element;
                    const key = fieldElement.localName;
                    const parent = fieldElement.parentElement || fieldElement;
                    if (text === "") {
                        if (checkXdrValue("x", definition.dtType) !== "") add("warning", parent, `Value of <${key}> is empty (expected ${definition.dtType}).`, key);
                    } else {
                        const problem = checkXdrValue(text, definition.dtType);
                        if (problem) add("error", parent, `<${key}>: ${problem}.`, key);
                    }
                    return;
                }

                const declared = new Map(definition.elements.map((entry, index) => [entry.name, { ...entry, index }]));
                const counts = new Map();
                let lastIndex = -1;
                let lastName = "";
                let orderReported = false;
                children.forEach(child => {
                    const entry = declared.get(child.localName);
                    if (!entry) {
                        if (definition.closed) add("error", element, `Unknown element <${child.localName}> in <${element.localName}>.`, child.localName);
                        return;
                    }
                    counts.set(child.localName, (counts.get(child.localName) || 0) + 1);
                    if (definition.order === "seq" && !orderReported) {
                        if (entry.index < lastIndex) {
                            add("error", element, `Wrong order in <${element.localName}>: <${child.localName}> must come before <${lastName}>.`, child.localName);
                            orderReported = true;
                        } else {
                            lastIndex = entry.index;
                            lastName = child.localName;
                        }
                    }
                });
                definition.elements.forEach(entry => {
                    const count = counts.get(entry.name) || 0;
                    if (count < entry.min) add("error", element, `Required element <${entry.name}> is missing in <${element.localName}>.`, entry.name);
                    if (count > entry.max) add("error", element, `<${entry.name}> occurs ${count}× in <${element.localName}> (allowed: ${entry.max}).`, entry.name);
                });
                children.forEach(child => { if (declared.has(child.localName)) visit(child); });
            };
            visit(root);
            return findings;
        }

        function getFileVersion(file) {
            const metadata = [...file.xml.documentElement.children].find(child => child.localName === "metadata");
            const read = name => [...(metadata?.children || [])].find(child => child.localName === name)?.textContent.trim() || "";
            const schemaVersion = read("schema_version");
            return schemaVersion ? { version: schemaVersion, source: "schema_version" } : { version: read("config_version"), source: "config_version" };
        }

        // Ergebnis je Datei, zwischengespeichert bis sich XML oder aktive XDR aendern.
        function getSchemaResult(file) {
            const schema = getActiveXdr();
            if (!file || !schema) return null;
            const key = `${schema.id}|${serializeXml(file.xml)}`;
            const cached = schemaResultCache.get(file);
            if (cached && cached.key === key) return cached.result;
            let findings;
            try {
                findings = validateAgainstXdr(file.xml, schema);
            } catch (error) {
                findings = [{ severity: "error", message: `Schema could not be used: ${error.message}`, path: "", section: "", key: "", segmentIndex: null }];
            }
            const fileVersion = getFileVersion(file);
            const comparison = fileVersion.version && schema.version ? compareVersions(fileVersion.version, schema.version) : 0;
            const result = {
                schema,
                findings,
                errors: findings.filter(finding => finding.severity === "error").length,
                warnings: findings.filter(finding => finding.severity === "warning").length,
                fileVersion,
                comparison,
                matchingSchema: comparison !== 0 ? xdrSchemas.find(entry => entry.version && compareVersions(entry.version, fileVersion.version) === 0) || null : null
            };
            schemaResultCache.set(file, { key, result });
            return result;
        }

        function schemaErrorFiles(files) {
            return files.filter(file => (getSchemaResult(file)?.errors || 0) > 0);
        }

        function schemaLoadSummary(files) {
            const withErrors = schemaErrorFiles(files).length;
            return withErrors ? ` ${withErrors} file(s) do not match the schema (Tools › Schema Check).` : "";
        }

        // Vor dem Speichern: bei Schemafehlern Rueckfrage, sonst direkt speichern.
        const schemaSaveModal = document.getElementById("schemaSaveModal");
        let pendingSchemaSave = null;
        function confirmSchemaBeforeSave(files, proceed) {
            const failing = schemaErrorFiles(files.filter(Boolean));
            if (!failing.length) { proceed(); return; }
            const schema = getActiveXdr();
            document.getElementById("schemaSaveText").textContent =
                `${failing.length} file(s) do not match the schema ${schema?.version ? `v${schema.version}` : ""} (${schema?.name || "XDR"}). Save anyway?`;
            const list = document.getElementById("schemaSaveList");
            list.replaceChildren();
            failing.slice(0, 5).forEach(file => {
                const result = getSchemaResult(file);
                const line = document.createElement("div");
                line.className = "schema-save-line";
                line.textContent = `${fileShortLabel(file)}: ${result.errors} error(s) – ${result.findings.find(finding => finding.severity === "error")?.message || ""}`;
                list.appendChild(line);
            });
            if (failing.length > 5) {
                const more = document.createElement("div");
                more.className = "schema-save-line";
                more.textContent = `… and ${failing.length - 5} more`;
                list.appendChild(more);
            }
            pendingSchemaSave = proceed;
            openModal(schemaSaveModal, document.getElementById("schemaSaveCancelBtn"));
        }
        document.getElementById("schemaSaveCancelBtn").onclick = () => {
            pendingSchemaSave = null;
            closeModal(schemaSaveModal);
            document.getElementById("status").textContent = "Save cancelled: schema errors (Tools › Schema Check).";
        };
        document.getElementById("schemaSaveShowBtn").onclick = () => {
            pendingSchemaSave = null;
            closeModal(schemaSaveModal);
            showSchemaCheck();
        };
        document.getElementById("schemaSaveConfirmBtn").onclick = () => {
            const proceed = pendingSchemaSave;
            pendingSchemaSave = null;
            closeModal(schemaSaveModal);
            if (proceed) proceed();
        };

        // Neue XDR-Version aus einer Datei aufnehmen.
        async function importXdrFile(file) {
            const status = document.getElementById("status");
            try {
                const xml = await file.text();
                parseViewerXdr(xml, file.name);
                const version = readXdrVersion(xml);
                if (!version) throw new Error(`${file.name}: no version found (xmlns:version on <Schema>).`);
                const existing = xdrSchemas.find(schema => !schema.builtin && schema.version === version);
                if (existing && !window.confirm(`Schema version ${version} is already stored (${existing.name}). Replace it?`)) return;
                const record = { id: existing?.id || `xdr-${Date.now()}`, name: file.name, version, loadedAt: new Date().toISOString(), xml };
                const previous = xdrSchemas;
                xdrSchemas = existing ? xdrSchemas.map(schema => schema.id === existing.id ? record : schema) : [...xdrSchemas, record];
                const previousActive = activeXdrId;
                activeXdrId = record.id;
                parsedXdrCache.delete(record.id);
                if (!saveXdrSchemas()) {
                    xdrSchemas = previous;
                    activeXdrId = previousActive;
                    throw new Error("The browser storage is full. Delete an old schema version and try again.");
                }
                status.textContent = `Schema ${file.name} (v${version}) loaded and activated.`;
            } catch (error) {
                status.textContent = `XDR not loaded: ${error.message}`;
                window.alert(`XDR not loaded:\n${error.message}`);
            }
            refreshSchemaViews();
        }

        function setActiveXdr(id) {
            activeXdrId = id;
            saveXdrSchemas();
            refreshSchemaViews();
            const schema = getActiveXdr();
            document.getElementById("status").textContent = `Active schema: ${schema?.name} (v${schema?.version}).`;
        }

        function deleteXdr(id) {
            const schema = xdrSchemas.find(entry => entry.id === id);
            if (!schema || schema.builtin) return;
            if (!window.confirm(`Delete schema ${schema.name} (v${schema.version})?`)) return;
            xdrSchemas = xdrSchemas.filter(entry => entry.id !== id);
            parsedXdrCache.delete(id);
            if (activeXdrId === id) activeXdrId = xdrSchemas[0]?.id || "";
            saveXdrSchemas();
            refreshSchemaViews();
        }

        // Springt zum Feld eines Befunds (Bereich bzw. Segment oeffnen und Feld markieren).
        function openSchemaFinding(fileIndex, finding) {
            commitPendingEdit();
            activeFile = fileIndex;
            const file = loadedFiles[fileIndex];
            const section = finding.section || "description";
            if (section === "segments" && finding.segmentIndex !== null) {
                const position = file.sections.segments.findIndex(segment => segment.getAttribute("index") === finding.segmentIndex);
                if (position >= 0) selectedSegmentPosition = position;
            }
            document.querySelectorAll("#sidebar .sidebar-item").forEach(el => el.classList.remove("active"));
            renderFileList();
            lastSelectedSection = section;
            renderSidebar();
            showSection(section);
            if (!finding.key) return;
            window.setTimeout(() => {
                const field = document.querySelector(`#content [data-param-name="${CSS.escape(finding.key)}"]`);
                const row = field?.closest("tr");
                if (!row) {
                    document.getElementById("status").textContent = `${finding.key}: ${finding.message}`;
                    return;
                }
                row.scrollIntoView({ block: "center" });
                row.classList.add("schema-flash");
                window.setTimeout(() => row.classList.remove("schema-flash"), 2400);
                document.getElementById("status").textContent = `${finding.key}: ${finding.message}`;
            }, 30);
        }

        function formatXdrDate(iso) {
            if (!iso) return "built-in";
            const date = new Date(iso);
            return Number.isNaN(date.getTime()) ? "" : date.toLocaleString();
        }

        // XDR-Versionsverwaltung (im Settings-Dialog).
        function renderXdrManager() {
            const container = document.getElementById("xdrManager");
            if (!container) return;
            container.replaceChildren();
            const make = (tag, className, text) => {
                const element = document.createElement(tag);
                if (className) element.className = className;
                if (text !== undefined) element.textContent = text;
                return element;
            };
            const table = make("table", "schema-version-table");
            const headRow = make("tr");
            ["", "Version", "File", "Loaded", ""].forEach(text => headRow.appendChild(make("th", "", text)));
            table.appendChild(headRow);
            [...xdrSchemas].sort((a, b) => compareVersions(b.version, a.version)).forEach(schema => {
                const row = make("tr", schema.id === activeXdrId ? "is-active" : "");
                row.append(make("td", "schema-state-cell", schema.id === activeXdrId ? "● Active" : ""),
                    make("td", "schema-version-cell", schema.version ? `v${schema.version}` : "–"),
                    make("td", "schema-name-cell", schema.name), make("td", "schema-date-cell", formatXdrDate(schema.loadedAt)));
                const actions = make("td", "schema-actions-cell");
                if (schema.id !== activeXdrId) {
                    const use = make("button", "btn-secondary schema-small-btn", "Use");
                    use.type = "button";
                    use.onclick = () => setActiveXdr(schema.id);
                    actions.appendChild(use);
                }
                if (!schema.builtin) {
                    const remove = make("button", "btn-secondary schema-small-btn", "Delete");
                    remove.type = "button";
                    remove.onclick = () => deleteXdr(schema.id);
                    actions.appendChild(remove);
                }
                row.appendChild(actions);
                table.appendChild(row);
            });
            container.appendChild(table);

            const drop = make("div", "schema-drop");
            drop.appendChild(make("span", "", "Drop a new .XDR version here or"));
            const loadButton = make("button", "schema-small-btn", "Load XDR…");
            loadButton.type = "button";
            const fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.accept = ".xdr,.XDR,.xml";
            fileInput.hidden = true;
            fileInput.onchange = () => { if (fileInput.files[0]) importXdrFile(fileInput.files[0]); };
            loadButton.onclick = () => fileInput.click();
            drop.ondragover = event => { event.preventDefault(); drop.classList.add("dragover"); };
            drop.ondragleave = () => drop.classList.remove("dragover");
            drop.ondrop = event => {
                event.preventDefault();
                drop.classList.remove("dragover");
                const file = event.dataTransfer.files[0];
                if (file) importXdrFile(file);
            };
            drop.append(loadButton, fileInput);
            container.appendChild(drop);

            // Layout-Muster fuer das Upgrade
            const templates = make("div", "layout-template-row");
            templates.appendChild(make("span", "layout-template-label", "Upgrade layout templates:"));
            ["NGRT", "NG"].forEach(kind => {
                const template = getLayoutTemplate(kind);
                const chip = make("span", "layout-template-chip", `${kind}: ${template.name}${template.version ? ` · v${template.version}` : ""}`);
                if (!template.builtin) {
                    const reset = make("button", "schema-small-btn", "Reset");
                    reset.type = "button";
                    reset.title = "Use the built-in template again";
                    reset.onclick = () => resetLayoutTemplate(kind);
                    chip.appendChild(reset);
                }
                templates.appendChild(chip);
            });
            const templateButton = make("button", "btn-secondary schema-small-btn", "Load template XML…");
            templateButton.type = "button";
            templateButton.title = "Schedule XML of the latest version; assigned to NGRT or NG by its head";
            const templateInput = document.createElement("input");
            templateInput.type = "file";
            templateInput.accept = ".xml";
            templateInput.hidden = true;
            templateInput.onchange = () => { if (templateInput.files[0]) importLayoutTemplate(templateInput.files[0]); };
            templateButton.onclick = () => templateInput.click();
            templates.append(templateButton, templateInput);
            container.appendChild(templates);
        }

        // Nach Aenderungen an den XDR-Versionen: Dialog, Dateiliste und Schema-Check-Ansicht aktualisieren.
        function refreshSchemaViews() {
            renderXdrManager();
            renderFileList();
            if (document.getElementById("schemaCheckBtn").classList.contains("active")) showSchemaCheck();
        }

        function showSchemaCheck() {
            commitPendingEdit();
            document.querySelectorAll("#sidebar .sidebar-item").forEach(el => el.classList.remove("active"));
            document.getElementById("schemaCheckBtn").classList.add("active");
            const content = document.getElementById("content");
            content.innerHTML = "";
            const make = (tag, className, text) => {
                const element = document.createElement(tag);
                if (className) element.className = className;
                if (text !== undefined) element.textContent = text;
                return element;
            };

            content.appendChild(make("h2", "", "Schema Check"));
            const active = getActiveXdr();

            // Aktive XDR (Verwaltung unter Settings)
            const activeLine = make("div", "panel schema-active-line");
            activeLine.appendChild(make("span", "", active ? `Active schema: ${active.name} · v${active.version || "?"}` : "No XDR schema active."));
            const manage = make("button", "btn-secondary schema-small-btn", "Manage schemas…");
            manage.type = "button";
            manage.onclick = openSettings;
            const candidates = active ? upgradeCandidates() : [];
            if (candidates.length) {
                const upgradeAll = make("button", "schema-small-btn", `Upgrade all to v${active.version} (${candidates.length})`);
                upgradeAll.type = "button";
                upgradeAll.title = "Bring all files with schema errors or an older version to the active schema version";
                upgradeAll.onclick = () => openUpgradeDialog(candidates);
                activeLine.appendChild(upgradeAll);
            }
            activeLine.appendChild(manage);
            content.appendChild(activeLine);

            // Ergebnisse je Datei
            const resultsPanel = make("div", "panel schema-results-panel");
            resultsPanel.appendChild(make("div", "panel-header", "Results"));
            if (!loadedFiles.length || !active) {
                resultsPanel.appendChild(make("p", "schema-empty", !active ? "No schema active. Load an XDR file." : "No files loaded."));
            }
            loadedFiles.forEach((file, fileIndex) => {
                const result = getSchemaResult(file);
                if (!result) return;
                const block = make("details", "schema-file" + (result.errors ? " has-errors" : ""));
                block.open = result.errors > 0 && loadedFiles.length <= 6;
                const summary = make("summary", "schema-file-summary");
                const status = make("span", "schema-status " + (result.errors ? "is-error" : result.warnings ? "is-warning" : "is-ok"),
                    result.errors ? `! ${result.errors} error${result.errors === 1 ? "" : "s"}` : result.warnings ? `△ ${result.warnings} warning${result.warnings === 1 ? "" : "s"}` : "✓ Valid");
                if (result.errors && result.warnings) status.textContent += ` · ${result.warnings} warning${result.warnings === 1 ? "" : "s"}`;
                const label = make("span", "schema-file-label", fileShortLabel(file));
                label.title = file.name;
                const versionInfo = make("span", "schema-version-info");
                const fileVersionText = result.fileVersion.version ? `file v${result.fileVersion.version}` : "file version unknown";
                if (!result.fileVersion.version || !result.schema.version) versionInfo.textContent = fileVersionText;
                else if (result.comparison === 0) versionInfo.textContent = `${fileVersionText} = schema ✓`;
                else if (result.comparison < 0) versionInfo.textContent = `${fileVersionText} older than schema v${result.schema.version}`;
                else {
                    versionInfo.textContent = `${fileVersionText} newer than schema v${result.schema.version} – load a newer XDR`;
                    versionInfo.classList.add("is-warning");
                }
                summary.append(label, status, versionInfo);
                if (result.matchingSchema) {
                    const useMatching = make("button", "btn-secondary schema-small-btn", `Use v${result.matchingSchema.version}`);
                    useMatching.type = "button";
                    useMatching.title = `Check against the stored schema ${result.matchingSchema.name}`;
                    useMatching.onclick = event => { event.preventDefault(); setActiveXdr(result.matchingSchema.id); };
                    summary.appendChild(useMatching);
                }
                if (result.errors > 0 || result.comparison < 0) {
                    const upgrade = make("button", "schema-small-btn", `Upgrade to v${result.schema.version}`);
                    upgrade.type = "button";
                    upgrade.onclick = event => { event.preventDefault(); openUpgradeDialog([file]); };
                    summary.appendChild(upgrade);
                }
                block.appendChild(summary);
                if (file.lastUpgrade) {
                    const info = file.lastUpgrade;
                    const upgradeInfo = make("details", "schema-upgrade-report");
                    upgradeInfo.appendChild(make("summary", "", `Last upgrade: v${info.versionFrom || "?"} → v${info.versionTo} · +${info.added.length} added · −${info.removed.length} removed${info.renamed.length ? ` · ${info.renamed.length} renamed` : ""} · template ${info.template}`));
                    const lines = [
                        ...info.renamed.map(entry => `Renamed: ${entry.from} → ${entry.to} (value ${entry.value})`),
                        ...info.added.map(path => `Added: ${path}`),
                        ...info.removed.map(entry => `Removed: ${entry.path}${entry.value ? ` (was ${entry.value})` : ""}`)
                    ];
                    const list = make("ul", "schema-upgrade-lines");
                    lines.forEach(text => list.appendChild(make("li", "", text)));
                    upgradeInfo.appendChild(list);
                    block.appendChild(upgradeInfo);
                }
                if (!result.findings.length) {
                    block.appendChild(make("p", "schema-empty", "No findings – the file matches the schema."));
                } else {
                    const list = make("ul", "schema-findings");
                    result.findings.forEach(finding => {
                        const item = make("li", `schema-finding is-${finding.severity}`);
                        item.appendChild(make("span", "schema-finding-severity", finding.severity === "error" ? "Error" : "Warning"));
                        const text = make("span", "schema-finding-text");
                        text.appendChild(make("span", "schema-finding-message", finding.message));
                        text.appendChild(make("span", "schema-finding-path", finding.path));
                        item.appendChild(text);
                        if (finding.section) {
                            const show = make("button", "btn-secondary schema-small-btn", "Show");
                            show.type = "button";
                            show.onclick = () => openSchemaFinding(fileIndex, finding);
                            item.appendChild(show);
                        }
                        list.appendChild(item);
                    });
                    block.appendChild(list);
                }
                resultsPanel.appendChild(block);
            });
            content.appendChild(resultsPanel);
        }

        document.getElementById("schemaCheckBtn").onclick = showSchemaCheck;

