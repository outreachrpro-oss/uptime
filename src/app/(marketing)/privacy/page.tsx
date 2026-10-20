import { LegalPageShell } from "@/components/marketing/legal-page-shell";
import { appConfig, companyConfig, emailConfig } from "@/lib/config";
import { createPageMetadata } from "@/lib/marketing/metadata";

export const metadata = createPageMetadata({
  title: "Privacy Policy",
  description: `Privacy Policy for ${appConfig.name}.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPageShell title="Privacy Policy">
      <h2>1. Controller</h2>
      <p>
        {companyConfig.legalName} (Company No. {companyConfig.registrationNumber})
        is the data controller for personal data processed through {appConfig.name}.
        Registered office: {companyConfig.registeredOffice.full}. Contact:{" "}
        {emailConfig.support}.
      </p>

      <h2>2. Scope</h2>
      <p>
        This Privacy Policy explains how we collect and use personal data when you
        visit our marketing site, create an account, use the Service, or contact us.
      </p>

      <h2>3. Data we may collect</h2>
      <ul>
        <li>Account data: name, email, organization details, authentication logs</li>
        <li>Billing data: subscription status, payment references (processed by payment providers)</li>
        <li>Service data: monitor URLs, alert settings, check results, incident records</li>
        <li>Communications: support tickets and contact form messages</li>
        <li>Technical data: IP address, browser type, device identifiers, cookies (see Cookie Policy)</li>
      </ul>

      <h2>4. Purposes and lawful bases (UK GDPR)</h2>
      <p>We process personal data to:</p>
      <ul>
        <li>Provide and secure the Service (contract; legitimate interests)</li>
        <li>Bill and administer subscriptions (contract; legal obligation)</li>
        <li>Respond to enquiries and support requests (contract; legitimate interests)</li>
        <li>Improve reliability and prevent abuse (legitimate interests)</li>
        <li>Comply with law (legal obligation)</li>
        <li>Send service-related messages (contract); marketing only with consent where required</li>
      </ul>

      <h2>5. Sharing</h2>
      <p>
        We may share data with infrastructure, email, payment, and analytics
        providers who process data on our instructions. We may disclose data if
        required by law or to protect rights and safety. A subprocessors list may
        be published separately as the Service matures.
      </p>

      <h2>6. International transfers</h2>
      <p>
        If data is transferred outside the UK, we use appropriate safeguards such
        as UK adequacy regulations or standard contractual clauses, as applicable.
      </p>

      <h2>7. Retention</h2>
      <p>
        We retain account and billing records as needed to provide the Service and
        meet legal obligations. Monitoring history retention depends on your plan.
        You may request deletion subject to exceptions (e.g. legal holds, backups).
      </p>

      <h2>8. Your rights</h2>
      <p>
        Under UK data protection law you may have rights to access, rectify, erase,
        restrict, object, and data portability, and to withdraw consent where
        processing is consent-based. You may lodge a complaint with the Information
        Commissioner&apos;s Office (ICO). Contact {emailConfig.support} to exercise
        rights.
      </p>

      <h2>9. Security</h2>
      <p>
        We implement technical and organizational measures appropriate to the risk.
        No method of transmission or storage is completely secure.
      </p>

      <h2>10. Children</h2>
      <p>The Service is not directed at children under 16.</p>

      <h2>11. Changes</h2>
      <p>We may update this policy and will post the revised version with a new date.</p>
    </LegalPageShell>
  );
}
