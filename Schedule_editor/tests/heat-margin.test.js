// Heat Input: Safety Margin (gelbe Linien) – verengt Target Ranges und WPS-Heat-Input an beiden Grenzen.
const REF = "Schedule_editor/data/samples/04_HIC_PK_764_CS_NGRT_Rev1/0402-Hotpass1.xml";
// 0402: Heat Input nominal ~0.80, mit Overrides ~0.65 – 0.97 kJ/mm

module.exports = [
    {
        name: "safety margin narrows the target range (percent and absolute)",
        async run(t) {
            const { page, frame } = await t.openApp("editor");
            await frame.evaluate(() => localStorage.setItem("scheduleEditorHeatInputTargets", JSON.stringify([{ id: "t1", name: "Hot pass", min: "0.5", max: "1.0", files: ["0402"] }])));
            await frame.setInputFiles("#fileInput", [t.file(REF)]);
            await page.waitForTimeout(300);
            await frame.click("#heatInputBtn");
            const check = () => frame.evaluate(() => {
                const entry = heatInputCheck(loadedFiles[0]).entries[0];
                return { outside: entry.outside, violations: entry.targetViolations.map(item => `${item.bound} ${item.value}`), max: entry.result.maxHeatInput };
            });
            let result = await check();
            t.check("without margin inside (max < 1.0)", !result.outside && result.max < 1.0 && result.max > 0.9, JSON.stringify(result));
            t.check("no yellow lines without margin", await frame.locator(".heat-margin-line").count() === 0);

            await frame.fill("#heatMarginInput", "10");
            await frame.press("#heatMarginInput", "Enter");
            t.check("stored as percent, both limits", JSON.stringify(await frame.evaluate(() => JSON.parse(localStorage.getItem("scheduleEditorHeatMargin")))) === JSON.stringify({ mode: "percent", value: 10, side: "both" }));
            t.check("yellow lines drawn", await frame.locator(".heat-chart svg .heat-margin-line").count() === 2);
            const labels = await frame.$$eval(".heat-margin-label", items => items.map(item => item.textContent));
            t.check("margin labels min 0.55 / max 0.9", labels.includes("margin 0.55") && labels.includes("margin 0.9"), labels.join(", "));
            result = await check();
            t.check("10 %: max 0.97 above margin max 0.9 -> outside", result.outside && result.violations.includes("margin max 0.9"), JSON.stringify(result));

            await frame.click("#batchSaveBtn");
            await frame.click("#batchSaveConfirmBtn");
            t.check("batch save names the margin", (await frame.textContent("#heatSaveList")).includes("Hot pass margin max 0.90"), await frame.textContent("#heatSaveList"));
            await frame.click("#heatSaveCancelBtn");

            await frame.selectOption("#heatMarginMode", "absolute");
            await frame.fill("#heatMarginInput", "0,05");
            await frame.press("#heatMarginInput", "Enter");
            result = await check();
            t.check("absolute 0.05: margin max 0.95, min 0.55", result.outside && result.violations.includes("margin max 0.95"), JSON.stringify(result));
            t.check("stored as absolute", JSON.stringify(await frame.evaluate(() => JSON.parse(localStorage.getItem("scheduleEditorHeatMargin")))) === JSON.stringify({ mode: "absolute", value: 0.05, side: "both" }));

            // nur untere Grenze: max bleibt 1.0 (0.97 innerhalb), min 0.55; eine gelbe Linie
            await frame.selectOption("#heatMarginSide", "lower");
            result = await check();
            t.check("lower only: inside, one yellow line", !result.outside && await frame.locator(".heat-chart svg .heat-margin-line").count() === 1, JSON.stringify(result));
            t.check("lower only: label margin 0.55", (await frame.$$eval(".heat-margin-label", items => items.map(item => item.textContent))).join() === "margin 0.55");
            // nur obere Grenze: max 0.95 -> 0.97 ausserhalb ("margin max"), min bleibt 0.5
            await frame.selectOption("#heatMarginSide", "upper");
            result = await check();
            t.check("upper only: margin max 0.95 violated", result.outside && result.violations.join() === "margin max 0.95", JSON.stringify(result));
            t.check("upper only: one yellow line", await frame.locator(".heat-chart svg .heat-margin-line").count() === 1);
            t.check("side stored", (await frame.evaluate(() => JSON.parse(localStorage.getItem("scheduleEditorHeatMargin")))).side === "upper");
            await frame.selectOption("#heatMarginSide", "both");

            await frame.fill("#heatMarginInput", "");
            await frame.press("#heatMarginInput", "Enter");
            result = await check();
            t.check("empty switches the margin off", !result.outside && await frame.locator(".heat-margin-line").count() === 0, JSON.stringify(result));
        }
    },
    {
        name: "WPS check and Fit Overrides respect the safety margin",
        async run(t) {
            const { page, frame } = await t.openApp("editor");
            await frame.evaluate(() => {
                localStorage.setItem("scheduleEditorWpsRanges", JSON.stringify({
                    document: "test.pdf", wpsNumber: "T-M", checkMode: "separate", wireUnit: "cm/min",
                    rows: [{ label: "Hotpass", passType: "Hot pass", files: ["0402"], current: { min: null, max: null }, voltage: { min: null, max: null },
                        travel: { min: null, max: null }, wire: { min: null, max: null }, heat: { min: 0.5, max: 1.0 } }]
                }));
                localStorage.setItem("scheduleEditorHeatMargin", JSON.stringify({ mode: "percent", value: 10 }));
            });
            await frame.setInputFiles("#fileInput", [t.file(REF)]);
            await page.waitForTimeout(300);
            await frame.click("#heatInputBtn");
            await frame.click("#heatTabWps");
            const heatCell = () => frame.evaluate(() => document.querySelector(".wps-check-table [data-field=heat]").className);
            t.check("heat: override range beyond the margin max 0.9 -> warn", (await heatCell()).includes("is-warn"), await heatCell());
            t.check("group row shows the margin range", (await frame.textContent(".wps-check-table .wps-group-row")).includes("margin 0.55 – 0.9"));
            await frame.click("#wpsFitOverridesBtn");
            const after = await frame.evaluate(() => {
                const file = loadedFiles[0];
                const get = name => Number([...file.sections.overrides.children].find(child => child.tagName === name).textContent);
                const heat = calculateSegmentHeatInput(file.sections.segments[0], file.sections.overrides);
                return { pri: get("pri_amp_max"), avc: get("avc_override_max"), max: heat.maxHeatInput, min: heat.minHeatInput };
            });
            // Ohne Margin passt 0.65 – 0.97 in 0.5 – 1.0 (Overrides blieben 10 %); mit Margin muessen sie kleiner werden.
            t.check("overrides reduced below 10 %", after.pri < 10 && after.avc < 10, JSON.stringify(after));
            t.check("heat input range inside the yellow lines (0.55 – 0.9)", after.max <= 0.9 + 1e-6 && after.min >= 0.55 - 1e-6, JSON.stringify(after));
            t.check("heat cell OK after Fit Overrides", (await heatCell()).includes("is-ok"), await heatCell());
        }
    }
];
