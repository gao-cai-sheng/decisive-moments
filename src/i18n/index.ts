import { useMemo } from "react";
import { useAppStore } from "../store/appStore";
import { messages, type Locale, type MessageKey } from "./messages";

export { LOCALE_STORAGE_KEY, messages } from "./messages";
export type { Locale, MessageKey } from "./messages";

export type TranslateParams = Record<string, string | number>;

export function translate(locale: Locale, key: MessageKey, params?: TranslateParams): string {
  const template = messages[locale][key] ?? messages.zh[key];
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match,
  );
}

export function useT() {
  const locale = useAppStore((state) => state.locale);
  return useMemo(
    () => (key: MessageKey, params?: TranslateParams) => translate(locale, key, params),
    [locale],
  );
}

const localeSuffix = { zh: "Zh", en: "En", es: "Es" } as const;

// 内容层字段（names 等）按语言取值；缺失时回退 Zh——内容翻译渐进推进，不阻塞 UI 英化
export function pickName(names: { zh: string; en: string; es?: string }, locale: Locale): string {
  return locale === "zh" ? names.zh : names[locale] || names.en || names.zh;
}

// 多语言后缀字段约定：pickText(problem, "summary", locale) 读 summaryEn/summaryEs，缺失回退 summaryZh
export function pickText(entity: Record<string, unknown>, base: string, locale: Locale): string {
  if (locale !== "zh") {
    const translated = entity[`${base}${localeSuffix[locale]}`];
    if (typeof translated === "string" && translated.length > 0) return translated;
  }
  const zh = entity[`${base}Zh`];
  return typeof zh === "string" ? zh : "";
}

// 数组字段的同款取值：pickList(philosopher, "keywords", locale) 读 keywordsEn/keywordsEs，缺失回退 keywordsZh
export function pickList(entity: Record<string, unknown>, base: string, locale: Locale): string[] {
  if (locale !== "zh") {
    const translated = entity[`${base}${localeSuffix[locale]}`];
    if (Array.isArray(translated) && translated.length > 0) return translated as string[];
  }
  const zh = entity[`${base}Zh`];
  return Array.isArray(zh) ? (zh as string[]) : [];
}
