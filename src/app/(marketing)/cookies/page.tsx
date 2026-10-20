import Link from "next/link";

import { LegalPageShell } from "@/components/marketing/legal-page-shell";
import { appConfig, companyConfig, emailConfig } from "@/lib/config";
import { createPageMetadata } from "@/lib/marketing/metadata";

export const metadata = createPageMetadata({
  title: "Cookie Policy",
  description: `Cookie Policy for ${appConfig.name}.`,
  path: "/cookies",
});

export default function CookiesPage() {
  return (
    <LegalPageShell title="Cookie Policy">
      <h2>1. What are cookies?</h2>
      <p>
        Cookies are small text files stored on your device when you visit a website.
        Similar technologies (local storage, pixels) may be used for comparable
        purposes.
      </p>

      <h2>2. How we use cookies</h2>
      <p>{companyConfig.legalName} may use cookies on the {appConfig.name} marketing site and application to:</p>
      <ul>
        <li>Keep you signed in and maintain session security (strictly necessary)</li>
        <li>Remember preferences such as cookie consent choices</li>
        <li>Understand aggregate usage to improve the Service (analytics, where enabled)</li>
      </ul>

      <h2>3. Categories</h2>
      <ul>
        <li>
          <strong>Strictly necessary:</strong> required for core functionality; may not
          require consent under PECR where exempt.
        </li>
        <li>
          <strong>Functional:</strong> remember settings you choose.
        </li>
        <li>
          <strong>Analytics:</strong> help us understand how features are used; deployed
          only with appropriate consent where required.
        </li>
      </ul>

      <h2>4. Managing cookies</h2>
      <p>
        You can control cookies through your browser settings. Blocking strictly
        necessary cookies may affect sign-in and security features. Where we present
        a consent banner, you can update choices at any time.
      </p>

      <h2>5. Third parties</h2>
      <p>
        Payment processors or embedded content may set their own cookies governed by
        their policies.
      </p>

      <h2>6. More information</h2>
      <p>
        See our{" "}
        <Link href="/privacy">Privacy Policy</Link>. Questions: {emailConfig.support}.
      </p>
    </LegalPageShell>
  );
}
