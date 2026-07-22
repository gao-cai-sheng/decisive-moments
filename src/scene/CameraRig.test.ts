import { describe, expect, it } from "vitest";
import { GALAXY_AUTO_ROTATE_SPEED, getGalaxyAutoRotateSpeed, interpolateTarget } from "./CameraRig";

describe("CameraRig target interpolation", () => {
  it("moves the current orbit target toward the selected star without snapping", () => {
    const current: [number, number, number] = [0, 0, 0];
    const target: [number, number, number] = [10, 0, 0];

    const next = interpolateTarget(current, target, 1 / 60, 8);

    expect(next[0]).toBeGreaterThan(0);
    expect(next[0]).toBeLessThan(10);
    expect(next[1]).toBe(0);
    expect(next[2]).toBe(0);
  });

  it("keeps interpolation stable across larger frame deltas", () => {
    const next = interpolateTarget([0, 0, 0], [10, 5, -5], 0.5, 8);

    expect(next[0]).toBeGreaterThan(9.8);
    expect(next[1]).toBeGreaterThan(4.9);
    expect(next[2]).toBeLessThan(-4.9);
  });
  it("uses a slow galaxy auto-rotation speed by default", () => {
    expect(getGalaxyAutoRotateSpeed(false)).toBe(GALAXY_AUTO_ROTATE_SPEED);
    expect(getGalaxyAutoRotateSpeed(false)).toBeGreaterThan(0);
    expect(getGalaxyAutoRotateSpeed(false)).toBeLessThan(0.25);
  });

  it("disables galaxy auto-rotation when reduced motion is requested", () => {
    expect(getGalaxyAutoRotateSpeed(true)).toBe(0);
  });

});
