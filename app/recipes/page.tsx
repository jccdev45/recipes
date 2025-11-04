import { getRecipes } from "@/queries/recipe-queries"
import { createClient } from "@/supabase/server"
import { prefetchQuery } from "@supabase-cache-helpers/postgrest-react-query"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"
import { ChefHat } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Typography } from "@/components/ui/typography"
import { getUser } from "@/app/(auth)/actions"
import { RecipeList } from "@/app/recipes/recipe-list"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Recipes",
  description:
    "Browse our collection of delicious family recipes, from appetizers to drinks to desserts.",
}

export default async function RecipesPage(props: {
  searchParams?: Promise<{ [key: string]: string | undefined }>
}) {
  const { user } = await getUser()
  const searchParams = await props.searchParams
  const search = searchParams?.search

  const queryClient = new QueryClient()
  const supabase = await createClient()

  await prefetchQuery(queryClient, getRecipes(supabase))

  return (
    <>
      <section className="from-primary/10 via-background to-background relative overflow-hidden bg-linear-to-br">
        <div
          className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.35),transparent_60%)] dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_55%)]"
          aria-hidden="true"
        />
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-16 text-center lg:flex-row lg:items-center lg:justify-between lg:px-6 lg:text-left">
          <div className="space-y-4">
            <Badge
              variant="outline"
              className="bg-background/80 mx-auto flex w-fit items-center gap-2 rounded-full px-4 py-1 text-sm font-medium shadow-sm lg:mx-0"
            >
              <ChefHat className="h-4 w-4" aria-hidden="true" />
              Seasonal inspiration
            </Badge>
            <Typography
              variant="h1"
              className="text-4xl tracking-tight text-balance sm:text-5xl lg:text-6xl"
            >
              {search
                ? `Results for “${search}”`
                : "Cook together, savor together"}
            </Typography>
            <Typography
              variant="lead"
              className="text-muted-foreground mx-auto max-w-2xl text-balance lg:mx-0"
            >
              Explore comforting dishes, time-saving weeknight dinners, and
              crowd-pleasing desserts curated by our community of home cooks.
            </Typography>
          </div>
          <div className="border-primary/20 bg-background/70 flex w-full flex-col items-center gap-6 rounded-2xl border p-6 shadow-sm backdrop-blur sm:flex-row sm:justify-center lg:max-w-sm lg:flex-col lg:items-start">
            <div className="space-y-2 text-left">
              <Typography variant="h4" className="text-xl font-semibold">
                {search ? "Refine your search" : "Find your next favorite"}
              </Typography>
              <Typography variant="muted" className="text-sm leading-relaxed">
                {search
                  ? "Filters help you narrow down by author, ingredients, and tags so you can quickly find the perfect dish."
                  : "Use the filters to browse by author, ingredients, or tags—then jump into the recipe details to start cooking."}
              </Typography>
            </div>
          </div>
        </div>
      </section>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <RecipeList user={user} searchTerm={search} />
      </HydrationBoundary>
    </>
  )
}
