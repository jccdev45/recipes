import Link from "next/link"
import { searchRecipes } from "@/queries/recipe-queries"
import { createClient } from "@/supabase/client"
import { prefetchQuery } from "@supabase-cache-helpers/postgrest-react-query"
import { User } from "@supabase/supabase-js"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"
import { UtensilsCrossed } from "lucide-react"

import { NAV_LINKS } from "@/lib/constants"
import { ClientNav } from "@/components/client-nav"

export async function Nav() {
  const supabase = createClient()
  const queryClient = new QueryClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    console.error(error)
  }

  await prefetchQuery(queryClient, searchRecipes(supabase, ""))

  return (
    <header className="w-full shadow-md">
      <div className="container mx-auto flex items-center justify-between py-4 sm:px-4">
        <Link href="/" className="flex items-center gap-2">
          <UtensilsCrossed className="size-8" />
          <h1 className="hidden text-2xl font-bold text-secondary sm:block">
            Family Recipes
          </h1>
        </Link>
        <nav className="hidden space-x-6 md:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-primary-foreground transition-colors duration-200 ease-in-out hover:text-primary"
            >
              {label}
            </Link>
          ))}
        </nav>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <ClientNav user={user} />
        </HydrationBoundary>
      </div>
    </header>
  )
}
