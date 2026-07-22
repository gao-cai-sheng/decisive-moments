// 一次性升格脚本（U1 试点用；将来应graduate为正式 admit-kimi-upgrade）。
// 作用：把某位 seed 升格为 standard——
//   detail = proposed-philosophers 该 item + thoughtSystem(problems)
//   index  = 同 item 剥到索引字段
// 只处理单人。写盘用 fs.writeFileSync（FUSE 允许就地覆盖）。
// 门禁交给独立的 validate-data / quality-audit / vitest，本脚本不代替。
//
// 用法：node tools/oneoff-promote-upgrade.mjs <batchDir> <philosopherId> [--write]

import fs from "node:fs";
import path from "node:path";

const [batchArg, philId, ...rest] = process.argv.slice(2);
const write = rest.includes("--write");
if (!batchArg || !philId) {
  console.error("Usage: node tools/oneoff-promote-upgrade.mjs <batchDir> <philosopherId> [--write]");
  process.exit(1);
}

const batchDir = path.resolve(batchArg);
const dataDir = path.resolve("public/data");
const readJson = (f) => JSON.parse(fs.readFileSync(f, "utf8"));
const assert = (c, m) => { if (!c) { console.error("ASSERT FAIL: " + m); process.exit(1); } };

const proposed = readJson(path.join(batchDir, "proposed-philosophers.json"));
const ts = readJson(path.join(batchDir, "thought-systems.json"));
assert(proposed.schemaVersion === 1 && Array.isArray(proposed.items), "proposed-philosophers.json shape");
assert(ts.schemaVersion === 1 && Array.isArray(ts.items), "thought-systems.json shape");

const pItem = proposed.items.find((x) => x.id === philId);
const tItem = ts.items.find((x) => x.philosopherId === philId);
assert(pItem, "no proposed-philosophers item for " + philId);
assert(tItem, "no thought-systems item for " + philId);
assert(pItem.tier === "standard", "proposed item tier must be standard, got " + pItem.tier);
assert(Array.isArray(tItem.problems) && tItem.problems.length >= 3, "need >=3 problems");

// works 归属核对
const works = readJson(path.join(dataDir, "works.json"));
const worksById = new Map(works.map((w) => [w.id, w]));
for (const pr of tItem.problems)
  for (const c of pr.claims ?? [])
    for (const e of c.evidence ?? []) {
      const wid = e.source?.workId;
      if (!wid) continue;
      const w = worksById.get(wid);
      assert(w, philId + " references unknown workId: " + wid);
      assert(w.philosopherId === philId, wid + " belongs to another philosopher");
    }

// detail = proposed item + thoughtSystem
const detail = { ...pItem, thoughtSystem: { problems: tItem.problems } };

const detailFile = path.join(dataDir, "philosophers", philId + ".json");
const indexFile = path.join(dataDir, "philosophers.index.json");
assert(fs.existsSync(detailFile), "detail file missing: " + detailFile);
const oldDetail = readJson(detailFile);
const index = readJson(indexFile);
const idxPos = index.findIndex((x) => x.id === philId);
assert(idxPos >= 0, "philosopher not in index: " + philId);

// 就地同步索引字段（保留原键序，最小 diff）；索引只含以下字段
const INDEX_FIELDS = [
  "id", "tier", "names", "life", "civilization", "traditions",
  "periods", "themes", "keywordsZh", "oneLineZh", "influenceWeight", "reviewStatus",
];
const idxEntry = index[idxPos];
const changed = [];
for (const k of INDEX_FIELDS) {
  if (JSON.stringify(idxEntry[k]) !== JSON.stringify(pItem[k])) {
    changed.push(`${k}: ${JSON.stringify(idxEntry[k])} -> ${JSON.stringify(pItem[k])}`);
    idxEntry[k] = pItem[k];
  }
}

console.log(`[${philId}] tier: ${oldDetail.tier} -> ${detail.tier}`);
console.log(`  thoughtSystem: ${oldDetail.thoughtSystem ? "replace" : "add"} (${tItem.problems.length} problems)`);
console.log(`  summaryZh: ${(oldDetail.summaryZh || "").length} -> ${(detail.summaryZh || "").length} 字`);
console.log(`  index 变更字段: ${changed.length ? changed.join(" | ") : "无"}`);

if (!write) {
  console.log("\nDRY-RUN（未写盘）。加 --write 落盘。");
  process.exit(0);
}

fs.writeFileSync(detailFile, JSON.stringify(detail, null, 2) + "\n");
fs.writeFileSync(indexFile, JSON.stringify(index, null, 2) + "\n");
console.log("\nWROTE:", detailFile);
console.log("WROTE:", indexFile, `(entry ${idxPos})`);
