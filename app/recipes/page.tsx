import { getRecipes } from "@/queries/recipe-queries"
import { createClient } from "@/supabase/server"
import { prefetchQuery } from "@supabase-cache-helpers/postgrest-react-query"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"

import { GradientBanner } from "@/components/gradient-banner"
import { RecipeList } from "@/app/recipes/recipe-list"

export const metadata = {
  title: "Recipes",
}

export default async function RecipesPage(props: {
  searchParams?: Promise<{ [key: string]: string | undefined }>
}) {
  const searchParams = await props.searchParams
  const search = searchParams?.search
  const params = {
    search,
  }
  // const query = `${apiUrl}/recipes?${queryString.stringify(params)}`

  const queryClient = new QueryClient()
  const supabase = await createClient()

  await prefetchQuery(queryClient, getRecipes(supabase))

  return (
    <>
      <GradientBanner
        text={search ? `Showing results for ${search}` : "Recipes"}
        size="lg"
        variant="accent"
        pattern
      />

      <HydrationBoundary state={dehydrate(queryClient)}>
        <RecipeList />
      </HydrationBoundary>
    </>
  )
}
