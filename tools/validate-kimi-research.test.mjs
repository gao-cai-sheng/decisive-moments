import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { validateResearchBatch } from "./validate-kimi-research.mjs";

const kimiRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", ".research/tmp/kimi");
const storedBatches = fs.existsSync(kimiRoot)
  ? fs
      .readdirSync(kimiRoot)
      .map((name) => path.join(kimiRoot, name))
      .filter((dir) => fs.statSync(dir).isDirectory())
  : [];

function makeBatch(files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "kimi-research-"));
  for (const [name, content] of Object.entries(files)) {
    fs.writeFileSync(path.join(dir, name), content);
  }
  return dir;
}

const sourcesMd = `# Sources

## S001: Source One

- Author/Organization: Archive
- URL: https://example.com/one
- Accessed: 2026-06-26
- Source type: institutional
- Reliability: high
- Useful for: core facts
- Limits: summary page
`;

const requiredMarkdown = {
  "brief.md": "# Research Brief\n",
  "sources.md": sourcesMd,
  "notes.md": "# Notes\n",
  "open-questions.md": "# Open Questions\n",
};

describe("validateResearchBatch", () => {
  it("accepts versioned claims and a versioned timeline with valid source ids", () => {
    const dir = makeBatch({
      ...requiredMarkdown,
      "claims.json": JSON.stringify({
        schemaVersion: 1,
        items: [
          {
            id: "tennis-court-oath:fact:001",
            subject: "Tennis Court Oath",
            subjectZh: "网球场宣誓",
            claimZh: "网球场宣誓发生于 1789 年 6 月 20 日。",
            type: "fact",
            timeRange: "1789-06-20",
            sourceIds: ["S001"],
            confidence: "high",
            reviewStatus: "needs_human_review",
            notesZh: "可用于事件卡。",
          },
        ],
      }),
      "timeline.json": JSON.stringify({
        schemaVersion: 1,
        items: [
          {
            id: "tennis-court-oath:timeline:001",
            date: "1789-06-20",
            eventZh: "网球场宣誓",
            eventEn: "Tennis Court Oath",
            descriptionZh: "代表宣誓在宪法确立前不解散。",
            sourceIds: ["S001"],
            significance: "focal",
          },
        ],
      }),
    });

    expect(validateResearchBatch(dir)).toEqual({
      claims: 1,
      sources: 1,
      timeline: 1,
    });
  });

  it("rejects missing schema versions, duplicate ids, and unknown source ids", () => {
    const dir = makeBatch({
      ...requiredMarkdown,
      "claims.json": JSON.stringify([
        {
          id: "topic:fact:001",
          subject: "Topic",
          subjectZh: "主题",
          claimZh: "缺少版本且引用了未知来源。",
          type: "fact",
          sourceIds: ["S999"],
          confidence: "high",
          reviewStatus: "needs_human_review",
          notesZh: "应失败。",
        },
        {
          id: "topic:fact:001",
          subject: "Topic",
          subjectZh: "主题",
          claimZh: "重复 id。",
          type: "fact",
          sourceIds: ["S001"],
          confidence: "high",
          reviewStatus: "needs_human_review",
          notesZh: "应失败。",
        },
      ]),
    });

    expect(() => validateResearchBatch(dir)).toThrow(/schemaVersion|duplicate id|unknown sourceId/);
  });

  it("requires timeline.json when the brief asks for a timeline", () => {
    const dir = makeBatch({
      ...requiredMarkdown,
      "brief.md": "# Research Brief\n\n## Intended Use\n\nevent card / timeline\n",
      "claims.json": JSON.stringify({
        schemaVersion: 1,
        items: [
          {
            id: "topic:fact:001",
            subject: "Topic",
            subjectZh: "主题",
            claimZh: "一条合法事实。",
            type: "fact",
            sourceIds: ["S001"],
            confidence: "high",
            reviewStatus: "needs_human_review",
            notesZh: "应因为缺少 timeline.json 失败。",
          },
        ],
      }),
    });

    expect(() => validateResearchBatch(dir)).toThrow(/timeline\.json is required/);
  });

});

// Guards against contract drift between the validator, the bridge doc, and
// real Kimi output. Skips when no batch is checked out (.research is gitignored
// and disposable), so it only runs against batches actually on disk.
describe("stored Kimi batches", () => {
  it.skipIf(storedBatches.length === 0)("all pass the validator", () => {
    for (const dir of storedBatches) {
      expect(() => validateResearchBatch(dir), dir).not.toThrow();
    }
  });
});
