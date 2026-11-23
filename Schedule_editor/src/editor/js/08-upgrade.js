        /* UPGRADE TO SCHEMA VERSION */
        // Bringt eine Datei auf die Struktur der aktiven XDR: Werte bleiben, fehlende Felder kommen aus dem
        // Layout-Muster (nach Head), unbekannte Felder werden entfernt, Reihenfolge nach XDR.
        const LAYOUT_TEMPLATE_KEY = "scheduleEditorLayoutTemplates";
        // Umbenennungen aelterer Versionen: alter Name -> neue Felder (Wert wird uebernommen).
        const SCHEMA_RENAMES = {
            amp_max: ["pri_amp_max", "bkg_amp_max"],
            amp_rate: ["pri_amp_rate", "bkg_amp_rate"]
        };
        const FIXED_UPGRADE_VALUES = { jog_speed_edit_mode: "1" };
        let customLayoutTemplates = readStoredJson(LAYOUT_TEMPLATE_KEY, {});

        function layoutKindForHead(head) {
            return /ngrt/i.test(String(head || "")) ? "NGRT" : "NG";
        }

        function getLayoutTemplate(kind) {
            const custom = customLayoutTemplates[kind];
            if (custom && typeof custom.xml === "string") return { kind, name: custom.name, version: custom.version, xml: custom.xml, builtin: false };
            const xml = document.getElementById(kind === "NGRT" ? "layoutNGRT" : "layoutNG")?.textContent.trim() || "";
            const version = (xml.match(/<config_version>([^<]*)</) || [])[1] || "";
            return { kind, name: kind === "NGRT" ? "8888-layout new NGRT.xml (built-in)" : "7777-layout new NG.xml (built-in)", version, xml, builtin: true };
        }

        function parseLayoutTemplate(template) {
            const doc = new DOMParser().parseFromString(template.xml, "application/xml");
            if (doc.querySelector("parsererror") || doc.documentElement.localName !== "sched") throw new Error(`${template.name}: not a valid schedule XML.`);
            return doc;
        }

        function directChildren(element, name) {
            return [...element.children].filter(child => child.localName === name);
        }

        // Standardwert fuer ein neues Feld ohne Musterwert.
        function defaultValueForType(type) {
            const kind = String(type || "string").toLowerCase();
            if (kind === "boolean" || XDR_INTEGER_RANGES[kind]) return "0";
            if (["float", "number", "r4", "r8"].includes(kind) || kind.startsWith("fixed")) return "0.000000";
            return "";
        }

        function upgradeDocument(xmlDocument, schema, templateDoc) {
            const { model, version } = buildXdrModel(schema);
            const report = { added: [], removed: [], renamed: [], reordered: 0 };
            const ownerDoc = xmlDocument;

            const createDefault = name => {
                const element = ownerDoc.createElement(name);
                const definition = model.get(name);
                if (definition && definition.elements.length && definition.content !== "textOnly") {
                    definition.elements.filter(entry => entry.min > 0).forEach(entry => {
                        for (let index = 0; index < entry.min; index++) element.appendChild(createDefault(entry.name));
                    });
                } else if (definition) {
                    element.textContent = defaultValueForType(definition.dtType);
                }
                return element;
            };

            const pathOf = element => {
                const parts = [];
                for (let node = element; node && node.nodeType === 1; node = node.parentElement) {
                    parts.unshift(node.localName === "segment" && node.hasAttribute("index") ? `segment[${node.getAttribute("index")}]` : node.localName);
                }
                return parts.join("/");
            };

            const indent = (element, depth) => {
                const children = [...element.children];
                [...element.childNodes].forEach(node => { if (node.nodeType !== 1) element.removeChild(node); });
                children.forEach(child => {
                    element.insertBefore(ownerDoc.createTextNode(`\n${"\t".repeat(depth + 1)}`), child);
                });
                if (children.length) element.appendChild(ownerDoc.createTextNode(`\n${"\t".repeat(depth)}`));
            };

            const visit = (element, templateElement, depth, position) => {
                const definition = model.get(element.localName);
                if (!definition) return;
                // Pflichtattribute
                definition.attributes.forEach(attribute => {
                    if (!attribute.required || element.hasAttribute(attribute.name)) return;
                    let value = templateElement?.getAttribute(attribute.name) ?? defaultValueForType(attribute.dtType);
                    if (element.localName === "segment" && attribute.name === "index") value = String(position);
                    element.setAttribute(attribute.name, value);
                    report.added.push(`${pathOf(element)} @${attribute.name}`);
                });
                if (definition.content === "textOnly" || !definition.elements.length) return;

                const declared = new Set(definition.elements.map(entry => entry.name));
                const before = [...element.children].map(child => child.localName).join("|");

                // Umbenannte Felder: Wert in die neuen Felder uebernehmen (nur wenn diese fehlen).
                Object.entries(SCHEMA_RENAMES).forEach(([oldName, newNames]) => {
                    const source = directChildren(element, oldName)[0];
                    if (!source || declared.has(oldName)) return;
                    newNames.forEach(newName => {
                        if (!declared.has(newName) || directChildren(element, newName).length) return;
                        const target = ownerDoc.createElement(newName);
                        target.textContent = source.textContent;
                        element.appendChild(target);
                        report.renamed.push({ from: oldName, to: newName, value: source.textContent, path: pathOf(element) });
                    });
                });

                const ordered = [];
                definition.elements.forEach(entry => {
                    const existing = directChildren(element, entry.name);
                    const templateMatches = templateElement ? directChildren(templateElement, entry.name) : [];
                    existing.forEach((child, index) => {
                        if (index >= entry.max) {
                            report.removed.push({ path: pathOf(child), value: child.textContent.trim().slice(0, 60) });
                            return;
                        }
                        ordered.push({ child, template: templateMatches[Math.min(index, templateMatches.length - 1)] || null });
                    });
                    for (let index = existing.length; index < entry.min; index++) {
                        const templateChild = templateMatches[Math.min(index, templateMatches.length - 1)];
                        const created = templateChild ? ownerDoc.importNode(templateChild, true) : createDefault(entry.name);
                        ordered.push({ child: created, template: templateChild || null, isNew: true });
                        report.added.push(`${pathOf(element)}/${entry.name}${templateChild ? "" : " (default)"}`);
                    }
                });
                [...element.children].forEach(child => {
                    if (!declared.has(child.localName)) {
                        report.removed.push({ path: pathOf(child), value: child.children.length ? "…" : child.textContent.trim().slice(0, 60) });
                    }
                });

                [...element.childNodes].forEach(node => element.removeChild(node));
                let segmentPosition = 0;
                ordered.forEach(({ child }) => element.appendChild(child));
                if (ordered.map(entry => entry.child.localName).join("|") !== before) report.reordered++;
                ordered.forEach(({ child, template }) => {
                    visit(child, template, depth + 1, child.localName === "segment" ? segmentPosition++ : 0);
                });
                indent(element, depth);
            };

            const root = xmlDocument.documentElement;
            const versionFrom = (root.querySelector("metadata > config_version")?.textContent || "").trim();
            visit(root, templateDoc?.documentElement || null, 0, 0);

            const configVersion = root.querySelector("metadata > config_version");
            if (configVersion && version) configVersion.textContent = version;
            Object.entries(FIXED_UPGRADE_VALUES).forEach(([name, value]) => {
                if (isLocked(name)) return;
                root.querySelectorAll(name).forEach(node => { node.textContent = value; });
            });
            return { ...report, versionFrom, versionTo: version };
        }

        // Probelauf an einer Kopie (fuer die Vorschau im Dialog).
        function previewUpgrade(file) {
            const schema = getActiveXdr();
            const template = getLayoutTemplate(layoutKindForHead(file.xml.documentElement.getAttribute("head")));
            const copy = file.xml.cloneNode(true);
            const report = upgradeDocument(copy, schema, parseLayoutTemplate(template));
            return { report, template, schema };
        }

        function upgradeCandidates() {
            return loadedFiles.filter(file => {
                const result = getSchemaResult(file);
                return result && (result.errors > 0 || result.comparison < 0);
            });
        }

        const upgradeModal = document.getElementById("upgradeModal");
        let pendingUpgradeIds = [];
        function openUpgradeDialog(files) {
            commitPendingEdit();
            const schema = getActiveXdr();
            if (!schema || !files.length) return;
            pendingUpgradeIds = files.map(file => file.id);
            document.getElementById("upgradeText").textContent =
                `${files.length} file(s) will be brought to schema v${schema.version}. Values of existing fields are kept; missing fields are added from the layout template, fields unknown to the schema are removed.`;
            const list = document.getElementById("upgradeList");
            list.replaceChildren();
            files.forEach(file => {
                const line = document.createElement("div");
                line.className = "upgrade-line";
                try {
                    const { report, template } = previewUpgrade(file);
                    line.textContent = `${fileShortLabel(file)}: v${report.versionFrom || "?"} → v${report.versionTo} · +${report.added.length} added · −${report.removed.length} removed${report.renamed.length ? ` · ${report.renamed.length} renamed` : ""} · template ${template.kind}`;
                } catch (error) {
                    line.textContent = `${fileShortLabel(file)}: ${error.message}`;
                    line.classList.add("is-error");
                }
                list.appendChild(line);
            });
            openModal(upgradeModal, document.getElementById("upgradeConfirmBtn"));
        }

        function upgradeFiles(fileIds) {
            const schema = getActiveXdr();
            let done = 0;
            let stillFailing = 0;
            recordHistoryAction("Upgrade schedule", () => {
                fileIds.forEach(id => {
                    const fileIndex = loadedFiles.findIndex(file => file.id === id);
                    const file = loadedFiles[fileIndex];
                    if (!file) return;
                    const template = getLayoutTemplate(layoutKindForHead(file.xml.documentElement.getAttribute("head")));
                    const report = upgradeDocument(file.xml, schema, parseLayoutTemplate(template));
                    file.sections = createFileRecord(file.name, file.xml, file.originalXml, file.id, file.originalXmlString).sections;
                    file.lastUpgrade = { ...report, template: template.name, at: new Date().toISOString() };
                    updateChangeLogEntry({
                        fileIndex, fileName: file.name, sectionName: "metadata", key: "schema upgrade", segmentIndex: "",
                        oldValue: `v${report.versionFrom || "?"}`,
                        newValue: `v${report.versionTo} (+${report.added.length} / −${report.removed.length} fields${report.renamed.length ? `, ${report.renamed.length} renamed` : ""})`
                    });
                    done++;
                    if ((getSchemaResult(file)?.errors || 0) > 0) stillFailing++;
                });
                renderFileList();
            });
            document.getElementById("status").textContent = `${done} file(s) upgraded to v${schema.version}`
                + (stillFailing ? ` – ${stillFailing} still with schema errors.` : " – all match the schema.") + " Save to keep the changes.";
            showSchemaCheck();
        }

        document.getElementById("upgradeCancelBtn").onclick = () => { pendingUpgradeIds = []; closeModal(upgradeModal); };
        document.getElementById("upgradeConfirmBtn").onclick = () => {
            const ids = pendingUpgradeIds;
            pendingUpgradeIds = [];
            closeModal(upgradeModal);
            if (ids.length) upgradeFiles(ids);
        };

        // Hinweis beim Laden: aeltere bzw. nicht schema-konforme Dateien zum Upgrade anbieten (nichts automatisch).
        let upgradeBannerIds = [];
        function offerUpgradeForNewFiles(newFiles) {
            const schema = getActiveXdr();
            const ids = new Set(newFiles.map(file => file.id));
            const candidates = upgradeCandidates().filter(file => ids.has(file.id));
            upgradeBannerIds = [...new Set([...upgradeBannerIds, ...candidates.map(file => file.id)])];
            refreshUpgradeBanner(schema);
        }

        function refreshUpgradeBanner(schema = getActiveXdr()) {
            const banner = document.getElementById("upgradeBanner");
            if (!banner) return;
            const candidates = new Set(upgradeCandidates().map(file => file.id));
            upgradeBannerIds = upgradeBannerIds.filter(id => candidates.has(id));
            const files = upgradeBannerIds.map(id => loadedFiles.find(file => file.id === id)).filter(Boolean);
            banner.hidden = !files.length || !schema;
            if (banner.hidden) return;
            const versions = [...new Set(files.map(file => getFileVersion(file).version || "?"))];
            document.getElementById("upgradeBannerText").textContent =
                `${files.length} file(s) do not match schema v${schema.version}${versions.length ? ` (file version ${versions.join(", ")})` : ""}. Upgrade them?`;
        }

        document.getElementById("upgradeBannerReviewBtn").onclick = () => {
            const files = upgradeBannerIds.map(id => loadedFiles.find(file => file.id === id)).filter(Boolean);
            if (files.length) openUpgradeDialog(files);
        };
        document.getElementById("upgradeBannerDismissBtn").onclick = () => {
            upgradeBannerIds = [];
            refreshUpgradeBanner();
        };

        // Eigene Layout-Muster (Settings): Zuordnung ueber das head-Attribut.
        async function importLayoutTemplate(file) {
            const status = document.getElementById("status");
            try {
                const xml = await file.text();
                const doc = new DOMParser().parseFromString(xml, "application/xml");
                if (doc.querySelector("parsererror") || doc.documentElement.localName !== "sched") throw new Error(`${file.name}: not a schedule XML.`);
                const kind = layoutKindForHead(doc.documentElement.getAttribute("head"));
                const version = (doc.querySelector("metadata > config_version")?.textContent || "").trim();
                customLayoutTemplates = { ...customLayoutTemplates, [kind]: { name: file.name, version, xml } };
                localStorage.setItem(LAYOUT_TEMPLATE_KEY, JSON.stringify(customLayoutTemplates));
                status.textContent = `Layout template ${file.name} (v${version}) used for ${kind} heads.`;
            } catch (error) {
                status.textContent = `Template not loaded: ${error.message}`;
                window.alert(`Template not loaded:\n${error.message}`);
            }
            renderXdrManager();
        }

        function resetLayoutTemplate(kind) {
            const next = { ...customLayoutTemplates };
            delete next[kind];
            customLayoutTemplates = next;
            try { localStorage.setItem(LAYOUT_TEMPLATE_KEY, JSON.stringify(customLayoutTemplates)); } catch (error) { /* ignore */ }
            renderXdrManager();
        }

