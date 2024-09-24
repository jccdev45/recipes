"use client"

import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"

import ErrorSVG from "/public/images/error.svg"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
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
            <Typography variant="h1" className="mb-4">
              Oops! Something went wrong
            </Typography>
            <Typography variant="p" className="mb-6">
              We apologize for the inconvenience. Our team has been notified and
              is working on a fix.
            </Typography>
            <div className="space-x-4">
              <Button onClick={() => reset()}>Try again</Button>
              <Button variant="outline" asChild>
                <Link href="/">Go to homepage</Link>
              </Button>
            </div>
            {process.env.NODE_ENV === "development" && (
              <Typography
                variant="p"
                className="mt-4 text-sm text-muted-foreground"
              >
                Error: {error.message}
              </Typography>
            )}
          </div>
        </section>
      </body>
    </html>
  )
}
