// Felder, die laut Schema Text sind (z. B. arc_type = "TOUCH"), werden als Text behandelt.
module.exports = [
    {
        name: "string field arc_type",
        async run(t) {
            const { page, frame } = await t.openApp("editor");
            const dir = "Schedule_editor/data/samples/04_HIC_PK_764_CS_NGRT_Rev1/";
            await frame.setInputFiles("#fileInput", [t.file(dir + "0402-Hotpass1.xml"), t.file(dir + "0403-Hotpass2.xml")]);
            await page.waitForTimeout(400);
            await frame.evaluate(() => { activeFile = 0; renderFileList(); showSection("global"); });
            const input = frame.locator('[data-param-name="arc_type"] input');
            t.check("shows TOUCH", await input.inputValue() === "TOUCH", await input.inputValue());
            t.check("not marked invalid", !(await input.evaluate(element => element.classList.contains("invalid-value"))));
            t.check("no unit button", !(await frame.locator('[data-param-name="arc_type"] .unit-toggle-btn').isVisible()));
            await input.focus();
            await input.press("Tab");
            t.check("focus/blur keeps value", (await frame.evaluate(() => loadedFiles[0].xml.querySelector("global arc_type").textContent)) === "TOUCH");
            t.check("file unchanged", (await frame.locator("#fileList .file-status").first().textContent()) === "Saved");
            await input.fill("PULSE");
            await input.press("Tab");
            const values = await frame.evaluate(() => loadedFiles.map(file => file.xml.querySelector("global arc_type").textContent));
            t.check("text written and propagated to selected files", values.join(",") === "PULSE,PULSE", values.join(","));
            await frame.click("#returnBtn");
            const undone = await frame.evaluate(() => loadedFiles.map(file => file.xml.querySelector("global arc_type").textContent));
            t.check("undo restores TOUCH", undone.join(",") === "TOUCH,TOUCH", undone.join(","));
        }
    }
];
