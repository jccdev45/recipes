import { Typography } from "@/components/ui/typography"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read our privacy policy to understand how we collect, use, and protect your personal information.",
}

const LAST_UPDATED = "November 3, 2025"

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-12 px-6 py-12 text-pretty">
      <header className="space-y-4 text-center">
        <Typography variant="muted">Last updated: {LAST_UPDATED}</Typography>
        <Typography variant="h1">Privacy Policy</Typography>
        <Typography variant="lead">
          This Privacy Policy describes how Family Recipes collects, uses,
          discloses, and safeguards information when you interact with our
          website, mobile applications, and related online services
          (collectively, the "Services").
        </Typography>
      </header>

      <section className="space-y-4">
        <Typography variant="h2">1. Information We Collect</Typography>
        <Typography variant="p">
          The information we collect depends on how you use the Services. We may
          collect the following categories of data:
        </Typography>
        <Typography variant="list">
          <li>
            <span className="font-semibold">Account Information:</span> Name,
            email address, authentication credentials, and profile details when
            you create or update an account.
          </li>
          <li>
            <span className="font-semibold">User Content:</span> Recipes,
            comments, photos, ratings, and any other material you submit.
          </li>
          <li>
            <span className="font-semibold">Usage Data:</span> Interactions with
            the Services, such as viewed pages, search queries, and feature
            usage.
          </li>
          <li>
            <span className="font-semibold">Device and Technical Data:</span>
            IP address, browser type, operating system, device identifiers,
            language settings, and referral URLs.
          </li>
          <li>
            <span className="font-semibold">
              Cookies and Similar Technologies:
            </span>
            We use cookies, local storage, and similar technologies to remember
            your preferences, understand engagement, and support analytics.
          </li>
        </Typography>
      </section>

      <section className="space-y-4">
        <Typography variant="h2">2. How We Use Information</Typography>
        <Typography variant="p">
          We process information for purposes including:
        </Typography>
        <Typography variant="list">
          <li>Providing, maintaining, and improving the Services.</li>
          <li>Customizing your experience and surfacing relevant recipes.</li>
          <li>
            Communicating with you about updates, security alerts, or support
            requests.
          </li>
          <li>
            Analyzing usage trends to develop new features and enhancements.
          </li>
          <li>
            Complying with legal obligations and enforcing our Terms of Service.
          </li>
        </Typography>
        <Typography variant="p">
          If you are located in the European Economic Area or United Kingdom, we
          process personal data only where we have a valid legal basis, such as
          your consent, performance of a contract, compliance with legal
          obligations, or our legitimate interests.
        </Typography>
      </section>

      <section className="space-y-4">
        <Typography variant="h2">3. How We Share Information</Typography>
        <Typography variant="p">
          We may share information in the following circumstances:
        </Typography>
        <Typography variant="list">
          <li>
            <span className="font-semibold">Service Providers:</span> With
            vendors who provide hosting, analytics, customer support, email
            delivery, or other services on our behalf.
          </li>
          <li>
            <span className="font-semibold">Legal Compliance:</span> To comply
            with applicable law, regulation, legal process, or enforceable
            governmental request.
          </li>
          <li>
            <span className="font-semibold">Protection of Rights:</span> When
            necessary to protect the rights, property, or safety of Family
            Recipes, our users, or the public.
          </li>
          <li>
            <span className="font-semibold">Business Transfers:</span> In
            connection with a merger, acquisition, financing, or sale of all or
            part of our business.
          </li>
          <li>
            <span className="font-semibold">With Your Consent:</span> With third
            parties when you direct us to do so or otherwise consent.
          </li>
        </Typography>
      </section>

      <section className="space-y-4">
        <Typography variant="h2">
          4. Cookies and Similar Technologies
        </Typography>
        <Typography variant="p">
          We use first- and third-party cookies to keep you signed in, remember
          your preferences, measure traffic, and deliver relevant content. You
          can adjust your browser settings to refuse cookies or alert you when
          cookies are being sent, but some features of the Services may not
          function properly without them.
        </Typography>
      </section>

      <section className="space-y-4">
        <Typography variant="h2">5. Data Retention</Typography>
        <Typography variant="p">
          We retain personal information for as long as necessary to fulfill the
          purposes outlined in this Policy, unless a longer retention period is
          required or permitted by law. We may anonymize data for research or
          statistical purposes, at which point it is no longer considered
          personal information.
        </Typography>
      </section>

      <section className="space-y-4">
        <Typography variant="h2">6. Your Choices and Rights</Typography>
        <Typography variant="p">
          Depending on your location, you may have the right to request access
          to, correction of, or deletion of your personal information, to object
          to or restrict certain processing, or to withdraw consent where we
          rely on consent. You may also have the right to data portability and
          to lodge a complaint with your local data protection authority.
        </Typography>
        <Typography variant="p">
          To exercise these rights, please contact us using the information in
          the "Contact Us" section below. We may ask you to verify your identity
          before responding to requests.
        </Typography>
      </section>

      <section className="space-y-4">
        <Typography variant="h2">7. Children's Privacy</Typography>
        <Typography variant="p">
          The Services are not directed to children under the age required by
          applicable law (typically 13 or 16). We do not knowingly collect
          personal information from children. If we learn that we have collected
          personal information from a child without verified parental consent,
          we will delete that information.
        </Typography>
      </section>

      <section className="space-y-4">
        <Typography variant="h2">8. International Data Transfers</Typography>
        <Typography variant="p">
          We may process and store information in countries other than the
          country where you reside, including the United States. When we
          transfer personal information internationally, we rely on appropriate
          safeguards such as standard contractual clauses or other lawful
          mechanisms.
        </Typography>
      </section>

      <section className="space-y-4">
        <Typography variant="h2">9. Security</Typography>
        <Typography variant="p">
          We implement administrative, technical, and physical safeguards
          designed to protect personal information against unauthorized access,
          loss, or misuse. However, no method of transmission or storage is
          completely secure, and we cannot guarantee absolute security.
        </Typography>
      </section>

      <section className="space-y-4">
        <Typography variant="h2">10. Changes to This Policy</Typography>
        <Typography variant="p">
          We may update this Privacy Policy periodically. We will revise the
          "Last updated" date and, when appropriate, provide additional notice
          (such as via email or in-product notification). Your continued use of
          the Services after the effective date of an updated Policy constitutes
          acceptance of the changes.
        </Typography>
      </section>

      <section className="space-y-4">
        <Typography variant="h2">11. Contact Us</Typography>
        <Typography variant="p">
          If you have questions about this Privacy Policy or our privacy
          practices, contact us at privacy@familyrecipes.com
        </Typography>
      </section>
    </div>
  )
}
