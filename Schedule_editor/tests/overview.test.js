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
            t.check("section order", JSON.stringify(headings) === JSON.stringify(["Files", "Segments – main values", "Global – highlighted values", "Overrides used for the heat input", "Heat input"]), headings.join(" | "));
            t.check("sections", ["Files", "Global – highlighted values", "Segments – main values", "Heat input", "Overrides used for the heat input"].every(h => headings.includes(h)), headings.join(" | "));
            t.check("three files listed", await overview.locator("h2:text('Files') + table tbody tr").count() === 3);
            const segmentHeader = await overview.locator("h2:text('Segments – main values') + table thead").innerText();
            t.check("segment columns per file", ["0402 · S1", "0403 · S1", "0408 · S1"].every(label => segmentHeader.includes(label)), segmentHeader);
            // Gespeicherte eigene Reihenfolge darf die Gruppen nicht aufbrechen
            const segmentRows = await overview.$$eval("h2:text-is('Segments – main values') + table.matrix td.key", cells => cells.map(cell => cell.textContent));
            const expectedStart = ["pri_amp", "bkg_amp", "pri_ahc", "bkg_ahc", "pri_travel", "bkg_travel", "pri_wire", "bkg_wire", "indwell", "excursion", "outdwell"];
            t.check("segment rows grouped", JSON.stringify(segmentRows.slice(0, expectedStart.length)) === JSON.stringify(expectedStart), segmentRows.join(","));
            t.check("further starred values follow", segmentRows.includes("pulse_freq") && segmentRows.indexOf("pulse_freq") > segmentRows.indexOf("wire_manipulator_in_out_width"));
            t.check("heat chart svg", await overview.locator(".chart svg .heat-range").count() === 3);
            t.check("heat table rows", await overview.locator("table.heat tbody tr").count() === 3);
            const overrideRows = await overview.$$eval("h2:text-is('Overrides used for the heat input') + table.matrix td.key", cells => cells.map(cell => cell.textContent));
            t.check("only heat input overrides", overrideRows.join(",") === "pri_amp_max,bkg_amp_max,avc_override_max,travel_max,dwell_max,excursion_max", overrideRows.join(","));
            t.check("print button", await overview.locator("button", { hasText: "Print / Save as PDF" }).count() === 1);
            const pdf = await overview.pdf({ format: "A4", landscape: true });
            t.check("PDF can be generated", pdf.length > 20000, String(pdf.length));
            require("fs").writeFileSync(require("path").join(t.tmpDir, "overview.pdf"), pdf);
        }
    }
];
