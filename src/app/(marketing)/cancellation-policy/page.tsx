import { LegalPageShell } from "@/components/marketing/legal-page-shell";
import { appConfig, companyConfig, emailConfig } from "@/lib/config";
import { createPageMetadata } from "@/lib/marketing/metadata";

export const metadata = createPageMetadata({
  title: "Cancellation Policy",
  description: `How to cancel ${appConfig.name} subscriptions.`,
  path: "/cancellation-policy",
});

export default function CancellationPolicyPage() {
  return (
    <LegalPageShell title="Cancellation Policy">
      <h2>1. Who this applies to</h2>
      <p>
        This policy explains how to cancel paid subscriptions to {appConfig.name}{" "}
        operated by {companyConfig.legalName}.
      </p>

      <h2>2. Cancelling a paid plan</h2>
      <p>
        You may cancel renewal of a paid subscription from your account billing
        settings when that feature is available, or by emailing {emailConfig.billing}{" "}
        from your registered account email. Cancellation stops future charges; it
        does not automatically delete your account unless you request deletion
        separately.
      </p>

      <h2>3. Effect of cancellation</h2>
      <p>
        When you cancel, you typically retain access to paid features until the end
        of the current billing period. After that, your workspace may revert to
        Starter limits or become read-only according to the Terms and product
        behaviour at that time.
      </p>

      <h2>4. Free accounts</h2>
      <p>
        You may stop using a free account at any time. Contact {emailConfig.support}{" "}
        to request account deletion, subject to retention requirements in our Privacy
        Policy.
      </p>

      <h2>5. Data after cancellation</h2>
      <p>
        Monitoring history may be deleted or truncated according to your plan and
        retention settings. Export data before cancellation if you need long-term
        records.
      </p>

      <h2>6. Reinstatement</h2>
      <p>
        You may resubscribe later subject to then-current pricing and features.
        Illustrative prices on the marketing site may change before you resubscribe.
      </p>

      <h2>7. Contact</h2>
      <p>
        Billing: {emailConfig.billing} · Support: {emailConfig.support}
      </p>
    </LegalPageShell>
  );
}
