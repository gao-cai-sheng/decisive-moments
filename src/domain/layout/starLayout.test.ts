import { describe, expect, it } from "vitest";
import { validPhilosopher } from "../../data/fixtures";
import { computeStarLayout } from "./starLayout";

function xzDistance(position: [number, number, number]) {
  return Math.hypot(position[0], position[2]);
}

describe("computeStarLayout", () => {
  it("returns stable coordinates for the same philosopher ids", () => {
    const first = computeStarLayout([validPhilosopher], []);
    const second = computeStarLayout([validPhilosopher], []);
    expect(first[0].position).toEqual(second[0].position);
  });

  it("keeps visual radii in a star-point range", () => {
    const result = computeStarLayout(
      [validPhilosopher],
      [
        { from: "plato", to: "x" },
        { from: "y", to: "plato" },
        { from: "plato", to: "z" },
        { from: "a", to: "plato" },
      ],
    );
    expect(result[0].radius).toBeGreaterThanOrEqual(0.06);
    expect(result[0].radius).toBeLessThanOrEqual(0.16);
  });

  it("uses relationship count to increase visual size within the star-point scale", () => {
    const isolated = computeStarLayout([validPhilosopher], []);
    const connected = computeStarLayout(
      [validPhilosopher],
      [
        { from: "plato", to: "x" },
        { from: "y", to: "plato" },
      ],
    );
    expect(connected[0].radius).toBeGreaterThan(isolated[0].radius);
    expect(connected[0].radius).toBeLessThanOrEqual(0.16);
  });

  it("places older philosophers nearer the center than modern philosophers", () => {
    const [ancientNode, modernNode] = computeStarLayout(
      [
        {
          ...validPhilosopher,
          id: "ancient-philosopher",
          life: { birth: -500, death: -420, display: "500-420 BCE" },
          periods: ["classical_antiquity"],
        },
        {
          ...validPhilosopher,
          id: "modern-philosopher",
          life: { birth: 1804, death: 1872, display: "1804-1872" },
          periods: ["modern"],
        },
      ],
      [],
    );

    expect(ancientNode.periodBucket).toBe("classical");
    expect(modernNode.periodBucket).toBe("modern");
    expect(xzDistance(modernNode.position)).toBeGreaterThanOrEqual(xzDistance(ancientNode.position) + 5);
  });

  it("uses period buckets when exact chronology is missing", () => {
    const [node] = computeStarLayout(
      [
        {
          ...validPhilosopher,
          id: "period-only-philosopher",
          life: { display: "medieval" },
          periods: ["medieval"],
        },
      ],
      [],
    );

    expect(node.periodBucket).toBe("medieval");
    expect(xzDistance(node.position)).toBeGreaterThanOrEqual(8);
    expect(xzDistance(node.position)).toBeLessThanOrEqual(12);
  });

  it("recognizes space-separated early modern period labels", () => {
    const [node] = computeStarLayout(
      [
        {
          ...validPhilosopher,
          id: "early-modern-spaces",
          life: { display: "early modern" },
          periods: ["early modern"],
        },
      ],
      [],
    );

    expect(node.periodBucket).toBe("early_modern");
  });

  it("recognizes hyphenated early modern period labels", () => {
    const [node] = computeStarLayout(
      [
        {
          ...validPhilosopher,
          id: "early-modern-hyphen",
          life: { display: "early-modern" },
          periods: ["early-modern"],
        },
      ],
      [],
    );

    expect(node.periodBucket).toBe("early_modern");
  });

  it("recognizes space-separated global modern period labels as contemporary", () => {
    const [node] = computeStarLayout(
      [
        {
          ...validPhilosopher,
          id: "global-modern-spaces",
          life: { display: "global modern" },
          periods: ["global modern"],
        },
      ],
      [],
    );

    expect(node.periodBucket).toBe("contemporary");
  });

  it("prefers birth year over conflicting period labels", () => {
    const [node] = computeStarLayout(
      [
        {
          ...validPhilosopher,
          id: "modern-with-classical-label",
          life: { birth: 1804, death: 1872, display: "1804-1872" },
          periods: ["classical_antiquity"],
        },
      ],
      [],
    );

    expect(node.periodBucket).toBe("modern");
    expect(xzDistance(node.position)).toBeGreaterThan(13);
  });

  it("uses death year when birth year is absent", () => {
    const [node] = computeStarLayout(
      [
        {
          ...validPhilosopher,
          id: "death-only-medieval",
          life: { death: 1274, display: "卒于 1274" },
          periods: ["modern"],
        },
      ],
      [],
    );

    expect(node.periodBucket).toBe("medieval");
    expect(xzDistance(node.position)).toBeGreaterThan(13);
  });

  it("spreads unknown chronology entries through a stable middle band", () => {
    const nodes = computeStarLayout(
      [
        {
          ...validPhilosopher,
          id: "first-release-a",
          life: { display: "first release" },
          periods: ["first_release"],
        },
        {
          ...validPhilosopher,
          id: "first-release-b",
          life: { display: "first release" },
          periods: ["first_release"],
        },
        {
          ...validPhilosopher,
          id: "first-release-c",
          life: { display: "first release" },
          periods: ["first_release"],
        },
      ],
      [],
    );

    const distances = nodes.map((node) => xzDistance(node.position));
    expect(nodes.every((node) => node.periodBucket === "unknown")).toBe(true);
    expect(distances.every((distance) => distance >= 10 && distance <= 15.5)).toBe(true);
    expect(new Set(distances.map((distance) => distance.toFixed(1))).size).toBeGreaterThan(1);
  });

  it("includes the primary tradition in the color key", () => {
    const [node] = computeStarLayout(
      [
        {
          ...validPhilosopher,
          id: "confucius",
          civilization: "chinese",
          traditions: ["confucianism"],
        },
      ],
      [],
    );

    expect(node.colorKey).toBe("chinese:confucianism");
  });
});
