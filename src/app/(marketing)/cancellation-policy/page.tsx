import { LegalPageShell } from "@/components/marketing/legal-page-shell";
import { LegalSection } from "@/components/marketing/legal-section";
import { appConfig, companyConfig, emailConfig } from "@/lib/config";
import { createPageMetadata } from "@/lib/marketing/metadata";

export const metadata = createPageMetadata({
  title: "Cancellation Policy",
  description: `How to cancel ${appConfig.name} subscriptions.`,
  path: "/cancellation-policy",
});

export default function CancellationPolicyPage() {
  return (
    <LegalPageShell title="Cancellation Policy" currentPath="/cancellation-policy">
      <LegalSection number="01" title="Who this applies to">
        <p>
          This policy explains how to cancel paid subscriptions to {appConfig.name}{" "}
          operated by {companyConfig.legalName}.
        </p>
      </LegalSection>

      <LegalSection number="02" title="Cancelling a paid plan">
        <p>
          You may cancel renewal of a paid subscription from your account billing
          settings when that feature is available, or by emailing {emailConfig.billing}{" "}
          from your registered account email. Cancellation stops future charges; it
          does not automatically delete your account unless you request deletion
          separately.
        </p>
      </LegalSection>

      <LegalSection number="03" title="Effect of cancellation">
        <p>
          When you cancel, you typically retain access to paid features until the end
          of the current billing period. After that, your workspace may revert to
          Starter limits or become read-only according to the Terms and product
          behaviour at that time.
        </p>
      </LegalSection>

      <LegalSection number="04" title="Free accounts">
        <p>
          You may stop using a free account at any time. Contact {emailConfig.support}{" "}
          to request account deletion, subject to retention requirements in our Privacy
          Policy.
        </p>
      </LegalSection>

      <LegalSection number="05" title="Data after cancellation">
        <p>
          Monitoring history may be deleted or truncated according to your plan and
          retention settings. Export data before cancellation if you need long-term
          records.
        </p>
      </LegalSection>

      <LegalSection number="06" title="Reinstatement">
        <p>
          You may resubscribe later subject to then-current pricing and features.
        </p>
      </LegalSection>

      <LegalSection number="07" title="Contact">
        <p>
          Billing: {emailConfig.billing} · Support: {emailConfig.support}
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
