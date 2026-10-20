import type { MetadataRoute } from "next";
import { appConfig } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = appConfig.url;
  const routes = [
    "",
    "/features",
    "/pricing",
    "/how-it-works",
    "/faq",
    "/about",
    "/contact",
    "/terms",
    "/privacy",
    "/cookies",
    "/refund-policy",
    "/cancellation-policy",
  ];

  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
