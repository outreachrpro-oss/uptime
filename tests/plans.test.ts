import { describe, it, expect } from "vitest";
import { plans } from "@/lib/config";

describe("subscription plans", () => {
  it("defines starter, pro, and business plans", () => {
    expect(plans.starter.limits.monitors).toBe(5);
    expect(plans.pro.limits.monitors).toBe(50);
    expect(plans.business.limits.monitors).toBe(250);
  });

  it("enforces minimum intervals by plan", () => {
    expect(plans.starter.limits.minIntervalSeconds).toBe(300);
    expect(plans.pro.limits.minIntervalSeconds).toBe(60);
  });

  it("uses GBP currency", () => {
    expect(plans.pro.currency).toBe("GBP");
    expect(plans.business.priceMonthly).toBe(39);
  });
});
