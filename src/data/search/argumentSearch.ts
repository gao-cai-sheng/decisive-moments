import type { Argument, Theme } from "../schemas";

export type ArgumentSearchResult = {
  item: Argument;
  score: number;
  matchedThemeIds: string[];
};

function normalize(input: string) {
  return input.trim().toLocaleLowerCase();
}

export function searchArgumentsLocal(
  query: string,
  argumentsIndex: Argument[],
  themes: Theme[],
): ArgumentSearchResult[] {
  const q = normalize(query);
  if (!q) return [];

  const matchedThemeIds = themes
    .filter((theme) =>
      [theme.zh, theme.en, ...theme.aliasesZh].some((term) => {
        const normalizedTerm = normalize(term);
        return normalizedTerm.includes(q) || q.includes(normalizedTerm);
      }),
    )
    .map((theme) => theme.id);

  return argumentsIndex
    .map((item) => {
      let score = 0;
      const fields = [item.questionZh, item.claimZh, item.explanationZh, ...item.keywordsZh].map(normalize);
      if (fields.some((field) => field.includes(q))) score += 4;
      const themeMatches = item.themeIds.filter((themeId) => matchedThemeIds.includes(themeId));
      score += themeMatches.length * 6;
      if (item.reviewStatus === "reviewed") score += 1;
      return { item, score, matchedThemeIds: themeMatches };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score);
}
