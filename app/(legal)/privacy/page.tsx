import React from "react"

import { Typography } from "@/components/ui/typography"

export const metadata = {
  title: "Privacy Policy",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl text-pretty p-8">
      <header>
        <Typography
          variant="lead"
          className="mx-auto w-fit bg-destructive p-8 text-center text-destructive-foreground"
        >
          (this isn't real)
        </Typography>
        <Typography variant="h1" className="mb-6 text-center">
          Privacy Policy
        </Typography>
        <Typography variant="large" className="text-center">
          (again, not real)
        </Typography>
        <Typography variant="p" className="mb-6">
          At Family Recipes, we take your privacy seriously. This Privacy Policy
          explains how we collect, use, and disclose information when you access
          or use our website, mobile application, or other online services
          (collectively, “Services”), and when you interact with us.
        </Typography>
      </header>

      <section>
        <Typography variant="h2" className="mb-4">
          Information Collection:
        </Typography>
        <Typography variant="p" className="mb-6">
          We collect certain information from you when you use our Services,
          including:
        </Typography>
        <Typography variant="list" className="mb-6">
          <li>
            Personal Information: We may collect personal information that you
            voluntarily provide to us, such as your name, email address, and
            phone number.
          </li>
          <li>
            Usage Information: We automatically collect usage information when
            you use our Services, such as your IP address, browser type, device
            type, and operating system.
          </li>
          <li>
            Cookies: We may use cookies and similar tracking technologies to
            collect information about your activity on our Services.
          </li>
        </Typography>
      </section>

      <section>
        <Typography variant="h2" className="mb-4">
          Use of Information:
        </Typography>
        <Typography variant="p" className="mb-6">
          We use the information we collect for various purposes, including:
        </Typography>
        <Typography variant="list" className="mb-6">
          <li>To provide and maintain our Services</li>
          <li>
            To communicate with you, such as sending newsletters or responding
            to customer support requests
          </li>
          <li>To analyze usage patterns and improve our Services</li>
          <li>To comply with legal obligations and protect our interests</li>
        </Typography>
      </section>

      <section>
        <Typography variant="h2" className="mb-4">
          Sharing of Information:
        </Typography>
        <Typography variant="p" className="mb-6">
          We may share your information with third parties in the following
          circumstances:
        </Typography>
        <Typography variant="list" className="mb-6">
          <li>
            With service providers who assist us in providing our Services
          </li>
          <li>If required by law or to respond to legal process</li>
          <li>
            If necessary to investigate, prevent, or take action regarding
            illegal activities, suspected fraud, or potential threats to the
            physical safety of any person
          </li>
          <li>
            In connection with a merger, acquisition, or sale of all or a
            portion of our assets
          </li>
        </Typography>
      </section>

      <section>
        <Typography variant="h2" className="mb-4">
          Data Retention:
        </Typography>
        <Typography variant="p" className="mb-6">
          We retain personal information for as long as necessary to fill the
          purposes for which it was collected, unless otherwise required by law.
        </Typography>
      </section>

      <section>
        <Typography variant="h2" className="mb-4">
          Security:
        </Typography>
        <Typography variant="p" className="mb-6">
          We implement reasonable measures to protect the security of your
          information, but no transmission over the internet is completely
          secure. We cannot guarantee the absolute security of your information.
        </Typography>
      </section>

      <section>
        <Typography variant="h2" className="mb-4">
          Changes to this Privacy Policy:
        </Typography>
        <Typography variant="p" className="mb-6">
          We may update our Privacy Policy from time to time. We will post any
          changes on this page and, if the changes are significant, we will
          provide more prominent notice (such as a banner).
        </Typography>
      </section>

      <section>
        <Typography variant="p" className="text-center">
          If you have any questions or concerns about our Privacy Policy, please
          contact us at{" "}
          <span className="underline hover:no-underline">
            privacy@familyrecipes.com
          </span>
          .
        </Typography>
      </section>
    </div>
  )
}
