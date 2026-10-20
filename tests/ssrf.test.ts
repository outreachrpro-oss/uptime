import { describe, it, expect } from "vitest";
import { isPrivateIp, validateMonitorUrl } from "@/lib/security/ssrf";

describe("SSRF protection", () => {
  it("blocks private IPv4 addresses", () => {
    expect(isPrivateIp("127.0.0.1")).toBe(true);
    expect(isPrivateIp("10.0.0.1")).toBe(true);
    expect(isPrivateIp("192.168.1.1")).toBe(true);
    expect(isPrivateIp("169.254.169.254")).toBe(true);
    expect(isPrivateIp("172.16.0.1")).toBe(true);
  });

  it("allows public IPv4 addresses", () => {
    expect(isPrivateIp("8.8.8.8")).toBe(false);
    expect(isPrivateIp("1.1.1.1")).toBe(false);
  });

  it("blocks localhost hostnames", async () => {
    const result = await validateMonitorUrl("http://localhost/admin");
    expect(result.ok).toBe(false);
  });

  it("blocks non-http protocols", async () => {
    const result = await validateMonitorUrl("file:///etc/passwd");
    expect(result.ok).toBe(false);
  });

  it("blocks cloud metadata IP", async () => {
    const result = await validateMonitorUrl("http://169.254.169.254/latest/meta-data/");
    expect(result.ok).toBe(false);
  });

  it("blocks private IP literals in URLs", async () => {
    const result = await validateMonitorUrl("http://192.168.0.1/");
    expect(result.ok).toBe(false);
  });
});
