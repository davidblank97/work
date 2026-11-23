// Programmuebersicht (PDF): Zusammenfassung aller geladenen Dateien als Druckansicht.
module.exports = [
    {
        name: "overview of all loaded files",
        async run(t) {
            const { context, page, frame } = await t.openApp("editor");
            const dir = "Schedule_editor/04_HIC_PK_764_CS_NGRT_Rev1/";
            await frame.setInputFiles("#fileInput", ["0402-Hotpass1.xml", "0403-Hotpass2.xml", "0408-Cap.xml"].map(name => t.file(dir + name)));
            await page.waitForTimeout(400);
            const important = await frame.evaluate(() => [...importantFields]);
            const [overview] = await Promise.all([context.waitForEvent("page"), frame.click("#programOverviewBtn")]);
            overview.on("pageerror", error => t.errors.push(`overview: ${error.message}`));
            await overview.waitForLoadState();
            const headings = await overview.$$eval("h2", items => items.map(item => item.textContent));
            t.check("sections", ["Files", "Global – highlighted values", "Segments – highlighted values", "Heat input", "Overrides"].every(h => headings.includes(h)), headings.join(" | "));
            t.check("three files listed", await overview.locator("h2:text('Files') + table tbody tr").count() === 3);
            const segmentHeader = await overview.locator("h2:text('Segments – highlighted values') + table thead").innerText();
            t.check("segment columns per file", ["0402 · S1", "0403 · S1", "0408 · S1"].every(label => segmentHeader.includes(label)), segmentHeader);
            const segmentRows = await overview.$$eval("h2:text-is('Segments – highlighted values') + table.matrix td.key", cells => cells.map(cell => cell.textContent));
            t.check("highlighted segment values only", segmentRows.length > 0 && segmentRows.every(key => important.includes(key)), segmentRows.join(","));
            t.check("pri_amp included", segmentRows.includes("pri_amp"));
            t.check("heat chart svg", await overview.locator(".chart svg .heat-range").count() === 3);
            t.check("heat table rows", await overview.locator("table.heat tbody tr").count() === 3);
            const overrideRows = await overview.locator("h2:text('Overrides') ~ table.matrix tbody tr").count();
            const overrideCount = await frame.evaluate(() => loadedFiles[0].sections.overrides.children.length);
            t.check("all overrides", overrideRows === overrideCount, `${overrideRows} vs ${overrideCount}`);
            t.check("print button", await overview.locator("button", { hasText: "Print / Save as PDF" }).count() === 1);
            const pdf = await overview.pdf({ format: "A4", landscape: true });
            t.check("PDF can be generated", pdf.length > 20000, String(pdf.length));
            require("fs").writeFileSync(require("path").join(t.tmpDir, "overview.pdf"), pdf);
        }
    }
];
