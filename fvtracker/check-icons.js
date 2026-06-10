// check-icons.js — pokreni iz roota projekta s: node check-icons.js
const { readFileSync, existsSync, readdirSync, statSync } = require("fs");
const { join } = require("path");

const exts = [".js", ".jsx", ".ts", ".tsx"];
const re = /from\s+["']@react-icons\/all-files\/([^"']+)["']/g;

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name.startsWith(".")) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, files);
    else if (exts.some((e) => name.endsWith(e))) files.push(p);
  }
  return files;
}

let bad = 0;
for (const file of walk(".")) {
  const src = readFileSync(file, "utf8");
  for (const m of src.matchAll(re)) {
    const target = join("node_modules/@react-icons/all-files", m[1] + ".js");
    if (!existsSync(target)) {
      console.log(`${file}  →  NEDOSTAJE: ${m[1]}`);
      bad++;
    }
  }
}

console.log(
  bad ? `\n${bad} neispravnih importa` : "\nSvi importi postoje ✔",
);