import type { Metadata } from "next";
import { appConfig } from "@/lib/config";
import { StatusPageView } from "@/components/status/status-page-view";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Status — ${slug} | ${appConfig.name}`,
    description: `Public system status page for ${slug}`,
    robots: { index: true, follow: true },
  };
}

export default async function PublicStatusPage({ params }: Props) {
  const { slug } = await params;
  return <StatusPageView slug={slug} />;
}
