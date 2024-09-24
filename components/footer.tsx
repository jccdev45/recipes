import Link from "next/link"
import { Heart, UtensilsCrossed } from "lucide-react"

import { cn } from "@/lib/utils"
import { Typography } from "@/components/ui/typography"

export function Footer({ className }: { className?: string }) {
  return (
    <footer className={cn(``, className)}>
      <div className="mx-auto flex flex-col flex-wrap px-5 md:flex-row md:flex-nowrap md:items-center lg:items-start">
        <div className="mx-auto mt-10 w-64 flex-shrink-0 text-center md:mx-0 md:mt-0 md:text-left">
          <div className="title-font flex items-center justify-center font-medium md:justify-start">
            <UtensilsCrossed className="size-12" />
            <span className="ml-3 text-xl">Family Recipes</span>
          </div>
        </div>
        <div className="order-first -mb-10 flex flex-grow flex-wrap text-center md:pr-20 md:text-left">
          <div className="w-full px-4 md:w-1/2 lg:w-1/4">
            <nav className="mb-10 flex flex-col">
              <Link href="/">Home</Link>
              <Link href="/recipes">Recipes</Link>
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms of Service</Link>
            </nav>
          </div>
        </div>
      </div>
      <div className="container mx-auto flex w-full flex-col items-center justify-center px-5 py-4 md:max-w-sm">
        <Typography variant="p" className="text-center">
          Made (with love) by{" "}
          <Link
            href="https://jccdev.vercel.app"
            rel="noopener noreferrer"
            className="my-1 flex items-center justify-center underline"
            target="_blank"
          >
            @jccdev
            <Heart className="ml-1 bg-gradient-to-br from-red-500 to-red-800 bg-clip-text fill-red-800 no-underline" />
          </Link>
        </Typography>
      </div>
    </footer>
  )
}
