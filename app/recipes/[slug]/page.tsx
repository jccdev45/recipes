import { notFound, redirect } from "next/navigation"
import { getRecipeBySlug } from "@/queries/recipe-queries"
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

import type { Metadata, ResolvingMetadata } from "next"

type RecipePageProps = {
  params: { slug: string }
}

export async function generateMetadata(
  { params: { slug } }: RecipePageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const supabase = createClient()
  const { data: recipe } = await getRecipeBySlug(supabase, slug)
  const previousTitle = (await parent).title?.absolute || ""

  return {
    title: `${recipe?.recipe_name} | ${previousTitle}`,
  }
}

export default async function RecipePage({
  params: { slug },
}: RecipePageProps) {
  const queryClient = new QueryClient()
  const supabase = createClient()
  const { user, error } = await getUser()

  if (error) {
    console.error(error)
    redirect(`/auth-error?message=${error.message}`)
  }

  await prefetchQuery(queryClient, getRecipeBySlug(supabase, slug))

  const { data: recipe } = await getRecipeBySlug(supabase, slug)

  if (!recipe) notFound()

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="space-y-4 px-4">
        <div className="flex flex-col gap-8">
          <RecipeDisplay slug={slug} user={user} />
          <CommentsSection
            currentUser={user}
            recipe_id={recipe.id}
            className="flex w-full max-w-full flex-col"
          />
        </div>
      </div>
    </HydrationBoundary>
  )
}
