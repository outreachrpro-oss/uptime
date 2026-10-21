import { LegalPageShell } from "@/components/marketing/legal-page-shell";
import { LegalSection } from "@/components/marketing/legal-section";
import { appConfig, companyConfig, emailConfig } from "@/lib/config";
import { createPageMetadata } from "@/lib/marketing/metadata";

export const metadata = createPageMetadata({
  title: "Privacy Policy",
  description: `Privacy Policy for ${appConfig.name}.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPageShell title="Privacy Policy" currentPath="/privacy">
      <LegalSection number="01" title="Controller">
        <p>
          {companyConfig.legalName} (Company No. {companyConfig.registrationNumber})
          is the data controller for personal data processed through {appConfig.name}.
          Registered office: {companyConfig.registeredOffice.full}. Contact:{" "}
          {emailConfig.support}.
        </p>
      </LegalSection>

      <LegalSection number="02" title="Scope">
        <p>
          This Privacy Policy explains how we collect and use personal data when you
          visit our marketing site, create an account, use the Service, or contact us.
        </p>
      </LegalSection>

      <LegalSection number="03" title="Data we may collect">
        <ul>
          <li>
            <strong>Account data:</strong> name, email, organization details,
            authentication logs
          </li>
          <li>
            <strong>Billing data:</strong> subscription status, payment references
            (processed by payment providers)
          </li>
          <li>
            <strong>Service data:</strong> monitor URLs, alert settings, check results,
            incident records
          </li>
          <li>
            <strong>Communications:</strong> support tickets and contact form messages
          </li>
          <li>
            <strong>Technical data:</strong> IP address, browser type, device
            identifiers, cookies (see Cookie Policy)
          </li>
        </ul>
      </LegalSection>

      <LegalSection number="04" title="Purposes and lawful bases (UK GDPR)">
        <p>We process personal data to:</p>
        <ul>
          <li>Provide and secure the Service (contract; legitimate interests)</li>
          <li>Bill and administer subscriptions (contract; legal obligation)</li>
          <li>
            Respond to enquiries and support requests (contract; legitimate interests)
          </li>
          <li>Improve reliability and prevent abuse (legitimate interests)</li>
          <li>Comply with law (legal obligation)</li>
          <li>
            Send service-related messages (contract); marketing only with consent where
            required
          </li>
        </ul>
      </LegalSection>

      <LegalSection number="05" title="Sharing">
        <p>
          We may share data with infrastructure, email, payment, and analytics
          providers who process data on our instructions. We may disclose data if
          required by law or to protect rights and safety. A subprocessors list may
          be published separately as the Service matures.
        </p>
      </LegalSection>

      <LegalSection number="06" title="International transfers">
        <p>
          If data is transferred outside the UK, we use appropriate safeguards such as
          UK adequacy regulations or standard contractual clauses, as applicable.
        </p>
      </LegalSection>

      <LegalSection number="07" title="Retention">
        <p>
          We retain account and billing records as needed to provide the Service and
          meet legal obligations. Monitoring history retention depends on your plan.
          You may request deletion subject to exceptions (e.g. legal holds, backups).
        </p>
      </LegalSection>

      <LegalSection number="08" title="Your rights">
        <p>
          Under UK data protection law you may have rights to access, rectify, erase,
          restrict, object, and data portability, and to withdraw consent where
          processing is consent-based. You may lodge a complaint with the Information
          Commissioner&apos;s Office (ICO). Contact {emailConfig.support} to exercise
          rights.
        </p>
      </LegalSection>

      <LegalSection number="09" title="Security">
        <p>
          We implement technical and organizational measures appropriate to the risk.
          No method of transmission or storage is completely secure.
        </p>
      </LegalSection>

      <LegalSection number="10" title="Children">
        <p>The Service is not directed at children under 16.</p>
      </LegalSection>

      <LegalSection number="11" title="Changes">
        <p>
          We may update this policy and will post the revised version with a new date.
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
