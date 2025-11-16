import Link from "next/link"
import { UtensilsCrossed } from "lucide-react"

import { NAV_LINKS } from "@/lib/constants"
import { NavClient } from "@/components/nav/nav-client"
import { getUser } from "@/app/(auth)/actions"

export async function Nav() {
  const { user } = await getUser()

  return (
    <header className="border-border/40 bg-background border-b">
      <div className="container flex items-start gap-4 py-4 lg:items-center lg:justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 rounded px-1 py-0.5 underline-offset-4 transition-all duration-300 ease-in-out hover:underline hover:opacity-90"
        >
          <UtensilsCrossed className="size-8" aria-hidden="true" />
          <span className="text-primary text-2xl font-bold">
            Family Recipes
          </span>
        </Link>
        <NavClient navLinks={NAV_LINKS} user={user} />
      </div>
    </header>
  )
}
