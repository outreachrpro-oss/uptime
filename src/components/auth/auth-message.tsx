"use client";

import { cn } from "@/lib/utils";

type AuthMessageProps = {
  error?: string | null;
  success?: string | null;
};

export function AuthMessage({ error, success }: AuthMessageProps) {
  if (!error && !success) return null;
  return (
    <div
      role="alert"
      className={cn(
        "rounded-lg border px-3 py-2 text-sm",
        error
          ? "border-danger/30 bg-danger/10 text-danger"
          : "border-success/30 bg-success/10 text-success"
      )}
    >
      {error ?? success}
    </div>
  );
}
