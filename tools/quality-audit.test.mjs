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
function ev(over = {}) {
  return {
    id: over.id || "sage:evidence:001",
    titleZh: "证据标题",
    // 默认 summaryZh 达到标准档（>=40 字），干净数据不触发 summary_thin
    summaryZh: over.summaryZh ?? "这是一段足够长的证据概括文字，长度超过四十个汉字，用以满足标准档的厚度目标而不触发偏薄告警。",
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
    claimZh: over.claimZh || "智慧来自对经验的反复省察与提炼。",
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

  it("missing_locator（无 locator 且 excerptStatus 非 none）", () => {
    const p = problem({ id: "sage:problem:001",
      claims: [claim({ id: "c1", titleZh: "甲", weight: 2, evidence: [ev({ id: "e1", source: { locator: "", excerptStatus: "summary_only" } }), ev({ id: "e2" })] }),
               claim({ id: "c2", titleZh: "乙", weight: 1 })] });
    const d = philosopher([p, problem({ id: "sage:problem:002" }), problem({ id: "sage:problem:003" })]);
    expect(codes(d)).toContain("missing_locator");
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
