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
      if (item.keywordsZh.some((keyword) => normalize(keyword).includes(q) || q.includes(normalize(keyword)))) {
        score += 3;
      }
      if (item.themes.some((theme) => normalize(theme).includes(q))) score += 2;
      if (item.reviewStatus === "reviewed") score += 1;
      return { item, score };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score);
}
