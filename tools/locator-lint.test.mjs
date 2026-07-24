import { describe, expect, it } from "vitest";
import { lintItems } from "./locator-lint.mjs";

// 这些用例锁的是 2026-07-24 U5/U6/U7 盲审的真实结论：
// 三道旧门对 herzen/fedorov/bulgakov 全绿放行，本门必须抓住它们，
// 同时不能误伤同批通过的 kropotkin/tolstoy/kireevsky/chernyshevsky。
const works = new Map([
  ["kropotkin-conquest-of-bread", { id: "kropotkin-conquest-of-bread", philosopherId: "peter-kropotkin", titleEn: "The Conquest of Bread" }],
  ["kropotkin-mutual-aid", { id: "kropotkin-mutual-aid", philosopherId: "peter-kropotkin", titleEn: "Mutual Aid: A Factor of Evolution" }],
  ["herzen-my-past-and-thoughts", { id: "herzen-my-past-and-thoughts", philosopherId: "alexander-herzen", titleEn: "My Past and Thoughts" }],
  ["bulgakov-lamb-of-god", { id: "bulgakov-lamb-of-god", philosopherId: "sergei-bulgakov", titleEn: "The Lamb of God" }],
  ["bulgakov-unfading-light", { id: "bulgakov-unfading-light", philosopherId: "sergei-bulgakov", titleEn: "Unfading Light" }],
  ["fedorov-philosophy-common-task", { id: "fedorov-philosophy-common-task", philosopherId: "nikolai-fedorov", titleEn: "The Philosophy of the Common Task" }],
  ["kireevsky-european-culture-russia", { id: "kireevsky-european-culture-russia", philosopherId: "ivan-kireevsky", titleEn: "On the Nature of European Culture and Its Relation to Russian Culture" }],
  ["chernyshevsky-aesthetic-relations", { id: "chernyshevsky-aesthetic-relations", philosopherId: "nikolai-chernyshevsky", titleEn: "The Aesthetic Relation of Art to Reality" }],
]);

// 构造一位哲人，evidence 只填本门关心的 source 字段
const person = (philosopherId, pairs) => ({
  philosopherId,
  problems: [
    {
      claims: [
        {
          evidence: pairs.map(([workId, locator], i) => ({
            id: `${philosopherId}:evidence:${String(i + 1).padStart(3, "0")}`,
            source: { workId, locator, excerptStatus: "summary_only" },
          })),
        },
      ],
    },
  ],
});

const codes = (list) => list.map((x) => x.code);

describe("locator-lint 形态门", () => {
  it("放行带编号锚的合法定位（kropotkin 范本）", () => {
    const { reds } = lintItems(
      [
        person("peter-kropotkin", [
          ["kropotkin-conquest-of-bread", "The Conquest of Bread, ch. I, Our Riches"],
          ["kropotkin-mutual-aid", "Mutual Aid, ch. III, Mutual Aid Among Savages"],
        ]),
      ],
      works,
    );
    expect(reds).toEqual([]);
  });

  it("容忍副标题省略、前缀简称与单复数差异（曾误伤 kireevsky/chernyshevsky）", () => {
    const { reds } = lintItems(
      [
        // 简称：locator 省掉了 "and Its Relation to Russian Culture"
        person("ivan-kireevsky", [["kireevsky-european-culture-russia", "On the Nature of European Culture, paragraphs on pagan Rome and Roman law"]]),
        // 单复数：Relation ↔ Relations
        person("nikolai-chernyshevsky", [["chernyshevsky-aesthetic-relations", "The Aesthetic Relations of Art to Reality, opening example of seascapes"]]),
        // 副标题：Mutual Aid: A Factor of Evolution ↔ Mutual Aid
        person("peter-kropotkin", [["kropotkin-mutual-aid", "Mutual Aid, ch. I, Mutual Aid Among Animals"]]),
      ],
      works,
    );
    expect(codes(reds)).not.toContain("locator_work_mismatch");
  });

  it("抓住主题描述冒充位置（bulgakov 型）", () => {
    const { reds } = lintItems(
      [
        person("sergei-bulgakov", [
          ["bulgakov-unfading-light", "Unfading Light, Prefatory and introductory religious-philosophical orientation"],
          ["bulgakov-unfading-light", "Unfading Light, religious consciousness and world sections as background to Godmanhood"],
          ["bulgakov-lamb-of-god", "The Lamb of God, Sophia and creation controversy context"],
          ["bulgakov-lamb-of-god", "The Lamb of God, chapters on the Lamb, sacrifice, and redemption"],
          ["bulgakov-lamb-of-god", "The Lamb of God, ch. on Divine Sophia"],
        ]),
      ],
      works,
    );
    expect(reds).toHaveLength(5);
    expect(new Set(codes(reds))).toEqual(
      new Set(["locator_not_a_position", "locator_vague_plural", "chapter_without_number"]),
    );
  });

  it("「passages」不带编号即拦（fedorov 型自曝）", () => {
    const { reds } = lintItems(
      [person("nikolai-fedorov", [["fedorov-philosophy-common-task", "The Philosophy of the Common Task, The Disarmament and Regulation passages"]])],
      works,
    );
    expect(codes(reds)).toContain("locator_vague_plural");
  });

  it("「passages on ...」挂在编号之后属合法（tolstoy 型，不得误伤）", () => {
    const w = new Map(works);
    w.set("tolstoy-confession", { id: "tolstoy-confession", philosopherId: "leo-tolstoy", titleEn: "A Confession" });
    const { reds } = lintItems([person("leo-tolstoy", [["tolstoy-confession", "A Confession, ch. IV, passages on suicide temptation"]])], w);
    expect(reds).toEqual([]);
  });

  it("篇名型定位未声明编本即拦，声明后放行（herzen/fedorov 型举证缺口）", () => {
    const items = [person("alexander-herzen", [["herzen-my-past-and-thoughts", "My Past and Thoughts, vol. VI, From the Other Shore, ch. I-II"]])];
    const before = lintItems(items, works);
    expect(codes(before.needDecl)).toContain("undeclared_title_segment");

    const after = lintItems(items, works, '- `herzen-my-past-and-thoughts` | Garnett 六卷本 | "From the Other Shore" → 见说明');
    expect(after.needDecl).toEqual([]);
  });

  it("页码定位未标版次即拦", () => {
    const items = [person("alexander-herzen", [["herzen-my-past-and-thoughts", "My Past and Thoughts, vol. IV, pp. 180-185"]])];
    expect(codes(lintItems(items, works).needDecl)).toContain("undeclared_pagination");
    expect(lintItems(items, works, "- `herzen-my-past-and-thoughts` | Garnett 1924 六卷本").needDecl).toEqual([]);
  });

  it("跨度≥3 的章/讲范围只提示不阻断；页码范围不算跨度", () => {
    const w = new Map(works);
    w.set("solovyov-lectures-divine-humanity", { id: "solovyov-lectures-divine-humanity", philosopherId: "vladimir-solovyov", titleEn: "Lectures on Divine Humanity" });
    const wide = lintItems([person("vladimir-solovyov", [["solovyov-lectures-divine-humanity", "Lectures on Divine Humanity, Lectures 1-3"]])], w);
    expect(codes(wide.warns)).toContain("locator_range_wide");
    expect(wide.reds).toEqual([]);

    const pages = lintItems(
      [person("alexander-herzen", [["herzen-my-past-and-thoughts", "My Past and Thoughts, ch. II, pp. 180-185"]])],
      works,
      "- `herzen-my-past-and-thoughts` | Garnett 1924 六卷本",
    );
    expect(codes(pages.warns)).not.toContain("locator_range_wide");
  });

  it("workId 不在 works.json 直接 RED", () => {
    const { reds } = lintItems([person("someone", [["no-such-work", "Some Book, ch. I"]])], works);
    expect(codes(reds)).toContain("unknown_workid");
  });

  it("空 locator 直接 RED", () => {
    const { reds } = lintItems([person("peter-kropotkin", [["kropotkin-mutual-aid", ""]])], works);
    expect(codes(reds)).toEqual(["locator_empty"]);
  });
});
