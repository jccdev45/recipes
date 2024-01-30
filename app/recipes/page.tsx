import queryString from "query-string"

import { Recipe } from "@/types/supabase"
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
    <section className="h-full">
      <GradientBanner />

      <div className="flex flex-col w-5/6 h-full max-w-6xl py-16 mx-auto -translate-y-32 md:py-0 gap-y-8">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 gap-y-4 lg:gap-4">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              className="hover:shadow-xl hover:scale-[1.01] col-span-1 shadow-lg"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
