import Link from "next/link"
import { Heart, UtensilsCrossed } from "lucide-react"

import { cn } from "@/lib/utils"
import { Typography } from "@/components/ui/typography"

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/recipes", label: "Recipes" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
]

export function Footer({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        "w-full max-w-3xl bg-background px-12 py-12 md:px-0",
        className
      )}
    >
      <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-start">
        <nav className="mt-8 grid grid-cols-2 gap-8 md:mt-0 md:gap-4">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-center text-foreground/80 transition-colors hover:text-foreground md:text-left"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col items-center md:items-end">
          <Link
            href="/"
            className="flex items-center space-x-2 text-foreground/80 transition-colors hover:text-foreground"
          >
            <UtensilsCrossed className="size-6 text-foreground" />
            <Typography variant="h3">Family Recipes</Typography>
          </Link>
          <Typography
            variant="muted"
            className="mt-4 text-center md:text-right"
          >
            Preserving family traditions, one recipe at a time.
          </Typography>
        </div>
      </div>
      <div className="mt-12 border-t border-foreground/10 pt-8 text-center">
        <Typography variant="p" className="text-sm text-foreground/60">
          © 2024 Family Recipes
        </Typography>
        <Typography variant="p" className="mt-2 text-sm text-foreground/60">
          Made with{" "}
          <Heart
            aria-label="Heart icon signifying the word 'love'"
            className="inline-block size-4 fill-red-500 text-white"
          />{" "}
          by{" "}
          <Link
            href="https://jccdev.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline transition-colors hover:text-foreground"
          >
            @jccdev
          </Link>
        </Typography>
      </div>
    </footer>
  )
}
