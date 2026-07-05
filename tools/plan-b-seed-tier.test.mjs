import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { philosopherIndexEntrySchema, philosopherSchema } from "../src/data/schemas.ts";
import { admitKimiBatch } from "./admit-kimi-batch.mjs";
import { runAudit } from "./quality-audit.mjs";

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + "\n");
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function standardPhilosopher(id = "plato") {
  return {
    tier: "standard",
    id,
    names: { zh: "柏拉图", en: "Plato" },
    life: { birth: -428, death: -348, display: "约前 428—前 348" },
    civilization: "ancient_greek",
    traditions: ["platonism"],
    periods: ["classical_antiquity"],
    themes: ["knowledge"],
    keywordsZh: ["理念论"],
    oneLineZh: "以理念论奠定西方哲学的问题框架。",
    influenceWeight: 3,
    reviewStatus: "reviewed",
    summaryZh: "柏拉图以对话录保存并重构苏格拉底问题，使理念论和城邦正义成为长期哲学主题。",
    works: [id + "-work"],
    sourceNotes: [{ label: "SEP Plato", url: "https://plato.stanford.edu/entries/plato/", noteZh: "身份与作品信息来源。" }],
  };
}

function seedPhilosopher(overrides = {}) {
  return {
    tier: "seed",
    id: "seed-sage",
    names: { zh: "种子贤者", en: "Seed Sage" },
    life: { birth: 100, death: 180, display: "100—180" },
    civilization: "chinese_classical",
    traditions: ["confucianism"],
    periods: ["seed_w1"],
    themes: ["knowledge"],
    keywordsZh: ["经学", "礼学"],
    oneLineZh: "以身份层占位连接中国哲学谱系，思想内容待标准档深化。",
    influenceWeight: 1,
    reviewStatus: "draft",
    summaryZh: "种子贤者用于测试种子档身份层：只记录可靠身份、生卒、传统、代表作和关系，不携带思想体系。该摘要长度足够支撑面板展示，并明确后续需要标准档深化。",
    works: ["seed-sage-work"],
    sourceNotes: [{ label: "CTP Seed Sage", url: "https://ctext.org/", noteZh: "用于身份层核对的权威来源条目。" }],
    ...overrides,
  };
}

function seedWork(id = "seed-sage-work") {
  return { id, philosopherId: "seed-sage", titleZh: "《种子代表作》", titleEn: "Seed Work", yearDisplay: "2nd c.", noteZh: "用于测试种子档代表作归属。" };
}

function makeDataDir(philosophers) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "seed-data-"));
  writeJson(path.join(dir, "public/data/philosophers.index.json"), philosophers.map(({ summaryZh, works, sourceNotes, thoughtSystem, ...index }) => index));
  writeJson(path.join(dir, "public/data/arguments.index.json"), []);
  writeJson(path.join(dir, "public/data/themes.json"), [{ id: "knowledge", zh: "知识", en: "Knowledge", aliasesZh: ["认识"] }]);
  writeJson(path.join(dir, "public/data/works.json"), philosophers.flatMap((p) => (p.works || []).map((id) => ({ id, philosopherId: p.id, titleZh: "作品", titleEn: "Work", noteZh: "测试作品。" }))));
  const philosopherIds = new Set(philosophers.map((philosopher) => philosopher.id));
  const seedRelationships = philosopherIds.has("seed-sage")
    ? [
        { id: "plato-seed-sage", from: "plato", to: "seed-sage", type: "reception", strength: 1, confidence: "low", themeIds: ["knowledge"], noteZh: "测试关系一。", reviewStatus: "draft" },
        { id: "seed-sage-plato", from: "seed-sage", to: "plato", type: "shared_problem", strength: 1, confidence: "low", themeIds: ["knowledge"], noteZh: "测试关系二。", reviewStatus: "draft" },
      ]
    : [];
  writeJson(path.join(dir, "public/data/relationships.json"), seedRelationships);
  for (const philosopher of philosophers) {
    writeJson(path.join(dir, "public/data/philosophers", philosopher.id + ".json"), philosopher);
  }
  return dir;
}

function makeSeedBatch(overrides = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "seed-batch-"));
  fs.writeFileSync(path.join(dir, "brief.md"), "# Seed batch\n\nidentity layer only\n");
  fs.writeFileSync(path.join(dir, "sources.md"), "# Sources\n\n## S001: CTP Seed Sage\n\n- URL: https://ctext.org/\n");
  fs.writeFileSync(path.join(dir, "notes.md"), "# Notes\n");
  fs.writeFileSync(path.join(dir, "open-questions.md"), "# Open Questions\n");
  writeJson(path.join(dir, "claims.json"), { schemaVersion: 1, items: [{ id: "seed-sage:fact:001", subject: "Seed Sage", subjectZh: "种子贤者", claimZh: "种子贤者是一个身份层测试条目。", type: "fact", sourceIds: ["S001"], confidence: "medium", reviewStatus: "needs_human_review", notesZh: "测试用。" }] });
  writeJson(path.join(dir, "proposed-philosophers.json"), { schemaVersion: 1, items: [seedPhilosopher(overrides.philosopher)] });
  writeJson(path.join(dir, "proposed-works.json"), { schemaVersion: 1, items: [seedWork()] });
  writeJson(path.join(dir, "proposed-relationships.json"), { schemaVersion: 1, items: [
    { id: "plato-seed-sage", from: "plato", to: "seed-sage", type: "reception", strength: 1, confidence: "low", themeIds: ["knowledge"], noteZh: "测试关系一。", reviewStatus: "draft" },
    { id: "seed-sage-plato", from: "seed-sage", to: "plato", type: "shared_problem", strength: 1, confidence: "low", themeIds: ["knowledge"], noteZh: "测试关系二。", reviewStatus: "draft" },
  ] });
  if (overrides.thoughtSystems) writeJson(path.join(dir, "thought-systems.json"), overrides.thoughtSystems);
  return dir;
}

describe("Plan B seed tier gates", () => {
  it("schema preserves standard and seed tiers and rejects unknown tiers", () => {
    expect(philosopherSchema.parse(standardPhilosopher()).tier).toBe("standard");
    expect(philosopherSchema.parse(seedPhilosopher()).tier).toBe("seed");
    expect(philosopherIndexEntrySchema.parse(seedPhilosopher()).tier).toBe("seed");
    expect(() => philosopherSchema.parse({ ...standardPhilosopher(), tier: "draft" })).toThrow();
  });

  it("validate-data hard-errors when a seed detail carries thoughtSystem", () => {
    const badSeed = seedPhilosopher({ thoughtSystem: { problems: [{ id: "seed:p1", titleZh: "问题", questionZh: "为何不能携带思想体系？", summaryZh: "种子档不能携带思想体系，此处用于触发硬错误。", themeIds: ["knowledge"], weight: 1, claims: [{ id: "seed:c1", titleZh: "主张", claimZh: "种子档不得混入思想内容。", explanationZh: "思想内容必须走标准档管线，此处用于验证硬错误。", themeIds: ["knowledge"], weight: 1, evidence: [{ id: "seed:e1", titleZh: "证据", summaryZh: "这条证据不应出现在种子档中，用于验证 validate-data 硬错误。", source: { excerptStatus: "summary_only", workId: "seed-sage-work", locator: "测试定位" } }] }] }] } });
    const root = makeDataDir([standardPhilosopher(), badSeed]);

    const result = spawnSync(process.execPath, [path.resolve("tools/validate-data.mjs")], { cwd: root, encoding: "utf8" });

    expect(result.status).not.toBe(0);
    expect(result.stderr + result.stdout).toMatch(/seed.*thoughtSystem/i);
  });

  it("quality-audit reports standard and seed counts separately", () => {
    const root = makeDataDir([standardPhilosopher(), seedPhilosopher()]);
    const report = runAudit({ dataDir: path.join(root, "public/data") });

    expect(report.totals.standardPeople).toBe(1);
    expect(report.totals.seedPeople).toBe(1);
  });

  it("admit --tier seed admits identity layer without thoughtSystem", () => {
    const dataRoot = makeDataDir([standardPhilosopher()]);
    const dataDir = path.join(dataRoot, "public/data");
    const batchDir = makeSeedBatch();

    const result = admitKimiBatch({ batchDir, dataDir, tier: "seed", write: true });
    const detail = readJson(path.join(dataDir, "philosophers/seed-sage.json"));
    const index = readJson(path.join(dataDir, "philosophers.index.json")).find((item) => item.id === "seed-sage");

    expect(result.counts).toEqual({ philosophers: 1, works: 1, relationships: 2 });
    expect(detail.tier).toBe("seed");
    expect(detail.thoughtSystem).toBeUndefined();
    expect(index.tier).toBe("seed");
  });

  it("admit --tier seed rejects thoughtSystem payloads", () => {
    const dataRoot = makeDataDir([standardPhilosopher()]);
    const batchDir = makeSeedBatch({ thoughtSystems: { schemaVersion: 1, items: [{ philosopherId: "seed-sage", sourceIds: ["S001"], problems: [] }] } });

    expect(() => admitKimiBatch({ batchDir, dataDir: path.join(dataRoot, "public/data"), tier: "seed" })).toThrow(/seed.*thoughtSystem/i);
  });

  it("admit --tier seed rejects seed batches without source notes", () => {
    const dataRoot = makeDataDir([standardPhilosopher()]);
    const batchDir = makeSeedBatch({ philosopher: { sourceNotes: [] } });

    expect(() => admitKimiBatch({ batchDir, dataDir: path.join(dataRoot, "public/data"), tier: "seed" })).toThrow(/sourceNotes/i);
  });

  it("admit --tier seed rejects out-of-whitelist themeId at the write gate", () => {
    const dataRoot = makeDataDir([standardPhilosopher()]);
    const batchDir = makeSeedBatch({ philosopher: { themes: ["history"] } });

    expect(() => admitKimiBatch({ batchDir, dataDir: path.join(dataRoot, "public/data"), tier: "seed" })).toThrow(/unknown themeId: history/i);
  });
});
