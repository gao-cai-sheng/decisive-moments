#!/usr/bin/env node
// ============================================================
// locator-lint.mjs —— 第四道门：evidence.source.locator 形态与举证检查
//
// 用法：
//   node tools/locator-lint.mjs <batchDir> [--works public/data/works.json]
//
// 存在理由（2026-07-24 立）：
//   U5/U6/U7 三批 12 人在 validate:kimi + admit dry-run + quality-audit --require-standard
//   三道门下【全绿】，但盲审发现三人不可入库：
//     herzen  —— 把《彼岸书》《俄国人民与社会主义》两部独立著作挂在《往事与随想》vol.VI 之下
//     fedorov —— 12 条中 6 条篇名疑似按主题自拟，文集目录里查不到
//     bulgakov—— 12 条中仅 2 条是真正位置，其余是「作为……背景的那些部分」这类主题描述
//   机器查不了「这个篇名真不真」，但机器能查两件事：
//     (1) 这条 locator 在【形态】上是不是一个位置（有没有编号锚、是不是描述性短语）
//     (2) 凡不能靠编号自证的位置，生产方有没有在 sources.md 写下【所据编本 + 它在目录中的层级】
//   第二条把「无法核实的内容错误」转成「可核实的举证缺口」——这是本工具的全部设计意图。
//
//   与 quality-audit.mjs 的分工：那里只判 locator 空串(RED) 与一个宽泛词正则(YELLOW，
//   且 --require-standard 不拦 YELLOW)。本工具补的是形态与举证，两者不重叠。
//
// 退出码：0=通过；1=有 RED 或有未声明项（禁止 admit）；2=用法/输入错误。
// 只读，对仓库零写入。
// ============================================================
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DECL_HEADING = /^#{1,6}\s*locator\s*版本声明\s*$/im;

// —— 编号锚：出现任一即认为这条 locator 指向一个可编号定位的位置 ——
const ANCHOR_PATTERNS = [
  /\b(?:ch|chap|bk|vol|pt|sec|art|q)\.\s*[IVXLCDM\d]/i, // ch. VII / vol. VI / pt. 2
  /§\s*\d+/, // §1
  /\b(?:Book|Part|Letter|Hymn|Lecture|Lectures|Canto|Discourse|Chapter|Chapters|Section|Sections|Volume|Treatise|Sutra|Fragment)\s+(?:[IVXLCDM]+|\d+|First|Second|Third|Fourth|Fifth|Sixth|Seventh|Eighth|Ninth|Tenth|Eleventh|Twelfth)\b/i,
  /\bpp?\.\s*\d+/i, // p. 12 / pp. 180-185
  /\b(?:lines?|vv?)\.?\s*\d+/i, // lines 3-9 / v. 4
  /\b(?:Introduction|Preface|Prologue|Foreword|Epilogue|Conclusion|Appendix|Postscript)\b/i, // 全书唯一的结构位
];

// —— 描述性标记：这些词说明写的是「关于什么的部分」而不是「哪个位置」 ——
const DESCRIPTIVE_MARKERS = [
  { re: /\bbackground\b/i, label: "background" },
  { re: /\bcontext\b/i, label: "context" },
  { re: /\bin relation to\b/i, label: "in relation to" },
  { re: /\borientation\b/i, label: "orientation" },
  { re: /\brelevant\b/i, label: "relevant" },
  { re: /\band related\b/i, label: "and related" },
];

// 无编号的 chapters/sections/passages 复数 —— 「那些章」不是位置
const VAGUE_PLURAL = /\b(?:chapters|sections|passages|discourses)\b/i;
// ch. 后面跟的不是编号而是 on/about —— 「论家庭那一章」不是章号
const CH_WITHOUT_NUMBER = /\b(?:ch|chap|chapter)\.?\s+(?:on|about|concerning|dealing)\b/i;

const norm = (s) =>
  String(s || "")
    .toLowerCase()
    .replace(/[‘’']/g, "'")
    .replace(/[^a-z0-9']+/g, " ")
    .trim();

// 标题匹配的容忍范围（都是实际批次里出现过的合法写法，不是放水）：
//   副标题  —— works.json "Mutual Aid: A Factor of Evolution" ↔ locator "Mutual Aid"
//   简称    —— "On the Nature of European Culture and Its Relation to..." ↔ 前缀简称
//   单复数  —— "The Aesthetic Relation of Art to Reality" ↔ "...Relations..."
//   冠词    —— 首个 the/a/an 可省
// 收紧点：简称至少要有 2 个实词，避免「The」这种一字前缀撞上任意书名。
function titleMatches(seg, titleEn) {
  const stripArticle = (x) => x.replace(/^(the|a|an)\s+/, "");
  const foldPlural = (x) => x.replace(/(\w{3,})s\b/g, "$1");
  const prep = (x) => foldPlural(stripArticle(norm(x)));

  const a = prep(seg);
  const b = prep(titleEn);
  if (!a || !b) return false;
  if (a === b) return true;

  const beforeColon = prep(String(titleEn).split(":")[0]);
  if (a === beforeColon) return true;

  // 前缀简称：locator 首段是完整题名的开头，且本身够长
  const words = a.split(" ").filter((w) => !/^(of|the|a|an|and|or|in|on|to|for|with|from|as|at|by|its)$/.test(w));
  return words.length >= 2 && b.startsWith(a + " ");
}

const hasAnchor = (text) => ANCHOR_PATTERNS.some((re) => re.test(text));

// Title Case 片段：≥2 个首字母大写的实词，且不含编号 —— 典型的「篇名/章题」。
// 真伪机器判不了，必须由 sources.md 声明所据编本与目录层级。
function looksLikeTitleSegment(seg) {
  if (/\d/.test(seg)) return false;
  const words = seg.trim().split(/\s+/);
  if (words.length < 2) return false;
  const minor = /^(of|the|a|an|and|or|in|on|to|for|with|from|as|at|by|its)$/i;
  const content = words.filter((w) => !minor.test(w));
  if (content.length === 0) return false;
  const capContent = content.filter((w) => /^[A-Z]/.test(w));
  const capitalized = words.filter((w) => /^[A-Z][a-z’']/.test(w));
  return capitalized.length >= 2 && capContent.length === content.length;
}

const readJson = (p) => JSON.parse(fs.readFileSync(p, "utf8"));

function loadWorks(worksPath) {
  const raw = readJson(worksPath);
  const arr = Array.isArray(raw) ? raw : raw.items || raw.works || [];
  return new Map(arr.map((w) => [w.id, w]));
}

// 提取 sources.md 中「locator 版本声明」小节的正文
function loadDeclarations(batchDir) {
  const p = path.join(batchDir, "sources.md");
  if (!fs.existsSync(p)) return { present: false, body: "" };
  const lines = fs.readFileSync(p, "utf8").split(/\r?\n/);
  const start = lines.findIndex((l) => DECL_HEADING.test(l));
  if (start < 0) return { present: false, body: "" };
  const level = (lines[start].match(/^#+/) || ["#"])[0].length;
  const body = [];
  for (let i = start + 1; i < lines.length; i++) {
    const m = lines[i].match(/^(#+)\s/);
    if (m && m[1].length <= level) break;
    body.push(lines[i]);
  }
  return { present: true, body: body.join("\n") };
}

function romanToArabic(s) {
  if (/^\d+$/.test(s)) return Number(s);
  const map = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let n = 0;
  const u = s.toUpperCase();
  for (let i = 0; i < u.length; i++) {
    const v = map[u[i]] || 0;
    const next = map[u[i + 1]] || 0;
    n += v < next ? -v : v;
  }
  return n;
}

// 纯函数：给定人物条目、works 索引、sources.md 声明区块正文，产出检查结果。
// 与文件系统解耦，便于测试。
export function lintItems(items, works, declBody = "") {
  const decl = { body: declBody };
  const reds = [];
  const needDecl = [];
  const warns = [];
  const perPerson = new Map();

  for (const person of items) {
    const pid = person.philosopherId;
    const stat = { red: 0, decl: 0, warn: 0, total: 0 };
    perPerson.set(pid, stat);

    for (const problem of person.problems || []) {
      for (const claim of problem.claims || []) {
        for (const ev of claim.evidence || []) {
          const src = ev.source || {};
          const loc = String(src.locator || "");
          const workId = src.workId;
          const at = `${pid} / ${ev.id || "(no-id)"}`;
          stat.total++;

          if (!loc.trim()) {
            reds.push({ at, code: "locator_empty", loc, msg: "locator 为空" });
            stat.red++;
            continue;
          }

          const work = works.get(workId);
          const segs = loc.split(",").map((s) => s.trim()).filter(Boolean);
          const head = segs[0] || "";
          const tail = segs.slice(1);
          const tailText = tail.join(", ");

          // —— RED 1：首段书名与 workId 所指作品不符（跨作品挂靠第一道防线）——
          if (!work) {
            reds.push({ at, code: "unknown_workid", loc, msg: `works.json 中无 ${workId}` });
            stat.red++;
          } else if (!titleMatches(head, work.titleEn)) {
            reds.push({
              at,
              code: "locator_work_mismatch",
              loc,
              msg: `首段「${head}」≠ ${workId} 的题名「${work.titleEn}」`,
            });
            stat.red++;
          }

          const anchored = hasAnchor(loc);

          // —— RED 2：ch. 后面跟的不是编号 ——
          if (CH_WITHOUT_NUMBER.test(loc)) {
            reds.push({ at, code: "chapter_without_number", loc, msg: "「ch. on ...」不是章号，须补编号" });
            stat.red++;
          }

          // —— RED 3：无编号锚 + 描述性措辞 = 这不是一个位置 ——
          if (!anchored) {
            const hit = DESCRIPTIVE_MARKERS.find((m) => m.re.test(tailText));
            if (hit) {
              reds.push({
                at,
                code: "locator_not_a_position",
                loc,
                msg: `无编号锚且含描述性措辞「${hit.label}」，指的是「关于什么的部分」而非位置`,
              });
              stat.red++;
            } else if (VAGUE_PLURAL.test(tailText)) {
              reds.push({
                at,
                code: "locator_vague_plural",
                loc,
                msg: "无编号锚且用复数「chapters/sections/passages」，范围不可核",
              });
              stat.red++;
            }
          }

          // —— 举证缺口：靠篇名/章题定位者，必须在 sources.md 声明编本与目录层级 ——
          const titleSegs = tail.filter(looksLikeTitleSegment);
          for (const t of titleSegs) {
            if (!decl.body.includes(t)) {
              needDecl.push({ at, code: "undeclared_title_segment", loc, seg: t });
              stat.decl++;
            }
          }
          // 声明可用 workId 或书名任一作键，全工具统一
          const declared = (w) => decl.body.includes(workId) || (w && decl.body.includes(w.titleEn)) || decl.body.includes(head);

          // vol. 定位必须写出卷题，否则「vol. VI」指哪一卷无从核对
          if (/\bvol\.\s*[IVXLCDM\d]/i.test(loc) && titleSegs.length === 0 && !declared(work)) {
            needDecl.push({ at, code: "undeclared_volume", loc, seg: head });
            stat.decl++;
          }
          // 通篇无编号锚、也无篇名 → 该作品须声明「无标准分章」
          if (!anchored && titleSegs.length === 0) {
            const key = work ? work.titleEn : workId;
            if (!(decl.body.includes(workId) || decl.body.includes(key))) {
              needDecl.push({ at, code: "undeclared_unnumbered_work", loc, seg: workId });
              stat.decl++;
            }
          }

          // 页码定位必须标版本：同一部书不同版次页码不同，不标版本第三方无从复核
          if (/\bpp?\.\s*\d/i.test(loc) && !declared(work)) {
            needDecl.push({ at, code: "undeclared_pagination", loc, seg: `${workId}（页码定位须标版次）` });
            stat.decl++;
          }

          // —— 提示：跨度 ≥3 的章/讲范围定位（页码范围不算，页数多是常态）——
          const rangeScope = tailText.replace(/\bpp?\.\s*\d+\s*[-–]\s*\d+/gi, "");
          const range = rangeScope.match(/\b(?:[IVXLCDM]+|\d+)\s*[-–]\s*(?:[IVXLCDM]+|\d+)\b/);
          if (range) {
            const [a, b] = range[0].split(/[-–]/).map((s) => romanToArabic(s.trim()));
            if (b - a >= 2) {
              warns.push({ at, code: "locator_range_wide", loc, msg: `跨 ${b - a + 1} 个单元，建议收窄到单章/单讲` });
              stat.warn++;
            }
          }
        }
      }
    }
  }

  return { reds, needDecl, warns, perPerson };
}

function main() {
  const args = process.argv.slice(2);
  const batchDir = args.find((a) => !a.startsWith("--"));
  if (!batchDir) {
    console.error("用法: node tools/locator-lint.mjs <batchDir> [--works <works.json>]");
    process.exit(2);
  }
  const wi = args.indexOf("--works");
  const worksPath = wi >= 0 ? args[wi + 1] : "public/data/works.json";

  const tsPath = path.join(batchDir, "thought-systems.json");
  if (!fs.existsSync(tsPath)) {
    console.error(`找不到 ${tsPath}`);
    process.exit(2);
  }

  const works = loadWorks(worksPath);
  // 本批新提作品也算数（proposed-works.json 里的会随批入 works.json）
  const proposedPath = path.join(batchDir, "proposed-works.json");
  if (fs.existsSync(proposedPath)) {
    const raw = readJson(proposedPath);
    for (const w of Array.isArray(raw) ? raw : raw.items || []) works.set(w.id, w);
  }

  const decl = loadDeclarations(batchDir);
  const items = readJson(tsPath).items || [];
  const { reds, needDecl, warns, perPerson } = lintItems(items, works, decl.body);

  // —— 报告 ——
  const totalEv = [...perPerson.values()].reduce((a, b) => a + b.total, 0);
  console.log(`locator 门：${items.length} 位，${totalEv} 条 evidence`);
  console.log(`  批次目录：${batchDir}`);
  console.log(`  sources.md「locator 版本声明」小节：${decl.present ? "已存在" : "❌ 缺失"}`);
  console.log("");

  if (reds.length) {
    console.log(`🔴 RED ${reds.length} 条（禁止 admit）`);
    for (const r of reds) console.log(`   [${r.code}] ${r.at}\n      locator: ${r.loc}\n      ${r.msg}`);
    console.log("");
  }
  if (needDecl.length) {
    const bySeg = new Map();
    for (const d of needDecl) {
      const k = `${d.code}::${d.seg}`;
      if (!bySeg.has(k)) bySeg.set(k, { ...d, n: 0 });
      bySeg.get(k).n++;
    }
    console.log(`📋 举证缺口 ${needDecl.length} 条 / ${bySeg.size} 个待声明项（禁止 admit）`);
    console.log(`   在 ${path.join(batchDir, "sources.md")} 加「## locator 版本声明」小节，逐项写明所据编本与目录层级：`);
    for (const d of bySeg.values()) console.log(`   [${d.code}] ×${d.n}  「${d.seg}」`);
    console.log("");
  }
  if (warns.length) {
    console.log(`🟡 提示 ${warns.length} 条（不阻断）`);
    for (const w of warns) console.log(`   [${w.code}] ${w.at}: ${w.loc} —— ${w.msg}`);
    console.log("");
  }

  console.log("按人小结：");
  for (const [pid, s] of perPerson) {
    const flag = s.red ? "🔴" : s.decl ? "📋" : s.warn ? "🟡" : "🟢";
    console.log(`   ${flag} ${pid}  evidence ${s.total} ｜ RED ${s.red} ｜ 待声明 ${s.decl} ｜ 提示 ${s.warn}`);
  }

  const blocked = reds.length > 0 || needDecl.length > 0;
  console.log("");
  console.log(blocked ? "❌ locator 门未过：禁止 admit" : "✅ locator 门通过");
  process.exit(blocked ? 1 : 0);
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) main();
