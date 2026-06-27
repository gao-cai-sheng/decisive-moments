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
export const MIN_SUMMARY = 20;        // schema 要求 summaryZh >= 20
export const RESTATE_JACCARD = 0.72;  // claimZh 与 questionZh 字符 Jaccard 超此值疑似复述

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

  for (const p of problems) {
    const claims = p.claims || [];
    const evCount = claims.reduce((n, c) => n + (c.evidence?.length || 0), 0);
    if (claims.length < 2) add("RED", "claims_lt_2", `${p.id}: claims=${claims.length} (<2)`);
    if (evCount < 2) add("RED", "evidence_lt_2", `${p.id}: evidence=${evCount} (<2)`);

    const weights = claims.map((c) => c.weight);
    if (claims.length >= 2 && new Set(weights).size === 1)
      add("YELLOW", "weight_uniform", `${p.id}: 所有 claim 同权重(${weights[0]})，无区分`);

    for (const c of claims) {
      const j = jaccardChars(c.claimZh, p.questionZh);
      if (j >= RESTATE_JACCARD)
        add("YELLOW", "claim_restates_question", `${c.id}: claimZh 与 questionZh 高度重叠(${j.toFixed(2)})，疑似复述`);

      const key = (c.titleZh || "").trim();
      if (key) {
        if (claimTitles.has(key)) add("YELLOW", "duplicate_claim", `${c.id}: 与 ${claimTitles.get(key)} 标题重复「${key}」`);
        else claimTitles.set(key, c.id);
      }

      for (const e of c.evidence || []) {
        const s = e.source || {};
        if ((e.summaryZh || "").length < MIN_SUMMARY)
          add("RED", "summary_too_short", `${e.id}: summaryZh 长度 ${(e.summaryZh || "").length} (<${MIN_SUMMARY})`);
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

  for (const f of files) {
    const detail = readJson(path.join(phDir, f));
    const r = auditPhilosopher(detail, worksById);
    if (r.hasTS) {
      withTS++;
      for (const p of detail.thoughtSystem.problems || [])
        for (const id of p.themeIds || []) themeUse.set(id, (themeUse.get(id) || 0) + 1);
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
              greenPeople: greenPeople.length, redPeople: redPeople.length, yellowOnlyPeople: yellowOnly.length },
    redByCode: byCode(red), yellowByCode: byCode(yellow),
    uncoveredThemes, greenPeople, redPeople, yellowOnlyPeople: yellowOnly,
    findings: all, results,
  };
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
  const o = { dataDir: null, json: null, md: null, strict: false };
  const a = [...argv];
  while (a.length) {
    const t = a.shift();
    if (t === "--data-dir") o.dataDir = a.shift();
    else if (t === "--json") o.json = a.shift();
    else if (t === "--md") o.md = a.shift();
    else if (t === "--strict") o.strict = true;
    else if (t === "-h" || t === "--help") o.help = true;
    else { console.error("未知参数: " + t); process.exit(2); }
  }
  return o;
}

function cli() {
  const opt = parseArgs(process.argv.slice(2));
  if (opt.help) { console.log("node tools/quality-audit.mjs [--data-dir <dir>] [--json out] [--md out] [--strict]"); process.exit(0); }
  const dataDir = path.resolve(opt.dataDir || path.join(REPO_ROOT, "public/data"));
  const report = runAudit({ dataDir });
  if (opt.json) fs.writeFileSync(opt.json, JSON.stringify(report, null, 2) + "\n");
  if (opt.md) fs.writeFileSync(opt.md, renderMarkdown(report));

  const t = report.totals;
  console.log(`内容质量审计：${t.philosophersWithThoughtSystem} 位有 thoughtSystem`);
  console.log(`  🟢 全绿 ${t.greenPeople} ｜ 🔴 有RED ${t.redPeople} ｜ 🟡 仅YELLOW ${t.yellowOnlyPeople}`);
  console.log(`  RED ${t.red} 条 ${JSON.stringify(report.redByCode)}`);
  console.log(`  YELLOW ${t.yellow} 条 ${JSON.stringify(report.yellowByCode)}`);
  if (report.uncoveredThemes.length) console.log(`  无人覆盖 theme: ${report.uncoveredThemes.join(", ")}`);
  if (t.red) { console.log(`  ❌ 存在 RED：`); for (const x of report.findings.filter((f) => f.sev === "RED").slice(0, 20)) console.log(`     ${x.pid} [${x.code}] ${x.msg}`); }
  else console.log(`  ✅ 无 RED`);

  process.exit(t.red > 0 || (opt.strict && t.yellow > 0) ? 1 : 0);
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) cli();
