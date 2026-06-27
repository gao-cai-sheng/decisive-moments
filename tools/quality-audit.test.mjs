import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { auditPhilosopher, runAudit, jaccardChars } from "./quality-audit.mjs";

const worksById = new Map([
  ["sage-work", { id: "sage-work", philosopherId: "sage" }],
  ["other-work", { id: "other-work", philosopherId: "someoneelse" }],
]);

// ---- 构造助手：默认产出"干净"内容，按需用 overrides 注入问题 ----
function ev(over = {}) {
  return {
    id: over.id || "sage:evidence:001",
    titleZh: "证据标题",
    summaryZh: over.summaryZh ?? "这是一段足够长的证据概括，超过二十字以满足最小长度要求。",
    source: {
      workId: "sage-work",
      locator: "第一章：开篇段",
      excerptStatus: "summary_only",
      ...(over.source || {}),
    },
  };
}
function claim(over = {}) {
  return {
    id: over.id || "sage:claim:001",
    titleZh: over.titleZh || "主张甲",
    claimZh: over.claimZh || "智慧来自对经验的反复省察与提炼。",
    explanationZh: "这是一段足够长的解释文字，用于满足最小长度的硬性要求。",
    themeIds: over.themeIds || ["ethics"],
    weight: over.weight ?? 2,
    evidence: over.evidence || [ev()],
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
  });
});
