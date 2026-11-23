// Comparison: nur die Tabelle scrollt; Kopfzeile und erste Spalten bleiben stehen.
const fs = require("fs");

module.exports = [
    {
        name: "single scroll area with sticky header",
        async run(t) {
            for (const width of [1440, 900]) {
                const { page, frame } = await t.openApp("editor", { viewport: { width, height: 760 } });
                const dir = "Schedule_editor/data/samples/04_HIC_PK_764_CS_NGRT_Rev1/";
                const files = fs.readdirSync(t.file(dir)).filter(name => name.endsWith(".xml")).map(name => t.file(dir + name));
                await frame.setInputFiles("#fileInput", files);
                await page.waitForTimeout(500);
                await frame.click("#compareBtn");
                await page.waitForTimeout(300);
                const scrollers = await frame.evaluate(() => [...document.querySelectorAll("#content, #content *")].filter(element => {
                    const style = getComputedStyle(element);
                    return (element.scrollWidth > element.clientWidth + 1 && /(auto|scroll)/.test(style.overflowX))
                        || (element.scrollHeight > element.clientHeight + 1 && /(auto|scroll)/.test(style.overflowY));
                }).map(element => element.className || element.id));
                t.check(`${width}px: only the table scrolls`, scrollers.length === 1 && scrollers[0] === "comparison-table-wrap", scrollers.join(", "));
                const sticky = await frame.evaluate(() => {
                    const wrap = document.querySelector(".comparison-table-wrap");
                    wrap.scrollTop = 600;
                    wrap.scrollLeft = 400;
                    const header = wrap.querySelector("th").getBoundingClientRect().top - wrap.getBoundingClientRect().top;
                    const parameter = wrap.querySelector("tr:nth-child(10) > :nth-child(2)").getBoundingClientRect().left - wrap.getBoundingClientRect().left;
                    return { header: Math.round(header), parameter: Math.round(parameter) };
                });
                t.check(`${width}px: header stays on top`, Math.abs(sticky.header) <= 2, JSON.stringify(sticky));
                t.check(`${width}px: parameter column stays visible`, sticky.parameter >= 0 && sticky.parameter < 200, JSON.stringify(sticky));
            }
        }
    }
];
