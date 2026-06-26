import { describe, expect, it } from "vitest";
import { validArgument, validPhilosopher, validTheme } from "../fixtures";
import { searchArgumentsLocal } from "./argumentSearch";
import { searchPhilosophersLocal } from "./philosopherSearch";

describe("local search", () => {
  it("finds arguments through theme aliases", () => {
    const results = searchArgumentsLocal("公平是什么", [validArgument], [validTheme]);
    expect(results[0].item.id).toBe("plato-justice-soul-order");
    expect(results[0].score).toBeGreaterThan(0);
  });

  it("finds philosophers by Chinese and English names", () => {
    expect(searchPhilosophersLocal("柏拉图", [validPhilosopher])[0].item.id).toBe("plato");
    expect(searchPhilosophersLocal("Plato", [validPhilosopher])[0].item.id).toBe("plato");
  });
});
