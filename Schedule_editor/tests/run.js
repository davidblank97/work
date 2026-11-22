// Testlaeufer: node run.js [filter]   (z. B. "node run.js upgrade")
const fs = require("fs");
const os = require("os");
const path = require("path");
const { startServer, createContext, chromium } = require("./lib");

(async () => {
    const filter = process.argv[2] || "";
    const files = fs.readdirSync(__dirname).filter(name => name.endsWith(".test.js") && name.includes(filter)).sort();
    const server = await startServer();
    const baseUrl = `http://127.0.0.1:${server.address().port}`;
    const browser = await chromium.launch();
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "liburdi-tests-"));
    const results = [];
    for (const name of files) {
        const tests = require(path.join(__dirname, name));
        for (const test of tests) {
            const label = `${name.replace(".test.js", "")} › ${test.name}`;
            const ctx = createContext(browser, baseUrl, results, label);
            ctx.tmpDir = tmpDir;
            const started = Date.now();
            try {
                await test.run(ctx);
                if (ctx.errors.length) ctx.check("no page errors", false, ctx.errors.join(" | "));
            } catch (error) {
                results.push({ test: label, name: "exception", ok: false, detail: error.stack || error.message });
            }
            const own = results.filter(result => result.test === label);
            const failed = own.filter(result => !result.ok);
            console.log(`${failed.length ? "✗" : "✓"} ${label} (${own.length} checks, ${Date.now() - started} ms)`);
            failed.forEach(result => console.log(`    FAIL ${result.name}: ${result.detail}`));
        }
    }
    await browser.close();
    server.close();
    const failedCount = results.filter(result => !result.ok).length;
    console.log(`\n${results.length - failedCount} passed, ${failedCount} failed`);
    process.exit(failedCount ? 1 : 0);
})();
