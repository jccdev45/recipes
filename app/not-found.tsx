import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"

export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <Image
        src="/images/404.svg"
        alt="404 Not Found Illustration"
        width={400}
        height={400}
        priority
      />
      <Typography variant="h1" className="mb-4 mt-8">
        Oops! Page Not Found
      </Typography>
      <Typography variant="p" className="mb-6">
        The page you're looking for doesn't exist or has been moved.
      </Typography>
      <Button asChild>
        <Link href="/">Return to Home</Link>
      </Button>
    </div>
  )
}
