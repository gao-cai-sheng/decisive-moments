import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getArgumentIndex,
  getPhilosopher,
  getPhilosopherIndex,
  getRelationships,
  getThemes,
  getWorks,
} from "./client";

const fixtures: Record<string, unknown> = {
  "/data/philosophers.index.json": [
    {
      id: "plato",
      names: { zh: "柏拉图", en: "Plato" },
      life: { display: "x" },
      civilization: "ancient_greek",
      traditions: ["platonism"],
      periods: ["seed"],
      themes: ["justice"],
      keywordsZh: ["正义"],
      oneLineZh: "x",
      influenceWeight: 3,
      reviewStatus: "reviewed",
    },
  ],
  "/data/philosophers/plato.json": {
    id: "plato",
    names: { zh: "柏拉图", en: "Plato" },
    life: { display: "x" },
    civilization: "ancient_greek",
    traditions: ["platonism"],
    periods: ["seed"],
    themes: ["justice"],
    keywordsZh: ["正义"],
    oneLineZh: "x",
    summaryZh: "柏拉图的测试摘要需要超过二十个中文字符以通过结构校验。",
    works: [],
    influenceWeight: 3,
    reviewStatus: "reviewed",
    sourceNotes: [],
  },
  "/data/arguments.index.json": [],
  "/data/relationships.json": [],
  "/data/themes.json": [{ id: "justice", zh: "正义", en: "Justice", aliasesZh: ["公平"] }],
  "/data/works.json": [],
};

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string) => ({
      ok: true,
      json: async () => fixtures[url],
    })),
  );
});

describe("static data client", () => {
  it("loads all public data endpoints", async () => {
    await expect(getPhilosopherIndex()).resolves.toHaveLength(1);
    await expect(getPhilosopher("plato")).resolves.toMatchObject({ id: "plato" });
    await expect(getArgumentIndex()).resolves.toEqual([]);
    await expect(getRelationships()).resolves.toEqual([]);
    await expect(getThemes()).resolves.toHaveLength(1);
    await expect(getWorks()).resolves.toEqual([]);
  });
});
