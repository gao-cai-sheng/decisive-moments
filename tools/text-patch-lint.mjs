#!/usr/bin/env node
// ============================================================
// text-patch-lint.mjs —— 索引文本层补丁的机器门
//
// 用法：
//   node tools/text-patch-lint.mjs <patch.json> [--index public/data/philosophers.index.json] [--expect ids.txt]
//
// 适用对象：索引层文本补丁，形如
//   { "schemaVersion": 1, "items": { "<id>": { oneLineZh?, keywordsZh?, oneLineEn?, keywordsEn? } } }
// 覆盖三类批次：中文简介重写、英文翻译、关键词补实词。按补丁里实际出现的字段决定查哪几条。
//
// 与 locator-lint.mjs 的分工：那个查思想体系层的 evidence 溯源定位；本工具查索引文本层。两者不重叠。
//
// 立于 2026-07-24：92 位占位式中文简介重写批的自查是靠文字清单执行的。
// 本工具把那套清单变成任何人都能复算的东西——不是因为生产方不可信
// （该批自查数据经审核方独立重算属实），而是因为口头结论无法被第三方复核。
//
// 退出码：0=通过；1=有 RED；2=用法/输入错误。只读。
// ============================================================
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// 十个主题名。themes 字段已存主题，keywords 再抄一遍等于没有关键词。
const THEME_ZH = new Set(["正义", "伦理", "知识", "政治", "形而上学", "语言", "自由", "生死", "宗教", "美学"]);
// 初始播种留下的占位句式
const PLACEHOLDER_ZH = /是.+问题谱系中的第一版候选哲人。$/;
// 套谁都行、没有信息量的词
const EMPTY_WORDS_ZH = /重要|深远|奠定|贡献|集大成|杰出|著名/;
const ALLOWED_FIELDS = new Set(["oneLineZh", "keywordsZh", "oneLineEn", "keywordsEn"]);

const ONELINE_ZH_MIN = 25;
const ONELINE_ZH_MAX = 40;
const ONELINE_EN_MAX = 120; // 见 docs/i18n-content-translation-spec.md §3
const KEYWORDS_MIN = 3;
const KEYWORDS_MAX = 6;
const SHARED_AFFIX_LEN = 8; // 共享首尾段长度阈值
const SHARED_AFFIX_COUNT = 3; // 达到几条即判模板化

const readJson = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const hasHan = (s) => /[一-鿿]/.test(s);

// 找出被 >=minCount 条共享的固定长度首段/尾段
function sharedAffixes(strings, len, minCount) {
  const hits = [];
  for (const [kind, take] of [
    ["首段", (s) => s.slice(0, len)],
    ["尾段", (s) => s.slice(-len)],
  ]) {
    const bucket = new Map();
    for (const s of strings) {
      if (s.length < len) continue;
      const k = take(s);
      bucket.set(k, (bucket.get(k) || 0) + 1);
    }
    for (const [k, n] of bucket) if (n >= minCount) hits.push({ kind, affix: k, count: n });
  }
  return hits;
}

export function lintPatch(patch, indexById, opts = {}) {
  const expectIds = opts.expectIds || null; // Set，给定则要求恰好相等
  const reds = [];
  const warns = [];
  const add = (code, at, msg) => reds.push({ code, at, msg });

  if (patch.schemaVersion !== 1) add("bad_schema_version", "(patch)", `schemaVersion 应为 1，实为 ${patch.schemaVersion}`);
  const items = patch.items;
  if (!items || typeof items !== "object" || Array.isArray(items)) {
    add("bad_items_shape", "(patch)", "items 必须是 {id: {...}} 映射");
    return { reds, warns, stats: { total: 0, zh: 0, en: 0 } };
  }

  const ids = Object.keys(items);

  // —— id 集合 ——
  for (const id of ids) if (!indexById.has(id)) add("unknown_id", id, "不存在于 philosophers.index.json");
  if (expectIds) {
    for (const id of expectIds) if (!items[id]) add("missing_id", id, "应在本批却缺失");
    for (const id of ids) if (!expectIds.has(id)) add("extra_id", id, "不属本批范围");
  }

  const zhLines = [];
  const enLines = [];
  const kwZhCombos = new Map();

  for (const id of ids) {
    const it = items[id];
    const idxEntry = indexById.get(id);

    for (const f of Object.keys(it)) if (!ALLOWED_FIELDS.has(f)) add("stray_field", id, `含额外字段 ${f}，本层只许改文本字段`);

    // —— oneLineZh ——
    if (typeof it.oneLineZh === "string") {
      const s = it.oneLineZh;
      zhLines.push(s);
      if (s.length < ONELINE_ZH_MIN || s.length > ONELINE_ZH_MAX)
        add("zh_length", id, `oneLineZh ${s.length} 字，应在 ${ONELINE_ZH_MIN}-${ONELINE_ZH_MAX}`);
      if (PLACEHOLDER_ZH.test(s)) add("placeholder_residue", id, "仍是播种期占位句式");
      const empty = s.match(EMPTY_WORDS_ZH);
      if (empty) add("empty_word", id, `含空话词「${empty[0]}」，套谁都行`);
      if (!hasHan(s)) add("zh_not_chinese", id, "oneLineZh 不含中文");
    }

    // —— oneLineEn ——
    if (typeof it.oneLineEn === "string") {
      const s = it.oneLineEn;
      enLines.push(s);
      if (!s.trim()) add("en_empty", id, "oneLineEn 为空");
      if (s.length > ONELINE_EN_MAX) warns.push({ code: "en_long", at: id, msg: `oneLineEn ${s.length} 字符，超 ${ONELINE_EN_MAX}` });
      if (hasHan(s)) add("en_has_han", id, "oneLineEn 残留中文字符");
    }

    // —— keywordsZh ——
    if (Array.isArray(it.keywordsZh)) {
      const k = it.keywordsZh;
      if (k.length < KEYWORDS_MIN || k.length > KEYWORDS_MAX)
        add("kw_count", id, `keywordsZh ${k.length} 个，应在 ${KEYWORDS_MIN}-${KEYWORDS_MAX}`);
      const themeHit = k.filter((x) => THEME_ZH.has(x));
      if (themeHit.length) add("kw_is_theme", id, `关键词用了主题名「${themeHit.join("、")}」，themes 字段已存，重复无意义`);
      if (k.some((x) => typeof x !== "string" || !x.trim())) add("kw_empty", id, "keywordsZh 含空项");
      if (new Set(k).size !== k.length) add("kw_dup_within", id, "keywordsZh 组内有重复");
      const combo = k.join("|");
      if (!kwZhCombos.has(combo)) kwZhCombos.set(combo, []);
      kwZhCombos.get(combo).push(id);
    }

    // —— keywordsEn：须与中文侧等长同序 ——
    if (Array.isArray(it.keywordsEn)) {
      const en = it.keywordsEn;
      const zh = Array.isArray(it.keywordsZh) ? it.keywordsZh : idxEntry && idxEntry.keywordsZh;
      if (en.some((x) => typeof x !== "string" || !x.trim())) add("kw_en_empty", id, "keywordsEn 含空项");
      if (en.some((x) => hasHan(x))) add("kw_en_has_han", id, "keywordsEn 残留中文字符");
      if (Array.isArray(zh) && en.length !== zh.length)
        add("kw_en_length_mismatch", id, `keywordsEn ${en.length} 个 ≠ keywordsZh ${zh.length} 个，须等长同序`);
    }
  }

  // —— 跨条重复 ——
  const dupZh = zhLines.filter((s, i) => zhLines.indexOf(s) !== i);
  if (dupZh.length) add("zh_duplicate", "(批)", `oneLineZh 有 ${new Set(dupZh).size} 组重复`);
  const dupEn = enLines.filter((s, i) => enLines.indexOf(s) !== i);
  if (dupEn.length) add("en_duplicate", "(批)", `oneLineEn 有 ${new Set(dupEn).size} 组重复`);
  for (const [combo, who] of kwZhCombos) if (who.length > 1) add("kw_combo_duplicate", who.join(","), `关键词组合完全相同：${combo}`);

  // —— 反模板 ——
  for (const h of sharedAffixes(zhLines, SHARED_AFFIX_LEN, SHARED_AFFIX_COUNT))
    add("shared_affix_zh", "(批)", `${h.count} 条共享 ${SHARED_AFFIX_LEN} 字${h.kind}「${h.affix}」，句式在收敛`);
  for (const h of sharedAffixes(enLines, 12, SHARED_AFFIX_COUNT))
    add("shared_affix_en", "(批)", `${h.count} 条共享 12 字符${h.kind}「${h.affix}」，句式在收敛`);

  return { reds, warns, stats: { total: ids.length, zh: zhLines.length, en: enLines.length } };
}

function main() {
  const args = process.argv.slice(2);
  const patchPath = args.find((a) => !a.startsWith("--"));
  if (!patchPath) {
    console.error("用法: node tools/text-patch-lint.mjs <patch.json> [--index <index.json>] [--expect <ids.txt>]");
    process.exit(2);
  }
  const ii = args.indexOf("--index");
  const indexPath = ii >= 0 ? args[ii + 1] : "public/data/philosophers.index.json";
  const ei = args.indexOf("--expect");

  const rawIdx = readJson(indexPath);
  const arr = Array.isArray(rawIdx) ? rawIdx : rawIdx.items || rawIdx.philosophers || [];
  const indexById = new Map(arr.map((p) => [p.id, p]));

  let expectIds = null;
  if (ei >= 0) {
    expectIds = new Set(
      fs.readFileSync(args[ei + 1], "utf8").split(/[\s,]+/).map((s) => s.trim()).filter(Boolean),
    );
  }

  const patch = readJson(patchPath);
  const { reds, warns, stats } = lintPatch(patch, indexById, { expectIds });

  console.log(`文本补丁门：${patchPath}`);
  console.log(`  条目 ${stats.total} ｜ 含 oneLineZh ${stats.zh} ｜ 含 oneLineEn ${stats.en}`);
  if (expectIds) console.log(`  对照名单 ${expectIds.size} 个 id`);
  console.log("");

  if (reds.length) {
    console.log(`🔴 RED ${reds.length} 条（禁止 admit）`);
    for (const r of reds) console.log(`   [${r.code}] ${r.at}: ${r.msg}`);
    console.log("");
  }
  if (warns.length) {
    console.log(`🟡 提示 ${warns.length} 条（不阻断）`);
    for (const w of warns) console.log(`   [${w.code}] ${w.at}: ${w.msg}`);
    console.log("");
  }

  console.log(reds.length ? "❌ 文本补丁门未过" : "✅ 文本补丁门通过");
  process.exit(reds.length ? 1 : 0);
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) main();
