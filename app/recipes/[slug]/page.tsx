import { notFound } from "next/navigation"
import { getRecipeWithComments } from "@/queries/recipe-queries"
import { createClient } from "@/supabase/server"
import { prefetchQuery } from "@supabase-cache-helpers/postgrest-react-query"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"

import { getUser } from "@/app/(auth)/actions"
import { CommentsSection } from "@/app/recipes/[slug]/comments"
import { RecipeDisplay } from "@/app/recipes/[slug]/recipe-display"

import type { Metadata } from "next"

type RecipePageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const { slug } = await params

  try {
    const supabase = await createClient()
    const { data: recipe } = await getRecipeWithComments(supabase, slug)

    if (!recipe) {
      notFound()
    }

    return {
      title: recipe.recipe_name,
      description: `Discover how to make ${recipe.recipe_name}. A delicious family recipe shared on Family Recipes.`,
    }
  } catch (error) {
    console.error("Error fetching recipe data:", error)
    return {
      title: "Recipe Details",
      description: "View recipe details on Family Recipes.",
    }
  }
}

export default async function RecipePage(props: RecipePageProps) {
  const params = await props.params
  const { slug } = params

  const queryClient = new QueryClient()
  const supabase = await createClient()
  const { user } = await getUser()

  await prefetchQuery(queryClient, getRecipeWithComments(supabase, slug))

  return (
    <>
      <a
        href="#recipe-main"
        className="focus-visible:bg-primary focus-visible:text-primary-foreground sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-50 focus-visible:rounded-md focus-visible:px-4 focus-visible:py-2"
      >
        Skip to recipe details
      </a>
      <main id="recipe-main" className="space-y-12 px-4 pb-16">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <RecipeDisplay slug={slug} user={user} />
          <section
            id="recipe-comments"
            className="mx-auto flex w-full max-w-6xl flex-col gap-4"
          >
            <CommentsSection
              currentUser={user}
              slug={slug}
              className="flex w-full max-w-full flex-col"
            />
          </section>
        </HydrationBoundary>
      </main>
    </>
  )
}
