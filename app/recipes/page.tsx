import { Recipe } from "@/supabase/types"
import queryString from "query-string"

import { apiUrl } from "@/lib/constants"
import { TypographyH1 } from "@/components/ui/typography"
import { GradientBanner } from "@/components/GradientBanner"

import { RecipeCard } from "./RecipeCard"

export default async function RecipesPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined }
}) {
  const search = searchParams?.search
  const params = {
    search,
  }
  const query = `${apiUrl}/recipes?${queryString.stringify(params)}`

  const res = await fetch(query)
  const recipes: Recipe[] = await res.json()

  if (!recipes) {
    return <TypographyH1 className="mx-auto">No recipes found</TypographyH1>
  }

  return (
    <>
      <GradientBanner
        text={search ? `Showing results for ${search}` : "Recipes"}
      />

      {/* TODO: Combine */}
      <section className="mx-auto flex h-full w-5/6 max-w-6xl -translate-y-8 flex-col gap-y-8 py-16 md:py-0">
        <div className="grid grid-cols-1 gap-2 gap-y-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              className="col-span-1 duration-100 hover:translate-x-baseX hover:translate-y-baseY hover:shadow-none"
            />
          ))}
        </div>
      </section>
    </>
  )
}
