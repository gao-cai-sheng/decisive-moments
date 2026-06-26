import { describe, expect, it } from "vitest";
import { validRelationship } from "../../data/fixtures";
import { getDefaultVisibleRelationships, getFocusedRelationshipIds } from "./relationshipFilters";

describe("relationship filters", () => {
  it("keeps high-confidence direct relationships in default view", () => {
    expect(getDefaultVisibleRelationships([validRelationship])).toHaveLength(1);
  });

  it("finds relationships connected to selected philosopher", () => {
    expect(getFocusedRelationshipIds("plato", [validRelationship])).toEqual(["socrates-plato-direct"]);
  });
});
