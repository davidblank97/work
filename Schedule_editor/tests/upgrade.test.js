// Upgrade aelterer Schedules auf die Schema-Version 1.8.3.7.
const fs = require("fs");
const path = require("path");

const OLD_FILES = [
    "Schedule_editor/data/samples/schedule_beispiel.xml",              // 1.7.4.1
    "Schedule_editor/data/samples/layouts/5555-layout old NG.xml", // 1.8.3.3
    "Schedule_editor/data/samples/Test 2 Segmente.xml"                  // 1.8.3.5
];
const REFERENCE = "Schedule_editor/data/samples/04_HIC_PK_764_CS_NGRT_Rev1/0402-Hotpass1.xml";

const snapshot = frame => frame.evaluate(() => Object.fromEntries(loadedFiles.map(file => {
    const values = {};
    const walk = (element, key) => {
        const children = [...element.children];
        if (!children.length) values[key] = element.textContent;
        children.forEach(child => walk(child, `${key}/${child.localName}${child.localName === "segment" ? `[${child.getAttribute("index")}]` : ""}`));
    };
    walk(file.xml.documentElement, "sched");
    return [file.name, { values, xml: serializeXml(file.xml), segments: file.xml.querySelectorAll("segment").length }];
})));

module.exports = [
    {
        name: "upgrade all to 1.8.3.7",
        async run(t) {
            const { page, frame } = await t.openApp("editor");
            await frame.setInputFiles("#fileInput", [...OLD_FILES, REFERENCE].map(t.file));
            await page.waitForTimeout(600);
            const before = await snapshot(frame);
            t.check("upgrade banner after loading", await frame.isVisible("#upgradeBanner") && (await frame.textContent("#upgradeBannerText")).includes("3 file(s)"), await frame.textContent("#upgradeBannerText"));
            await frame.click("#schemaCheckBtn");
            const upgradeAll = frame.locator(".schema-active-line button", { hasText: "Upgrade all" });
            t.check("Upgrade all offered for 3 files", (await upgradeAll.textContent()).includes("(3)"));
            await upgradeAll.click();
            t.check("upgrade dialog", await frame.locator("#upgradeModal.show").count() === 1);
            await frame.click("#upgradeConfirmBtn");
            await page.waitForTimeout(300);
            const errors = await frame.evaluate(() => Object.fromEntries(loadedFiles.map(x => [x.name, getSchemaResult(x).errors])));
            t.check("banner hidden after upgrade", !(await frame.isVisible("#upgradeBanner")));
            t.check("all valid after upgrade", Object.values(errors).every(count => count === 0), JSON.stringify(errors));
            const after = await snapshot(frame);
            t.check("reference untouched", before["0402-Hotpass1.xml"].xml === after["0402-Hotpass1.xml"].xml);
            for (const name of Object.keys(before)) {
                const changed = Object.entries(before[name].values)
                    .filter(([key, value]) => key in after[name].values && after[name].values[key] !== value && !/config_version|jog_speed_edit_mode/.test(key));
                t.check(`values kept: ${name}`, changed.length === 0, JSON.stringify(changed.slice(0, 3)));
                t.check(`segments kept: ${name}`, before[name].segments === after[name].segments);
            }
            const overrides = await frame.evaluate(() => {
                const xml = loadedFiles.find(f => f.name === "schedule_beispiel.xml").xml;
                return ["pri_amp_max", "bkg_amp_max", "pri_amp_rate", "bkg_amp_rate", "amp_max"].map(n => xml.querySelector(`overrides > ${n}`)?.textContent ?? "-").join(" ");
            });
            t.check("amp_max/amp_rate renamed", overrides === "10.000000 10.000000 5.000000 5.000000 -", overrides);
            const sameStructure = await frame.evaluate(() => {
                const sequence = element => { const out = []; const walk = e => { out.push(e.localName); [...e.children].forEach(walk); }; walk(element); return out.join(","); };
                const top = doc => { const out = []; const walk = e => { out.push(e.localName); if (e.localName !== "segment") [...e.children].forEach(walk); }; walk(doc.documentElement); return out.join(",").replace(/(,segment)+/g, ",segment"); };
                const reference = loadedFiles.find(x => x.name === "0402-Hotpass1.xml");
                const referenceSegment = sequence(reference.xml.querySelector("segment"));
                return loadedFiles.filter(x => x !== reference).every(x => top(x.xml) === top(reference.xml)
                    && [...x.xml.querySelectorAll("segment")].every(segment => sequence(segment) === referenceSegment));
            });
            t.check("structure equals 1.8.3.7 reference", sameStructure);
            const xmlText = await frame.evaluate(() => serializeXml(loadedFiles.find(x => x.name === "schedule_beispiel.xml").xml));
            t.check("tab indentation", /\n\t<metadata>\n\t\t<schema_version/.test(xmlText));
            await frame.click("#returnBtn");
            await page.waitForTimeout(200);
            const undone = await snapshot(frame);
            t.check("undo restores exactly", Object.keys(before).every(name => before[name].xml === undone[name].xml));
        }
    },
    {
        name: "layout template by head",
        async run(t) {
            const { page, frame } = await t.openApp("editor");
            const text = fs.readFileSync(t.file("Schedule_editor/data/samples/schedule_beispiel.xml"), "utf8").replace('head="NGRT + H-HEAD"', 'head="H2-FV-100S"');
            const ngFile = path.join(t.tmpDir, "ng_head.xml");
            fs.writeFileSync(ngFile, text);
            await frame.setInputFiles("#fileInput", [ngFile, t.file("Schedule_editor/data/samples/schedule_beispiel.xml")]);
            await page.waitForTimeout(400);
            await frame.click("#upgradeBannerDismissBtn");
            t.check("banner can be dismissed", !(await frame.isVisible("#upgradeBanner")));
            const templates = await frame.evaluate(() => { upgradeFiles(loadedFiles.map(x => x.id)); return loadedFiles.map(x => x.lastUpgrade.template); });
            t.check("NG head uses 7777 template", templates.some(name => name.startsWith("7777")), templates.join(" | "));
            t.check("NGRT head uses 8888 template", templates.some(name => name.startsWith("8888")), templates.join(" | "));
        }
    }
];
