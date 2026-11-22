// Pendant Key Layout Editor (drittes Werkzeug der Suite).
const fs = require("fs");

const keysOf = (xml, modeName) => {
    const block = xml.match(new RegExp(`<mode[^>]*name='${modeName}'[^>]*>([\\s\\S]*?)</mode>`));
    return block ? [...block[1].matchAll(/<key[^>]*>([^<]*)<\/key>/g)].map(m => m[1]) : null;
};

module.exports = [
    {
        name: "start page card and switching",
        async run(t) {
            const { page } = await t.newPage();
            await page.goto(t.suiteUrl);
            t.check("three cards", await page.locator(".app-card").count() === 3);
            await page.click('a[data-app="pendant"]');
            await page.waitForTimeout(800);
            t.check("hash #pendant", page.url().endsWith("#pendant"));
            const frame = page.frames().find(f => f.url() === "about:srcdoc");
            t.check("generator rendered", await frame.locator("#generate-xml-button").isVisible());
            await page.click('#suite-bar [data-route="editor"]');
            await page.waitForTimeout(600);
            await page.click('#suite-bar [data-route="pendant"]');
            t.check("pendant frame kept", await frame.locator("#generate-xml-button").isVisible());
            t.check("bar marks pendant", (await page.getAttribute('#suite-bar [data-route="pendant"]', "aria-current")) === "page");
        }
    },
    {
        name: "load key_layout.xml, edit and export",
        async run(t) {
            const { context, page, frame } = await t.openApp("pendant");
            const source = fs.readFileSync(t.file("Pendant_layout/key_layout.xml"), "utf8");
            await frame.setInputFiles("#file-input", [t.file("Pendant_layout/key_layout.xml")]);
            await page.waitForTimeout(400);
            const tabs = await frame.$$eval("#tabs-container button", buttons => buttons.map(b => b.dataset.mode));
            t.check("tabs JOG, WELD, WELD2", tabs.join(",") === "JOG,WELD,WELD2", tabs.join(","));
            const first = frame.locator("#JOG-grid-container select").first();
            t.check("JOG row 0 key 0 from file", await first.inputValue() === keysOf(source, "JOG")[0], await first.inputValue());
            await first.selectOption("wire_on");
            await frame.fill("#filename-suffix-input", "test");
            const [download] = await Promise.all([page.waitForEvent("download"), frame.click("#generate-xml-button")]);
            t.check("file name", download.suggestedFilename() === "key_layout_test.xml", download.suggestedFilename());
            const xml = fs.readFileSync(await download.path(), "utf8");
            t.check("root termkeys", /<termkeys[\s>]/.test(xml));
            t.check("nine modes", (xml.match(/<mode /g) || []).length === 9);
            t.check("edited key written", keysOf(xml, "JOG")[0] === "wire_on");
            t.check("NUMPAD kept from loaded file", JSON.stringify(keysOf(xml, "NUMPAD")) === JSON.stringify(keysOf(source, "NUMPAD")));
            const [preview] = await Promise.all([context.waitForEvent("page"), frame.click("#preview-pdf-button")]);
            await preview.waitForTimeout(300);
            t.check("PDF preview opens", (await preview.title()).includes("Pendant Layout Preview"), await preview.title());
        }
    },
    {
        name: "editor colour scheme",
        async run(t) {
            const { frame } = await t.openApp("pendant");
            const colors = await frame.evaluate(() => ({
                body: getComputedStyle(document.body).backgroundColor,
                panel: getComputedStyle(document.querySelector(".panel")).backgroundColor,
                primary: getComputedStyle(document.getElementById("generate-xml-button")).backgroundColor,
                primaryText: getComputedStyle(document.getElementById("generate-xml-button")).color
            }));
            t.check("background #141210", colors.body === "rgb(20, 18, 16)", colors.body);
            t.check("panel #211d1a", colors.panel === "rgb(33, 29, 26)", colors.panel);
            t.check("primary button #f28a3d", colors.primary === "rgb(242, 138, 61)", colors.primary);
            t.check("dark text on orange", colors.primaryText === "rgb(36, 21, 13)", colors.primaryText);
        }
    }
];
