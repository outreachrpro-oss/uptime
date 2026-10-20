import net from "net";
import { validateMonitorUrl } from "@/lib/security/ssrf";
import type { CheckResult } from "./http-check";

export async function performTcpCheck(options: {
  host: string;
  port: number;
  timeoutMs?: number;
}): Promise<CheckResult> {
  const startedAt = Date.now();
  const timeoutMs = options.timeoutMs ?? 10_000;

  // Validate via synthetic URL for SSRF checks
  const validation = await validateMonitorUrl(
    `http://${options.host}:${options.port}/`,
    { forTcp: true, allowCustomPorts: true }
  );

  if (!validation.ok) {
    return {
      status: "error",
      responseTimeMs: Date.now() - startedAt,
      statusCode: null,
      errorCode: "SSRF_BLOCKED",
      errorMessage: validation.reason,
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

  return new Promise((resolve) => {
    const socket = new net.Socket();
    let settled = false;

    const finish = (result: CheckResult) => {
      if (settled) return;
      settled = true;
      socket.destroy();
      resolve(result);
    };

    socket.setTimeout(timeoutMs);

    socket.once("connect", () => {
      const totalMs = Date.now() - startedAt;
      finish({
        status: "up",
        responseTimeMs: totalMs,
        statusCode: null,
        errorCode: null,
        errorMessage: null,
        timing: {
          dnsMs: null,
          connectMs: totalMs,
          tlsMs: null,
          ttfbMs: null,
          totalMs,
        },
        checkedAt: new Date(),
      });
    });

    socket.once("timeout", () => {
      finish({
        status: "timeout",
        responseTimeMs: Date.now() - startedAt,
        statusCode: null,
        errorCode: "TIMEOUT",
        errorMessage: `TCP connection timed out after ${timeoutMs}ms`,
        timing: {
          dnsMs: null,
          connectMs: null,
          tlsMs: null,
          ttfbMs: null,
          totalMs: Date.now() - startedAt,
        },
        checkedAt: new Date(),
      });
    });

    socket.once("error", (err) => {
      finish({
        status: "down",
        responseTimeMs: Date.now() - startedAt,
        statusCode: null,
        errorCode: "TCP_ERROR",
        errorMessage: err.message,
        timing: {
          dnsMs: null,
          connectMs: null,
          tlsMs: null,
          ttfbMs: null,
          totalMs: Date.now() - startedAt,
        },
        checkedAt: new Date(),
      });
    });

    socket.connect(options.port, options.host);
  });
}
