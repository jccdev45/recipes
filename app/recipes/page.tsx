import { getRecipes } from "@/queries/recipe-queries"
import { createClient } from "@/supabase/server"
import { prefetchQuery } from "@supabase-cache-helpers/postgrest-react-query"
import { QueryClient } from "@tanstack/react-query"

import { GradientBanner } from "@/components/GradientBanner"
import { RecipeList } from "@/app/recipes/recipe-list"

export const metadata = {
  title: "Recipes",
}

export default async function RecipesPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined }
}) {
  const search = searchParams?.search
  const params = {
    search,
  }
  // const query = `${apiUrl}/recipes?${queryString.stringify(params)}`

  const queryClient = new QueryClient()
  const supabase = createClient()

  await prefetchQuery(queryClient, getRecipes(supabase))

  // if (!recipes) {
  //   return <TypographyH1 className="mx-auto">No recipes found</TypographyH1>
  // }

  return (
    <>
      <GradientBanner
        text={search ? `Showing results for ${search}` : "Recipes"}
      />

      <RecipeList />
    </>
  )
}
