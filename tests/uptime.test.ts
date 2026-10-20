import { describe, it, expect } from "vitest";

/**
 * Uptime calculation helper (mirrors dashboard logic).
 * Successful checks / total observed checks — does not invent unavailable periods.
 */
function calculateUptimePercent(
  successful: number,
  total: number
): number | null {
  if (total === 0) return null;
  return Math.round((successful / total) * 10000) / 100;
}

describe("uptime calculation", () => {
  it("returns null when no observations", () => {
    expect(calculateUptimePercent(0, 0)).toBeNull();
  });

  it("calculates percentage from observations only", () => {
    expect(calculateUptimePercent(99, 100)).toBe(99);
    expect(calculateUptimePercent(100, 100)).toBe(100);
    expect(calculateUptimePercent(1, 3)).toBe(33.33);
  });
});
