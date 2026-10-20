"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "arolagb_cookie_consent";

/**
 * Renders nothing on the server and on the first client paint,
 * then shows after mount — avoids hydration mismatches from localStorage.
 */
export function CookieBanner() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function save(analytics: boolean) {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          necessary: true,
          analytics,
          marketing: false,
          at: new Date().toISOString(),
        })
      );
    } catch {
      /* ignore */
    }
    setVisible(false);
  }

  if (!mounted || !visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-lg rounded-2xl border border-border bg-white p-5 shadow-2xl"
    >
      <p className="text-sm text-ink-soft">
        We use necessary cookies to run the service. Optional analytics cookies
        stay off until you choose to enable them.{" "}
        <Link
          href="/cookies"
          className="font-medium text-ink underline-offset-2 hover:underline"
        >
          Cookie Policy
        </Link>
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button size="sm" onClick={() => save(false)}>
          Necessary only
        </Button>
        <Button size="sm" variant="outline" onClick={() => save(true)}>
          Accept analytics
        </Button>
      </div>
    </div>
  );
}
