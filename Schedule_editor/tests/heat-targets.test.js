// Heat Input: mehrere Target Ranges mit Dateizuordnung.
const DIR = "Schedule_editor/data/samples/04_HIC_PK_764_CS_NGRT_Rev1/";
const FILES = ["0402-Hotpass1.xml", "0403-Hotpass2.xml", "0404-Fill-OUT.xml", "0408-Cap.xml"];

module.exports = [
    {
        name: "add ranges, assign files, check and persist",
        async run(t) {
            const { page, frame } = await t.openApp("editor");
            await frame.setInputFiles("#fileInput", FILES.map(name => t.file(DIR + name)));
            await page.waitForTimeout(400);
            await frame.click("#heatInputBtn");
            t.check("no range yet", (await frame.textContent(".heat-targets")).includes("No target range"));

            // Range 1: "Hot pass" 0.6 – 0.9 nur fuer 0402, 0403
            await frame.click(".heat-target-add");
            let row = frame.locator(".heat-target-row").nth(0);
            await row.locator(".heat-target-name").fill("Hot pass");
            await row.locator(".heat-target-name").press("Enter");
            row = frame.locator(".heat-target-row").nth(0);
            await row.locator(".heat-target-min").fill("0.6"); await row.locator(".heat-target-min").press("Enter");
            row = frame.locator(".heat-target-row").nth(0);
            await row.locator(".heat-target-max").fill("0.9"); await row.locator(".heat-target-max").press("Enter");
            row = frame.locator(".heat-target-row").nth(0);
            await row.locator(".heat-target-chip", { hasText: "All files" }).locator("input").uncheck();
            for (const key of ["0402", "0403"]) {
                row = frame.locator(".heat-target-row").nth(0);
                await row.locator(".heat-target-chip", { hasText: key }).locator("input").check();
            }
            // Range 2: "Fill" 1.0 – 1.3 nur fuer 0404
            await frame.click(".heat-target-add");
            row = frame.locator(".heat-target-row").nth(1);
            await row.locator(".heat-target-name").fill("Fill"); await row.locator(".heat-target-name").press("Enter");
            row = frame.locator(".heat-target-row").nth(1);
            await row.locator(".heat-target-min").fill("1,0"); await row.locator(".heat-target-min").press("Enter");
            row = frame.locator(".heat-target-row").nth(1);
            await row.locator(".heat-target-max").fill("1.3"); await row.locator(".heat-target-max").press("Enter");
            row = frame.locator(".heat-target-row").nth(1);
            await row.locator(".heat-target-chip", { hasText: "All files" }).locator("input").uncheck();
            row = frame.locator(".heat-target-row").nth(1);
            await row.locator(".heat-target-chip", { hasText: "0404" }).locator("input").check();

            const stored = await frame.evaluate(() => JSON.parse(localStorage.getItem("scheduleEditorHeatInputTargets")));
            t.check("two ranges stored", stored.length === 2 && stored[0].name === "Hot pass" && JSON.stringify(stored[0].files) === '["0402","0403"]'
                && stored[1].min === "1" && JSON.stringify(stored[1].files) === '["0404"]', JSON.stringify(stored));

            const result = await frame.evaluate(() => Object.fromEntries(loadedFiles.map(file => {
                const check = heatInputCheck(file);
                return [fileTargetKey(file), { targets: check.targets.map(x => x.name), outside: check.entries[0].outsideTarget, violations: check.entries[0].targetViolations.map(v => `${v.target.name} ${v.bound}`) }];
            })));
            t.check("0402 checked against Hot pass", JSON.stringify(result["0402"].targets) === '["Hot pass"]', JSON.stringify(result["0402"]));
            t.check("0403 outside Hot pass max", result["0403"].outside && result["0403"].violations.includes("Hot pass max"), JSON.stringify(result["0403"]));
            t.check("0404 checked against Fill only", JSON.stringify(result["0404"].targets) === '["Fill"]', JSON.stringify(result["0404"]));
            t.check("0408 without range", result["0408"].targets.length === 0 && !result["0408"].outside, JSON.stringify(result["0408"]));
            const lines = await frame.$$eval(".heat-chart svg .heat-target-labelx, .heat-chart svg .heat-target-label", nodes => nodes.map(n => n.textContent));
            t.check("chart labels per range", lines.some(text => text === "Hot pass max 0.9") && lines.some(text => text === "Fill min 1"), lines.join(" | "));
            t.check("status names range", (await frame.locator(".heat-segment-row .heat-status").nth(1).getAttribute("title")).includes("Hot pass: max 0.9"));

            // Batch Save nennt die Range
            await frame.click("#batchSaveBtn");
            await frame.click("#batchSaveConfirmBtn");
            t.check("batch save names range", (await frame.textContent("#heatSaveList")).includes("0403 · Segment 1") && (await frame.textContent("#heatSaveList")).includes("Hot pass max 0.90"));
            await frame.click("#heatSaveCancelBtn");

            // Neu laden: bleibt erhalten; Entfernen
            await page.reload();
            await page.waitForTimeout(1200);
            const frame2 = page.frames().find(f => f.url() === "about:srcdoc");
            t.check("ranges persist", (await frame2.evaluate(() => readHeatInputTargets().map(x => x.name).join(","))) === "Hot pass,Fill");
            await frame2.setInputFiles("#fileInput", FILES.map(name => t.file(DIR + name)));
            await page.waitForTimeout(400);
            await frame2.click("#heatInputBtn");
            await frame2.locator(".heat-target-row").nth(1).locator(".heat-target-remove").click();
            t.check("remove range", (await frame2.evaluate(() => readHeatInputTargets().map(x => x.name).join(","))) === "Hot pass");
        }
    },
    {
        name: "old single target is migrated",
        async run(t) {
            const { page, frame } = await t.openApp("editor");
            await frame.evaluate(() => { localStorage.removeItem("scheduleEditorHeatInputTargets"); localStorage.setItem("scheduleEditorHeatInputTarget", JSON.stringify({ min: "0.5", max: "1.1" })); });
            const targets = await frame.evaluate(() => readHeatInputTargets());
            t.check("migrated to one range for all files", targets.length === 1 && targets[0].name === "Target" && targets[0].min === 0.5 && targets[0].max === 1.1 && targets[0].files === null, JSON.stringify(targets));
        }
    }
];
