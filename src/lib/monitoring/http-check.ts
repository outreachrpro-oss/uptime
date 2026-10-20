import {
  validateMonitorUrl,
  validateRedirectTarget,
  type UrlValidationResult,
} from "@/lib/security/ssrf";

export interface CheckResult {
  status: "up" | "down" | "error" | "timeout" | "unknown";
  responseTimeMs: number | null;
  statusCode: number | null;
  errorCode: string | null;
  errorMessage: string | null;
  timing: {
    dnsMs: number | null;
    connectMs: number | null;
    tlsMs: number | null;
    ttfbMs: number | null;
    totalMs: number | null;
  };
  checkedAt: Date;
}

export interface HttpCheckOptions {
  url: string;
  method?: "GET" | "HEAD" | "POST";
  timeoutMs?: number;
  expectedStatus?: number;
  keyword?: string | null;
  keywordMode?: "contains" | "not_contains" | null;
  followRedirects?: boolean;
  headers?: Record<string, string>;
  maxRedirects?: number;
}

const USER_AGENT =
  process.env.MONITOR_USER_AGENT ||
  "AROLAGB-Uptime-Monitor/1.0 (+https://arolagblimited.store)";

function fail(
  errorCode: string,
  errorMessage: string,
  status: CheckResult["status"] = "down",
  startedAt: number
): CheckResult {
  return {
    status,
    responseTimeMs: Date.now() - startedAt,
    statusCode: null,
    errorCode,
    errorMessage,
    timing: {
      dnsMs: null,
      connectMs: null,
      tlsMs: null,
      ttfbMs: null,
      totalMs: Date.now() - startedAt,
    },
    checkedAt: new Date(),
  };
}

export async function performHttpCheck(
  options: HttpCheckOptions
): Promise<CheckResult> {
  const startedAt = Date.now();
  const timeoutMs = options.timeoutMs ?? 10_000;
  const maxRedirects = options.maxRedirects ?? 5;

  const validation = await validateMonitorUrl(options.url);
  if (!validation.ok) {
    return fail("SSRF_BLOCKED", validation.reason, "error", startedAt);
  }

  let currentUrl = validation.url.toString();
  let redirects = 0;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    while (redirects <= maxRedirects) {
      const requestStart = Date.now();
      const response = await fetch(currentUrl, {
        method: options.method || "GET",
        redirect: "manual",
        signal: controller.signal,
        headers: {
          "User-Agent": USER_AGENT,
          Accept: "*/*",
          ...(options.headers || {}),
        },
      });

      const ttfbMs = Date.now() - requestStart;

      // Handle redirects with revalidation
      if (
        options.followRedirects !== false &&
        [301, 302, 303, 307, 308].includes(response.status)
      ) {
        const location = response.headers.get("location");
        if (!location) {
          return fail("REDIRECT_NO_LOCATION", "Redirect without Location header", "down", startedAt);
        }
        const redirectCheck: UrlValidationResult = await validateRedirectTarget(
          location,
          currentUrl
        );
        if (!redirectCheck.ok) {
          return fail("SSRF_REDIRECT_BLOCKED", redirectCheck.reason, "error", startedAt);
        }
        currentUrl = redirectCheck.url.toString();
        redirects += 1;
        if (redirects > maxRedirects) {
          return fail("TOO_MANY_REDIRECTS", "Exceeded maximum redirects", "down", startedAt);
        }
        continue;
      }

      const expected = options.expectedStatus ?? 200;
      const totalMs = Date.now() - startedAt;
      let body = "";

      if (options.keyword) {
        body = await response.text();
      }

      if (response.status !== expected) {
        return {
          status: "down",
          responseTimeMs: totalMs,
          statusCode: response.status,
          errorCode: "UNEXPECTED_STATUS",
          errorMessage: `Expected HTTP ${expected}, got ${response.status}`,
          timing: {
            dnsMs: null,
            connectMs: null,
            tlsMs: null,
            ttfbMs,
            totalMs,
          },
          checkedAt: new Date(),
        };
      }

      if (options.keyword && options.keywordMode) {
        const found = body.includes(options.keyword);
        const ok =
          options.keywordMode === "contains" ? found : !found;
        if (!ok) {
          return {
            status: "down",
            responseTimeMs: totalMs,
            statusCode: response.status,
            errorCode: "KEYWORD_MISMATCH",
            errorMessage:
              options.keywordMode === "contains"
                ? "Expected keyword not found in response"
                : "Forbidden keyword found in response",
            timing: {
              dnsMs: null,
              connectMs: null,
              tlsMs: null,
              ttfbMs,
              totalMs,
            },
            checkedAt: new Date(),
          };
        }
      }

      return {
        status: "up",
        responseTimeMs: totalMs,
        statusCode: response.status,
        errorCode: null,
        errorMessage: null,
        timing: {
          dnsMs: null,
          connectMs: null,
          tlsMs: null,
          ttfbMs,
          totalMs,
        },
        checkedAt: new Date(),
      };
    }

    return fail("TOO_MANY_REDIRECTS", "Exceeded maximum redirects", "down", startedAt);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    if (message.includes("abort") || (error as { name?: string })?.name === "AbortError") {
      return fail("TIMEOUT", `Request timed out after ${timeoutMs}ms`, "timeout", startedAt);
    }
    if (message.includes("ENOTFOUND") || message.includes("getaddrinfo")) {
      return fail("DNS_FAILURE", "DNS resolution failed", "down", startedAt);
    }
    if (message.includes("CERT") || message.includes("SSL") || message.includes("TLS")) {
      return fail("TLS_ERROR", message, "down", startedAt);
    }
    if (message.includes("ECONNREFUSED")) {
      return fail("CONNECTION_REFUSED", "Connection refused", "down", startedAt);
    }
    if (message.includes("ECONNRESET")) {
      return fail("CONNECTION_RESET", "Connection reset", "down", startedAt);
    }
    return fail("NETWORK_ERROR", message, "error", startedAt);
  } finally {
    clearTimeout(timer);
  }
}
