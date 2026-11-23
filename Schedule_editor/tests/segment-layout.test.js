// Segment: Feldgruppen stehen spaltenweise untereinander (pri/bkg zusammen, indwell-excursion-outdwell).
const GROUPS = [
    ["pri_amp", "bkg_amp", "pri_ahc", "bkg_ahc", "pri_travel", "bkg_travel"],
    ["pri_wire", "bkg_wire", "indwell", "excursion", "outdwell", "tungsten_width"],
    ["layer_diameter", "segment_time", "sync_mode", "slope", "osc_width", "wire_manipulator_in_out_width"]
];

module.exports = [
    {
        name: "grouped columns at different widths",
        async run(t) {
            for (const width of [1920, 1440, 1300, 1100]) {
                const { page, frame } = await t.openApp("editor", { viewport: { width, height: 900 } });
                await frame.setInputFiles("#fileInput", [t.file("Schedule_editor/data/samples/04_HIC_PK_764_CS_NGRT_Rev1/0402-Hotpass1.xml")]);
                await page.waitForTimeout(400);
                await frame.evaluate(() => showSection("segments"));
                await page.waitForTimeout(200);
                const boxes = await frame.evaluate(keys => Object.fromEntries(keys.map(key => {
                    const row = document.querySelector(`.segment-panel tr[data-param-key="${key}"]`);
                    const rect = row.getBoundingClientRect();
                    return [key, { x: Math.round(rect.left), y: Math.round(rect.top), h: Math.round(rect.height) }];
                })), GROUPS.flat());
                const columns = await frame.evaluate(() => getComputedStyle(document.querySelector(".segment-panel tbody")).gridTemplateColumns.split(" ").length);
                const stacked = group => group.every((key, i) => i === 0 || (boxes[key].x === boxes[group[i - 1]].x && Math.abs(boxes[key].y - (boxes[group[i - 1]].y + boxes[group[i - 1]].h)) <= 1));
                GROUPS.forEach((group, index) => t.check(`${width}px (${columns} columns): group ${index + 1} stacked`, stacked(group), JSON.stringify(group.map(k => boxes[k]))));
                const firstRowTop = boxes.pri_amp.y;
                if (columns >= 2) t.check(`${width}px: groups start in the first row`, boxes.pri_wire.y === firstRowTop && (columns < 3 || boxes.layer_diameter.y === firstRowTop));
            }
        }
    },
    {
        name: "custom order keeps plain flow",
        async run(t) {
            const { page, frame } = await t.openApp("editor");
            await frame.setInputFiles("#fileInput", [t.file("Schedule_editor/data/samples/04_HIC_PK_764_CS_NGRT_Rev1/0402-Hotpass1.xml")]);
            await page.waitForTimeout(300);
            await frame.evaluate(() => { parameterOrder = { segments: ["enable", "mode"] }; showSection("segments"); });
            const placed = await frame.evaluate(() => [...document.querySelectorAll(".segment-panel tbody tr")].filter(row => row.style.gridColumn).length);
            t.check("no explicit placement with custom order", placed === 0, String(placed));
            t.check("reset order button shown", await frame.locator(".segment-panel .panel-header-btn").count() === 1);
        }
    }
];
