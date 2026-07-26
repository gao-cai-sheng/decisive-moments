#!/usr/bin/env node
// tools/text-patch-apply.mjs
// 把文本层补丁合入正式库：同步写 philosophers.index.json 与每人 detail 文件。
// 只覆盖补丁 item 中出现的四个文本字段：oneLineZh / keywordsZh / oneLineEn / keywordsEn。
// 幂等；reviewStatus 及其它字段一律不动；预检任一 id 缺失即整体中止（不做半截写入）。
//
// 用法：
//   node tools/text-patch-apply.mjs <patch.json> [<patch2.json> ...] [--dry-run]
//
// 先过 tools/text-patch-lint.mjs 再用本脚本；本脚本不重复质量门，只做安全合入。

import fs from 'node:fs';
import path from 'node:path';

const FIELDS = ['oneLineZh', 'keywordsZh', 'oneLineEn', 'keywordsEn'];
const INDEX = 'public/data/philosophers.index.json';
const DETAIL_DIR = 'public/data/philosophers';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const patchFiles = args.filter((a) => !a.startsWith('--'));
if (patchFiles.length === 0) {
  console.error('用法: node tools/text-patch-apply.mjs <patch.json> [...] [--dry-run]');
  process.exit(2);
}

const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const writeJson = (p, obj) => fs.writeFileSync(p, JSON.stringify(obj, null, 2) + '\n');
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// 1) 合并所有补丁为 id -> {field: value}，校验 schema、字段白名单、补丁间冲突。
const merged = new Map();
for (const pf of patchFiles) {
  const patch = readJson(pf);
  if (patch.schemaVersion !== 1) {
    console.error(`✗ ${pf}: schemaVersion 必须为 1（实为 ${patch.schemaVersion}）`);
    process.exit(1);
  }
  for (const [id, fields] of Object.entries(patch.items || {})) {
    for (const k of Object.keys(fields)) {
      if (!FIELDS.includes(k)) {
        console.error(`✗ ${pf}: id=${id} 含非法字段 "${k}"（只允许 ${FIELDS.join('/')}）`);
        process.exit(1);
      }
    }
    if (!merged.has(id)) merged.set(id, {});
    const tgt = merged.get(id);
    for (const [k, v] of Object.entries(fields)) {
      if (k in tgt && !eq(tgt[k], v)) {
        console.error(`✗ 补丁间冲突: id=${id} 字段 ${k} 在多份补丁取值不同`);
        process.exit(1);
      }
      tgt[k] = v;
    }
  }
}

// 2) 预检：每个 id 必须在 index 且有 detail 文件，否则整体中止。
const index = readJson(INDEX);
const byId = new Map(index.map((e) => [e.id, e]));
const missIndex = [];
const missDetail = [];
for (const id of merged.keys()) {
  if (!byId.has(id)) missIndex.push(id);
  if (!fs.existsSync(path.join(DETAIL_DIR, `${id}.json`))) missDetail.push(id);
}
if (missIndex.length || missDetail.length) {
  if (missIndex.length) console.error('✗ index 缺失 id:', missIndex.join(', '));
  if (missDetail.length) console.error('✗ detail 缺失文件 id:', missDetail.join(', '));
  process.exit(1);
}

// 3) 应用（内存），只把真正变化的 detail 排入写盘队列。
let idxFieldWrites = 0;
let detailFieldWrites = 0;
const detailQueue = [];
for (const [id, fields] of merged) {
  const entry = byId.get(id);
  for (const [k, v] of Object.entries(fields)) {
    if (!eq(entry[k], v)) idxFieldWrites++;
    entry[k] = v;
  }
  const dp = path.join(DETAIL_DIR, `${id}.json`);
  const detail = readJson(dp);
  let changed = false;
  for (const [k, v] of Object.entries(fields)) {
    if (!eq(detail[k], v)) {
      detailFieldWrites++;
      changed = true;
    }
    detail[k] = v;
  }
  if (changed) detailQueue.push({ dp, detail });
}

console.log(
  `补丁合计: ${merged.size} 位 | index 字段变更 ${idxFieldWrites} | detail 字段变更 ${detailFieldWrites}（涉及 ${detailQueue.length} 个 detail 文件）`
);
if (dryRun) {
  console.log('（--dry-run：未写盘）');
  process.exit(0);
}

// 4) 写盘：index 整文件 + 变化的 detail。
writeJson(INDEX, index);
for (const { dp, detail } of detailQueue) writeJson(dp, detail);
console.log(`✅ 已写入 ${INDEX} 与 ${detailQueue.length} 个 detail 文件`);
