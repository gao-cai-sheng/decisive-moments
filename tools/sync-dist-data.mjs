#!/usr/bin/env node
// Sync public/data → dist/data so the built star map reflects the latest
// admitted philosophers without a full `vite build` (JS bundle is unchanged
// when only data files change). Run after each admit, or use `npm run build`
// for a full rebuild when source code changed.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = path.join(root, "public", "data");
const distDir = path.join(root, "dist");
const destDir = path.join(distDir, "data");

function countIndex(dir) {
  try {
    return JSON.parse(fs.readFileSync(path.join(dir, "philosophers.index.json"), "utf8")).length;
  } catch {
    return null;
  }
}

if (!fs.existsSync(srcDir)) {
  console.error(`✗ source not found: ${srcDir}`);
  process.exit(1);
}
if (!fs.existsSync(distDir)) {
  console.error(`✗ dist/ not found — run \`npm run build\` first to create the build, then this sync keeps its data fresh.`);
  process.exit(1);
}

const before = countIndex(destDir);
fs.mkdirSync(destDir, { recursive: true });
// force overwrite; additive for new detail files. We only ever add/replace
// philosophers, so stale files are not a concern; if needed, clear destDir first.
fs.cpSync(srcDir, destDir, { recursive: true, force: true });
const after = countIndex(destDir);

const srcCount = countIndex(srcDir);
const srcDetails = fs.readdirSync(path.join(srcDir, "philosophers")).filter((f) => f.endsWith(".json")).length;
const destDetails = fs.readdirSync(path.join(destDir, "philosophers")).filter((f) => f.endsWith(".json")).length;

console.log(`synced public/data → dist/data`);
console.log(`  index:   ${before ?? "?"} → ${after}  (source ${srcCount})`);
console.log(`  details: ${destDetails}  (source ${srcDetails})`);
if (after !== srcCount || destDetails !== srcDetails) {
  console.error("✗ mismatch after sync");
  process.exit(1);
}
console.log("✓ dist/data is up to date — hard-refresh the star map (Cmd+Shift+R) to see changes.");
