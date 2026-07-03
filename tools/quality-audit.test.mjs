import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { auditPhilosopher, runAudit, runAuditBatch, shouldFail, jaccardChars } from "./quality-audit.mjs";

const worksById = new Map([
  ["sage-work", { id: "sage-work", philosopherId: "sage" }],
  ["other-work", { id: "other-work", philosopherId: "someoneelse" }],
]);

// ---- 构造助手：默认产出"干净"内容，按需用 overrides 注入问题 ----
const SUMMARY_POOL = [
  "这一证据聚焦经验如何校正判断，并把德性理解为长期实践中逐渐稳定的能力。",
  "材料强调制度安排对行动选择的限制，说明责任不能脱离具体场景来抽象处理。",
  "文本把知识形成放在公共讨论中观察，突出理由交换和可修正性的作用。",
  "段落分析欲望、习惯与训练之间的关系，用来说明伦理能力需要持续培养。",
  "论证从语言用法入手，指出概念意义要通过实际判断和生活形式来确认。",
  "作者借历史案例说明政治权威需要公共理由，而不能只诉诸传统身份。",
  "相关章节讨论自然秩序与人的技艺如何互相限定，避免把理论化成空洞原则。",
  "此处把教育视为塑造判断力的过程，强调学习者要在行动后果中获得理解。",
  "材料展现个体经验与共同规范之间的张力，说明自由必须接受责任检验。",
  "段落围绕解释、证据与信念转换展开，显示思想系统内部的层次关系。",
  "文本分析社会分工造成的视角差异，并把正义问题放入具体生活结构中考察。",
  "论述强调批判不是简单否定，而是在保留问题压力时重新安排概念关系。",
];
function defaultSummaryFor(id) {
  const s = String(id || "sage:evidence:001");
  let n = 0;
  let h = 0;
  for (const ch of s) {
    n += ch.charCodeAt(0);
    h = (h * 31 + ch.charCodeAt(0)) % 1000000;
  }
  return `${SUMMARY_POOL[n % SUMMARY_POOL.length]}此证据的差异尾码为${h}。`;
}
function ev(over = {}) {
  const id = over.id || "sage:evidence:001";
  return {
    id,
    titleZh: "证据标题",
    // 默认 summaryZh 达到标准档（>=40 字），且相互差异足够，干净数据不触发相似度规则
    summaryZh: over.summaryZh ?? defaultSummaryFor(id),
    source: {
      workId: "sage-work",
      locator: "第一章：开篇段",
      excerptStatus: "summary_only",
      ...(over.source || {}),
    },
  };
}
function claim(over = {}) {
  const cid = over.id || "sage:claim:001";
  return {
    id: cid,
    titleZh: over.titleZh || "主张甲",
    claimZh: over.claimZh || `智慧来自对经验的反复省察与提炼，并在 ${cid} 的论证位置上获得具体含义。`,
    explanationZh: "这是一段足够长的解释文字，用于满足最小长度的硬性要求。",
    themeIds: over.themeIds || ["ethics"],
    weight: over.weight ?? 2,
    // 默认每 claim 挂 2 条 evidence（标准档），干净数据不触发 thin_evidence
    evidence: over.evidence || [ev({ id: `${cid}:e1` }), ev({ id: `${cid}:e2` })],
  };
}
function problem(over = {}) {
  const pid = over.id || "sage:problem:001";
  // 默认两 claim 的标题/ID 按 problem 命名空间唯一，避免跨 problem 误判重复
  return {
    id: pid,
    titleZh: "问题甲",
    questionZh: over.questionZh || "人应如何看待知识与德性之间的关系？",
    summaryZh: "这是一段足够长的问题概括，超过二十字以满足最小长度要求。",
    themeIds: over.themeIds || ["ethics"],
    weight: 2,
    claims: over.claims || [claim({ id: `${pid}:claim:1`, titleZh: `${pid}-甲`, weight: 2 }),
                            claim({ id: `${pid}:claim:2`, titleZh: `${pid}-乙`, weight: 1 })],
  };
}
function philosopher(problems) {
  return { id: "sage", thoughtSystem: { problems } };
}
function cleanPhilosopher() {
  return philosopher([
    problem({ id: "sage:problem:001" }),
    problem({ id: "sage:problem:002" }),
    problem({ id: "sage:problem:003" }),
  ]);
}
function codes(detail) {
  return auditPhilosopher(detail, worksById).findings.map((f) => f.code);
}

describe("jaccardChars", () => {
  it("相同文本接近 1，完全不同接近 0", () => {
    expect(jaccardChars("天行有常", "天行有常")).toBe(1);
    expect(jaccardChars("天行有常", "ABCDEFG")).toBe(0);
  });
});

describe("quality-audit：干净数据应零问题", () => {
  it("标准三问题全合规 → 无 findings", () => {
    expect(codes(cleanPhilosopher())).toEqual([]);
  });
  it("无 thoughtSystem → hasTS=false 且无 findings", () => {
    const r = auditPhilosopher({ id: "sage" }, worksById);
    expect(r.hasTS).toBe(false);
    expect(r.findings).toEqual([]);
  });
});

describe("quality-audit：每类问题都必须被抓到", () => {
  it("problems_lt_3", () => {
    const d = philosopher([problem({ id: "sage:problem:001" }), problem({ id: "sage:problem:002" })]);
    expect(codes(d)).toContain("problems_lt_3");
  });

  it("claims_lt_2", () => {
    const p = problem({ id: "sage:problem:001", claims: [claim()] });
    const d = philosopher([p, problem({ id: "sage:problem:002" }), problem({ id: "sage:problem:003" })]);
    expect(codes(d)).toContain("claims_lt_2");
  });

  it("evidence_lt_2（两 claim 但合计只 1 evidence）", () => {
    const p = problem({
      id: "sage:problem:001",
      claims: [
        claim({ id: "c1", titleZh: "甲", weight: 2, evidence: [ev({ id: "e1" })] }),
        claim({ id: "c2", titleZh: "乙", weight: 1, evidence: [] }),
      ],
    });
    const d = philosopher([p, problem({ id: "sage:problem:002" }), problem({ id: "sage:problem:003" })]);
    expect(codes(d)).toContain("evidence_lt_2");
  });

  it("weight_uniform（两 claim 同权重）", () => {
    const p = problem({
      id: "sage:problem:001",
      claims: [claim({ id: "c1", titleZh: "甲", weight: 2 }), claim({ id: "c2", titleZh: "乙", weight: 2 })],
    });
    const d = philosopher([p, problem({ id: "sage:problem:002" }), problem({ id: "sage:problem:003" })]);
    expect(codes(d)).toContain("weight_uniform");
  });

  it("claim_restates_question（claimZh 抄题目）", () => {
    const q = "人应如何看待知识与德性之间的关系？";
    const p = problem({
      id: "sage:problem:001",
      questionZh: q,
      claims: [claim({ id: "c1", titleZh: "甲", weight: 2, claimZh: q }),
               claim({ id: "c2", titleZh: "乙", weight: 1 })],
    });
    const d = philosopher([p, problem({ id: "sage:problem:002" }), problem({ id: "sage:problem:003" })]);
    expect(codes(d)).toContain("claim_restates_question");
  });

  it("duplicate_claim（同哲人两 claim 同标题）", () => {
    const p1 = problem({ id: "sage:problem:001",
      claims: [claim({ id: "c1", titleZh: "重复标题", weight: 2 }), claim({ id: "c2", titleZh: "别的", weight: 1 })] });
    const p2 = problem({ id: "sage:problem:002",
      claims: [claim({ id: "c3", titleZh: "重复标题", weight: 2 }), claim({ id: "c4", titleZh: "再一个", weight: 1 })] });
    const d = philosopher([p1, p2, problem({ id: "sage:problem:003" })]);
    expect(codes(d)).toContain("duplicate_claim");
  });

  it("summary_too_short", () => {
    const p = problem({ id: "sage:problem:001",
      claims: [claim({ id: "c1", titleZh: "甲", weight: 2, evidence: [ev({ id: "e1", summaryZh: "太短" }), ev({ id: "e2" })] }),
               claim({ id: "c2", titleZh: "乙", weight: 1 })] });
    const d = philosopher([p, problem({ id: "sage:problem:002" }), problem({ id: "sage:problem:003" })]);
    expect(codes(d)).toContain("summary_too_short");
  });

  it("fake_public_domain（标 public_domain 却无原文）", () => {
    const p = problem({ id: "sage:problem:001",
      claims: [claim({ id: "c1", titleZh: "甲", weight: 2, evidence: [ev({ id: "e1", source: { excerptStatus: "public_domain" } }), ev({ id: "e2" })] }),
               claim({ id: "c2", titleZh: "乙", weight: 1 })] });
    const d = philosopher([p, problem({ id: "sage:problem:002" }), problem({ id: "sage:problem:003" })]);
    expect(codes(d)).toContain("fake_public_domain");
  });

  it("excerpt_status_mismatch（有原文却非 public_domain）", () => {
    const p = problem({ id: "sage:problem:001",
      claims: [claim({ id: "c1", titleZh: "甲", weight: 2, evidence: [ev({ id: "e1", source: { excerptStatus: "summary_only", publicDomainExcerptZh: "天行有常" } }), ev({ id: "e2" })] }),
               claim({ id: "c2", titleZh: "乙", weight: 1 })] });
    const d = philosopher([p, problem({ id: "sage:problem:002" }), problem({ id: "sage:problem:003" })]);
    expect(codes(d)).toContain("excerpt_status_mismatch");
  });

  it("unknown_workid", () => {
    const p = problem({ id: "sage:problem:001",
      claims: [claim({ id: "c1", titleZh: "甲", weight: 2, evidence: [ev({ id: "e1", source: { workId: "ghost-work", excerptStatus: "summary_only" } }), ev({ id: "e2" })] }),
               claim({ id: "c2", titleZh: "乙", weight: 1 })] });
    const d = philosopher([p, problem({ id: "sage:problem:002" }), problem({ id: "sage:problem:003" })]);
    expect(codes(d)).toContain("unknown_workid");
  });

  it("workid_other_philosopher", () => {
    const p = problem({ id: "sage:problem:001",
      claims: [claim({ id: "c1", titleZh: "甲", weight: 2, evidence: [ev({ id: "e1", source: { workId: "other-work", excerptStatus: "summary_only" } }), ev({ id: "e2" })] }),
               claim({ id: "c2", titleZh: "乙", weight: 1 })] });
    const d = philosopher([p, problem({ id: "sage:problem:002" }), problem({ id: "sage:problem:003" })]);
    expect(codes(d)).toContain("workid_other_philosopher");
  });

  it("vague_locator", () => {
    const p = problem({ id: "sage:problem:001",
      claims: [claim({ id: "c1", titleZh: "甲", weight: 2, evidence: [ev({ id: "e1", source: { locator: "天志上、中、下", excerptStatus: "summary_only" } }), ev({ id: "e2" })] }),
               claim({ id: "c2", titleZh: "乙", weight: 1 })] });
    const d = philosopher([p, problem({ id: "sage:problem:002" }), problem({ id: "sage:problem:003" })]);
    expect(codes(d)).toContain("vague_locator");
  });

  it("missing_locator（无 locator 且 excerptStatus 非 none）→ RED", () => {
    const p = problem({ id: "sage:problem:001",
      claims: [claim({ id: "c1", titleZh: "甲", weight: 2, evidence: [ev({ id: "e1", source: { locator: "", excerptStatus: "summary_only" } }), ev({ id: "e2" })] }),
               claim({ id: "c2", titleZh: "乙", weight: 1 })] });
    const d = philosopher([p, problem({ id: "sage:problem:002" }), problem({ id: "sage:problem:003" })]);
    const r = auditPhilosopher(d, worksById);
    expect(r.findings.map((f) => f.code)).toContain("missing_locator");
    expect(r.findings.find((f) => f.code === "missing_locator")?.sev).toBe("RED");
  });

  it("thin_evidence（claim 仅 1 evidence，过 RED 底线但低于标准档）", () => {
    const p = problem({
      id: "sage:problem:001",
      claims: [claim({ id: "c1", titleZh: "甲", weight: 2, evidence: [ev({ id: "e1" })] }),
               claim({ id: "c2", titleZh: "乙", weight: 1, evidence: [ev({ id: "e2" })] })],
    });
    const d = philosopher([p, problem({ id: "sage:problem:002" }), problem({ id: "sage:problem:003" })]);
    const cs = codes(d);
    expect(cs).toContain("thin_evidence");     // 每 claim 仅 1 条 → YELLOW
    expect(cs).not.toContain("evidence_lt_2"); // 问题合计 2 条 → 不触发 RED 底线
  });

  it("summary_thin（summaryZh 介于 20 与 40 之间 → YELLOW 而非 RED）", () => {
    const p = problem({ id: "sage:problem:001",
      claims: [claim({ id: "c1", titleZh: "甲", weight: 2, evidence: [ev({ id: "e1", summaryZh: "刚好超过二十字但不足四十字的偏薄概括文字。" }), ev({ id: "e2" })] }),
               claim({ id: "c2", titleZh: "乙", weight: 1 })] });
    const d = philosopher([p, problem({ id: "sage:problem:002" }), problem({ id: "sage:problem:003" })]);
    const cs = codes(d);
    expect(cs).toContain("summary_thin");
    expect(cs).not.toContain("summary_too_short");
  });

  it("template_claim（模板化 claim 直接 RED）", () => {
    const p = problem({ id: "sage:problem:001",
      claims: [claim({ id: "c1", titleZh: "甲", weight: 2, claimZh: "某某在“知识问题”中提出基础性立场，说明其理论问题的出发点。" }),
               claim({ id: "c2", titleZh: "乙", weight: 1 })] });
    const d = philosopher([p, problem({ id: "sage:problem:002" }), problem({ id: "sage:problem:003" })]);
    expect(codes(d)).toContain("template_claim");
  });

  it("template_foundational_stance（claimZh 含基础性立场套话直接 RED）", () => {
    const p = problem({ id: "sage:problem:001",
      claims: [claim({ id: "c1", titleZh: "甲", weight: 2, claimZh: "这位哲人在伦理问题上提出基础性立场，说明其理论问题的出发点。" }),
               claim({ id: "c2", titleZh: "乙", weight: 1 })] });
    const d = philosopher([p, problem({ id: "sage:problem:002" }), problem({ id: "sage:problem:003" })]);
    expect(codes(d)).toContain("template_foundational_stance");
  });

  it("template_evidence_summary（复述 locator 的证据摘要直接 RED）", () => {
    const p = problem({ id: "sage:problem:001",
      claims: [claim({ id: "c1", titleZh: "甲", weight: 2, evidence: [ev({ id: "e1", summaryZh: "某某在第一章中提供该命题的原典定位，用于支撑这条命题的文本依据。" }), ev({ id: "e2" })] }),
               claim({ id: "c2", titleZh: "乙", weight: 1 })] });
    const d = philosopher([p, problem({ id: "sage:problem:002" }), problem({ id: "sage:problem:003" })]);
    expect(codes(d)).toContain("template_evidence_summary");
  });

  it("template_primary_locator（summaryZh 含提供该命题的原典定位套话直接 RED）", () => {
    const p = problem({ id: "sage:problem:001",
      claims: [claim({ id: "c1", titleZh: "甲", weight: 2, evidence: [
        ev({ id: "e1", summaryZh: "文本在第一章中提供该命题的原典定位，但没有说明任何实际哲学内容。" }),
        ev({ id: "e2" }),
      ] }), claim({ id: "c2", titleZh: "乙", weight: 1 })] });
    const d = philosopher([p, problem({ id: "sage:problem:002" }), problem({ id: "sage:problem:003" })]);
    expect(codes(d)).toContain("template_primary_locator");
  });

  it("duplicate_claim_text（同一 problem 内 claimZh 精确重复直接 RED）", () => {
    const repeated = "自由不是抽象口号，而是在制度与教育安排中被具体训练出来的责任能力。";
    const p = problem({ id: "sage:problem:001",
      claims: [claim({ id: "c1", titleZh: "甲", weight: 2, claimZh: repeated }),
               claim({ id: "c2", titleZh: "乙", weight: 1, claimZh: repeated })] });
    const d = philosopher([p, problem({ id: "sage:problem:002" }), problem({ id: "sage:problem:003" })]);
    expect(codes(d)).toContain("duplicate_claim_text");
  });

  it("workid_in_summary（summaryZh 粘贴 evidence workId 子串直接 RED）", () => {
    const p = problem({ id: "sage:problem:001",
      claims: [claim({ id: "c1", titleZh: "甲", weight: 2, evidence: [
        ev({ id: "e1", summaryZh: "该证据依据 sage-work 的核心段落和问题结构，说明主张如何获得文本支撑。" }),
        ev({ id: "e2" }),
      ] }), claim({ id: "c2", titleZh: "乙", weight: 1 })] });
    const d = philosopher([p, problem({ id: "sage:problem:002" }), problem({ id: "sage:problem:003" })]);
    expect(codes(d)).toContain("workid_in_summary");
  });

  it("template_similarity（同一哲人 summaryZh 两两字符 Jaccard 均值过高直接 RED）", () => {
    const similarEvidence = (id) => ev({ id, summaryZh: `该证据依据核心段落和问题结构，说明文本如何支撑相关主张，并保持几乎相同的模板表达${id}。` });
    const probs = [1, 2, 3].map((n) => problem({ id: `sage:problem:00${n}`, claims: [
      claim({ id: `p${n}c1`, titleZh: `甲${n}`, weight: 2, evidence: [similarEvidence(`p${n}e1`), similarEvidence(`p${n}e2`)] }),
      claim({ id: `p${n}c2`, titleZh: `乙${n}`, weight: 1, evidence: [similarEvidence(`p${n}e3`), similarEvidence(`p${n}e4`)] }),
    ] }));
    expect(codes(philosopher(probs))).toContain("template_similarity");
  });

  it("malformed_punct（summaryZh 含病句标点 '。，' 直接 RED）", () => {
    const p = problem({ id: "sage:problem:001",
      claims: [claim({ id: "c1", titleZh: "甲", weight: 2, evidence: [
        ev({ id: "e1", summaryZh: "这条摘要先以句号收束。，随后又接逗号，显示机械拼接痕迹。" }),
        ev({ id: "e2" }),
      ] }), claim({ id: "c2", titleZh: "乙", weight: 1 })] });
    const d = philosopher([p, problem({ id: "sage:problem:002" }), problem({ id: "sage:problem:003" })]);
    expect(codes(d)).toContain("malformed_punct");
  });

  it("shared_suffix（同一哲人至少 3 条 summaryZh 共享 >=12 字符尾缀直接 RED）", () => {
    const suffix = "共同尾缀用于机械凑长。";
    const mk = (id, head) => ev({ id, summaryZh: `${head}，并在真实段落中说明不同论点的文本根据。${suffix}` });
    const p = problem({ id: "sage:problem:001", claims: [
      claim({ id: "c1", titleZh: "甲", weight: 2, evidence: [mk("e1", "第一条证据讨论经验判断"), mk("e2", "第二条证据分析制度语境")] }),
      claim({ id: "c2", titleZh: "乙", weight: 1, evidence: [mk("e3", "第三条证据转向语言用法"), ev({ id: "e4" })] }),
    ] });
    const d = philosopher([p, problem({ id: "sage:problem:002" }), problem({ id: "sage:problem:003" })]);
    expect(codes(d)).toContain("shared_suffix");
  });
});

describe("runAudit：整目录扫描与分级", () => {
  it("扫描含问题与干净哲人的目录，红/绿分类正确", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "qa-"));
    fs.mkdirSync(path.join(dir, "philosophers"), { recursive: true });
    fs.writeFileSync(path.join(dir, "works.json"), JSON.stringify([{ id: "sage-work", philosopherId: "sage" }]));
    fs.writeFileSync(path.join(dir, "themes.json"), JSON.stringify([{ id: "ethics" }, { id: "metaphysics" }]));
    // 一个干净哲人
    fs.writeFileSync(path.join(dir, "philosophers", "sage.json"), JSON.stringify(cleanPhilosopher()));
    // 一个有 RED 的哲人（problems<3）
    const bad = { id: "sage2", thoughtSystem: { problems: [problem({ id: "sage2:problem:001" })] } };
    fs.writeFileSync(path.join(dir, "philosophers", "sage2.json"), JSON.stringify(bad));

    const r = runAudit({ dataDir: dir });
    expect(r.totals.philosophersWithThoughtSystem).toBe(2);
    expect(r.greenPeople).toContain("sage");
    expect(r.redPeople).toContain("sage2");
    expect(r.redByCode.problems_lt_3).toBeGreaterThanOrEqual(1);
    // themes.json 里 metaphysics 没人用 → 应被标无人覆盖
    expect(r.uncoveredThemes).toContain("metaphysics");
    // 逐字原文欠债：两位哲人的 evidence 全为 summary_only → excerptDebt 与分布应统计到
    expect(r.totals.excerptDebt).toBeGreaterThan(0);
    expect(r.excerptStatusCount.summary_only).toBe(r.totals.excerptDebt);
  });
});

describe("shouldFail：写前门退出决策", () => {
  const mk = (red, yellowCodes = []) => ({
    totals: { red, yellow: yellowCodes.length },
    findings: yellowCodes.map((code) => ({ pid: "x", sev: "YELLOW", code })),
  });

  it("有 RED → 任何模式都失败", () => {
    const r = mk(1);
    expect(shouldFail(r, {})).toBe(true);
    expect(shouldFail(r, { requireStandard: true })).toBe(true);
  });
  it("干净 → 都通过", () => {
    const r = mk(0);
    expect(shouldFail(r, {})).toBe(false);
    expect(shouldFail(r, { strict: true })).toBe(false);
    expect(shouldFail(r, { requireStandard: true })).toBe(false);
  });
  it("仅标准档 YELLOW：默认过，--require-standard 阻断", () => {
    const r = mk(0, ["thin_evidence", "summary_thin"]);
    expect(shouldFail(r, {})).toBe(false);
    expect(shouldFail(r, { requireStandard: true })).toBe(true);
    expect(shouldFail(r, { strict: true })).toBe(true);
  });
  it("weight_uniform 也算标准档阻断项", () => {
    expect(shouldFail(mk(0, ["weight_uniform"]), { requireStandard: true })).toBe(true);
  });
  it("非标准档 YELLOW（如 vague_locator）不被 --require-standard 阻断", () => {
    expect(shouldFail(mk(0, ["vague_locator"]), { requireStandard: true })).toBe(false);
  });
});

describe("runAuditBatch：审计暂存 batch 的 thought-systems.json", () => {
  function writeBatch(dir, items) {
    fs.writeFileSync(path.join(dir, "works.json"), JSON.stringify([{ id: "sage-work", philosopherId: "sage" }]));
    const bf = path.join(dir, "thought-systems.json");
    fs.writeFileSync(bf, JSON.stringify({ schemaVersion: 1, items }));
    return bf;
  }
  // batch item 形状：{ philosopherId, problems }
  const itemFrom = (probs) => ({ philosopherId: "sage", problems: probs });

  it("标准档 batch（2 evidence/claim、40字摘要）→ 无阻断项", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "qab-"));
    const clean = cleanPhilosopher().thoughtSystem.problems;
    const bf = writeBatch(dir, [itemFrom(clean)]);
    const r = runAuditBatch({ batchFile: bf, dataDir: dir });
    expect(r.totals.red).toBe(0);
    expect(shouldFail(r, { requireStandard: true })).toBe(false);
  });

  it("底线 batch（每 claim 仅 1 evidence）→ thin_evidence，--require-standard 阻断", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "qab-"));
    const thin = [
      problem({ id: "sage:problem:001", claims: [claim({ id: "c1", titleZh: "甲", weight: 2, evidence: [ev({ id: "e1" })] }),
                                                 claim({ id: "c2", titleZh: "乙", weight: 1, evidence: [ev({ id: "e2" })] })] }),
      problem({ id: "sage:problem:002", claims: [claim({ id: "c3", titleZh: "丙", weight: 2, evidence: [ev({ id: "e3" })] }),
                                                 claim({ id: "c4", titleZh: "丁", weight: 1, evidence: [ev({ id: "e4" })] })] }),
      problem({ id: "sage:problem:003", claims: [claim({ id: "c5", titleZh: "戊", weight: 2, evidence: [ev({ id: "e5" })] }),
                                                 claim({ id: "c6", titleZh: "己", weight: 1, evidence: [ev({ id: "e6" })] })] }),
    ];
    const bf = writeBatch(dir, [itemFrom(thin)]);
    const r = runAuditBatch({ batchFile: bf, dataDir: dir });
    expect(r.totals.red).toBe(0);                       // 过硬下限
    expect(r.yellowByCode.thin_evidence).toBeGreaterThan(0);
    expect(shouldFail(r, { requireStandard: true })).toBe(true); // 但标准档硬门拦住
  });
});
