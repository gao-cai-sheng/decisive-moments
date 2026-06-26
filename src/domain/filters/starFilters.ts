import type { PhilosopherIndexEntry, Relationship, RelationshipType } from "../../data/schemas";

export type StarMapFilters = {
  civilization?: string;
  period?: string;
  tradition?: string;
  theme?: string;
  relationshipTypes: RelationshipType[];
};

function matchesOptional(value: string | undefined, expected: string | undefined) {
  return !expected || value === expected;
}

function includesOptional(values: string[], expected: string | undefined) {
  return !expected || values.includes(expected);
}

export function filterPhilosophersForStarMap(
  philosophers: PhilosopherIndexEntry[],
  filters: StarMapFilters,
) {
  return philosophers.filter(
    (philosopher) =>
      matchesOptional(philosopher.civilization, filters.civilization) &&
      includesOptional(philosopher.periods, filters.period) &&
      includesOptional(philosopher.traditions, filters.tradition) &&
      includesOptional(philosopher.themes, filters.theme),
  );
}

export function filterRelationshipsForStarMap(
  relationships: Relationship[],
  visiblePhilosophers: Pick<PhilosopherIndexEntry, "id">[],
  filters: StarMapFilters,
) {
  const visibleIds = new Set(visiblePhilosophers.map((philosopher) => philosopher.id));
  const selectedTypes = new Set(filters.relationshipTypes);

  return relationships.filter(
    (relationship) =>
      visibleIds.has(relationship.from) &&
      visibleIds.has(relationship.to) &&
      (selectedTypes.size === 0 || selectedTypes.has(relationship.type)),
  );
}
