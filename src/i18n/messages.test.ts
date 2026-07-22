import { describe, expect, it } from "vitest";
import { pickText, translate } from "./index";
import { en, zh } from "./messages";

function placeholders(template: string) {
  return [...template.matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort();
}

describe("i18n messages", () => {
  it("en covers exactly the zh key set", () => {
    expect(Object.keys(en).sort()).toEqual(Object.keys(zh).sort());
  });

  it("has no empty translations", () => {
    for (const [key, value] of Object.entries(zh)) expect(value, `zh:${key}`).not.toBe("");
    for (const [key, value] of Object.entries(en)) expect(value, `en:${key}`).not.toBe("");
  });

  it("keeps {placeholder} tokens consistent between locales", () => {
    for (const key of Object.keys(zh) as (keyof typeof zh)[]) {
      expect(placeholders(en[key]), key).toEqual(placeholders(zh[key]));
    }
  });

  it("interpolates params and leaves unknown tokens intact", () => {
    expect(translate("zh", "loading.error", { error: "404" })).toBe("数据载入失败：404");
    expect(translate("en", "panel.detailAria", { name: "Plato" })).toBe("Plato details");
    expect(translate("zh", "loading.error")).toBe("数据载入失败：{error}");
  });

  it("pickText prefers En under en locale and falls back to Zh", () => {
    const entity = { summaryZh: "中文摘要", summaryEn: "English summary", titleZh: "标题" };
    expect(pickText(entity, "summary", "en")).toBe("English summary");
    expect(pickText(entity, "summary", "zh")).toBe("中文摘要");
    expect(pickText(entity, "title", "en")).toBe("标题");
    expect(pickText(entity, "missing", "zh")).toBe("");
  });
});
