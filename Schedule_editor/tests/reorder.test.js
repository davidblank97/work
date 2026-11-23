// Parameter-Reihenfolge per Ziehen, Sperren, Rohrgroessen-Dropdown.
module.exports = [
    {
        name: "drag parameters and lock",
        async run(t) {
            const { page, frame } = await t.openApp("editor");
            await frame.setInputFiles("#fileInput", [t.file("Schedule_editor/data/samples/04_HIC_PK_764_CS_NGRT_Rev1/0402-Hotpass1.xml")]);
            await page.waitForTimeout(300);
            await frame.evaluate(() => showSection("global"));
            const rows = () => frame.$$eval("#content .param-table tr[data-param-key]", trs => trs.map(tr => tr.dataset.paramKey));
            const initial = await rows();
            await frame.locator(`tr[data-param-key="${initial[4]}"] .param-name`)
                .dragTo(frame.locator(`tr[data-param-key="${initial[0]}"]`), { targetPosition: { x: 40, y: 3 } });
            let current = await rows();
            t.check("drag by name moves row", current[0] === initial[4], current.slice(0, 5).join(","));
            t.check("order stored", (await frame.evaluate(() => JSON.parse(localStorage.getItem("scheduleEditorParameterOrder")).global[0])) === initial[4]);
            await frame.locator(`tr[data-param-key="${initial[4]}"] .param-drag-handle`).focus();
            await frame.locator(`tr[data-param-key="${initial[4]}"] .param-drag-handle`).press("Alt+ArrowDown");
            current = await rows();
            t.check("Alt+Down moves one row", current.indexOf(initial[4]) === 1, current.slice(0, 3).join(","));
            await frame.click("#returnBtn");
            await page.waitForTimeout(100);
            current = await rows();
            t.check("undo", current[0] === initial[4]);

            // Sperren: gesperrte Zeile nicht verschiebbar und bleibt stehen
            const locked = current[1];
            await frame.locator(`tr[data-param-key="${locked}"]`).hover();
            await frame.locator(`tr[data-param-key="${locked}"] .param-lock-btn`).click();
            await frame.locator(`tr[data-param-key="${locked}"] .param-name`)
                .dragTo(frame.locator(`tr[data-param-key="${current[5]}"]`), { targetPosition: { x: 40, y: 20 } });
            t.check("locked row not draggable", JSON.stringify(await rows()) === JSON.stringify(current));
            await frame.locator(`tr[data-param-key="${current[6]}"] .param-name`)
                .dragTo(frame.locator(`tr[data-param-key="${current[0]}"]`), { targetPosition: { x: 40, y: 3 } });
            const afterLock = await rows();
            t.check("locked row keeps its position", afterLock[1] === locked && afterLock[0] === current[6], afterLock.slice(0, 4).join(","));
        }
    },
    {
        name: "outer diameter dropdown",
        async run(t) {
            const { page, frame } = await t.openApp("editor");
            await frame.setInputFiles("#fileInput", [t.file("Schedule_editor/data/samples/schedule_beispiel.xml")]);
            await page.waitForTimeout(300);
            await frame.evaluate(() => showSection("description"));
            const select = frame.locator(".diameter-select");
            t.check("G18 preselected", await select.inputValue() === "G18");
            await select.selectOption("G24");
            const value = await frame.evaluate(() => loadedFiles[0].sections.description.querySelector("outer_diameter").textContent);
            t.check("value written in inch", value === (666 / 25.4).toFixed(6), value);
        }
    }
];
