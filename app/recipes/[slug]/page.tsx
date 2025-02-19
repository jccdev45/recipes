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
    <div className="space-y-4 px-4">
      <div className="flex flex-col gap-8">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <RecipeDisplay slug={slug} user={user} />
          <CommentsSection
            currentUser={user}
            slug={slug}
            className="flex w-full max-w-full flex-col"
          />
        </HydrationBoundary>
      </div>
    </div>
  )
}
