import {
  argumentSchema,
  philosopherIndexEntrySchema,
  philosopherSchema,
  relationshipSchema,
  themeSchema,
  workSchema,
  type Argument,
  type Philosopher,
  type PhilosopherIndexEntry,
  type Relationship,
  type Theme,
  type Work,
} from "./schemas";

// 数据放在 public/ 下，部署到子路径（如 GitHub Pages 的 /decisive-moments/）时
// 必须带上 Vite 的 base，否则 542 份 JSON 全部 404。BASE_URL 始终以 / 结尾。
function withBase(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
}

async function loadJson<T>(path: string, parse: (value: unknown) => T): Promise<T> {
  const url = withBase(path);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to load ${url}: ${response.status}`);
  return parse(await response.json());
}

export function getPhilosopherIndex(): Promise<PhilosopherIndexEntry[]> {
  return loadJson("/data/philosophers.index.json", (value) =>
    philosopherIndexEntrySchema.array().parse(value),
  );
}

export function getPhilosopher(id: string): Promise<Philosopher> {
  return loadJson(`/data/philosophers/${id}.json`, (value) => philosopherSchema.parse(value));
}

export function getArgumentIndex(): Promise<Argument[]> {
  return loadJson("/data/arguments.index.json", (value) => argumentSchema.array().parse(value));
}

export function getRelationships(): Promise<Relationship[]> {
  return loadJson("/data/relationships.json", (value) => relationshipSchema.array().parse(value));
}

export function getThemes(): Promise<Theme[]> {
  return loadJson("/data/themes.json", (value) => themeSchema.array().parse(value));
}

export function getWorks(): Promise<Work[]> {
  return loadJson("/data/works.json", (value) => workSchema.array().parse(value));
}
