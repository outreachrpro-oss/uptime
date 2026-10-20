import { ContactForm } from "@/components/marketing/contact-form";
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
      <section className="border-b border-slate-200 bg-white py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-[#0B1220] sm:text-4xl">
            Contact us
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-600">
            Reach {companyConfig.legalName} for product questions, billing, or
            support. We respond by email when possible.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-[#0B1220]">Company details</h2>
          <dl className="mt-4 space-y-3 text-sm text-slate-600">
            <div>
              <dt className="font-medium text-slate-900">Legal name</dt>
              <dd>{companyConfig.legalName}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-900">Company number</dt>
              <dd>
                <a
                  href={companyConfig.companiesHouseUrl}
                  className="text-ink hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {companyConfig.registrationNumber}
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-medium text-slate-900">Registered office</dt>
              <dd>{companyConfig.registeredOffice.full}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-900">Support</dt>
              <dd>
                <a
                  href={`mailto:${emailConfig.support}`}
                  className="text-ink hover:underline"
                >
                  {emailConfig.support}
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-medium text-slate-900">General enquiries</dt>
              <dd>
                <a
                  href={`mailto:${emailConfig.contact}`}
                  className="text-ink hover:underline"
                >
                  {emailConfig.contact}
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-[#0B1220]">Send a message</h2>
          <div className="mt-4">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
