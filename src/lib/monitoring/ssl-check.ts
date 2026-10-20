import tls from "tls";
import { validateMonitorUrl } from "@/lib/security/ssrf";
import type { CheckResult } from "./http-check";

export interface SslCheckResult extends CheckResult {
  sslExpiresAt: Date | null;
  sslIssuer: string | null;
  sslValid: boolean | null;
  daysUntilExpiry: number | null;
}

export async function performSslCheck(options: {
  host: string;
  port?: number;
  timeoutMs?: number;
}): Promise<SslCheckResult> {
  const startedAt = Date.now();
  const port = options.port ?? 443;
  const timeoutMs = options.timeoutMs ?? 10_000;

  const validation = await validateMonitorUrl(`https://${options.host}/`, {
    allowCustomPorts: true,
  });

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
      sslExpiresAt: null,
      sslIssuer: null,
      sslValid: null,
      daysUntilExpiry: null,
    };
  }

  return new Promise((resolve) => {
    const socket = tls.connect(
      {
        host: options.host,
        port,
        servername: options.host,
        rejectUnauthorized: true,
        timeout: timeoutMs,
      },
      () => {
        const cert = socket.getPeerCertificate();
        const totalMs = Date.now() - startedAt;
        const validTo = cert?.valid_to ? new Date(cert.valid_to) : null;
        const daysUntilExpiry = validTo
          ? Math.floor((validTo.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
          : null;
        const authorized = socket.authorized;
        const expired = validTo ? validTo.getTime() < Date.now() : true;

        socket.end();

        resolve({
          status: authorized && !expired ? "up" : "down",
          responseTimeMs: totalMs,
          statusCode: null,
          errorCode: !authorized
            ? "SSL_INVALID"
            : expired
              ? "SSL_EXPIRED"
              : null,
          errorMessage: !authorized
            ? socket.authorizationError instanceof Error
              ? socket.authorizationError.message
              : socket.authorizationError || "Certificate not authorized"
            : expired
              ? "Certificate has expired"
              : null,
          timing: {
            dnsMs: null,
            connectMs: null,
            tlsMs: totalMs,
            ttfbMs: null,
            totalMs,
          },
          checkedAt: new Date(),
          sslExpiresAt: validTo,
          sslIssuer: cert?.issuer
            ? Object.values(cert.issuer).join(", ")
            : null,
          sslValid: authorized && !expired,
          daysUntilExpiry,
        });
      }
    );

    socket.on("error", (err) => {
      resolve({
        status: "down",
        responseTimeMs: Date.now() - startedAt,
        statusCode: null,
        errorCode: "SSL_ERROR",
        errorMessage: err.message,
        timing: {
          dnsMs: null,
          connectMs: null,
          tlsMs: null,
          ttfbMs: null,
          totalMs: Date.now() - startedAt,
        },
        checkedAt: new Date(),
        sslExpiresAt: null,
        sslIssuer: null,
        sslValid: false,
        daysUntilExpiry: null,
      });
    });

    socket.on("timeout", () => {
      socket.destroy();
      resolve({
        status: "timeout",
        responseTimeMs: Date.now() - startedAt,
        statusCode: null,
        errorCode: "TIMEOUT",
        errorMessage: `SSL check timed out after ${timeoutMs}ms`,
        timing: {
          dnsMs: null,
          connectMs: null,
          tlsMs: null,
          ttfbMs: null,
          totalMs: Date.now() - startedAt,
        },
        checkedAt: new Date(),
        sslExpiresAt: null,
        sslIssuer: null,
        sslValid: null,
        daysUntilExpiry: null,
      });
    });
  });
}
