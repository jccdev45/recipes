import Link from "next/link"
import { prefetchQuery } from "@supabase-cache-helpers/postgrest-react-query"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"
import { UtensilsCrossed } from "lucide-react"

import { getUser } from "@/app/(auth)/actions"
import { NAV_LINKS } from "@/lib/constants"
import { NavClient } from "@/components/nav/nav-client"
import { searchRecipes } from "@/queries/recipe-queries"
import { createClient } from "@/supabase/server"
import type { TypedSupabaseClient } from "@/supabase/client"

export async function Nav() {
  const supabase = (await createClient()) as TypedSupabaseClient
  const queryClient = new QueryClient()
  const { user } = await getUser()

  // TODO: Research if this prefetch is needed/reevaluate search functionality
  await prefetchQuery(queryClient, searchRecipes(supabase, ""))

  return (
    <header className="border-b border-border/40 bg-background">
      <div className="container flex items-start gap-4 py-4 lg:items-center lg:justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 underline-offset-4 transition-all duration-300 ease-in-out hover:underline hover:opacity-90"
        >
          <UtensilsCrossed className="size-8" aria-hidden="true" />
          <span className="text-2xl font-bold text-secondary">Family Recipes</span>
        </Link>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <NavClient navLinks={NAV_LINKS} user={user} />
        </HydrationBoundary>
      </div>
    </header>
  )
}
