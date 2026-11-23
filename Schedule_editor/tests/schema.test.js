// Schema-Pruefung gegen WELDSCHEDULE.XDR und XDR-Verwaltung unter Settings.
const fs = require("fs");

const BASE = "Schedule_editor/data/samples/layouts/8888-layout new NGRT.xml"; // Version 1.8.3.7, schema-konform

module.exports = [
    {
        name: "detects schema violations",
        async run(t) {
            const { page, frame } = await t.openApp("editor");
            const stored = await frame.evaluate(() => JSON.parse(localStorage.getItem("scheduleEditorXdrSchemas")));
            t.check("built-in XDR stored", stored.length === 1 && stored[0].version === "1.8.3.7", JSON.stringify(stored.map(s => s.version)));
            const sample = fs.readFileSync(t.file(BASE), "utf8");
            const variants = {
                "ok.xml": sample,
                "missing.xml": sample.replace(/<groove_depth>[^<]*<\/groove_depth>/, ""),
                "unknown.xml": sample.replace("<groove_depth>", "<foo_bar>1</foo_bar><groove_depth>"),
                "order.xml": sample.replace(/(<outer_diameter>[^<]*<\/outer_diameter>)(\s*)(<groove_depth>[^<]*<\/groove_depth>)/, "$3$2$1"),
                "bool.xml": sample.replace(/<enable>1<\/enable>/, "<enable>2</enable>"),
                "float.xml": sample.replace(/<pri_amp>[^<]*<\/pri_amp>/, "<pri_amp>abc</pri_amp>"),
                "index.xml": sample.replace(/<segment index="[^"]*"/, "<segment")
            };
            await frame.setInputFiles("#fileInput", Object.entries(variants).map(([name, text]) => ({ name, mimeType: "text/xml", buffer: Buffer.from(text) })));
            await page.waitForTimeout(500);
            t.check("load status mentions schema", (await frame.textContent("#status")).includes("do not match the schema"));
            const result = await frame.evaluate(() => Object.fromEntries(loadedFiles.map(file => {
                const r = getSchemaResult(file);
                return [file.name, { errors: r.errors, messages: r.findings.map(x => x.message), comparison: r.comparison }];
            })));
            t.check("valid sample", result["ok.xml"].errors === 0 && result["ok.xml"].comparison === 0, JSON.stringify(result["ok.xml"]));
            const has = (name, pattern) => result[name].messages.some(message => pattern.test(message));
            t.check("missing element", has("missing.xml", /Required element <groove_depth>/));
            t.check("unknown element", has("unknown.xml", /Unknown element <foo_bar>/));
            t.check("wrong order", has("order.xml", /Wrong order/));
            t.check("boolean type", has("bool.xml", /boolean/));
            t.check("float type", has("float.xml", /expected number/));
            t.check("required attribute", has("index.xml", /attribute "index"/));
            t.check("file list badges", await frame.locator(".file-schema-badge").count() === 6);

            await frame.click("#schemaCheckBtn");
            await page.waitForTimeout(150);
            const floatBlock = frame.locator("details.schema-file").filter({ has: frame.locator(".schema-file-label", { hasText: "float.xml" }) });
            await floatBlock.evaluate(element => { element.open = true; });
            await floatBlock.locator(".schema-finding button", { hasText: "Show" }).first().click();
            await page.waitForTimeout(200);
            t.check("Show jumps to segment field", await frame.evaluate(() => lastSelectedSection) === "segments" && await frame.locator("tr.schema-flash").count() === 1);

            // Fehler durch Bearbeitung und Undo
            await frame.evaluate(() => { activeFile = loadedFiles.findIndex(x => x.name === "ok.xml"); renderFileList(); showSection("global"); });
            await frame.evaluate(() => recordHistoryAction("test", () => { loadedFiles[activeFile].xml.querySelector("global prepurge").textContent = "bad"; }));
            t.check("edit error detected", await frame.evaluate(() => getSchemaResult(loadedFiles[activeFile]).errors) === 1);
            await frame.click("#returnBtn");
            await page.waitForTimeout(100);
            t.check("undo clears error", await frame.evaluate(() => getSchemaResult(loadedFiles[activeFile]).errors) === 0);

            // Batch Save (Download) fragt bei Schemafehlern nach
            await frame.evaluate(() => { selectedFiles = new Set([loadedFiles.findIndex(x => x.name === "bool.xml")]); renderFileList(); });
            await frame.click("#batchSaveBtn");
            await frame.click("#batchSaveConfirmBtn");
            await page.waitForTimeout(150);
            t.check("batch save asks on schema errors", await frame.locator("#schemaSaveModal.show").count() === 1, await frame.textContent("#status"));
            const [download] = await Promise.all([page.waitForEvent("download"), frame.click("#schemaSaveConfirmBtn")]);
            t.check("save anyway downloads", download.suggestedFilename() === "bool.xml");
        }
    },
    {
        name: "XDR versions in Settings",
        async run(t) {
            const { page, frame } = await t.openApp("editor");
            const xdr = fs.readFileSync(t.file("Schedule_editor/data/schema/WELDSCHEDULE.XDR"), "utf8");
            await frame.setInputFiles("#fileInput", [t.file("Schedule_editor/data/samples/Test 2 Segmente.xml")]);
            await page.waitForTimeout(300);
            await frame.click("#localStorageBackupBtn");
            t.check("dialog is called Settings", (await frame.textContent("#localStorageBackupTitle")) === "Settings");
            await frame.locator("#xdrManager .schema-drop input[type=file]").setInputFiles({
                name: "WELDSCHEDULE_1835.XDR", mimeType: "text/xml", buffer: Buffer.from(xdr.replace('xmlns:version="1.8.3.7"', 'xmlns:version="1.8.3.5"'))
            });
            await page.waitForTimeout(200);
            t.check("second version active", await frame.evaluate(() => getActiveXdr().version) === "1.8.3.5");
            t.check("file version matches active schema", await frame.evaluate(() => getSchemaResult(loadedFiles[0]).comparison) === 0);
            await frame.locator("#xdrManager tr", { hasText: "built-in" }).locator("button", { hasText: "Use" }).click();
            t.check("switch back", await frame.evaluate(() => getActiveXdr().version) === "1.8.3.7");
            await page.reload();
            await page.waitForTimeout(1200);
            const frame2 = page.frames().find(f => f.url() === "about:srcdoc");
            t.check("versions persisted", await frame2.evaluate(() => xdrSchemas.length) === 2);
            await frame2.click("#localStorageBackupBtn");
            page.once("dialog", dialog => dialog.accept());
            await frame2.locator("#xdrManager tr", { hasText: "1.8.3.5" }).locator("button", { hasText: "Delete" }).click();
            t.check("delete version", await frame2.evaluate(() => xdrSchemas.length) === 1);
            page.once("dialog", dialog => dialog.accept());
            await frame2.locator("#xdrManager .schema-drop input[type=file]").setInputFiles({ name: "bad.xdr", mimeType: "text/xml", buffer: Buffer.from("<foo/>") });
            await page.waitForTimeout(150);
            t.check("invalid XDR rejected", (await frame2.textContent("#status")).includes("XDR not loaded"));
        }
    }
];
