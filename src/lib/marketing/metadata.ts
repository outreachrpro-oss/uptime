import type { Metadata } from "next";
import { appConfig } from "@/lib/config";

const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL || "https://arolagblimited.store";

export function createPageMetadata({
  title,
  description,
  path = "",
}: {
  title: string;
  description: string;
  path?: string;
}): Metadata {
  const url = `${baseUrl.replace(/\/$/, "")}${path}`;
  const ogTitle =
    title === appConfig.name ? `${appConfig.name} — ${appConfig.tagline}` : title;

  return {
    title,
    description,
    openGraph: {
      title: ogTitle,
      description,
      url,
      siteName: appConfig.name,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
    },
  };
}
