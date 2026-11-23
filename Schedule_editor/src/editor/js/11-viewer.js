        // Schluessel je Element (Pfad mit Segment-Index und Vorkommen), fuer den Vergleich mit dem gespeicherten Stand.
        function xmlElementKey(element, parentKey) {
            const name = element.localName;
            if (name === "segment" && element.hasAttribute("index")) return `${parentKey}/segment[${element.getAttribute("index")}]`;
            const siblings = element.parentElement ? [...element.parentElement.children].filter(child => child.localName === name) : [element];
            const occurrence = siblings.indexOf(element);
            return `${parentKey}/${name}${occurrence > 0 ? `#${occurrence}` : ""}`;
        }

        function indexXmlForDiff(documentNode) {
            const map = new Map();
            const walk = (element, parentKey) => {
                const key = xmlElementKey(element, parentKey);
                map.set(key, element);
                [...element.children].forEach(child => walk(child, key));
            };
            if (documentNode?.documentElement) walk(documentNode.documentElement, "");
            return map;
        }

        function renderXmlWithMissingValues(viewerDocument, file, schema, options = {}) {
            const output = viewerDocument.getElementById("xmlContent");
            const summary = viewerDocument.getElementById("missingSummary");
            output.replaceChildren();
            let missingCount = 0;
            // Aenderungen gegenueber dem zuletzt gespeicherten/geladenen Stand (file.originalXml).
            const showChanges = options.showChanges !== false && Boolean(file.originalXml);
            const changesOnly = showChanges && Boolean(options.changesOnly);
            const baseline = showChanges ? indexXmlForDiff(file.originalXml) : new Map();
            const seenKeys = new Set();
            const diffCount = { added: 0, removed: 0, changed: 0 };
            const escapeXmlText = text => String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            const schemaDetails = parseViewerXdr(schema.xml, schema.sourceFile || schema.name);
            const xmlDocument = new DOMParser().parseFromString(new XMLSerializer().serializeToString(file.xml), "application/xml");
            const parseError = xmlDocument.querySelector("parsererror");
            if (parseError) throw new Error(`${file.name}: XML could not be parsed for schema comparison.`);

            function appendLine(parts, depth, diff = "") {
                const line = viewerDocument.createElement("span");
                line.className = "xml-line" + (diff ? ` diff-${diff}` : "");
                if (showChanges) {
                    const marker = viewerDocument.createElement("span");
                    marker.className = "diff-marker";
                    marker.textContent = diff === "added" ? "+" : diff === "removed" ? "−" : diff === "changed" ? "~" : " ";
                    line.appendChild(marker);
                }
                line.appendChild(viewerDocument.createTextNode("  ".repeat(depth)));
                parts.forEach(part => {
                    const span = viewerDocument.createElement("span");
                    if (part.missing) span.className = "missing-value";
                    if (part.className) span.className = part.className;
                    span.textContent = part.text;
                    line.appendChild(span);
                });
                line.appendChild(viewerDocument.createTextNode("\n"));
                output.appendChild(line);
            }

            // Entfernte Elemente (nur im gespeicherten Stand) als rote Zeilen.
            function renderRemovedElement(element, depth) {
                diffCount.removed++;
                const attributes = [...element.attributes].map(attribute => ` ${attribute.name}="${escapeXmlText(attribute.value)}"`).join("");
                const children = [...element.children];
                if (!children.length) {
                    appendLine([{ text: `<${element.nodeName}${attributes}>${escapeXmlText(element.textContent)}</${element.nodeName}>` }], depth, "removed");
                    return;
                }
                appendLine([{ text: `<${element.nodeName}${attributes}>` }], depth, "removed");
                children.forEach(child => renderRemovedElement(child, depth + 1));
                appendLine([{ text: `</${element.nodeName}>` }], depth, "removed");
                diffCount.removed--; // Container zaehlt nicht doppelt
            }

            function rulesFor(definition) {
                return Array.from(definition.children).filter(child => child.localName === "element");
            }

            function renderMissingElement(name, depth, ancestors = new Set()) {
                missingCount++;
                const definition = schemaDetails.definitions.get(name);
                if (!definition || ancestors.has(name)) {
                    appendLine([{ text: `<${name}>[MISSING REQUIRED ELEMENT]</${name}>`, missing: true }], depth);
                    return;
                }
                const attributes = Array.from(definition.children).filter(child => child.localName === "AttributeType");
                const allowedAttributes = Array.from(definition.children)
                    .filter(child => child.localName === "attribute")
                    .map(child => child.getAttribute("type"));
                const missingAttributes = attributes
                    .filter(attribute => allowedAttributes.includes(attribute.getAttribute("name")) && attribute.getAttribute("required") === "yes")
                    .map(attribute => attribute.getAttribute("name"));
                const opening = [{ text: `<${name}` }];
                missingAttributes.forEach(attributeName => {
                    missingCount++;
                    opening.push({ text: ` ${attributeName}="[MISSING VALUE]"`, missing: true });
                });
                if (definition.getAttribute("content") === "eltOnly") {
                    appendLine([...opening, { text: ">" }], depth);
                    const nextAncestors = new Set(ancestors);
                    nextAncestors.add(name);
                    rulesFor(definition).forEach(rule => {
                        const minimum = Number(rule.getAttribute("minOccurs") || 1);
                        for (let count = 0; count < minimum; count++) {
                            renderMissingElement(rule.getAttribute("type"), depth + 1, nextAncestors);
                        }
                    });
                    appendLine([{ text: `</${name}>` }], depth);
                    return;
                }
                appendLine([
                    ...opening,
                    { text: ">" },
                    { text: "[MISSING REQUIRED ELEMENT / VALUE]", missing: true },
                    { text: `</${name}>` }
                ], depth);
            }

            function renderElement(element, depth, parentKey = "") {
                const name = element.localName;
                const definition = schemaDetails.definitions.get(name);
                const opening = [{ text: `<${element.nodeName}` }];
                const key = xmlElementKey(element, parentKey);
                const baselineElement = showChanges ? baseline.get(key) : null;
                const isAdded = showChanges && !baselineElement;
                if (showChanges) seenKeys.add(key);
                let attributeChanged = false;
                if (definition) {
                    const declaredAttributes = new Map(Array.from(definition.children)
                        .filter(child => child.localName === "AttributeType")
                        .map(attribute => [attribute.getAttribute("name"), attribute]));
                    const allowedAttributes = new Set(Array.from(definition.children)
                        .filter(child => child.localName === "attribute")
                        .map(attribute => attribute.getAttribute("type")));
                    const highlightedAttributes = new Set();
                    Array.from(element.attributes).forEach(attribute => {
                        const attributeDefinition = declaredAttributes.get(attribute.localName);
                        const missing = attributeDefinition?.getAttribute("required") === "yes" && !attribute.value.trim();
                        if (missing) {
                            missingCount++;
                            highlightedAttributes.add(attribute.localName);
                        }
                        const value = attribute.value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
                        const oldAttribute = baselineElement?.getAttribute(attribute.name);
                        const changed = Boolean(baselineElement) && !missing && oldAttribute !== attribute.value;
                        if (changed) attributeChanged = true;
                        opening.push({
                            text: missing ? ` ${attribute.name}="[MISSING VALUE]"`
                                : changed ? ` ${attribute.name}="${value}"${oldAttribute === null ? " (new)" : ` (was "${escapeXmlText(oldAttribute)}")`}` : ` ${attribute.name}="${value}"`,
                            missing,
                            className: changed ? "diff-value" : ""
                        });
                    });
                    allowedAttributes.forEach(attributeName => {
                        const attributeDefinition = declaredAttributes.get(attributeName);
                        const attributeValue = Array.from(element.attributes)
                            .find(attribute => attribute.localName === attributeName)?.value;
                        if (attributeDefinition?.getAttribute("required") === "yes" &&
                            attributeValue === undefined && !highlightedAttributes.has(attributeName)) {
                            missingCount++;
                            opening.push({ text: ` ${attributeName}="[MISSING VALUE]"`, missing: true });
                        }
                    });
                } else {
                    Array.from(element.attributes).forEach(attribute => {
                        const value = attribute.value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
                        opening.push({ text: ` ${attribute.name}="${value}"` });
                    });
                }

                const children = Array.from(element.children);
                if (definition?.getAttribute("content") === "textOnly" && !children.length) {
                    const text = element.textContent;
                    // Gleiche Regel wie die Schema-Pruefung: leer ist nur bei Zahl/Boolean ein fehlender Wert.
                    const valueType = definition.getAttribute("dt:type") || "string";
                    if (!text.trim() && checkXdrValue("x", valueType) !== "") {
                        missingCount++;
                        appendLine([...opening, { text: ">" }, { text: "[MISSING VALUE]", missing: true }, { text: `</${element.nodeName}>` }], depth);
                    } else {
                        const escapedText = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                        const oldText = baselineElement && !baselineElement.children.length ? baselineElement.textContent : null;
                        const valueChanged = oldText !== null && oldText.trim() !== text.trim();
                        if (isAdded) {
                            diffCount.added++;
                            appendLine([...opening, { text: `>${escapedText}</${element.nodeName}>` }], depth, "added");
                        } else if (valueChanged || attributeChanged) {
                            diffCount.changed++;
                            appendLine([...opening, { text: ">" }, { text: escapedText, className: valueChanged ? "diff-value" : "" },
                                { text: `</${element.nodeName}>` }, ...(valueChanged ? [{ text: `  was: ${escapeXmlText(oldText.trim())}`, className: "diff-old" }] : [])], depth, "changed");
                        } else if (!changesOnly) {
                            appendLine([...opening, { text: `>${escapedText}</${element.nodeName}>` }], depth);
                        }
                    }
                    return;
                }

                if (!children.length && definition?.getAttribute("content") !== "eltOnly") {
                    if (isAdded) diffCount.added++;
                    else if (attributeChanged) diffCount.changed++;
                    if (isAdded || attributeChanged || !changesOnly) appendLine([...opening, { text: "/>" }], depth, isAdded ? "added" : attributeChanged ? "changed" : "");
                    return;
                }
                if (isAdded) diffCount.added++;
                else if (attributeChanged) diffCount.changed++;
                appendLine([...opening, { text: ">" }], depth, isAdded ? "added" : attributeChanged ? "changed" : "");
                // Entfernte Kinder an ihrer frueheren Position einordnen (vor dem naechsten noch vorhandenen Geschwister).
                const removedBefore = new Map();
                const removedAtEnd = [];
                if (showChanges && baselineElement) {
                    const currentKeys = new Set(children.map(child => xmlElementKey(child, key)));
                    const baselineChildren = [...baselineElement.children];
                    baselineChildren.forEach((oldChild, index) => {
                        const oldKey = xmlElementKey(oldChild, key);
                        if (currentKeys.has(oldKey)) return;
                        const next = baselineChildren.slice(index + 1).map(child => xmlElementKey(child, key)).find(nextKey => currentKeys.has(nextKey));
                        if (next) removedBefore.set(next, [...(removedBefore.get(next) || []), oldChild]);
                        else removedAtEnd.push(oldChild);
                    });
                }
                const renderChild = child => {
                    (removedBefore.get(xmlElementKey(child, key)) || []).forEach(oldChild => renderRemovedElement(oldChild, depth + 1));
                    renderElement(child, depth + 1, key);
                };
                if (definition?.getAttribute("content") === "eltOnly") {
                    const rules = rulesFor(definition);
                    const missingByPosition = new Map();
                    rules.forEach((rule, ruleIndex) => {
                        const nameForRule = rule.getAttribute("type");
                        const minimum = Number(rule.getAttribute("minOccurs") || 1);
                        const count = children.filter(child => child.localName === nameForRule).length;
                        for (let missing = count; missing < minimum; missing++) {
                            let position = children.length;
                            for (let nextRule = ruleIndex + 1; nextRule < rules.length; nextRule++) {
                                const nextName = rules[nextRule].getAttribute("type");
                                const nextPosition = children.findIndex(child => child.localName === nextName);
                                if (nextPosition >= 0) {
                                    position = nextPosition;
                                    break;
                                }
                            }
                            const atPosition = missingByPosition.get(position) || [];
                            atPosition.push(nameForRule);
                            missingByPosition.set(position, atPosition);
                        }
                    });
                    for (let index = 0; index <= children.length; index++) {
                        (missingByPosition.get(index) || []).forEach(missingName => renderMissingElement(missingName, depth + 1));
                        if (index < children.length) renderChild(children[index]);
                    }
                } else {
                    children.forEach(renderChild);
                }
                removedAtEnd.forEach(oldChild => renderRemovedElement(oldChild, depth + 1));
                appendLine([{ text: `</${element.nodeName}>` }], depth, isAdded ? "added" : "");
            }

            renderElement(xmlDocument.documentElement, 0);
            summary.textContent = missingCount
                ? `${missingCount} missing required element(s) or value(s) are highlighted. This view does not change the XML.`
                : "No missing required elements or values found. This view does not change the XML.";
            summary.classList.toggle("has-missing", missingCount > 0);
            const diffSummary = viewerDocument.getElementById("diffSummary");
            if (diffSummary) {
                const total = diffCount.added + diffCount.removed + diffCount.changed;
                diffSummary.replaceChildren();
                if (!showChanges) {
                    diffSummary.textContent = "";
                } else if (!total) {
                    diffSummary.textContent = "No changes since the last save.";
                } else {
                    const make = (className, text) => { const span = viewerDocument.createElement("span"); span.className = className; span.textContent = text; return span; };
                    diffSummary.append("Changes since the last save: ",
                        make("legend-added", `+ ${diffCount.added} added`), " · ",
                        make("legend-removed", `− ${diffCount.removed} removed`), " · ",
                        make("legend-changed", `~ ${diffCount.changed} changed`));
                }
            }
        }

        function openXmlViewer() {
            if (activeFile < 0 || activeFile >= loadedFiles.length) {
                document.getElementById("status").textContent = "Please load an XML file first.";
                return;
            }

            const file = loadedFiles[activeFile];
            const viewerWindow = window.open("", "xmlViewerWindow", "width=1100,height=800,resizable=yes,scrollbars=yes");
            if (!viewerWindow) {
                document.getElementById("status").textContent = "Could not open the XML Viewer. Please allow pop-ups for this page.";
                return;
            }

            viewerWindow.document.open();
            viewerWindow.document.write(`<!DOCTYPE html>
                <html lang="en"><head><meta charset="UTF-8"><title>XML Viewer</title>
                <style>
                    :root { color-scheme: dark; }
                    body { margin: 0; padding: 24px; background: #141416; color: #f3f3f5; font-family: "Segoe UI", sans-serif; }
                    h1 { margin: 0 0 16px; color: #ff9800; font-size: 20px; }
                    .toolbar { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
                    label { color: #c5c5ca; }
                    select { max-width: 520px; padding: 8px; background: #202024; color: #f3f3f5; border: 1px solid #45454d; border-radius: 5px; }
                    #missingSummary { margin: 0 0 12px; color: #b6b6bd; }
                    #missingSummary.has-missing { color: #ff6464; font-weight: 700; }
                    pre { margin: 0; padding: 18px; background: #202024; border: 1px solid #2d2d34; border-radius: 6px; color: #f3f3f5; font: 13px/1.5 Consolas, "Courier New", monospace; white-space: pre-wrap; overflow: auto; }
                    .missing-value { color: #ff6464; font-weight: 700; }
                    .toolbar input[type=checkbox] { accent-color: #f28a3d; }
                    .toolbar .option { display: inline-flex; align-items: center; gap: 6px; color: #c5c5ca; }
                    #diffSummary { margin: 0 0 12px; color: #b6b6bd; }
                    .legend-added { color: #6fd3a8; font-weight: 700; }
                    .legend-removed { color: #ff7a7a; font-weight: 700; }
                    .legend-changed { color: #f0c065; font-weight: 700; }
                    .xml-line { display: block; }
                    .diff-marker { display: inline-block; width: 1.4em; color: #6b6b73; user-select: none; }
                    .diff-added { background: rgba(80, 200, 150, 0.14); color: #a8f0cf; }
                    .diff-added .diff-marker { color: #6fd3a8; font-weight: 700; }
                    .diff-removed { background: rgba(255, 100, 100, 0.13); color: #ffb0b0; text-decoration: line-through; text-decoration-color: rgba(255, 140, 140, 0.6); }
                    .diff-removed .diff-marker { color: #ff7a7a; font-weight: 700; text-decoration: none; }
                    .diff-changed { background: rgba(240, 192, 101, 0.12); }
                    .diff-changed .diff-marker { color: #f0c065; font-weight: 700; }
                    .diff-value { color: #f0c065; font-weight: 700; }
                    .diff-old { color: #a99a80; font-style: italic; }
                </style></head>
                <body><h1 id="viewerTitle"></h1>
                    <div class="toolbar"><label for="schemaSelect">Saved XDR schema</label><select id="schemaSelect"><option value="">Loading schemas…</option></select>
                        <label class="option"><input type="checkbox" id="showChanges" checked> Highlight changes since last save</label>
                        <label class="option"><input type="checkbox" id="changesOnly"> Changes only</label></div>
                    <p id="missingSummary" role="status" aria-live="polite">Loading saved XDR schemas…</p>
                    <p id="diffSummary" aria-live="polite"></p>
                    <pre id="xmlContent"></pre></html>`);
            viewerWindow.document.close();
            viewerWindow.document.title = `XML Viewer - ${file.name}`;
            viewerWindow.document.getElementById("viewerTitle").textContent = file.name;
            viewerWindow.focus();
            const schemaSelect = viewerWindow.document.getElementById("schemaSelect");
            const summary = viewerWindow.document.getElementById("missingSummary");
            const showChangesBox = viewerWindow.document.getElementById("showChanges");
            const changesOnlyBox = viewerWindow.document.getElementById("changesOnly");
            const viewerOptions = () => ({ showChanges: showChangesBox.checked, changesOnly: changesOnlyBox.checked });
            let currentViewerSchema = null;
            const rerenderViewer = () => {
                changesOnlyBox.disabled = !showChangesBox.checked;
                if (!currentViewerSchema) return;
                try {
                    renderXmlWithMissingValues(viewerWindow.document, file, currentViewerSchema, viewerOptions());
                } catch (error) {
                    summary.textContent = error.message;
                    summary.classList.add("has-missing");
                }
            };
            showChangesBox.addEventListener("change", rerenderViewer);
            changesOnlyBox.addEventListener("change", rerenderViewer);
            const editorSchemas = xdrSchemas.map(schema => ({
                id: `editor:${schema.id}`, name: `${schema.name} (editor)`, schemaVersion: schema.version,
                xml: schema.xml, sourceFile: schema.name
            }));
            loadSavedXdrSchemas().catch(() => []).then(databaseSchemas => [...editorSchemas, ...databaseSchemas]).then(schemas => {
                if (viewerWindow.closed) return;
                schemaSelect.replaceChildren();
                const prompt = viewerWindow.document.createElement("option");
                prompt.value = "";
                prompt.textContent = schemas.length ? "Select an XDR schema" : "No saved XDR schema available";
                schemaSelect.appendChild(prompt);
                schemas.sort((left, right) => left.name.localeCompare(right.name));
                schemas.forEach(schema => {
                    const option = viewerWindow.document.createElement("option");
                    option.value = schema.id;
                    option.textContent = `${schema.name}${schema.schemaVersion ? ` (${schema.schemaVersion})` : ""}`;
                    schemaSelect.appendChild(option);
                });
                // Vorauswahl: im Editor aktive XDR, sonst die einzige vorhandene.
                const preferredSchema = schemas.find(schema => schema.id === `editor:${activeXdrId}`) || (schemas.length === 1 ? schemas[0] : null);
                if (preferredSchema) {
                    schemaSelect.value = preferredSchema.id;
                    try {
                        currentViewerSchema = preferredSchema;
                        renderXmlWithMissingValues(viewerWindow.document, file, preferredSchema, viewerOptions());
                    } catch (error) {
                        summary.textContent = error.message;
                        summary.classList.add("has-missing");
                    }
                } else if (!schemas.length) {
                    summary.textContent = "No saved XDR schema found. Load a schema in Schedule Database and reopen the viewer.";
                    viewerWindow.document.getElementById("xmlContent").textContent = new XMLSerializer().serializeToString(file.xml);
                } else {
                    summary.textContent = "Select the XDR schema to check for missing required elements and values.";
                    viewerWindow.document.getElementById("xmlContent").textContent = new XMLSerializer().serializeToString(file.xml);
                }
                schemaSelect.addEventListener("change", () => {
                    const selectedSchema = schemas.find(schema => schema.id === schemaSelect.value);
                    if (!selectedSchema) {
                        currentViewerSchema = null;
                        summary.textContent = "Select an XDR schema to show missing required elements and values.";
                        viewerWindow.document.getElementById("xmlContent").textContent = new XMLSerializer().serializeToString(file.xml);
                        return;
                    }
                    try {
                        currentViewerSchema = selectedSchema;
                        renderXmlWithMissingValues(viewerWindow.document, file, selectedSchema, viewerOptions());
                    } catch (error) {
                        summary.textContent = error.message;
                        summary.classList.add("has-missing");
                        viewerWindow.document.getElementById("xmlContent").textContent = new XMLSerializer().serializeToString(file.xml);
                    }
                });
            }).catch(error => {
                if (viewerWindow.closed) return;
                summary.textContent = `Could not load saved XDR schemas: ${error.message}`;
                summary.classList.add("has-missing");
                viewerWindow.document.getElementById("xmlContent").textContent = new XMLSerializer().serializeToString(file.xml);
            });
        }

        document.getElementById("compareBtn").onclick = renderComparison;
        document.getElementById("xmlViewerBtn").onclick = openXmlViewer;
        document.getElementById("heatInputBtn").onclick = () => {
            commitPendingEdit();
            document.querySelectorAll("#sidebar .sidebar-item").forEach(el => el.classList.remove("active"));
            document.getElementById("heatInputBtn").classList.add("active");
            renderHeatInput();
        };

        document.getElementById("hiddenManagerBtn").onclick = () => {
            commitPendingEdit();
            document.querySelectorAll("#sidebar .sidebar-item").forEach(el => el.classList.remove("active"));
            document.getElementById("hiddenManagerBtn").classList.add("active");
            showHiddenManager();
        };

        document.getElementById("changeLogBtn").onclick = () => {
            commitPendingEdit();
            document.querySelectorAll("#sidebar .sidebar-item").forEach(el => el.classList.remove("active"));
            document.getElementById("changeLogBtn").classList.add("active");
            renderChangeLog();
        };

        function showHiddenManager() {
            const content = document.getElementById("content"); content.innerHTML = "<h2>Hidden Parameters</h2>";
            if (hiddenFields.size === 0) { content.innerHTML += "<p style='color: var(--text-muted);'>No parameters are hidden.</p>"; return; }
            const table = document.createElement("table"); table.className = "hidden-table"; table.innerHTML = "<tr><th>Parameter</th><th>Action</th></tr>";
            [...hiddenFields].sort().forEach(key => {
                const tr = document.createElement("tr"); const tdName = document.createElement("td"); tdName.textContent = key;
                const tdAction = document.createElement("td"); const btn = document.createElement("button"); btn.textContent = "Restore"; btn.className = "btn-primary hidden-restore-btn";
                btn.onclick = () => {
                    recordHistoryAction("Restore field", () => {
                        hiddenFields.delete(key);
                        saveHidden();
                        showHiddenManager();
                    });
                };
                tdAction.appendChild(btn); tr.appendChild(tdName); tr.appendChild(tdAction); table.appendChild(tr);
            });
            content.appendChild(table);
        }

