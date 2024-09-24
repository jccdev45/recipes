import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"

import ErrorSVG from "/public/images/error.svg"

export const metadata = {
  title: "Error",
}

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  const { message } = searchParams

  if (!message) {
    redirect("/")
  }

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
        <Typography variant="h1" className="mb-4">
          Authentication Error
        </Typography>
        <Typography variant="p" className="mb-6">
          {decodeURIComponent(message)}
        </Typography>
        <Button variant="outline" asChild>
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    </section>
  )
}
