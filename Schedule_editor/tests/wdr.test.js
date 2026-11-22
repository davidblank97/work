// Startseite, Wechsel zwischen den Apps und WDR-Konvertierung.
const { smallCsv } = require("./lib");

module.exports = [
    {
        name: "start page and switching",
        async run(t) {
            const { page } = await t.newPage();
            await page.goto(t.suiteUrl);
            t.check("start page", await page.isVisible("#launcher") && !(await page.isVisible("#suite-bar")));
            await page.click('a[data-app="editor"]');
            await page.waitForTimeout(800);
            const editor = page.frames().find(frame => frame.url() === "about:srcdoc");
            t.check("editor not in quirks mode", await editor.evaluate(() => document.compatMode) === "CSS1Compat");
            await editor.setInputFiles("#fileInput", [t.file("Schedule_editor/schedule_beispiel.xml")]);
            await page.waitForTimeout(300);
            await page.click('#suite-bar [data-route="wdr"]');
            await page.waitForTimeout(800);
            await page.click('#suite-bar [data-route="editor"]');
            t.check("editor keeps state", await editor.evaluate(() => loadedFiles.length) === 1);
            await page.click('#suite-bar [data-route=""]');
            t.check("back to start", await page.isVisible("#launcher"));
        }
    },
    {
        name: "convert CSV to xlsx offline",
        async run(t) {
            // Kein Internet: alle externen Anfragen blockieren.
            const { page, frame } = await t.openApp("wdr", {
                beforeLoad: page => page.route(url => !url.href.startsWith(t.baseUrl), route => route.abort())
            });
            t.check("libraries available offline", await frame.evaluate(() => typeof XLSX !== "undefined" && typeof JSZip !== "undefined"));
            t.check("template placeholder", (await frame.$$eval(".panel-header", headers => headers.map(h => h.textContent))).some(text => text.includes("Excel template")));
            await frame.evaluate(() => { window.showDirectoryPicker = undefined; });
            await frame.setInputFiles("#file-input", [smallCsv(t.tmpDir)]);
            const [download] = await Promise.all([page.waitForEvent("download", { timeout: 30000 }), frame.click("#convert-btn")]);
            t.check("zip downloaded", download.suggestedFilename() === "Excel_Converted_Part1.zip");
        }
    }
];
