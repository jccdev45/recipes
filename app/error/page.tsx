import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { TypographyH1, TypographyP } from "@/components/ui/typography"

import ErrorSVG from "/public/images/error.svg"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <section className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4 lg:flex-row lg:gap-8">
      <Image
        src={ErrorSVG}
        alt="Illustration of a person standing next to a warning symbol"
        height={400}
        width={400}
        className="mb-8 lg:order-last lg:mb-0"
        priority
      />
      <div className="text-center lg:text-left">
        <TypographyH1 className="mb-4">Oops! Something went wrong</TypographyH1>
        <TypographyP className="mb-6">
          We apologize for the inconvenience. Our team has been notified and is
          working on a fix.
        </TypographyP>
        <div className="space-x-4">
          <Button onClick={() => reset()}>Try again</Button>
          <Button variant="outline" asChild>
            <Link href="/">Go to homepage</Link>
          </Button>
        </div>
        {process.env.NODE_ENV === "development" && (
          <TypographyP className="mt-4 text-sm text-muted-foreground">
            Error: {error.message}
          </TypographyP>
        )}
      </div>
    </section>
  )
}
