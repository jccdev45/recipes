import React from "react"

import {
  TypographyH1,
  TypographyH2,
  TypographyLarge,
  TypographyLead,
  TypographyList,
  TypographyP,
} from "@/components/ui/typography"

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 p-8">
      <header>
        <TypographyLead className="mx-auto w-fit bg-destructive p-8 text-center text-destructive-foreground">
          (this isn't real)
        </TypographyLead>
        <TypographyH1 className="mb-6 text-center">
          Terms of Service
        </TypographyH1>
        <TypographyLarge className="text-center">
          (again, not real)
        </TypographyLarge>
      </header>

      <TypographyP>
        Welcome to Family Recipes, the place where we collect and share recipes
        that have been passed down through generations! We’re glad you’re here,
        but before you start using our site, we want to make sure you’re aware
        of a few things.
      </TypographyP>
      <TypographyList>
        <li>
          This is a community-driven site, which means that all of the content
          on here has been submitted by users like you.
        </li>
        <li>
          While we do our best to moderate and ensure that everything is
          family-friendly, we can’t guarantee that every single recipe will meet
          your standards or preferences.
        </li>
      </TypographyList>

      <section>
        <TypographyH2 className="mb-4">User Guidelines:</TypographyH2>
        <TypographyP className="mb-6">
          By using our site, you agree not to:
          <br />
          • Use any discriminatory language or imagery in your submissions or
          comments
          <br />
          • Share any personal information about yourself or others without
          consent
          <br />
          • Infringe upon anyone else’s intellectual property rights (i.e.,
          don’t steal someone else’s recipe!)
          <br />• Engage in spamming or other disruptive behavior
        </TypographyP>
      </section>

      <section>
        <TypographyH2 className="mb-4">Content Ownership:</TypographyH2>
        <TypographyP className="mb-6">
          When you submit a recipe to Family Recipes, you retain ownership of
          that recipe, but you grant us a perpetual, non-exclusive, royalty-free
          license to use, reproduce, adapt, modify, publish, distribute,
          perform, translate, and display that recipe (in whole or in part) in
          any format or medium currently known or later developed. This includes
          promoting and advertising Family Recipes and its services.
        </TypographyP>
      </section>

      <section>
        <TypographyH2 className="mb-4">Disclaimer:</TypographyH2>
        <TypographyP className="mb-6">
          Please note that while we strive to provide accurate and helpful
          information on our site, we cannot be held liable for any errors,
          omissions, or damages resulting from the use of this site or any of
          its contents. By using Family Recipes, you acknowledge that you are
          doing so at your own risk.
        </TypographyP>
      </section>

      <section>
        <TypographyP className="text-center">
          Thanks for taking the time to read through our Terms of Service. If
          you have any questions or concerns, feel free to reach out to us at{" "}
          <span className="underline hover:no-underline">
            contact@familyrecipes.com
          </span>
          . Happy cooking!
        </TypographyP>
      </section>
    </div>
  )
}
