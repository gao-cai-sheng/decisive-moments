import type { PhilosopherIndexEntry } from "../schemas";

export type PhilosopherSearchResult = {
  item: PhilosopherIndexEntry;
  score: number;
};

function normalize(input: string) {
  return input.trim().toLocaleLowerCase();
}

export function searchPhilosophersLocal(
  query: string,
  philosophers: PhilosopherIndexEntry[],
): PhilosopherSearchResult[] {
  const q = normalize(query);
  if (!q) return [];

  return philosophers
    .map((item) => {
      let score = 0;
      const names = [item.names.zh, item.names.en, item.names.native ?? ""].map(normalize);
      if (names.some((name) => name.includes(q))) score += 10;
      // 中英关键词一并进召回：英文用户搜英译关键词也要命中，与上面 names 的处理一致
      const keywords = [...item.keywordsZh, ...(item.keywordsEn ?? [])];
      if (keywords.some((keyword) => normalize(keyword).includes(q) || q.includes(normalize(keyword)))) {
        score += 3;
      }
      if (item.themes.some((theme) => normalize(theme).includes(q))) score += 2;
      if (item.reviewStatus === "reviewed") score += 1;
      return { item, score };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score);
}
