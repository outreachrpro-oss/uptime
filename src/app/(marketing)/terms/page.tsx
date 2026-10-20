import { LegalPageShell } from "@/components/marketing/legal-page-shell";
import { appConfig, companyConfig, emailConfig } from "@/lib/config";
import { createPageMetadata } from "@/lib/marketing/metadata";

export const metadata = createPageMetadata({
  title: "Terms of Service",
  description: `Terms of Service for ${appConfig.name}, operated by ${companyConfig.legalName}.`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPageShell title="Terms of Service">
      <h2>1. Agreement</h2>
      <p>
        These Terms of Service (&quot;Terms&quot;) govern access to and use of{" "}
        {appConfig.name} (the &quot;Service&quot;) provided by{" "}
        {companyConfig.legalName} (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;),
        a company registered in {companyConfig.jurisdiction} (Company No.{" "}
        {companyConfig.registrationNumber}), with registered office at{" "}
        {companyConfig.registeredOffice.full}.
      </p>
      <p>
        By creating an account or using the Service, you agree to these Terms. If you
        use the Service on behalf of an organization, you represent that you have
        authority to bind that organization.
      </p>

      <h2>2. The Service</h2>
      <p>
        The Service provides website and infrastructure monitoring, alerting,
        analytics, and related features as described on our website and in your
        plan. We may modify features for operational, security, or legal reasons.
        We do not guarantee uninterrupted availability of the Service itself.
      </p>

      <h2>3. Accounts</h2>
      <p>
        You must provide accurate registration information and keep credentials
        secure. You are responsible for activity under your account. Notify us
        promptly at {emailConfig.support} if you suspect unauthorized access.
      </p>

      <h2>4. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use the Service unlawfully or to monitor systems without permission</li>
        <li>Attempt to disrupt, probe, or overload our systems</li>
        <li>Misuse alert channels to send spam or harmful content</li>
        <li>Reverse engineer the Service except where permitted by law</li>
      </ul>

      <h2>5. Subscriptions and fees</h2>
      <p>
        Paid plans are billed in accordance with the pricing shown at checkout or in
        your account. Published marketing prices may be illustrative until confirmed
        by the operator. Taxes may apply where required by law. Failure to pay may
        result in suspension or termination of paid features.
      </p>

      <h2>6. Free tier</h2>
      <p>
        We may offer a free plan with usage limits. We may change or discontinue
        free tier limits with reasonable notice where practicable.
      </p>

      <h2>7. Data and privacy</h2>
      <p>
        Our processing of personal data is described in our Privacy Policy. You are
        responsible for ensuring you have a lawful basis to configure monitors
        targeting URLs and systems you control or are authorized to test.
      </p>

      <h2>8. Intellectual property</h2>
      <p>
        We retain rights in the Service, software, and branding. You retain rights in
        your content. You grant us a limited licence to process monitor
        configuration and related data to operate the Service.
      </p>

      <h2>9. Disclaimer</h2>
      <p>
        The Service is provided on an &quot;as is&quot; and &quot;as available&quot;
        basis to the fullest extent permitted by applicable law. We do not warrant
        that monitoring will detect every failure or that alerts will always be
        delivered without delay. Monitoring results are indicative and should not
        be the sole basis for safety-critical decisions without independent
        verification.
      </p>

      <h2>10. Limitation of liability</h2>
      <p>
        Nothing in these Terms excludes liability that cannot be excluded under
        English law. Subject to that, our total liability arising from or related to
        the Service in any twelve-month period is limited to the fees you paid us for
        the Service in that period (or GBP £100 if you use a free plan only), except
        where otherwise required by law.
      </p>

      <h2>11. Termination</h2>
      <p>
        You may stop using the Service and cancel subscriptions as described in our
        Cancellation Policy. We may suspend or terminate access for material breach,
        non-payment, or risk to the Service, with notice where reasonable.
      </p>

      <h2>12. Governing law</h2>
      <p>
        These Terms are governed by the laws of England and Wales. The courts of
        England and Wales have exclusive jurisdiction, subject to mandatory consumer
        protections if you are a consumer resident in the UK or EEA.
      </p>

      <h2>13. Contact</h2>
      <p>
        {emailConfig.support} · {companyConfig.registeredOffice.full}
      </p>
    </LegalPageShell>
  );
}
