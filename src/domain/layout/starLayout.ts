import type { PhilosopherIndexEntry } from "../../data/schemas";

type RelationshipLike = { from: string; to: string };

export type PeriodBucket =
  | "ancient"
  | "classical"
  | "medieval"
  | "early_modern"
  | "modern"
  | "contemporary"
  | "unknown";

export type StarLayoutNode = {
  id: string;
  position: [number, number, number];
  colorKey: string;
  periodBucket: PeriodBucket;
  radius: number;
};

const CURRENT_LAYOUT_YEAR = 2026;
const MIN_CHRONOLOGY_YEAR = -800;
const CHRONOLOGY_DISTANCE_START = 5.2;
const CHRONOLOGY_DISTANCE_SPAN = 12.2;
// 旋臂缠绕率：角度随离银心距离递增（与 StarDust 的 0.42 一致），
// 使同文明恒星沿对数旋臂分布而非直辐条。
const SPIRAL_WINDING = 0.42;

const fallbackDistanceByBucket: Record<PeriodBucket, number> = {
  ancient: 5.4,
  classical: 6.8,
  medieval: 9.6,
  early_modern: 11.4,
  modern: 14.2,
  contemporary: 16.4,
  unknown: 12.4,
};

function hash(input: string) {
  let value = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    value ^= input.charCodeAt(index);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

function relationshipCount(id: string, relationships: RelationshipLike[]) {
  return relationships.filter((relationship) => relationship.from === id || relationship.to === id).length;
}

// +1.0 = 纯超验/形而上  0 = 中性  -1.0 = 纯实践/政治伦理
const traditionYScore: Record<string, number> = {
  platonism: 0.9,
  scholasticism: 0.7,
  critical_philosophy: 0.6,
  ancient_greek_philosophy: 0.45,
  islamic_philosophy: 0.45,
  jewish_philosophy: 0.45,
  peripatetic: 0.3,
  modern_european_philosophy: 0.25,
  indian_philosophy: 0.2,
  sramana_tradition: 0.1,
  early_buddhism: 0.05,
  japanese_philosophy: 0.0,
  global_modern_thought: 0.0,
  daoism: -0.05,
  african_philosophy: -0.15,
  american_philosophy: -0.25,
  chinese_philosophy: -0.3,
  latin_american_philosophy: -0.35,
  liberalism: -0.5,
  confucianism: -0.65,
  korean_confucianism: -0.65,
  political_philosophy: -0.75,
};

function philosopherYOffset(philosopher: PhilosopherIndexEntry, seed: number): number {
  const scores = philosopher.traditions.map((t) => traditionYScore[t] ?? 0);
  const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  const jitter = ((seed % 400) / 400 - 0.5) * 0.5;
  return Number(((avg * 2.2) + jitter).toFixed(4));
}

function chronologyYear(philosopher: PhilosopherIndexEntry) {
  return philosopher.life.birth ?? philosopher.life.death;
}

function bucketFromYear(year: number): PeriodBucket {
  if (year < -600) return "ancient";
  if (year < 500) return "classical";
  if (year < 1450) return "medieval";
  if (year < 1750) return "early_modern";
  if (year < 1945) return "modern";
  return "contemporary";
}

function canonicalPeriodText(value: string) {
  return value.toLowerCase().trim().replace(/[\s-]+/g, "_");
}

function hasPeriodText(philosopher: PhilosopherIndexEntry, matches: string[]) {
  const canonicalMatches = matches.map(canonicalPeriodText);
  return philosopher.periods.some((period) => {
    const normalized = canonicalPeriodText(period);
    const tokens = normalized.split("_");
    return canonicalMatches.some((match) => normalized === match || tokens.includes(match));
  });
}

export function getPeriodBucket(philosopher: PhilosopherIndexEntry): PeriodBucket {
  const year = chronologyYear(philosopher);
  if (year !== undefined) return bucketFromYear(year);

  if (hasPeriodText(philosopher, ["ancient"])) return "ancient";
  if (hasPeriodText(philosopher, ["classical", "antiquity", "axial"])) return "classical";
  if (hasPeriodText(philosopher, ["medieval", "scholastic"])) return "medieval";
  if (hasPeriodText(philosopher, ["early_modern", "renaissance", "enlightenment"])) return "early_modern";
  if (hasPeriodText(philosopher, ["contemporary", "global_modern"])) return "contemporary";
  if (hasPeriodText(philosopher, ["modern"])) return "modern";
  return "unknown";
}

function chronologyDistance(philosopher: PhilosopherIndexEntry, periodBucket: PeriodBucket, seed: number) {
  const year = chronologyYear(philosopher);
  if (year === undefined) {
    if (periodBucket === "unknown") return 10 + (seed % 550) / 100;
    return fallbackDistanceByBucket[periodBucket];
  }

  const normalized = (year - MIN_CHRONOLOGY_YEAR) / (CURRENT_LAYOUT_YEAR - MIN_CHRONOLOGY_YEAR);
  return CHRONOLOGY_DISTANCE_START + normalized * CHRONOLOGY_DISTANCE_SPAN;
}

export function computeStarLayout(
  philosophers: PhilosopherIndexEntry[],
  relationships: RelationshipLike[],
): StarLayoutNode[] {
  const civilizations = [...new Set(philosophers.map((item) => item.civilization))].sort();
  const angleByCivilization = new Map(
    civilizations.map((civilization, index) => [
      civilization,
      (Math.PI * 2 * index) / Math.max(civilizations.length, 1),
    ]),
  );

  return philosophers.map((philosopher) => {
    const seed = hash(philosopher.id);
    const baseAngle = angleByCivilization.get(philosopher.civilization) ?? 0;
    const jitter = ((seed % 1000) / 1000 - 0.5) * 0.9;
    const periodBucket = getPeriodBucket(philosopher);
    const distance = chronologyDistance(philosopher, periodBucket, seed);
    const y = philosopherYOffset(philosopher, seed);
    const count = relationshipCount(philosopher.id, relationships);
    const primaryTradition = philosopher.traditions[0] ?? "unknown";

    const armAngle = baseAngle + jitter + distance * SPIRAL_WINDING;

    return {
      id: philosopher.id,
      position: [
        Number((Math.cos(armAngle) * distance).toFixed(4)),
        Number(y.toFixed(4)),
        Number((Math.sin(armAngle) * distance).toFixed(4)),
      ],
      colorKey: `${philosopher.civilization}:${primaryTradition}`,
      periodBucket,
      radius: Number((0.065 + philosopher.influenceWeight * 0.018 + Math.min(count, 8) * 0.005).toFixed(4)),
    };
  });
}
