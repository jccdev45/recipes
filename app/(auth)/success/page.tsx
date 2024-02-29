import Image from "next/image"

import { TypographyH1 } from "@/components/ui/typography"
import { GradientBanner } from "@/components/GradientBanner"

import Email from "/public/images/email.svg"

export default async function SuccessPage() {
  return (
    <div className="grow">
      <GradientBanner />

      <section className="grid -translate-y-16 grid-cols-1 gap-8 p-20 md:-translate-y-32 lg:grid-cols-2">
        <Image
          src={Email}
          alt="person with mobile phone showing email"
          height={500}
          width={500}
          className=" col-span-1 mx-auto w-5/6 lg:order-first"
        />

        <div className="grid place-items-center bg-foreground p-16 shadow shadow-white/50">
          <TypographyH1 className="text-center text-background">
            Check your email for a confirmation link to continue signing up
          </TypographyH1>
        </div>
      </section>
    </div>
  )
}
