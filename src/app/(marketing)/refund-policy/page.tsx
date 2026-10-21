import { LegalPageShell } from "@/components/marketing/legal-page-shell";
import { LegalSection } from "@/components/marketing/legal-section";
import { appConfig, companyConfig, emailConfig } from "@/lib/config";
import { createPageMetadata } from "@/lib/marketing/metadata";

export const metadata = createPageMetadata({
  title: "Refund Policy",
  description: `Refund Policy for paid subscriptions to ${appConfig.name}.`,
  path: "/refund-policy",
});

export default function RefundPolicyPage() {
  return (
    <LegalPageShell title="Refund Policy" currentPath="/refund-policy">
      <LegalSection number="01" title="Overview">
        <p>
          This Refund Policy applies to paid subscriptions for {appConfig.name}{" "}
          provided by {companyConfig.legalName}. It should be read with our Terms of
          Service and Cancellation Policy.
        </p>
      </LegalSection>

      <LegalSection number="02" title="Free plan">
        <p>
          The Starter plan is free. No payment is taken and no refunds apply to free
          accounts.
        </p>
      </LegalSection>

      <LegalSection number="03" title="Paid subscriptions">
        <p>
          Fees are generally charged in advance for the billing period you select
          (monthly or yearly). Unless required by applicable consumer law or expressly
          stated in a separate written agreement, fees already paid are non-refundable
          once the billing period has started.
        </p>
      </LegalSection>

      <LegalSection number="04" title="Statutory rights">
        <p>
          If you are a consumer in the UK, you may have a 14-day right to cancel
          certain distance contracts. Digital services may begin during the
          cancellation period if you expressly request immediate access and
          acknowledge you may lose the right to cancel once performance has started.
          This policy does not affect mandatory statutory rights.
        </p>
      </LegalSection>

      <LegalSection number="05" title="Billing errors and exceptional cases">
        <p>
          If you believe you were charged incorrectly, contact {emailConfig.billing}{" "}
          within 30 days of the charge with your account email and invoice reference.
          We will review good-faith billing errors and may issue account credit or
          refund at our discretion where appropriate. We do not guarantee refunds for
          dissatisfaction with monitoring outcomes or missed alerts caused by
          third-party networks, misconfiguration, or factors outside our reasonable
          control.
        </p>
      </LegalSection>

      <LegalSection number="06" title="Chargebacks">
        <p>
          Please contact us before initiating a chargeback so we can resolve issues
          directly. Unjustified chargebacks may lead to account suspension.
        </p>
      </LegalSection>

      <LegalSection number="07" title="Contact">
        <p>{emailConfig.billing}</p>
      </LegalSection>
    </LegalPageShell>
  );
}
