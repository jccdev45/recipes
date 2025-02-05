import Image from "next/image"

import { Typography } from "@/components/ui/typography"
import { GradientBanner } from "@/components/gradient-banner"

export const metadata = {
  title: "Success",
}

export default async function SuccessPage() {
  return (
    <div className="grow">
      <GradientBanner />

      <section className="grid -translate-y-16 grid-cols-1 gap-8 p-20 md:-translate-y-32 lg:grid-cols-2">
        <Image
          src="/images/email.svg"
          alt="person with mobile phone showing email"
          height={500}
          width={500}
          className="col-span-1 mx-auto w-5/6 lg:order-first"
        />

        <div className="grid place-items-center bg-foreground p-16 shadow shadow-white/50">
          <Typography variant="h1" className="text-center text-background">
            Check your email for a confirmation link to continue signing up
          </Typography>
        </div>
      </section>
    </div>
  )
}
