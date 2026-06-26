import { describe, expect, it, vi } from "vitest";

vi.mock("@react-three/drei", () => ({
  Html: () => null,
  Sphere: () => null,
}));
vi.mock("three", () => ({ AdditiveBlending: 2 }));

import * as PhilosopherStars from "./PhilosopherStars";

const getStarColor = (PhilosopherStars as { getStarColor?: (colorKey: string) => string }).getStarColor;

describe("getStarColor", () => {
  it("uses a confucianism variant for Chinese stars", () => {
    expect(getStarColor?.("chinese:confucianism")).toBe("#d8a24f");
  });

  it("uses a daoism variant for Chinese stars", () => {
    expect(getStarColor?.("chinese:daoism")).toBe("#a9c96e");
  });

  it("keeps Chinese school variants visually distinct", () => {
    expect(getStarColor?.("chinese:confucianism")).not.toBe(getStarColor?.("chinese:daoism"));
  });

  it("falls back to civilization colors for unknown traditions", () => {
    expect(getStarColor?.("indian:unknown_tradition")).toBe("#55d2a7");
  });

  it("uses the Japanese civilization color for unknown Japanese traditions", () => {
    expect(getStarColor?.("japanese:zen_buddhism")).toBe("#ff8fb3");
    expect(getStarColor?.("japanese:zen_buddhism")).not.toBe("#d8a24f");
  });

  it("uses the African civilization color for unknown African traditions", () => {
    expect(getStarColor?.("african:african_philosophy")).toBe("#f2b35d");
    expect(getStarColor?.("african:african_philosophy")).not.toBe("#d8a24f");
  });

  it("falls back to the default star color for unknown civilizations", () => {
    expect(getStarColor?.("unknown:unknown")).toBe("#d8a24f");
  });
});
