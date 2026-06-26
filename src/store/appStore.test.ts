import { beforeEach, describe, expect, it } from "vitest";
import { useAppStore } from "./appStore";

describe("app store thought selections", () => {
  beforeEach(() => {
    useAppStore.setState({
      selectedPhilosopherId: null,
      selectedThoughtProblemId: null,
      selectedThoughtClaimId: null,
    });
  });

  it("tracks selected thought problem and claim ids", () => {
    expect(useAppStore.getState().selectedThoughtProblemId).toBeNull();
    expect(useAppStore.getState().selectedThoughtClaimId).toBeNull();

    useAppStore.getState().selectThoughtProblem("problem-1");
    expect(useAppStore.getState().selectedThoughtProblemId).toBe("problem-1");
    expect(useAppStore.getState().selectedThoughtClaimId).toBeNull();

    useAppStore.getState().selectThoughtClaim("claim-1");
    expect(useAppStore.getState().selectedThoughtClaimId).toBe("claim-1");

    useAppStore.getState().selectThoughtProblem(null);
    expect(useAppStore.getState().selectedThoughtProblemId).toBeNull();
    expect(useAppStore.getState().selectedThoughtClaimId).toBeNull();
  });

  it("clears selected thought ids when selecting a different philosopher", () => {
    useAppStore.getState().selectThoughtProblem("problem-1");
    useAppStore.getState().selectThoughtClaim("claim-1");

    useAppStore.getState().selectPhilosopher("aristotle");

    expect(useAppStore.getState().selectedPhilosopherId).toBe("aristotle");
    expect(useAppStore.getState().selectedThoughtProblemId).toBeNull();
    expect(useAppStore.getState().selectedThoughtClaimId).toBeNull();
  });

  it("clears selected claim when selecting a different thought problem", () => {
    useAppStore.getState().selectThoughtProblem("problem-1");
    useAppStore.getState().selectThoughtClaim("claim-1");

    useAppStore.getState().selectThoughtProblem("problem-2");

    expect(useAppStore.getState().selectedThoughtProblemId).toBe("problem-2");
    expect(useAppStore.getState().selectedThoughtClaimId).toBeNull();
  });
});

describe("app store star map filters", () => {
  beforeEach(() => {
    useAppStore.setState({
      filters: { relationshipTypes: [] },
    });
  });

  it("sets and clears one star map filter at a time", () => {
    useAppStore.getState().setFilter("civilization", "chinese");
    useAppStore.getState().setFilter("theme", "ethics");

    expect(useAppStore.getState().filters).toEqual({
      civilization: "chinese",
      theme: "ethics",
      relationshipTypes: [],
    });

    useAppStore.getState().setFilter("civilization", "");

    expect(useAppStore.getState().filters).toEqual({
      theme: "ethics",
      relationshipTypes: [],
    });
  });

  it("toggles relationship type filters", () => {
    useAppStore.getState().toggleRelationshipType("influence");
    useAppStore.getState().toggleRelationshipType("critique");
    useAppStore.getState().toggleRelationshipType("influence");

    expect(useAppStore.getState().filters.relationshipTypes).toEqual(["critique"]);
  });

  it("clears all star map filters", () => {
    useAppStore.getState().setFilter("period", "modern");
    useAppStore.getState().toggleRelationshipType("influence");

    useAppStore.getState().clearFilters();

    expect(useAppStore.getState().filters).toEqual({ relationshipTypes: [] });
  });
});
