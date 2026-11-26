// Heat Input: Pendelperiode = In-Dwell + 2 × Excursion + Out-Dwell (EXCURSIONS_PER_CYCLE in 01-state-history.js).
// Abgleich mit dem Maschinen-Log zu 0404 (data/wdr/DL_2026-11-10_…): Segment-Heat-Input der Maschine 1.1848 kJ/mm.
const REF = "Schedule_editor/data/samples/04_HIC_PK_764_CS_NGRT_Rev1/0404-Fill-OUT.xml";

module.exports = [
    {
        name: "heat input uses two excursions per oscillation period and matches the machine log",
        async run(t) {
            const { page, frame } = await t.openApp("editor");
            await frame.setInputFiles("#fileInput", [t.file(REF)]);
            await page.waitForTimeout(300);
            const result = await frame.evaluate(() => {
                const file = loadedFiles[0];
                const segment = file.sections.segments[0];
                const read = name => Number(segment.querySelector(name).textContent);
                const v = {
                    Ip: read("pri_amp"), Ib: read("bkg_amp"), Up: read("pri_ahc"), Ub: read("bkg_ahc"),
                    vp: read("pri_travel"), vb: read("bkg_travel"), ti: read("indwell"), to: read("outdwell"), te: read("excursion")
                };
                // Erwartung von Hand: Grundstrom waehrend 2 × Excursion, Pulsstrom waehrend In- und Out-Dwell
                const expected = 0.6 * (v.Ub * v.Ib * 2 * v.te + v.Up * v.Ip * (v.ti + v.to))
                    / ((v.vb * 2 * v.te + v.vp * (v.ti + v.to)) * 25.4 / 60 * 1000);
                return { constant: EXCURSIONS_PER_CYCLE, heat: calculateSegmentHeatInput(segment, file.sections.overrides).heatInput, expected };
            });
            t.check("two excursions per period", result.constant === 2);
            t.check("formula with 2 × excursion", Math.abs(result.heat - result.expected) < 1e-9, JSON.stringify(result));
            const machine = 1.1848;
            t.check("within 1 % of the machine heat input (1.1848 kJ/mm)", Math.abs(result.heat / machine - 1) < 0.01, result.heat);
        }
    }
];
