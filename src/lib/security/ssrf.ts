/**
 * SSRF protection for user-submitted monitoring URLs.
 * Blocks private networks, localhost, cloud metadata, and unsafe protocols.
 */

import { lookup } from "dns/promises";
import { isIP } from "net";

const BLOCKED_HOSTNAMES = new Set([
  "localhost",
  "metadata.google.internal",
  "metadata.google.com",
  "instance-data",
]);

const BLOCKED_IPV4_RANGES: Array<[number, number]> = [
  [ipToLong("0.0.0.0"), ipToLong("0.255.255.255")],
  [ipToLong("10.0.0.0"), ipToLong("10.255.255.255")],
  [ipToLong("100.64.0.0"), ipToLong("100.127.255.255")],
  [ipToLong("127.0.0.0"), ipToLong("127.255.255.255")],
  [ipToLong("169.254.0.0"), ipToLong("169.254.255.255")],
  [ipToLong("172.16.0.0"), ipToLong("172.31.255.255")],
  [ipToLong("192.0.0.0"), ipToLong("192.0.0.255")],
  [ipToLong("192.168.0.0"), ipToLong("192.168.255.255")],
  [ipToLong("198.18.0.0"), ipToLong("198.19.255.255")],
  [ipToLong("224.0.0.0"), ipToLong("255.255.255.255")],
];

const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);
const ALLOWED_PORTS = new Set([80, 443, 8080, 8443, 3000, 5000, 8000]);
/** TCP monitors may check common service ports — still block dangerous ones */
const BLOCKED_PORTS = new Set([
  22, 23, 25, 135, 139, 445, 1433, 1521, 3306, 3389, 5432, 5900, 6379, 11211, 27017,
]);

function ipToLong(ip: string): number {
  return ip.split(".").reduce((acc, octet) => (acc << 8) + Number(octet), 0) >>> 0;
}

function isPrivateIPv4(ip: string): boolean {
  const long = ipToLong(ip);
  return BLOCKED_IPV4_RANGES.some(([start, end]) => long >= start && long <= end);
}

function isPrivateIPv6(ip: string): boolean {
  const normalized = ip.toLowerCase();
  if (normalized === "::1" || normalized === "::") return true;
  if (normalized.startsWith("fc") || normalized.startsWith("fd")) return true; // ULA
  if (normalized.startsWith("fe80")) return true; // link-local
  if (normalized.startsWith("::ffff:")) {
    const v4 = normalized.slice(7);
    if (isIP(v4) === 4) return isPrivateIPv4(v4);
  }
  return false;
}

export function isPrivateIp(ip: string): boolean {
  const version = isIP(ip);
  if (version === 4) return isPrivateIPv4(ip);
  if (version === 6) return isPrivateIPv6(ip);
  return true;
}

export interface SafeUrlResult {
  ok: true;
  url: URL;
  resolvedIps: string[];
}

export interface UnsafeUrlResult {
  ok: false;
  reason: string;
}

export type UrlValidationResult = SafeUrlResult | UnsafeUrlResult;

export async function validateMonitorUrl(
  rawUrl: string,
  options: { allowCustomPorts?: boolean; forTcp?: boolean } = {}
): Promise<UrlValidationResult> {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return { ok: false, reason: "Invalid URL format" };
  }

  if (!ALLOWED_PROTOCOLS.has(parsed.protocol) && !options.forTcp) {
    return { ok: false, reason: "Only http and https protocols are allowed" };
  }

  const hostname = parsed.hostname.replace(/^\[|\]$/g, "").toLowerCase();

  if (!hostname) {
    return { ok: false, reason: "Hostname is required" };
  }

  if (BLOCKED_HOSTNAMES.has(hostname)) {
    return { ok: false, reason: "Hostname is not allowed" };
  }

  if (hostname.endsWith(".local") || hostname.endsWith(".internal")) {
    return { ok: false, reason: "Internal hostnames are not allowed" };
  }

  // Block cloud metadata IPs explicitly
  if (hostname === "169.254.169.254" || hostname === "metadata") {
    return { ok: false, reason: "Cloud metadata endpoints are blocked" };
  }

  const port = parsed.port
    ? Number(parsed.port)
    : parsed.protocol === "https:"
      ? 443
      : 80;

  if (BLOCKED_PORTS.has(port)) {
    return { ok: false, reason: `Port ${port} is not allowed for monitoring` };
  }

  if (!options.allowCustomPorts && !options.forTcp && !ALLOWED_PORTS.has(port)) {
    return {
      ok: false,
      reason: `Port ${port} is not in the allowed port list`,
    };
  }

  // Resolve DNS and validate all addresses (DNS rebinding protection)
  let resolvedIps: string[] = [];
  const ipVersion = isIP(hostname);

  if (ipVersion) {
    if (isPrivateIp(hostname)) {
      return { ok: false, reason: "Private or reserved IP addresses are blocked" };
    }
    resolvedIps = [hostname];
  } else {
    try {
      const results = await lookup(hostname, { all: true, verbatim: true });
      if (!results.length) {
        return { ok: false, reason: "Hostname could not be resolved" };
      }
      resolvedIps = results.map((r) => r.address);
      for (const ip of resolvedIps) {
        if (isPrivateIp(ip)) {
          return {
            ok: false,
            reason: "Hostname resolves to a private or reserved IP address",
          };
        }
      }
    } catch {
      return { ok: false, reason: "DNS lookup failed for hostname" };
    }
  }

  return { ok: true, url: parsed, resolvedIps };
}

/** Re-validate redirect targets before following */
export async function validateRedirectTarget(
  location: string,
  baseUrl: string
): Promise<UrlValidationResult> {
  try {
    const absolute = new URL(location, baseUrl).toString();
    return validateMonitorUrl(absolute);
  } catch {
    return { ok: false, reason: "Invalid redirect location" };
  }
}
