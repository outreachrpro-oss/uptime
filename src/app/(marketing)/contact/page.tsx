import { ContactForm } from "@/components/marketing/contact-form";
import { PageIntro } from "@/components/marketing/page-intro";
import { appConfig, companyConfig, emailConfig } from "@/lib/config";
import { createPageMetadata } from "@/lib/marketing/metadata";

export const metadata = createPageMetadata({
  title: "Contact",
  description: `Contact ${companyConfig.legalName} about ${appConfig.name}.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageIntro
        eyebrow="Contact"
        title="Contact us"
        description={`Reach ${companyConfig.legalName} for product questions, billing, or support. We respond by email when possible.`}
      />

      <section className="border-t border-border bg-white px-4 py-20 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-px overflow-hidden border border-border bg-border lg:grid-cols-2">
          <div className="bg-cream p-8 sm:p-10">
            <h2 className="font-display text-2xl text-ink">Company details</h2>
            <dl className="mt-8 space-y-6 text-sm">
              <div className="border-b border-border pb-5">
                <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Legal name
                </dt>
                <dd className="mt-2 text-ink">{companyConfig.legalName}</dd>
              </div>
              <div className="border-b border-border pb-5">
                <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Company number
                </dt>
                <dd className="mt-2">
                  <a
                    href={companyConfig.companiesHouseUrl}
                    className="font-medium text-ink underline-offset-4 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {companyConfig.registrationNumber}
                  </a>
                </dd>
              </div>
              <div className="border-b border-border pb-5">
                <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Registered office
                </dt>
                <dd className="mt-2 text-ink-soft">
                  {companyConfig.registeredOffice.full}
                </dd>
              </div>
              <div className="border-b border-border pb-5">
                <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Support
                </dt>
                <dd className="mt-2">
                  <a
                    href={`mailto:${emailConfig.support}`}
                    className="font-medium text-ink underline-offset-4 hover:underline"
                  >
                    {emailConfig.support}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  General enquiries
                </dt>
                <dd className="mt-2">
                  <a
                    href={`mailto:${emailConfig.contact}`}
                    className="font-medium text-ink underline-offset-4 hover:underline"
                  >
                    {emailConfig.contact}
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          <div className="bg-white p-8 sm:p-10">
            <h2 className="font-display text-2xl text-ink">Send a message</h2>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
