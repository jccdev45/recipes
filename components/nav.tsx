import Link from "next/link"
import { searchRecipes } from "@/queries/recipe-queries"
import { createClient } from "@/supabase/client"
import { prefetchQuery } from "@supabase-cache-helpers/postgrest-react-query"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"
import { UtensilsCrossed } from "lucide-react"

import { NAV_LINKS } from "@/lib/constants"
import { ClientNav } from "@/components/client-nav"
import { getUser, logout } from "@/app/(auth)/actions"

export async function Nav() {
  const supabase = createClient()
  const queryClient = new QueryClient()
  const { user } = await getUser()

  await prefetchQuery(queryClient, searchRecipes(supabase, ""))

  return (
    <header className="container grid grid-cols-[auto_1fr_auto] items-center gap-4 py-4 lg:grid-cols-3">
      <Link
        href="/"
        className="flex w-fit items-center justify-start gap-2 self-start underline-offset-4 transition-all duration-300 ease-in-out hover:underline hover:opacity-90"
      >
        <UtensilsCrossed className="size-8" />
        <h1 className="text-2xl font-bold text-secondary">Family Recipes</h1>
      </Link>
      <nav className="hidden items-center justify-center space-x-6 self-center lg:flex">
        {NAV_LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="text-foreground transition-colors duration-200 ease-in-out hover:text-primary"
          >
            {label}
          </Link>
        ))}
      </nav>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ClientNav user={user} logout={logout} />
      </HydrationBoundary>
    </header>
  )
}
