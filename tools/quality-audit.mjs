#!/usr/bin/env node
// ============================================================
// quality-audit.mjs —— 思想系统【内容质量】只读审计器
//
// validate-data.mjs 只查结构/schema；本工具查 validate 查不到的内容质量：
// 薄项、模糊 locator、假引文、claim 复述题目、weight 无区分、重复 claim、theme 覆盖。
//
// 只读：绝不写任何数据文件（仅在显式 --json/--md 时写【报告】到指定路径）。
//
// 用法：
//   node tools/quality-audit.mjs [--data-dir <dir>] [--json <out>] [--md <out>] [--strict]
//   --data-dir  含 philosophers/ works.json themes.json 的目录（默认 public/data）
//   --strict    有 YELLOW 也以非0退出（默认仅 RED 非0退出）
//
// 退出码：0=无 RED（--strict 下需也无 YELLOW）；1=有问题；2=用法错误
// ============================================================
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");

export const VAGUE_LOCATOR = /(等相关|等篇|等章|等段|上、?中、?下|整篇|各篇|若干|多处|参见)/;
export const MIN_SUMMARY = 20;            // 硬下限：schema 要求 summaryZh >= 20（低于=RED）
export const TARGET_SUMMARY = 40;         // 标准档：summaryZh 目标厚度（20<=len<40=YELLOW summary_thin）
export const TARGET_EV_PER_CLAIM = 2;     // 标准档：每 claim 目标 evidence 数（>=1 但 <2=YELLOW thin_evidence）
export const RESTATE_JACCARD = 0.72;      // claimZh 与 questionZh 字符 Jaccard 超此值疑似复述
export const TEMPLATE_SUMMARY_JACCARD = 0.55; // 同一哲人 evidence.summaryZh 两两字符 Jaccard 均值超此值疑似二代模板

// 反模板规则：这类句子满足长度/证据数门槛，却没有实质内容，必须直接 RED。
export const TEMPLATE_CLAIM = /(在[“\"][^”\"]+[”\"]中提出基础性立场，说明其理论问题的出发点|在[“\"][^”\"]+[”\"]中进一步推出实践、制度或认识论后果)/;
export const TEMPLATE_EVIDENCE_SUMMARY = /(提供该命题的原典定位，用于支撑|用于支撑[^。；]*命题|原典定位，用于支撑)/;

// 标准档 YELLOW 码：在 --require-standard（写前门硬门）下，这些也当作阻断项，不清零禁止入库。
export const STANDARD_TIER_CODES = new Set(["thin_evidence", "summary_thin", "weight_uniform"]);

function readJson(f) { return JSON.parse(fs.readFileSync(f, "utf8")); }

// 中文友好的字符 Jaccard：去标点空白后按字符集合比
export function jaccardChars(a, b) {
  const norm = (s) => new Set((s || "").replace(/[\s，。、；：？！（）「」『』《》·,.;:?!()\[\]"'-]/g, "").split(""));
  const A = norm(a), B = norm(b);
  if (!A.size || !B.size) return 0;
  let inter = 0;
  for (const c of A) if (B.has(c)) inter++;
  return inter / (A.size + B.size - inter);
}

// 审计单个哲人，返回 { pid, hasTS, findings:[{pid,sev,code,msg}] }
export function auditPhilosopher(detail, worksById) {
  const findings = [];
  const pid = detail.id;
  const add = (sev, code, msg) => findings.push({ pid, sev, code, msg });
  const ts = detail.thoughtSystem;
  if (!ts) return { pid, hasTS: false, findings };

  const problems = ts.problems || [];
  if (problems.length < 3) add("RED", "problems_lt_3", `problems=${problems.length} (<3)`);

  const claimTitles = new Map();
  const evidenceSummaries = [];

  for (const p of problems) {
    const claims = p.claims || [];
    const claimTextsInProblem = new Map();
    const evCount = claims.reduce((n, c) => n + (c.evidence?.length || 0), 0);
    if (claims.length < 2) add("RED", "claims_lt_2", `${p.id}: claims=${claims.length} (<2)`);
    if (evCount < 2) add("RED", "evidence_lt_2", `${p.id}: evidence=${evCount} (<2)`);

    const weights = claims.map((c) => c.weight);
    if (claims.length >= 2 && new Set(weights).size === 1)
      add("YELLOW", "weight_uniform", `${p.id}: 所有 claim 同权重(${weights[0]})，无区分`);

    for (const c of claims) {
      const evN = (c.evidence || []).length;
      if (evN >= 1 && evN < TARGET_EV_PER_CLAIM)
        add("YELLOW", "thin_evidence", `${c.id}: 仅 ${evN} 条 evidence（标准档目标 >=${TARGET_EV_PER_CLAIM}/claim，此为底线数据）`);

      const j = jaccardChars(c.claimZh, p.questionZh);
      if (j >= RESTATE_JACCARD)
        add("YELLOW", "claim_restates_question", `${c.id}: claimZh 与 questionZh 高度重叠(${j.toFixed(2)})，疑似复述`);
      if (TEMPLATE_CLAIM.test(c.claimZh || ""))
        add("RED", "template_claim", `${c.id}: claimZh 命中模板灌水句式，缺少实质主张`);

      const claimText = (c.claimZh || "").trim();
      if (claimText) {
        if (claimTextsInProblem.has(claimText))
          add("RED", "duplicate_claim_text", `${p.id}: ${c.id} 与 ${claimTextsInProblem.get(claimText)} 的 claimZh 精确重复`);
        else claimTextsInProblem.set(claimText, c.id);
      }

      const key = (c.titleZh || "").trim();
      if (key) {
        if (claimTitles.has(key)) add("YELLOW", "duplicate_claim", `${c.id}: 与 ${claimTitles.get(key)} 标题重复「${key}」`);
        else claimTitles.set(key, c.id);
      }

      for (const e of c.evidence || []) {
        const s = e.source || {};
        const sumLen = (e.summaryZh || "").length;
        if (sumLen < MIN_SUMMARY)
          add("RED", "summary_too_short", `${e.id}: summaryZh 长度 ${sumLen} (<${MIN_SUMMARY})`);
        else if (sumLen < TARGET_SUMMARY)
          add("YELLOW", "summary_thin", `${e.id}: summaryZh 长度 ${sumLen}（>=${MIN_SUMMARY} 但 <${TARGET_SUMMARY} 标准档，偏薄）`);
        if (TEMPLATE_EVIDENCE_SUMMARY.test(e.summaryZh || ""))
          add("RED", "template_evidence_summary", `${e.id}: summaryZh 命中“复述 locator/用于支撑命题”模板，缺少实质证据概括`);
        if (e.summaryZh) evidenceSummaries.push({ id: e.id, text: e.summaryZh });
        if (s.workId && (e.summaryZh || "").includes(s.workId))
          add("RED", "workid_in_summary", `${e.id}: summaryZh 含 workId 子串「${s.workId}」，疑似把定位字段粘入摘要`);
        if (s.excerptStatus === "public_domain" && !s.publicDomainExcerptZh)
          add("RED", "fake_public_domain", `${e.id}: 标 public_domain 但无 publicDomainExcerptZh`);
        if (s.publicDomainExcerptZh && s.excerptStatus !== "public_domain")
          add("YELLOW", "excerpt_status_mismatch", `${e.id}: 有逐字原文但 excerptStatus=${s.excerptStatus}`);
        if (s.workId) {
          const w = worksById.get(s.workId);
          if (!w) add("RED", "unknown_workid", `${e.id}: workId ${s.workId} 不在 works.json`);
          else if (w.philosopherId !== pid) add("RED", "workid_other_philosopher", `${e.id}: workId ${s.workId} 属于 ${w.philosopherId}`);
        }
        const loc = s.locator || "";
        if (!loc && s.excerptStatus !== "none")
          add("YELLOW", "missing_locator", `${e.id}: 无 locator (excerptStatus=${s.excerptStatus})`);
        else if (VAGUE_LOCATOR.test(loc))
          add("YELLOW", "vague_locator", `${e.id}: locator 宽泛「${loc}」`);
      }
    }
  }

  if (evidenceSummaries.length >= 6) {
    let total = 0;
    let pairs = 0;
    for (let i = 0; i < evidenceSummaries.length; i++) {
      for (let j = i + 1; j < evidenceSummaries.length; j++) {
        total += jaccardChars(evidenceSummaries[i].text, evidenceSummaries[j].text);
        pairs++;
      }
    }
    const mean = pairs ? total / pairs : 0;
    if (mean > TEMPLATE_SUMMARY_JACCARD)
      add("RED", "template_similarity", `summaryZh 两两字符 Jaccard 均值 ${mean.toFixed(2)} (>${TEMPLATE_SUMMARY_JACCARD})，疑似同一模板批量改写`);
  }

  return { pid, hasTS: true, findings };
}

// 审计整个数据目录，返回 report 对象（纯函数，不写文件、不退出）
export function runAudit({ dataDir }) {
  const phDir = path.join(dataDir, "philosophers");
  const works = readJson(path.join(dataDir, "works.json"));
  const worksById = new Map(works.map((w) => [w.id, w]));
  let themes = [];
  try { themes = readJson(path.join(dataDir, "themes.json")); } catch { /* optional */ }

  const files = fs.readdirSync(phDir).filter((f) => f.endsWith(".json")).sort();
  const results = [];
  const themeUse = new Map(themes.map((t) => [t.id, 0]));
  let withTS = 0;
  // 逐字原文欠债计数：excerptStatus 分布（summary_only 是待补的技术债，见 RUNBOOK §13 第4项）
  const excerptStatusCount = {};

  for (const f of files) {
    const detail = readJson(path.join(phDir, f));
    const r = auditPhilosopher(detail, worksById);
    if (r.hasTS) {
      withTS++;
      for (const p of detail.thoughtSystem.problems || []) {
        for (const id of p.themeIds || []) themeUse.set(id, (themeUse.get(id) || 0) + 1);
        for (const c of p.claims || [])
          for (const e of c.evidence || []) {
            const st = e.source?.excerptStatus || "unknown";
            excerptStatusCount[st] = (excerptStatusCount[st] || 0) + 1;
          }
      }
    }
    results.push(r);
  }

  const all = results.flatMap((r) => r.findings);
  const red = all.filter((x) => x.sev === "RED");
  const yellow = all.filter((x) => x.sev === "YELLOW");
  const byCode = (arr) => arr.reduce((m, x) => ((m[x.code] = (m[x.code] || 0) + 1), m), {});
  const uncoveredThemes = [...themeUse].filter(([, n]) => n === 0).map(([id]) => id);
  const greenPeople = results.filter((r) => r.hasTS && r.findings.length === 0).map((r) => r.pid);
  const redPeople = [...new Set(red.map((x) => x.pid))];
  const yellowOnly = [...new Set(yellow.map((x) => x.pid))].filter((p) => !redPeople.includes(p));

  return {
    dataDir, scannedAt: new Date().toISOString(),
    totals: { philosophersWithThoughtSystem: withTS, red: red.length, yellow: yellow.length,
              greenPeople: greenPeople.length, redPeople: redPeople.length, yellowOnlyPeople: yellowOnly.length,
              excerptDebt: excerptStatusCount.summary_only || 0 },
    excerptStatusCount,
    redByCode: byCode(red), yellowByCode: byCode(yellow),
    uncoveredThemes, greenPeople, redPeople, yellowOnlyPeople: yellowOnly,
    findings: all, results,
  };
}

// 审计一个【暂存 batch 的 thought-systems.json】（admit 前，内容尚未进正式库）。
// batch 结构：{ schemaVersion, items:[{ philosopherId, problems }] }。works.json 仍从 dataDir 读，用于 workId 校验。
export function runAuditBatch({ batchFile, dataDir }) {
  const works = readJson(path.join(dataDir, "works.json"));
  const worksById = new Map(works.map((w) => [w.id, w]));
  const raw = readJson(batchFile);
  const items = Array.isArray(raw) ? raw : (raw.items || []);
  const results = items.map((it) =>
    auditPhilosopher({ id: it.philosopherId || it.id, thoughtSystem: { problems: it.problems || [] } }, worksById));

  const all = results.flatMap((r) => r.findings);
  const red = all.filter((x) => x.sev === "RED");
  const yellow = all.filter((x) => x.sev === "YELLOW");
  const byCode = (arr) => arr.reduce((m, x) => ((m[x.code] = (m[x.code] || 0) + 1), m), {});
  const redPeople = [...new Set(red.map((x) => x.pid))];
  const yellowOnly = [...new Set(yellow.map((x) => x.pid))].filter((p) => !redPeople.includes(p));
  const greenPeople = results.filter((r) => r.hasTS && r.findings.length === 0).map((r) => r.pid);

  return {
    batchFile, scannedAt: new Date().toISOString(),
    totals: { philosophersWithThoughtSystem: results.filter((r) => r.hasTS).length,
              red: red.length, yellow: yellow.length,
              greenPeople: greenPeople.length, redPeople: redPeople.length, yellowOnlyPeople: yellowOnly.length },
    redByCode: byCode(red), yellowByCode: byCode(yellow),
    greenPeople, redPeople, yellowOnlyPeople: yellowOnly,
    findings: all, results,
  };
}

// 退出决策（纯函数，便于测试）：
//   默认：有 RED 即失败。
//   --strict：任何 YELLOW 也失败。
//   --require-standard：RED 或【标准档码】(thin_evidence/summary_thin/weight_uniform) 出现即失败。
export function shouldFail(report, { strict = false, requireStandard = false } = {}) {
  if (report.totals.red > 0) return true;
  if (strict && report.totals.yellow > 0) return true;
  if (requireStandard && report.findings.some((f) => STANDARD_TIER_CODES.has(f.code))) return true;
  return false;
}

export function renderMarkdown(report) {
  const md = [];
  md.push(`# 内容质量审计报告`);
  md.push(`数据目录：\`${report.dataDir}\`  扫描时间：${report.scannedAt}`);
  md.push(``);
  md.push(`有 thoughtSystem：**${report.totals.philosophersWithThoughtSystem}** 位 ｜ 🟢全绿 ${report.totals.greenPeople} ｜ 🔴有RED ${report.totals.redPeople} ｜ 🟡仅YELLOW ${report.totals.yellowOnlyPeople}`);
  md.push(`RED **${report.totals.red}** 条 ｜ YELLOW **${report.totals.yellow}** 条`);
  md.push(``);
  md.push(`## RED（硬性违规，必须修）`);
  md.push(Object.keys(report.redByCode).length ? Object.entries(report.redByCode).map(([k, v]) => `- ${k}: ${v}`).join("\n") : "无 ✅");
  md.push(``);
  md.push(`## YELLOW（质量异味，建议修）`);
  md.push(Object.keys(report.yellowByCode).length ? Object.entries(report.yellowByCode).map(([k, v]) => `- ${k}: ${v}`).join("\n") : "无 ✅");
  md.push(``);
  if (report.uncoveredThemes.length) { md.push(`## 无人覆盖的 theme`); md.push(report.uncoveredThemes.join(", ")); md.push(``); }
  if (report.findings.length) {
    md.push(`## 明细`);
    for (const r of report.results.filter((r) => r.findings.length)) {
      md.push(`### ${r.pid}`);
      for (const f of r.findings) md.push(`- ${f.sev === "RED" ? "🔴" : "🟡"} [${f.code}] ${f.msg}`);
    }
  }
  return md.join("\n") + "\n";
}

function parseArgs(argv) {
  const o = { dataDir: null, json: null, md: null, strict: false, batch: null, requireStandard: false };
  const a = [...argv];
  while (a.length) {
    const t = a.shift();
    if (t === "--data-dir") o.dataDir = a.shift();
    else if (t === "--json") o.json = a.shift();
    else if (t === "--md") o.md = a.shift();
    else if (t === "--strict") o.strict = true;
    else if (t === "--batch") o.batch = a.shift();
    else if (t === "--require-standard") o.requireStandard = true;
    else if (t === "-h" || t === "--help") o.help = true;
    else { console.error("未知参数: " + t); process.exit(2); }
  }
  return o;
}

function cli() {
  const opt = parseArgs(process.argv.slice(2));
  if (opt.help) { console.log("node tools/quality-audit.mjs [--data-dir <dir>] [--batch <thought-systems.json>] [--require-standard] [--json out] [--md out] [--strict]"); process.exit(0); }
  const dataDir = path.resolve(opt.dataDir || path.join(REPO_ROOT, "public/data"));

  // --batch：只审计一个暂存 batch（admit 前的写前门用），配合 --require-standard 把标准档做成硬门。
  if (opt.batch) {
    const report = runAuditBatch({ batchFile: path.resolve(opt.batch), dataDir });
    if (opt.json) fs.writeFileSync(opt.json, JSON.stringify(report, null, 2) + "\n");
    if (opt.md) fs.writeFileSync(opt.md, renderMarkdown(report));
    const t = report.totals;
    console.log(`Batch 内容审计：${t.philosophersWithThoughtSystem} 位（${path.basename(opt.batch)}）`);
    console.log(`  🟢 全绿 ${t.greenPeople} ｜ 🔴 有RED ${t.redPeople} ｜ 🟡 仅YELLOW ${t.yellowOnlyPeople}`);
    console.log(`  RED ${t.red} 条 ${JSON.stringify(report.redByCode)}`);
    console.log(`  YELLOW ${t.yellow} 条 ${JSON.stringify(report.yellowByCode)}`);
    const failed = shouldFail(report, { strict: opt.strict, requireStandard: opt.requireStandard });
    if (failed) {
      console.log(`  ❌ 未过${opt.requireStandard ? "（标准档硬门：thin_evidence/summary_thin/weight 需清零）" : ""}：`);
      const blockCodes = opt.requireStandard ? STANDARD_TIER_CODES : new Set();
      for (const x of report.findings.filter((f) => f.sev === "RED" || blockCodes.has(f.code)).slice(0, 30))
        console.log(`     ${x.pid} [${x.code}] ${x.msg}`);
    } else {
      console.log(`  ✅ 通过${opt.requireStandard ? "（含标准档硬门）" : ""}`);
    }
    process.exit(failed ? 1 : 0);
  }

  const report = runAudit({ dataDir });
  if (opt.json) fs.writeFileSync(opt.json, JSON.stringify(report, null, 2) + "\n");
  if (opt.md) fs.writeFileSync(opt.md, renderMarkdown(report));

  const t = report.totals;
  console.log(`内容质量审计：${t.philosophersWithThoughtSystem} 位有 thoughtSystem`);
  console.log(`  🟢 全绿 ${t.greenPeople} ｜ 🔴 有RED ${t.redPeople} ｜ 🟡 仅YELLOW ${t.yellowOnlyPeople}`);
  console.log(`  RED ${t.red} 条 ${JSON.stringify(report.redByCode)}`);
  console.log(`  YELLOW ${t.yellow} 条 ${JSON.stringify(report.yellowByCode)}`);
  console.log(`  逐字原文欠债 summary_only=${t.excerptDebt} ｜ excerptStatus 分布 ${JSON.stringify(report.excerptStatusCount)}`);
  if (report.uncoveredThemes.length) console.log(`  无人覆盖 theme: ${report.uncoveredThemes.join(", ")}`);
  if (t.red) { console.log(`  ❌ 存在 RED：`); for (const x of report.findings.filter((f) => f.sev === "RED").slice(0, 20)) console.log(`     ${x.pid} [${x.code}] ${x.msg}`); }
  else console.log(`  ✅ 无 RED`);

  process.exit(shouldFail(report, { strict: opt.strict }) ? 1 : 0);
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) cli();
