// XML Viewer: Aenderungen seit dem letzten Speichern farbig.
module.exports = [
    {
        name: "highlights changes after upgrade",
        async run(t) {
            const { context, page, frame } = await t.openApp("editor");
            await frame.setInputFiles("#fileInput", [t.file("Schedule_editor/schedule_beispiel.xml")]);
            await page.waitForTimeout(400);
            let [viewer] = await Promise.all([context.waitForEvent("page"), frame.click("#xmlViewerBtn")]);
            await viewer.waitForTimeout(500);
            t.check("no changes before", (await viewer.textContent("#diffSummary")).includes("No changes"));
            t.check("empty string fields are not reported missing", !(await viewer.textContent("#xmlContent")).includes("<custom_search_tag>[MISSING"));
            await viewer.close();

            await frame.evaluate(() => upgradeFiles([loadedFiles[0].id]));
            await frame.evaluate(() => recordHistoryAction("t", () => { loadedFiles[0].xml.querySelector("global prepurge").textContent = "9.000000"; }));
            [viewer] = await Promise.all([context.waitForEvent("page"), frame.click("#xmlViewerBtn")]);
            await viewer.waitForTimeout(500);
            const report = await frame.evaluate(() => loadedFiles[0].lastUpgrade);
            const summary = await viewer.textContent("#diffSummary");
            t.check("added count", summary.includes(`+ ${report.added.length + report.renamed.length} added`), summary);
            t.check("removed count", summary.includes(`− ${report.removed.length} removed`), summary);
            const removed = await viewer.$$eval(".diff-removed", lines => lines.map(line => line.textContent));
            t.check("removed amp_max shown", removed.some(line => line.includes("<amp_max>10.000000</amp_max>")));
            const added = await viewer.$$eval(".diff-added", lines => lines.map(line => line.textContent));
            t.check("added pri_amp_max shown", added.some(line => line.includes("<pri_amp_max>10.000000</pri_amp_max>")));
            const changed = await viewer.$$eval(".diff-changed", lines => lines.map(line => line.textContent));
            t.check("changed value with old value", changed.some(line => line.includes("9.000000") && line.includes("was: 7.000000")));
            await viewer.uncheck("#showChanges");
            await viewer.waitForTimeout(150);
            t.check("highlight can be switched off", await viewer.locator(".diff-added, .diff-removed, .diff-changed").count() === 0);
        }
    }
];
