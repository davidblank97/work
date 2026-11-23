// Batch Save: Fehlermeldung, wenn der Heat Input ausserhalb der Grenzen liegt.
const fs = require("fs");
const REF = "Schedule_editor/04_HIC_PK_764_CS_NGRT_Rev1/0402-Hotpass1.xml";

const openBatch = async frame => {
    await frame.click("#batchSaveBtn");
    await frame.click("#batchSaveConfirmBtn");
};

module.exports = [
    {
        name: "target range exceeded",
        async run(t) {
            const { page, frame } = await t.openApp("editor");
            await frame.evaluate(() => localStorage.setItem("scheduleEditorHeatInputTarget", JSON.stringify({ min: "", max: "0.1" })));
            await frame.setInputFiles("#fileInput", [t.file(REF)]);
            await page.waitForTimeout(300);
            let downloads = 0;
            page.on("download", () => { downloads++; });
            await openBatch(frame);
            t.check("error dialog shown", await frame.locator("#heatSaveModal.show").count() === 1);
            const text = await frame.textContent("#heatSaveList");
            t.check("names segment and target", /0402 · Segment 1: .* kJ\/mm \(Target max 0\.100\)/.test(text), text);
            await frame.click("#heatSaveCancelBtn");
            await page.waitForTimeout(200);
            t.check("cancel: no download", downloads === 0);
            t.check("cancel: status message", (await frame.textContent("#status")).includes("heat input outside the limits"));
            await openBatch(frame);
            const [download] = await Promise.all([page.waitForEvent("download"), frame.click("#heatSaveConfirmBtn")]);
            t.check("save anyway downloads", download.suggestedFilename() === "0402-Hotpass1.xml");
            await openBatch(frame);
            await frame.click("#heatSaveShowBtn");
            t.check("show opens heat input", await frame.evaluate(() => document.getElementById("heatInputBtn").classList.contains("active")));
        }
    },
    {
        name: "limits from the file and no dialog when inside",
        async run(t) {
            const { page, frame } = await t.openApp("editor");
            const xml = fs.readFileSync(t.file(REF), "utf8").replace(/<heat_input_fault_high>[^<]*<\/heat_input_fault_high>/, "<heat_input_fault_high>0.050000</heat_input_fault_high>");
            await frame.setInputFiles("#fileInput", [
                { name: "0499-limit.xml", mimeType: "text/xml", buffer: Buffer.from(xml) },
                { name: "0402-Hotpass1.xml", mimeType: "text/xml", buffer: fs.readFileSync(t.file(REF)) }
            ]);
            await page.waitForTimeout(300);
            await openBatch(frame);
            const text = await frame.textContent("#heatSaveList");
            t.check("file limit reported", /0499 · Segment 1: .*limit max 0\.050/.test(text) && !text.includes("0402"), text);
            await frame.click("#heatSaveCancelBtn");
            await frame.evaluate(() => { selectedFiles = new Set([loadedFiles.findIndex(f => f.name === "0402-Hotpass1.xml")]); renderFileList(); });
            const [download] = await Promise.all([page.waitForEvent("download"), openBatch(frame)]);
            t.check("inside limits: downloads directly", download.suggestedFilename() === "0402-Hotpass1.xml" && await frame.locator("#heatSaveModal.show").count() === 0);
        }
    }
];
