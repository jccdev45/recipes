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
    <footer className={cn("bg-background py-12", className)}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col-reverse items-center justify-between md:flex-row md:items-start">
          <nav className="mt-8 grid grid-cols-2 gap-4 md:mt-0">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground/80 transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col items-center md:items-end">
            <Link href="/" className="flex items-center">
              <span className="mr-2 text-xl font-bold">Family Recipes</span>
              <UtensilsCrossed className="h-8 w-8" />
            </Link>
            <Typography variant="p" className="mt-4 text-center md:text-right">
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
      </div>
    </footer>
  )
}
