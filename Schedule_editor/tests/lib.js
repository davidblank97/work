// Gemeinsame Helfer fuer die Browser-Tests der Liburdi Schedule Suite (Playwright, Chromium).
const http = require("http");
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const ROOT = path.resolve(__dirname, "..", "..");
const SUITE_PATH = "/Schedule_editor/Lib_Schedule_Editor_v3_0.html";
const TYPES = {
    ".html": "text/html; charset=utf-8", ".json": "application/json", ".xml": "text/xml",
    ".xdr": "text/xml", ".js": "text/javascript", ".csv": "text/csv", ".md": "text/plain"
};

// Statischer Server ueber dem Projektordner (ohne Cache), auf einem freien Port.
function startServer() {
    return new Promise(resolve => {
        const server = http.createServer((request, response) => {
            const requestPath = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
            const filePath = path.join(ROOT, requestPath);
            if (!filePath.startsWith(ROOT)) { response.writeHead(403); response.end(); return; }
            fs.stat(filePath, (error, stat) => {
                if (error || !stat.isFile()) { response.writeHead(404); response.end(); return; }
                response.writeHead(200, {
                    "Content-Type": TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream",
                    "Cache-Control": "no-store"
                });
                fs.createReadStream(filePath).pipe(response);
            });
        });
        server.listen(0, "127.0.0.1", () => resolve(server));
    });
}

// Pfad relativ zum Projektordner.
const file = relative => path.join(ROOT, relative);

// Kleiner CSV-Ausschnitt der grossen Beispiel-CSV (fuer schnelle WDR-Tests).
function smallCsv(targetDir) {
    const source = file("WDR_converter/DL_2026-11-10_14-16-55_Layer 7 Bead 12 Out _764.000_712.000_0.csv");
    const target = path.join(targetDir, "small.csv");
    const text = fs.readFileSync(source, "utf8").slice(0, 200000);
    fs.writeFileSync(target, text.slice(0, text.lastIndexOf("\n") + 1));
    return target;
}

function createContext(browser, baseUrl, results, testName) {
    const errors = [];
    const watch = page => {
        page.on("pageerror", error => errors.push(error.message));
        return page;
    };
    return {
        file,
        errors,
        check(name, ok, detail = "") {
            results.push({ test: testName, name, ok: Boolean(ok), detail: ok ? "" : String(detail) });
        },
        async newPage(options = {}) {
            const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true, ...options });
            context.on("page", watch);
            const page = watch(await context.newPage());
            return { context, page };
        },
        // Oeffnet die Suite mit der gewaehlten App (#editor / #wdr) und liefert den App-Frame.
        async openApp(route = "editor", options = {}) {
            const { context, page } = await this.newPage(options);
            if (options.beforeLoad) await options.beforeLoad(page);
            await page.goto(`${baseUrl}${SUITE_PATH}#${route}`);
            const frame = await waitForAppFrame(page, route);
            return { context, page, frame };
        },
        baseUrl,
        suiteUrl: `${baseUrl}${SUITE_PATH}`
    };
}

async function waitForAppFrame(page, route) {
    const probe = {
        wdr: "typeof wdrSelectedFiles !== 'undefined'",
        pendant: "Boolean(document.getElementById('generate-xml-button')) && document.querySelectorAll('#tabs-container button').length > 0"
    }[route] || "typeof loadedFiles !== 'undefined'";
    for (let attempt = 0; attempt < 100; attempt++) {
        for (const frame of page.frames()) {
            if (frame.url() !== "about:srcdoc") continue;
            const ready = await frame.evaluate(`(() => { try { return ${probe}; } catch (e) { return false; } })()`).catch(() => false);
            if (ready) return frame;
        }
        await page.waitForTimeout(100);
    }
    throw new Error(`App frame "${route}" not ready`);
}

module.exports = { startServer, createContext, file, smallCsv, ROOT, chromium };
