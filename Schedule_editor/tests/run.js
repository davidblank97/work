// Testlaeufer: node run.js [--quick] [--jobs=N] [filter]   (z. B. "node run.js upgrade", "node run.js --quick")
// Testdateien laufen parallel (Standard: 3 gleichzeitig, jeweils eigene Browser-Kontexte und eigener Temp-Ordner).
// --quick ueberspringt die langsamen Faelle in SLOW_TESTS (vor Commit/Merge immer den kompletten Lauf).
const fs = require("fs");
const os = require("os");
const path = require("path");
const { startServer, createContext, chromium } = require("./lib");

// "datei › testname" (Anfang genuegt); zusammen gut 25 s des kompletten Laufs.
const SLOW_TESTS = [
    "wdr-evaluation › imperial log",
    "wdr-evaluation › raw data of the Excel template",
    "wps › real WPS document",
    "comparison › single scroll area"
];

(async () => {
    const args = process.argv.slice(2);
    const quick = args.includes("--quick");
    const jobsArg = args.find(arg => arg.startsWith("--jobs="));
    const jobs = Math.max(1, Number(jobsArg ? jobsArg.slice(7) : 3) || 3);
    const filter = args.find(arg => !arg.startsWith("--")) || "";
    const files = fs.readdirSync(__dirname).filter(name => name.endsWith(".test.js") && name.includes(filter)).sort();
    const server = await startServer();
    const baseUrl = `http://127.0.0.1:${server.address().port}`;
    const browser = await chromium.launch();
    const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "liburdi-tests-"));
    const results = [];
    let skipped = 0;
    const started = Date.now();

    async function runFile(name) {
        const tmpDir = fs.mkdtempSync(path.join(tmpRoot, name.replace(".test.js", "") + "-"));
        const lines = [];
        for (const test of require(path.join(__dirname, name))) {
            const label = `${name.replace(".test.js", "")} › ${test.name}`;
            if (quick && SLOW_TESTS.some(prefix => label.startsWith(prefix))) {
                skipped++;
                lines.push(`- ${label} (skipped: --quick)`);
                continue;
            }
            const ctx = createContext(browser, baseUrl, results, label);
            ctx.tmpDir = tmpDir;
            const testStarted = Date.now();
            try {
                await test.run(ctx);
                if (ctx.errors.length) ctx.check("no page errors", false, ctx.errors.join(" | "));
            } catch (error) {
                results.push({ test: label, name: "exception", ok: false, detail: error.stack || error.message });
            }
            await ctx.closeAll();
            const own = results.filter(result => result.test === label);
            const failed = own.filter(result => !result.ok);
            lines.push(`${failed.length ? "✗" : "✓"} ${label} (${own.length} checks, ${Date.now() - testStarted} ms)`);
            failed.forEach(result => lines.push(`    FAIL ${result.name}: ${result.detail}`));
        }
        console.log(lines.join("\n"));
    }

    // Groesste Testdateien zuerst, damit keine lange Datei am Ende allein laeuft.
    const queue = [...files].sort((a, b) => fs.statSync(path.join(__dirname, b)).size - fs.statSync(path.join(__dirname, a)).size);
    await Promise.all(Array.from({ length: Math.min(jobs, queue.length) }, async () => {
        while (queue.length) await runFile(queue.shift());
    }));
    await browser.close();
    server.close();
    const failedCount = results.filter(result => !result.ok).length;
    console.log(`\n${results.length - failedCount} passed, ${failedCount} failed`
        + `${skipped ? `, ${skipped} test(s) skipped (--quick)` : ""} · ${((Date.now() - started) / 1000).toFixed(1)} s`);
    process.exit(failedCount ? 1 : 0);
})();
