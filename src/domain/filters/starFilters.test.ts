import { describe, expect, it } from "vitest";
import type { PhilosopherIndexEntry, Relationship } from "../../data/schemas";
import {
  filterPhilosophersForStarMap,
  filterRelationshipsForStarMap,
  type StarMapFilters,
} from "./starFilters";

const basePhilosopher = {
  names: { zh: "占位", en: "Placeholder" },
  life: { display: "年代" },
  civilization: "ancient_greek",
  traditions: ["platonism"],
  periods: ["classical_antiquity"],
  themes: ["knowledge"],
  keywordsZh: [],
  oneLineZh: "占位说明",
  influenceWeight: 2,
  reviewStatus: "draft",
} satisfies Omit<PhilosopherIndexEntry, "id">;

function philosopher(input: Partial<PhilosopherIndexEntry> & { id: string }): PhilosopherIndexEntry {
  return { ...basePhilosopher, ...input };
}

const philosophers = [
  philosopher({ id: "plato", civilization: "ancient_greek", traditions: ["platonism"], periods: ["classical_antiquity"], themes: ["knowledge", "justice"] }),
  philosopher({ id: "confucius", civilization: "chinese", traditions: ["confucianism"], periods: ["axial_age"], themes: ["ethics", "politics"] }),
  philosopher({ id: "rawls", civilization: "american", traditions: ["liberalism"], periods: ["twentieth_century"], themes: ["justice", "politics"] }),
];

const relationships: Relationship[] = [
  {
    id: "plato-rawls-justice",
    from: "plato",
    to: "rawls",
    type: "influence",
    strength: 3,
    confidence: "high",
    themeIds: ["justice"],
    noteZh: "正义问题的长期回响。",
    reviewStatus: "draft",
  },
  {
    id: "confucius-rawls-politics",
    from: "confucius",
    to: "rawls",
    type: "shared_problem",
    strength: 2,
    confidence: "medium",
    themeIds: ["politics"],
    noteZh: "政治秩序问题的比较。",
    reviewStatus: "draft",
  },
];

describe("star map filters", () => {
  it("filters philosophers by civilization, period, tradition, and theme", () => {
    const filters: StarMapFilters = {
      civilization: "ancient_greek",
      period: "classical_antiquity",
      tradition: "platonism",
      theme: "justice",
      relationshipTypes: [],
    };

    expect(filterPhilosophersForStarMap(philosophers, filters).map((item) => item.id)).toEqual(["plato"]);
  });

  it("keeps all philosophers when filters are empty", () => {
    expect(filterPhilosophersForStarMap(philosophers, { relationshipTypes: [] })).toHaveLength(3);
  });

  it("filters relationships by visible philosopher ids and selected relationship types", () => {
    const filters: StarMapFilters = { theme: "justice", relationshipTypes: ["influence"] };
    const visiblePhilosophers = filterPhilosophersForStarMap(philosophers, filters);

    expect(filterRelationshipsForStarMap(relationships, visiblePhilosophers, filters).map((item) => item.id)).toEqual([
      "plato-rawls-justice",
    ]);
  });

  it("shows all relationship types when no type filter is selected", () => {
    const filters: StarMapFilters = { relationshipTypes: [] };

    expect(filterRelationshipsForStarMap(relationships, philosophers, filters).map((item) => item.id)).toEqual([
      "plato-rawls-justice",
      "confucius-rawls-politics",
    ]);
  });
});
