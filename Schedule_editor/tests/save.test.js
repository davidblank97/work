// Save (ohne Download, alle geaenderten Dateien, Change Log) und Batch Save (Download).
const REF = "Schedule_editor/data/samples/04_HIC_PK_764_CS_NGRT_Rev1/";

module.exports = [
    {
        name: "save logs all changed files without download",
        async run(t) {
            const { page, frame } = await t.openApp("editor");
            let downloads = 0;
            page.on("download", () => { downloads++; });
            await frame.setInputFiles("#fileInput", ["0402-Hotpass1.xml", "0403-Hotpass2.xml", "0404-Fill-OUT.xml"].map(name => t.file(REF + name)));
            await page.waitForTimeout(400);
            t.check("no Save As", await frame.locator("#saveAsBtn").count() === 0);
            for (const index of [0, 1]) {
                await frame.evaluate(i => { activeFile = i; renderFileList(); showSection("segments"); }, index);
                const input = frame.locator('.segment-panel [data-param-name="pri_amp"] input');
                await input.fill(String(150 + index));
                await input.press("Tab");
            }
            await frame.click("#saveBtn");
            await page.waitForTimeout(150);
            t.check("saves 2 files", /Saved 2 files \(2 changes logged\)/.test(await frame.textContent("#status")), await frame.textContent("#status"));
            t.check("no download", downloads === 0);
            t.check("status Saved ↓", JSON.stringify(await frame.locator("#fileList .file-status").allTextContents()) === JSON.stringify(["Saved ↓", "Saved ↓", "Saved"]));
            t.check("header not downloaded", (await frame.textContent("#changeCounter")).includes("2 not downloaded"));

            // zweites Speichern derselben Datei
            await frame.evaluate(() => { activeFile = 0; renderFileList(); showSection("segments"); });
            const input = frame.locator('.segment-panel [data-param-name="pri_amp"] input');
            await input.fill("160");
            await input.press("Tab");
            await page.keyboard.press("Control+s");
            await frame.click("#changeLogBtn");
            const saves = frame.locator(".changelog-save-row.is-expandable");
            t.check("3 expandable save entries", await saves.count() === 3);
            await saves.nth(0).click();
            const details = await frame.$$eval(".changelog-detail-row:not([hidden])", rows => rows.map(row => row.innerText.replace(/\s+/g, " ")));
            t.check("latest save shows 150 → 160", details.length === 1 && /pri_amp \(segment 1\) 150\.000000 160\.000000/.test(details[0]), details.join(" | "));

            // Batch Save laedt herunter
            await frame.click("#batchSaveBtn");
            const [download] = await Promise.all([page.waitForEvent("download"), frame.click("#batchSaveConfirmBtn")]);
            await page.waitForTimeout(200);
            t.check("batch save downloads zip", /\.zip$/.test(download.suggestedFilename()));
            t.check("after download all Saved", (await frame.locator("#fileList .file-status").allTextContents()).every(text => text === "Saved"));
        }
    },
    {
        name: "clear change log with undo",
        async run(t) {
            const { page, frame } = await t.openApp("editor");
            await frame.setInputFiles("#fileInput", [t.file(REF + "0403-Hotpass2.xml")]);
            await page.waitForTimeout(300);
            await frame.evaluate(() => showSection("global"));
            const input = frame.locator('[data-param-name="prepurge"] input');
            await input.fill("2");
            await input.press("Tab");
            await frame.click("#saveBtn");
            await frame.click("#changeLogBtn");
            page.once("dialog", dialog => dialog.accept());
            await frame.click(".changelog-clear-btn");
            t.check("log cleared", await frame.evaluate(() => changeLog.length) === 0);
            await frame.click("#returnBtn");
            t.check("undo restores log", await frame.evaluate(() => changeLog.length) === 2);
        }
    }
];
