import { LegalPageShell } from "@/components/marketing/legal-page-shell";
import { LegalSection } from "@/components/marketing/legal-section";
import { appConfig, companyConfig, emailConfig } from "@/lib/config";
import { createPageMetadata } from "@/lib/marketing/metadata";

export const metadata = createPageMetadata({
  title: "Terms of Service",
  description: `Terms of Service for ${appConfig.name}, operated by ${companyConfig.legalName}.`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPageShell title="Terms of Service" currentPath="/terms">
      <LegalSection number="01" title="Agreement">
        <p>
          These Terms of Service (&quot;Terms&quot;) govern access to and use of{" "}
          {appConfig.name} (the &quot;Service&quot;) provided by{" "}
          {companyConfig.legalName} (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;),
          a company registered in {companyConfig.jurisdiction} (Company No.{" "}
          {companyConfig.registrationNumber}), with registered office at{" "}
          {companyConfig.registeredOffice.full}.
        </p>
        <p>
          By creating an account or using the Service, you agree to these Terms. If
          you use the Service on behalf of an organization, you represent that you
          have authority to bind that organization.
        </p>
      </LegalSection>

      <LegalSection number="02" title="The Service">
        <p>
          The Service provides website and infrastructure monitoring, alerting,
          analytics, and related features as described on our website and in your
          plan. We may modify features for operational, security, or legal reasons.
          We do not guarantee uninterrupted availability of the Service itself.
        </p>
      </LegalSection>

      <LegalSection number="03" title="Accounts">
        <p>
          You must provide accurate registration information and keep credentials
          secure. You are responsible for activity under your account. Notify us
          promptly at {emailConfig.support} if you suspect unauthorized access.
        </p>
      </LegalSection>

      <LegalSection number="04" title="Acceptable use">
        <p>You agree not to:</p>
        <ul>
          <li>Use the Service unlawfully or to monitor systems without permission</li>
          <li>Attempt to disrupt, probe, or overload our systems</li>
          <li>Misuse alert channels to send spam or harmful content</li>
          <li>Reverse engineer the Service except where permitted by law</li>
        </ul>
      </LegalSection>

      <LegalSection number="05" title="Subscriptions and fees">
        <p>
          Paid plans are billed in accordance with the pricing shown at checkout or
          in your account. Taxes may apply where required by law. Failure to pay may
          result in suspension or termination of paid features.
        </p>
      </LegalSection>

      <LegalSection number="06" title="Free tier">
        <p>
          We may offer a free plan with usage limits. We may change or discontinue
          free tier limits with reasonable notice where practicable.
        </p>
      </LegalSection>

      <LegalSection number="07" title="Data and privacy">
        <p>
          Our processing of personal data is described in our Privacy Policy. You are
          responsible for ensuring you have a lawful basis to configure monitors
          targeting URLs and systems you control or are authorized to test.
        </p>
      </LegalSection>

      <LegalSection number="08" title="Intellectual property">
        <p>
          We retain rights in the Service, software, and branding. You retain rights
          in your content. You grant us a limited licence to process monitor
          configuration and related data to operate the Service.
        </p>
      </LegalSection>

      <LegalSection number="09" title="Disclaimer">
        <p>
          The Service is provided on an &quot;as is&quot; and &quot;as available&quot;
          basis to the fullest extent permitted by applicable law. We do not warrant
          that monitoring will detect every failure or that alerts will always be
          delivered without delay. Monitoring results are indicative and should not
          be the sole basis for safety-critical decisions without independent
          verification.
        </p>
      </LegalSection>

      <LegalSection number="10" title="Limitation of liability">
        <p>
          Nothing in these Terms excludes liability that cannot be excluded under
          English law. Subject to that, our total liability arising from or related
          to the Service in any twelve-month period is limited to the fees you paid
          us for the Service in that period (or GBP £100 if you use a free plan
          only), except where otherwise required by law.
        </p>
      </LegalSection>

      <LegalSection number="11" title="Termination">
        <p>
          You may stop using the Service and cancel subscriptions as described in our
          Cancellation Policy. We may suspend or terminate access for material breach,
          non-payment, or risk to the Service, with notice where reasonable.
        </p>
      </LegalSection>

      <LegalSection number="12" title="Governing law">
        <p>
          These Terms are governed by the laws of England and Wales. The courts of
          England and Wales have exclusive jurisdiction, subject to mandatory consumer
          protections if you are a consumer resident in the UK or EEA.
        </p>
      </LegalSection>

      <LegalSection number="13" title="Contact">
        <p>
          {emailConfig.support} · {companyConfig.registeredOffice.full}
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
