import { Typography } from "@/components/ui/typography"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Review our terms of service to understand the rules and guidelines for using Family Recipes.",
}

const LAST_UPDATED = "November 3, 2025"

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-12 px-6 py-12">
      <header className="space-y-4 text-center">
        <Typography variant="muted">Last updated: {LAST_UPDATED}</Typography>
        <Typography variant="h1">Terms of Service</Typography>
        <Typography variant="lead">
          These Terms of Service explain the agreement between you and Family
          Recipes regarding access to and use of our website, mobile
          applications, and related services (collectively, the "Services").
        </Typography>
      </header>

      <section className="space-y-4">
        <Typography variant="h2">1. Acceptance of Terms</Typography>
        <Typography variant="p">
          By accessing or using the Services you agree to be bound by these
          Terms and any policies referenced herein, including our Privacy
          Policy. If you do not agree, you must not use the Services. You may
          use the Services only if you have the legal capacity to form a binding
          contract in your jurisdiction.
        </Typography>
      </section>

      <section className="space-y-4">
        <Typography variant="h2">2. Account Responsibilities</Typography>
        <Typography variant="p">
          If you create an account, you are responsible for maintaining the
          confidentiality of your login credentials and for all activity that
          occurs under your account. Notify us immediately of any unauthorized
          use. You agree that the information you provide is accurate and will
          be kept current.
        </Typography>
      </section>

      <section className="space-y-4">
        <Typography variant="h2">3. User Contributions</Typography>
        <Typography variant="p">
          The Services allow you to submit recipes, comments, photos, and other
          content (collectively, "User Content"). You retain ownership of your
          User Content, but grant Family Recipes a worldwide, perpetual,
          non-exclusive, royalty-free, transferable, and sublicensable license
          to host, store, reproduce, modify, publish, distribute, and display
          such content in connection with operating, promoting, and improving
          the Services.
        </Typography>
        <Typography variant="p">
          You represent that you have all rights necessary to grant this
          license, and that your User Content does not infringe or violate the
          rights of any third party.
        </Typography>
      </section>

      <section className="space-y-4">
        <Typography variant="h2">4. Community Guidelines</Typography>
        <Typography variant="p">
          We expect everyone to contribute respectfully. You agree that you will
          not post or share content that is unlawful, defamatory, obscene,
          hateful, harassing, discriminatory, misleading, or otherwise
          objectionable. We reserve the right to remove User Content or suspend
          accounts at our sole discretion if we believe these Terms have been
          violated.
        </Typography>
      </section>

      <section className="space-y-4">
        <Typography variant="h2">5. Prohibited Activities</Typography>
        <Typography variant="p">
          In addition to the Community Guidelines, you agree not to:
        </Typography>
        <Typography variant="list">
          <li>Use the Services for any unlawful purpose.</li>
          <li>
            Attempt to gain unauthorized access to the Services or systems.
          </li>
          <li>
            Interfere with or disrupt the integrity or performance of the
            Services.
          </li>
          <li>Harvest or collect data about other users without consent.</li>
          <li>
            Reverse engineer or otherwise attempt to discover the source code of
            the Services.
          </li>
        </Typography>
      </section>

      <section className="space-y-4">
        <Typography variant="h2">6. Intellectual Property</Typography>
        <Typography variant="p">
          All content and materials provided by Family Recipes, including logos,
          designs, text, graphics, and software, are owned by or licensed to us
          and protected by intellectual property laws. Except for your own User
          Content, you may not copy, modify, distribute, or create derivative
          works without our prior written permission.
        </Typography>
      </section>

      <section className="space-y-4">
        <Typography variant="h2">7. Feedback</Typography>
        <Typography variant="p">
          If you submit feedback, suggestions, or ideas, you agree that we may
          use them without restriction or compensation to you, and you waive any
          claims to ownership of such feedback.
        </Typography>
      </section>

      <section className="space-y-4">
        <Typography variant="h2">8. Third-Party Links</Typography>
        <Typography variant="p">
          The Services may contain links to third-party websites or resources.
          We are not responsible for the content, products, or services on those
          sites. You acknowledge sole responsibility for and assume all risk
          arising from your use of any third-party resources.
        </Typography>
      </section>

      <section className="space-y-4">
        <Typography variant="h2">9. Disclaimer of Warranties</Typography>
        <Typography variant="p">
          The Services are provided on an "as is" and "as available" basis.
          Family Recipes expressly disclaims all warranties of any kind, whether
          express or implied, including the implied warranties of
          merchantability, fitness for a particular purpose, title, and
          non-infringement. We do not guarantee that the Services will be
          uninterrupted, error-free, or secure.
        </Typography>
      </section>

      <section className="space-y-4">
        <Typography variant="h2">10. Limitation of Liability</Typography>
        <Typography variant="p">
          To the fullest extent permitted by law, Family Recipes and its
          affiliates, officers, employees, agents, and licensors will not be
          liable for any indirect, incidental, special, consequential, or
          punitive damages, or any loss of profits or revenues, arising out of
          or relating to your use of or inability to use the Services.
        </Typography>
      </section>

      <section className="space-y-4">
        <Typography variant="h2">11. Indemnification</Typography>
        <Typography variant="p">
          You agree to defend, indemnify, and hold harmless Family Recipes and
          its affiliates from and against any claims, liabilities, damages,
          losses, and expenses, including reasonable attorney fees, arising out
          of or in any way connected with your access to or use of the Services,
          your User Content, or your violation of these Terms.
        </Typography>
      </section>

      <section className="space-y-4">
        <Typography variant="h2">12. Termination</Typography>
        <Typography variant="p">
          We may suspend or terminate your access to the Services at any time,
          with or without notice, for conduct that we believe violates these
          Terms or is otherwise harmful to other users or Family Recipes. Upon
          termination, the licenses granted to you will end, but Sections 3, 6,
          and 9 through 13 will survive.
        </Typography>
      </section>

      <section className="space-y-4">
        <Typography variant="h2">13. Governing Law</Typography>
        <Typography variant="p">
          These Terms are governed by the laws of the jurisdiction where Family
          Recipes is headquartered, without regard to its conflict of law
          principles. Any disputes will be resolved in the courts located in
          that jurisdiction, unless applicable law requires otherwise.
        </Typography>
      </section>

      <section className="space-y-4">
        <Typography variant="h2">14. Changes to These Terms</Typography>
        <Typography variant="p">
          We may update these Terms from time to time. If we make material
          changes, we will provide reasonable notice, such as updating the "Last
          updated" date, sending an email, or posting a notice on the Services.
          Your continued use after the changes become effective constitutes
          acceptance of the revised Terms.
        </Typography>
      </section>

      <section className="space-y-4">
        <Typography variant="h2">15. Contact Us</Typography>
        <Typography variant="p">
          If you have questions about these Terms or the Services, please reach
          out to us at legal@familyrecipes.com
        </Typography>
      </section>
    </div>
  )
}
