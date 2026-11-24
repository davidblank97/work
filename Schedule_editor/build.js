#!/usr/bin/env node
// Baut Lib_Schedule_Editor_v3_1.html aus src/ (keine Abhaengigkeiten).
//   node build.js          -> schreibt die Datei
//   node build.js --check  -> Fehler, wenn die Datei nicht dem Stand von src/ entspricht
// Eine Zeile "<!-- @include pfad -->" (Pfad relativ zu src/) wird durch den Inhalt der Datei ersetzt (rekursiv).
const fs = require("fs");
const path = require("path");

const SRC = path.join(__dirname, "src");
const OUT = path.join(__dirname, "Lib_Schedule_Editor_v3_1.html");
const INCLUDE = /^\s*<!-- @include (\S+) -->\s*$/;

function expand(file, stack = []) {
    if (stack.includes(file)) throw new Error(`Include cycle: ${[...stack, file].join(" -> ")}`);
    const text = fs.readFileSync(path.join(SRC, file), "utf8");
    if (!text.endsWith("\n")) throw new Error(`${file} must end with a newline`);
    return text.slice(0, -1).split("\n").map(line => {
        const match = line.match(INCLUDE);
        return match ? expand(match[1], [...stack, file]).slice(0, -1) : line;
    }).join("\n") + "\n";
}

const html = expand("suite/shell.html");
if (process.argv.includes("--check")) {
    const current = fs.existsSync(OUT) ? fs.readFileSync(OUT, "utf8") : "";
    if (current !== html) {
        console.error("Lib_Schedule_Editor_v3_1.html is out of date: run `node build.js` in Schedule_editor/.");
        process.exit(1);
    }
    console.log("Build is up to date.");
} else {
    fs.writeFileSync(OUT, html);
    console.log(`Wrote ${path.basename(OUT)} (${(html.length / 1024 / 1024).toFixed(2)} MB)`);
}
