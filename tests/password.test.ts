import { describe, it, expect } from "vitest";
import {
  hashPassword,
  verifyPassword,
  validatePasswordStrength,
} from "@/lib/security/password";

describe("password security", () => {
  it("validates password strength", () => {
    expect(validatePasswordStrength("weak").ok).toBe(false);
    expect(validatePasswordStrength("StrongPass1").ok).toBe(true);
  });

  it("hashes and verifies passwords", async () => {
    const hash = await hashPassword("StrongPass1");
    expect(hash).not.toContain("StrongPass1");
    expect(await verifyPassword("StrongPass1", hash)).toBe(true);
    expect(await verifyPassword("WrongPass1", hash)).toBe(false);
  });
});
