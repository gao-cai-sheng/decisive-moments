import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { admitThoughtSystems } from "./admit-kimi-thought-systems.mjs";
import { philosopherSchema } from "../src/data/schemas.ts";

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2));
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function makeDataDir(detail = basePhilosopher(), works = [baseWork()]) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "admit-kimi-data-"));
  writeJson(path.join(dir, "philosophers", detail.id + ".json"), detail);
  writeJson(path.join(dir, "works.json"), works);
  return dir;
}

function makeBatch(thoughtSystemItem = laoziThoughtSystemItem()) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "admit-kimi-batch-"));
  fs.writeFileSync(path.join(dir, "brief.md"), "# Research Brief\n\n## Intended Use\nphilosopher profile / thoughtSystem\n");
  fs.writeFileSync(
    path.join(dir, "sources.md"),
    "# Sources\n\n## S001: Laozi source\n\n- Author/Organization: Archive\n- URL: https://example.com/laozi\n- Accessed: 2026-06-26\n- Source type: scholarly\n- Reliability: high\n- Useful for: thought system\n- Limits: test fixture\n",
  );
  fs.writeFileSync(path.join(dir, "notes.md"), "# Notes\n");
  fs.writeFileSync(path.join(dir, "open-questions.md"), "# Open Questions\n");
  writeJson(path.join(dir, "claims.json"), {
    schemaVersion: 1,
    items: [
      {
        id: "laozi:fact:001",
        subject: "Laozi",
        subjectZh: "老子",
        claimZh: "《老子》传统上归于老子名下。",
        type: "fact",
        sourceIds: ["S001"],
        confidence: "medium",
        reviewStatus: "needs_human_review",
        notesZh: "仅作候选事实。",
      },
    ],
  });
  writeJson(path.join(dir, "thought-systems.json"), {
    schemaVersion: 1,
    items: [thoughtSystemItem],
  });
  return dir;
}

function basePhilosopher() {
  return {
    id: "laozi",
    names: { zh: "老子", en: "Laozi" },
    life: { display: "约前 571—前 471", birth: -571, death: -471 },
    civilization: "chinese",
    traditions: ["daoism"],
    periods: ["first_release"],
    themes: ["metaphysics", "politics", "life_death"],
    keywordsZh: ["形而上学", "政治", "生死"],
    oneLineZh: "以道、无为和反强制秩序开辟道家思想。",
    influenceWeight: 1,
    reviewStatus: "draft",
    summaryZh: "老子以道作为万物生成和政治节制的根本尺度，强调无为、柔弱和反身性的治理智慧。",
    works: ["laozi-primary-work"],
    sourceNotes: [{ label: "draft", noteZh: "条目需要人工核对作品、年代和概念表述。" }],
  };
}

function baseWork() {
  return {
    id: "laozi-primary-work",
    philosopherId: "laozi",
    titleZh: "老子代表文本",
    titleEn: "Laozi primary text",
    noteZh: "测试用作品条目。",
  };
}

function laoziThoughtSystemItem() {
  return {
    philosopherId: "laozi",
    problems: [
      {
        id: "laozi:problem:001",
        titleZh: "道与命名",
        questionZh: "道能否被固定语言完整把握？",
        summaryZh: "老子思想把道、名与语言限度联系起来，构成形而上学和语言问题的核心。",
        themeIds: ["metaphysics", "language"],
        weight: 3,
        sourceIds: ["S001"],
        claims: [
          {
            id: "laozi:claim:001",
            titleZh: "道不可被定名穷尽",
            claimZh: "道不是普通对象，不能被固定名称完全把握。",
            explanationZh: "这一主张使老子的形而上学同时具有语言批判意味。",
            themeIds: ["metaphysics", "language"],
            weight: 3,
            sourceIds: ["S001"],
            evidence: [
              {
                id: "laozi:evidence:001",
                titleZh: "《老子》开篇",
                summaryZh: "开篇围绕道与名的关系展开，可作为语言限度问题的证据。",
                source: {
                  workId: "laozi-primary-work",
                  locator: "第一章",
                  excerptStatus: "summary_only",
                },
                sourceIds: ["S001"],
              },
            ],
          },
        ],
      },
    ],
    sourceIds: ["S001"],
  };
}

describe("admitThoughtSystems", () => {
  it("dry-runs by default without changing philosopher files", () => {
    const dataDir = makeDataDir();
    const batchDir = makeBatch();
    const philosopherPath = path.join(dataDir, "philosophers", "laozi.json");

    const result = admitThoughtSystems({ batchDir, dataDir });

    expect(result).toEqual({
      dryRun: true,
      planned: [{ philosopherId: "laozi", action: "add", file: philosopherPath }],
      written: [],
    });
    expect(readJson(philosopherPath).thoughtSystem).toBeUndefined();
  });

  it("writes reviewed thought systems and strips Kimi-only sourceIds", () => {
    const dataDir = makeDataDir();
    const batchDir = makeBatch();
    const philosopherPath = path.join(dataDir, "philosophers", "laozi.json");

    const result = admitThoughtSystems({ batchDir, dataDir, write: true });
    const detail = readJson(philosopherPath);

    expect(result.dryRun).toBe(false);
    expect(result.written).toEqual([{ philosopherId: "laozi", file: philosopherPath }]);
    expect(detail.thoughtSystem.problems).toHaveLength(1);
    expect(detail.thoughtSystem.problems[0].sourceIds).toBeUndefined();
    expect(detail.thoughtSystem.problems[0].claims[0].sourceIds).toBeUndefined();
    expect(detail.thoughtSystem.problems[0].claims[0].evidence[0].sourceIds).toBeUndefined();
    expect(() => philosopherSchema.parse(detail)).not.toThrow();
  });



  it("rejects evidence that references an unknown workId", () => {
    const dataDir = makeDataDir();
    const item = laoziThoughtSystemItem();
    item.problems[0].claims[0].evidence[0].source.workId = "laozi-daodejing-candidate";
    const batchDir = makeBatch(item);

    expect(() => admitThoughtSystems({ batchDir, dataDir })).toThrow(/unknown workId.*laozi-daodejing-candidate/);
  });



  it("rejects evidence that references another philosopher's workId", () => {
    const dataDir = makeDataDir(basePhilosopher(), [
      baseWork(),
      {
        id: "plato-primary-work",
        philosopherId: "plato",
        titleZh: "柏拉图代表文本",
        titleEn: "Plato primary text",
        noteZh: "测试用作品条目。",
      },
    ]);
    const item = laoziThoughtSystemItem();
    item.problems[0].claims[0].evidence[0].source.workId = "plato-primary-work";
    const batchDir = makeBatch(item);

    expect(() => admitThoughtSystems({ batchDir, dataDir })).toThrow(/workId belongs to another philosopher.*plato-primary-work/);
  });

  it("refuses to replace an existing thought system unless overwrite is explicit", () => {
    const existing = {
      ...basePhilosopher(),
      thoughtSystem: {
        problems: [
          {
            id: "laozi:existing:problem",
            titleZh: "既有问题",
            questionZh: "既有思想系统是否应被保护？",
            summaryZh: "这个夹具用于确认准入工具不会默认覆盖已有思想系统。",
            themeIds: ["metaphysics"],
            weight: 1,
            claims: [
              {
                id: "laozi:existing:claim",
                titleZh: "保护已有内容",
                claimZh: "默认准入不应覆盖已有思想系统。",
                explanationZh: "人工审核过的内容应通过显式 overwrite 才能替换。",
                themeIds: ["metaphysics"],
                weight: 1,
                evidence: [
                  {
                    id: "laozi:existing:evidence",
                    titleZh: "已有证据",
                    summaryZh: "这是一个满足 schema 的既有证据摘要。",
                    source: { excerptStatus: "summary_only" },
                  },
                ],
              },
            ],
          },
        ],
      },
    };
    const dataDir = makeDataDir(existing);
    const batchDir = makeBatch();

    expect(() => admitThoughtSystems({ batchDir, dataDir, write: true })).toThrow(/already has thoughtSystem/);
  });
});
