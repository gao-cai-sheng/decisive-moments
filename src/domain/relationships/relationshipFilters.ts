import type { Relationship } from "../../data/schemas";

const defaultTypes = new Set(["direct_student", "influence", "critique"]);

export function getDefaultVisibleRelationships(relationships: Relationship[]) {
  return relationships.filter(
    (relationship) =>
      relationship.confidence === "high" &&
      relationship.strength >= 2 &&
      defaultTypes.has(relationship.type),
  );
}

export function getFocusedRelationshipIds(philosopherId: string, relationships: Relationship[]) {
  return relationships
    .filter((relationship) => relationship.from === philosopherId || relationship.to === philosopherId)
    .map((relationship) => relationship.id);
}
