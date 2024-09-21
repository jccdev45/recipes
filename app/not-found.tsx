import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { TypographyH1, TypographyP } from "@/components/ui/typography"

import FourOhFour from "/public/images/404.svg"

export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <Image
        src={FourOhFour}
        alt="404 Not Found Illustration"
        width={400}
        height={400}
        priority
      />
      <TypographyH1 className="mb-4 mt-8">Oops! Page Not Found</TypographyH1>
      <TypographyP className="mb-6">
        The page you're looking for doesn't exist or has been moved.
      </TypographyP>
      <Button asChild>
        <Link href="/">Return to Home</Link>
      </Button>
    </div>
  )
}
