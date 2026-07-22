import { describe, expect, it } from "vitest";
import {
  buildIssueUrl,
  buildSubmissionFiles,
  validateContribution,
  type ContributionContext,
  type ContributionDraft,
} from "./validation";

function makeContext(): ContributionContext {
  return {
    philosopherIds: new Set(["confucius", "plato"]),
    workIds: new Set(["plato-republic"]),
    themeIds: new Set(["ethics", "politics", "knowledge"]),
  };
}

function makeValidDraft(): ContributionDraft {
  return {
    philosopher: {
      id: "test-thinker",
      names: { zh: "试思者", en: "Test Thinker" },
      life: { birth: 1801, death: 1877, display: "1801—1877" },
      civilization: "european_modern",
      traditions: ["test_tradition"],
      periods: ["community"],
      themes: ["ethics", "politics"],
      keywordsZh: ["伦理", "政治", "试验"],
      oneLineZh: "一位用于测试投稿硬门的合成哲人。",
      summaryZh: "这是一段超过二十个字符的合成简介，用来通过 summaryZh 的最小长度门槛校验。",
    },
    works: [
      {
        id: "test-thinker-main-work",
        titleZh: "《试思录》",
        titleEn: "Test Meditations",
        noteZh: "合成作品说明。",
      },
    ],
    relationships: [
      {
        direction: "incoming",
        targetId: "confucius",
        type: "influence",
        strength: 2,
        confidence: "medium",
        themeIds: ["ethics"],
        noteZh: "合成关系说明，长度超过十个字符。",
      },
      {
        direction: "outgoing",
        targetId: "plato",
        type: "critique",
        strength: 1,
        confidence: "low",
        themeIds: ["politics"],
        noteZh: "另一条合成关系说明，同样超过十字。",
      },
    ],
    sourceNotes: [
      {
        label: "SEP",
        url: "https://plato.stanford.edu/entries/test/",
        noteZh: "合成来源说明。",
      },
    ],
  };
}

describe("validateContribution", () => {
  it("passes a fully valid seed draft with no errors", () => {
    const issues = validateContribution(makeValidDraft(), makeContext());
    expect(issues.filter((issue) => issue.level === "error")).toEqual([]);
  });

  it("rejects duplicate philosopher id and placeholder work id", () => {
    const draft = makeValidDraft();
    draft.philosopher.id = "plato";
    draft.works[0].id = "plato-primary-work";
    const codes = validateContribution(draft, makeContext()).map((issue) => issue.code);
    expect(codes).toContain("id_taken");
    expect(codes).toContain("work_id_placeholder");
  });

  it("enforces seed gates: works 1-2, relationships 2-3, sourceNotes >= 1", () => {
    const draft = makeValidDraft();
    draft.works = [];
    draft.relationships = draft.relationships.slice(0, 1);
    draft.sourceNotes = [];
    const codes = validateContribution(draft, makeContext()).map((issue) => issue.code);
    expect(codes).toContain("works_count");
    expect(codes).toContain("relationships_count");
    expect(codes).toContain("sourcenotes_required");
  });

  it("rejects unknown themes and unknown relationship targets", () => {
    const draft = makeValidDraft();
    draft.philosopher.themes = ["not_a_theme"];
    draft.relationships[0].targetId = "nobody";
    const codes = validateContribution(draft, makeContext()).map((issue) => issue.code);
    expect(codes).toContain("theme_unknown");
    expect(codes).toContain("relationship_target_unknown");
  });

  it("flags short summary and invalid source URL as errors", () => {
    const draft = makeValidDraft();
    draft.philosopher.summaryZh = "太短";
    draft.sourceNotes[0].url = "ftp://nope";
    const issues = validateContribution(draft, makeContext());
    const errors = issues.filter((issue) => issue.level === "error").map((issue) => issue.code);
    expect(errors).toContain("summary_short");
    expect(errors).toContain("sourcenote_url_invalid");
  });
});

describe("buildSubmissionFiles", () => {
  it("emits kimi-compatible envelopes with resolved relationship direction", () => {
    const files = buildSubmissionFiles(makeValidDraft());
    const philosopher = files["proposed-philosophers.json"];
    expect(philosopher.schemaVersion).toBe(1);
    expect(philosopher.items).toHaveLength(1);
    expect(philosopher.items[0]).toMatchObject({
      id: "test-thinker",
      reviewStatus: "draft",
      influenceWeight: 1,
      works: ["test-thinker-main-work"],
    });

    const relationships = files["proposed-relationships.json"].items;
    // incoming: confucius -> test-thinker；outgoing: test-thinker -> plato
    expect(relationships[0]).toMatchObject({ from: "confucius", to: "test-thinker", type: "influence" });
    expect(relationships[1]).toMatchObject({ from: "test-thinker", to: "plato", type: "critique" });

    const work = files["proposed-works.json"].items[0];
    expect(work).toMatchObject({ id: "test-thinker-main-work", philosopherId: "test-thinker" });
    expect(work).not.toHaveProperty("originalTitle");
  });

  it("builds a GitHub issue URL with encoded JSON body", () => {
    const url = buildIssueUrl(makeValidDraft());
    expect(url).toContain("/issues/new?title=");
    expect(url).toContain(encodeURIComponent("[投稿] seed: test-thinker"));
    expect(decodeURIComponent(url)).toContain("proposed-philosophers.json");
  });
});
