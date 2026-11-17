#!/usr/bin/env node
// postmortem §3.3：把“原文锚率/逐字摘录率”变成每批必跑的硬指标。
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { coreAnchorStatus } from "./locator-lint.mjs";

const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));

function parseArgs(argv) {
  const batchDir = argv.find((arg) => !arg.startsWith("--"));
  const dataFlag = argv.indexOf("--data-dir");
  const dataDir = dataFlag >= 0 ? argv[dataFlag + 1] : "public/data";
  if (!batchDir) throw new Error("用法：node tools/research-batch-metrics.mjs <batchDir> [--data-dir public/data]");
  return { batchDir, dataDir };
}

function main() {
  const { batchDir, dataDir } = parseArgs(process.argv.slice(2));
  const batch = readJson(path.join(batchDir, "thought-systems.json"));
  const index = readJson(path.join(dataDir, "philosophers.index.json"));
  const civ = new Map(index.map((item) => [item.id, item.civilization]));
  const items = (batch.items || []).filter((item) => civ.get(item.philosopherId) === "chinese");
  if (!items.length) {
    console.log(`质量率：${batchDir} 非中华块，postmortem C 系指标跳过`);
    return;
  }

  const evidence = items.flatMap((item) => (item.problems || []).flatMap((problem) =>
    (problem.claims || []).flatMap((claim) => claim.evidence || [])));
  const excerptCount = evidence.filter((item) => String(item.source?.publicDomainExcerptZh || "").trim()).length;
  const originalAnchorCount = evidence.filter((item) => coreAnchorStatus(item.source || {}).kind === "excerpt").length;
  const numberedAnchorCount = evidence.filter((item) => coreAnchorStatus(item.source || {}).kind === "number").length;
  const corePassCount = evidence.filter((item) => coreAnchorStatus(item.source || {}).ok).length;
  const rate = (n) => `${((n / evidence.length) * 100).toFixed(1)}% (${n}/${evidence.length})`;
  const originalRate = originalAnchorCount / evidence.length;
  const excerptRate = excerptCount / evidence.length;
  const pass = originalRate >= 0.8 && excerptRate >= 0.6;
  console.log(`质量率：${batchDir}`);
  console.log(`  原文锚率：${rate(originalAnchorCount)} ｜ 编号锚：${rate(numberedAnchorCount)} ｜ 新门通过：${rate(corePassCount)}`);
  console.log(`  逐字摘录率：${rate(excerptCount)} ｜ 阈值：原文锚率 ≥80%，逐字摘录率 ≥60%`);
  console.log(pass ? "✅ postmortem 质量率通过" : "❌ postmortem 质量率未过：禁止送审/继续扩产");
  process.exit(pass ? 0 : 1);
}

try { main(); } catch (error) { console.error(error.message); process.exit(2); }
