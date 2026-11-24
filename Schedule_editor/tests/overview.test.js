// Programmuebersicht (PDF): Zusammenfassung aller geladenen Dateien als Druckansicht.
module.exports = [
    {
        name: "overview of all loaded files",
        async run(t) {
            const { context, page, frame } = await t.openApp("editor");
            const dir = "Schedule_editor/data/samples/04_HIC_PK_764_CS_NGRT_Rev1/";
            await frame.setInputFiles("#fileInput", ["0402-Hotpass1.xml", "0403-Hotpass2.xml", "0408-Cap.xml"].map(name => t.file(dir + name)));
            await page.waitForTimeout(400);
            await frame.evaluate(() => { parameterOrder = { segments: ["indwell", "pri_amp", "slope"] }; });
            const [overview] = await Promise.all([context.waitForEvent("page"), frame.click("#programOverviewBtn")]);
            overview.on("pageerror", error => t.errors.push(`overview: ${error.message}`));
            await overview.waitForLoadState();
            const headings = await overview.$$eval("h2", items => items.map(item => item.textContent));
            // ohne WPS und ohne hervorgehobene Global-Werte: kein WPS- und kein Global-Abschnitt
            t.check("section order", JSON.stringify(headings) === JSON.stringify(["Files", "Segments – main values", "Overrides", "Heat input"]), headings.join(" | "));
            t.check("three files listed", await overview.locator("h2:text('Files') + table tbody tr").count() === 3);
            const segmentHeader = await overview.locator("h2:text('Segments – main values') + table thead").innerText();
            t.check("segment columns per file", ["0402 · S1", "0403 · S1", "0408 · S1"].every(label => segmentHeader.includes(label)), segmentHeader);
            // Gespeicherte eigene Reihenfolge darf die Gruppen nicht aufbrechen
            const segmentRows = await overview.$$eval("h2:text-is('Segments – main values') + table.matrix td.key", cells => cells.map(cell => cell.textContent));
            const segmentGroups = await overview.$$eval("h2:text-is('Segments – main values') + table.matrix tr.group", rows => rows.map(row => row.textContent));
            t.check("segment groups", segmentGroups.slice(0, 5).join("|") === "Current (A)|Voltage / AHC (V)|Travel speed (in/min)|Wire feed (in/min)|Oscillation (s)", segmentGroups.join("|"));
            t.check("same values grey", await overview.locator("h2:text-is('Segments – main values') + table.matrix tr.same td.key", { hasText: "slope" }).count() === 1);
            const expectedStart = ["pri_amp", "bkg_amp", "pri_ahc", "bkg_ahc", "pri_travel", "bkg_travel", "pri_wire", "bkg_wire", "indwell", "excursion", "outdwell"];
            t.check("segment rows grouped", JSON.stringify(segmentRows.slice(0, expectedStart.length)) === JSON.stringify(expectedStart), segmentRows.join(","));
            t.check("further starred values follow", segmentRows.includes("pulse_freq") && segmentRows.indexOf("pulse_freq") > segmentRows.indexOf("wire_manipulator_in_out_width"));
            t.check("heat chart svg", await overview.locator(".chart svg .heat-range").count() === 3);
            t.check("heat table rows", await overview.locator("table.heat tbody tr").count() === 3);
            const overrideRows = await overview.$$eval("h2:text-is('Overrides') + table.matrix td.key", cells => cells.map(cell => cell.textContent));
            t.check("heat input overrides and wire_max", overrideRows.join(",") === "pri_amp_max,bkg_amp_max,avc_override_max,travel_max,dwell_max,excursion_max,wire_max", overrideRows.join(","));
            t.check("overrides in percent", (await overview.locator("h2:text-is('Overrides') + table.matrix td.num").first().textContent()).endsWith(" %"));
            t.check("print button", await overview.locator("button", { hasText: "Print / Save as PDF" }).count() === 1);
            const pdf = await overview.pdf({ format: "A4", landscape: true });
            t.check("PDF can be generated", pdf.length > 20000, String(pdf.length));
            require("fs").writeFileSync(require("path").join(t.tmpDir, "overview.pdf"), pdf);
        }
    },
    {
        name: "WPS ranges and check in the overview",
        async run(t) {
            const { context, page, frame } = await t.openApp("editor");
            await frame.evaluate(() => localStorage.setItem("scheduleEditorWpsRanges", JSON.stringify({
                document: "wps.pdf", wpsNumber: "HIC-T-1", page: 24, checkMode: "separate", wireUnit: "cm/min",
                rows: [{ label: "Füllage (m-141)", passType: "Fill", files: ["0402", "0403"], current: { min: 108, max: 300 }, voltage: { min: 8.6, max: 11.77 },
                    travel: { min: 50, max: 100 }, wire: { min: 80, max: 300 }, heat: { min: 0.46, max: 1.52 } }]
            })));
            const dir = "Schedule_editor/data/samples/04_HIC_PK_764_CS_NGRT_Rev1/";
            await frame.setInputFiles("#fileInput", ["0402-Hotpass1.xml", "0403-Hotpass2.xml", "0408-Cap.xml"].map(name => t.file(dir + name)));
            await page.waitForTimeout(400);
            const [overview] = await Promise.all([context.waitForEvent("page"), frame.click("#programOverviewBtn")]);
            overview.on("pageerror", error => t.errors.push(`overview: ${error.message}`));
            await overview.waitForLoadState();
            const headings = await overview.$$eval("h2", items => items.map(item => item.textContent));
            t.check("WPS section after files", headings[1] === "WPS – ranges and check", headings.join(" | "));
            t.check("WPS number in the header", (await overview.textContent(".meta")).includes("WPS HIC-T-1"));
            t.check("WPS source", (await overview.textContent("h2:text-is('WPS – ranges and check') + div")).includes("wps.pdf, page 24"));
            const range = await overview.locator("table.wps:not(.check) tbody tr").first().innerText();
            t.check("ranges table", range.includes("Füllage (m-141)") && range.includes("0402, 0403") && range.includes("108 – 300") && range.includes("80 – 300") && range.includes("0.46 – 1.52"), range);
            const checkRows = await overview.$$eval("table.wps.check tbody tr:not(.group)", rows => rows.map(row => row.innerText.replace(/\s+/g, " ")));
            t.check("check rows for assigned files", checkRows.length === 2 && checkRows[0].startsWith("0402-Hotpass1 180 140") && /(OK|Override|Outside)$/.test(checkRows[0]), JSON.stringify(checkRows));
            t.check("unassigned file named", (await overview.textContent("table.wps.check + p.legend")).includes("Not assigned to a WPS pass: 0408"));
            const files = await overview.locator("h2:text-is('Files') + table tbody tr").first().innerText();
            t.check("files: WPS pass column", files.includes("Füllage (m-141)"), files);
        }
    }
];
