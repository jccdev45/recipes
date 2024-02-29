import Image from "next/image"

import { TypographyH1 } from "@/components/ui/typography"

import ErrorSVG from "/public/images/error.svg"

export default async function ErrorPage() {
  return (
    <section className="grid w-full grid-cols-1 p-32 lg:grid-cols-2">
      <Image
        src={ErrorSVG}
        alt="Guy standing next to warning symbol, signifying something went wrong"
        height={500}
        width={500}
        className="order-last lg:order-first lg:col-span-1"
      />
      <div className="my-auto h-fit bg-foreground p-12 text-center text-background">
        <TypographyH1>Sorry chief, something went wrong</TypographyH1>
      </div>
    </section>
  )
}
