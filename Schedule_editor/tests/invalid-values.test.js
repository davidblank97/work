// Ungueltige Zahlenwerte aus der Datei werden angezeigt und nicht still zu 0.
const fs = require("fs");

module.exports = [
    {
        name: "invalid number stays visible and unchanged",
        async run(t) {
            const { page, frame } = await t.openApp("editor");
            const text = fs.readFileSync(t.file("Schedule_editor/04_HIC_PK_764_CS_NGRT_Rev1/0402-Hotpass1.xml"), "utf8")
                .replace(/<prepurge>[^<]*<\/prepurge>/, "<prepurge>abc</prepurge>");
            await frame.setInputFiles("#fileInput", [{ name: "invalid.xml", mimeType: "text/xml", buffer: Buffer.from(text) }]);
            await page.waitForTimeout(300);
            await frame.evaluate(() => showSection("global"));
            const input = frame.locator('[data-param-name="prepurge"] input');
            t.check("shows original text", await input.inputValue() === "abc", await input.inputValue());
            t.check("marked invalid", await input.evaluate(element => element.classList.contains("invalid-value")));
            await input.focus();
            await input.press("Tab");
            const stored = await frame.evaluate(() => loadedFiles[0].xml.querySelector("global prepurge").textContent);
            t.check("focus/blur does not write 0", stored === "abc", stored);
            t.check("file stays unchanged", (await frame.locator("#fileList .file-status").textContent()) === "Saved");
            await input.fill("2,5");
            await input.press("Tab");
            const fixed = await frame.evaluate(() => loadedFiles[0].xml.querySelector("global prepurge").textContent);
            t.check("valid entry is written", /^2\.5/.test(fixed), fixed);
            t.check("float gets 6 decimals", fixed === "2.500000", fixed);
            t.check("invalid mark removed", !(await input.evaluate(element => element.classList.contains("invalid-value"))));
        }
    },
    {
        name: "invalid integer field gets no decimals",
        async run(t) {
            const { page, frame } = await t.openApp("editor");
            const text = fs.readFileSync(t.file("Schedule_editor/04_HIC_PK_764_CS_NGRT_Rev1/0402-Hotpass1.xml"), "utf8")
                .replace(/<trail_gas>[^<]*<\/trail_gas>/, "<trail_gas>x</trail_gas>");
            await frame.setInputFiles("#fileInput", [{ name: "invalid-int.xml", mimeType: "text/xml", buffer: Buffer.from(text) }]);
            await page.waitForTimeout(300);
            await frame.evaluate(() => showSection("global"));
            const input = frame.locator('[data-param-name="trail_gas"] input');
            await input.fill("1");
            await input.press("Tab");
            const value = await frame.evaluate(() => loadedFiles[0].xml.querySelector("global trail_gas").textContent);
            t.check("boolean written as 1", value === "1", value);
            t.check("file valid again", await frame.evaluate(() => getSchemaResult(loadedFiles[0]).errors) === 0);
        }
    }
];
