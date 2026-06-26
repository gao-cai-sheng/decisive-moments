import { describe, expect, it } from "vitest";
import argumentsJson from "../../public/data/arguments.index.json";
import buddhaJson from "../../public/data/philosophers/buddha.json";
import confuciusJson from "../../public/data/philosophers/confucius.json";
import philosophersIndexJson from "../../public/data/philosophers.index.json";
import platoJson from "../../public/data/philosophers/plato.json";
import worksJson from "../../public/data/works.json";
import {
  argumentSchema,
  philosopherIndexEntrySchema,
  philosopherSchema,
  relationshipSchema,
  themeSchema,
  workSchema,
} from "./schemas";
import {
  validArgument,
  validPhilosopher,
  validRelationship,
  validTheme,
  validWork,
} from "./fixtures";

describe("data schemas", () => {
  it("accepts valid philosopher records", () => {
    expect(philosopherSchema.parse(validPhilosopher).id).toBe("plato");
  });

  it("accepts nested philosopher thought systems", () => {
    const parsed = philosopherSchema.parse({
      ...validPhilosopher,
      thoughtSystem: {
        problems: [
          {
            id: "plato-justice",
            titleZh: "正义",
            questionZh: "正义是什么，为什么它同时关乎灵魂和城邦？",
            summaryZh: "柏拉图把正义理解为灵魂和城邦内部秩序的对应关系。",
            themeIds: ["justice", "politics"],
            weight: 3,
            claims: [
              {
                id: "plato-justice-order",
                titleZh: "正义即秩序",
                claimZh: "正义是各部分各安其位，而不是强者任意支配弱者。",
                explanationZh: "《理想国》通过城邦与灵魂的类比，把正义解释为结构性的协调。",
                themeIds: ["justice"],
                weight: 3,
                evidence: [
                  {
                    id: "plato-republic-book-iv",
                    titleZh: "《理想国》第四卷",
                    summaryZh: "苏格拉底在此讨论城邦三阶层与灵魂三部分之间的对应。",
                    source: {
                      workId: "republic",
                      locator: "Book IV",
                      excerptStatus: "summary_only",
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    });

    expect(parsed.thoughtSystem?.problems[0].claims[0].evidence[0].source.excerptStatus).toBe(
      "summary_only",
    );
  });

  it("rejects invalid review statuses", () => {
    expect(() =>
      philosopherSchema.parse({ ...validPhilosopher, reviewStatus: "unchecked" }),
    ).toThrow();
  });

  it("rejects thought problems without claims", () => {
    expect(() =>
      philosopherSchema.parse({
        ...validPhilosopher,
        thoughtSystem: {
          problems: [
            {
              id: "plato-empty-problem",
              titleZh: "空问题",
              questionZh: "这个问题还没有命题吗？",
              summaryZh: "问题必须至少承载一个核心命题，才能成为星系中的有效节点。",
              themeIds: ["justice"],
              weight: 2,
              claims: [],
            },
          ],
        },
      }),
    ).toThrow();
  });

  it("accepts valid arguments, relationships, themes, and works", () => {
    expect(argumentSchema.parse(validArgument).id).toBe("plato-justice-soul-order");
    expect(relationshipSchema.parse(validRelationship).type).toBe("direct_student");
    expect(themeSchema.parse(validTheme).id).toBe("justice");
    expect(workSchema.parse(validWork).id).toBe("republic");
  });

  it("keeps the first-release thought-system exemplars concrete", () => {
    const philosophers = philosopherSchema.array().parse([buddhaJson, confuciusJson, platoJson]);
    const thoughtSystems = philosopherSchema
      .array()
      .parse([buddhaJson, confuciusJson, platoJson])
      .filter((philosopher) => philosopher.thoughtSystem);

    expect(thoughtSystems.map((philosopher) => philosopher.id)).toEqual(["buddha", "confucius", "plato"]);
    for (const philosopher of philosophers) {
      expect(philosopher.thoughtSystem?.problems.length).toBeGreaterThanOrEqual(4);
      expect(
        philosopher.thoughtSystem?.problems.every((problem) =>
          problem.claims.every((claim) => claim.evidence.length > 0),
        ),
      ).toBe(true);
    }
    expect(confuciusJson.thoughtSystem.problems.map((problem) => problem.id)).toEqual(
      expect.arrayContaining(["confucius-ren", "confucius-li", "confucius-governance"]),
    );
    expect(platoJson.thoughtSystem.problems.map((problem) => problem.id)).toEqual(
      expect.arrayContaining(["plato-forms", "plato-justice", "plato-soul"]),
    );
  });

  it("keeps the curated Buddha profile concrete across index, detail, works, and arguments", () => {
    const buddha = philosopherSchema.parse(buddhaJson);
    const buddhaIndex = philosopherIndexEntrySchema
      .array()
      .parse(philosophersIndexJson)
      .find((entry) => entry.id === "buddha");
    const works = workSchema.array().parse(worksJson).filter((work) => work.philosopherId === "buddha");
    const argumentsIndex = argumentSchema
      .array()
      .parse(argumentsJson)
      .filter((argument) => argument.philosopherId === "buddha");

    expect(buddha.names.native).toContain("Śākyamuni");
    expect(buddha.life.display).toContain("约公元前");
    expect(buddha.life.display).not.toContain("待审核");
    expect(buddha.periods).not.toContain("first_release");
    expect(buddha.traditions).toContain("early_buddhism");
    expect(buddha.oneLineZh).not.toContain("第一版候选哲人");
    expect(buddha.reviewStatus).toBe("reviewed");
    expect(buddha.sourceNotes.some((note) => note.url?.startsWith("https://"))).toBe(true);
    expect(buddhaIndex?.life.display).toBe(buddha.life.display);
    expect(buddhaIndex?.oneLineZh).toBe(buddha.oneLineZh);
    expect(buddhaIndex?.reviewStatus).toBe("reviewed");
    expect(works.map((work) => work.id)).toEqual(
      expect.arrayContaining(["dhammacakkappavattana-sutta", "anattalakkhana-sutta"]),
    );
    expect(works.every((work) => !work.noteZh.includes("种子文本"))).toBe(true);
    expect(argumentsIndex.map((argument) => argument.id)).toEqual(
      expect.arrayContaining(["buddha-four-noble-truths", "buddha-dependent-origination"]),
    );
    expect(argumentsIndex.every((argument) => !argument.claimZh.includes("可供第一版检索"))).toBe(true);
    expect(buddha.thoughtSystem?.problems.length).toBeGreaterThanOrEqual(5);
    expect(buddha.thoughtSystem?.problems.some((problem) => problem.id === "buddha-nirvana")).toBe(true);
  });
});
