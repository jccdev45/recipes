"use client"

import { getRecipes } from "@/queries/recipe-queries"
import { createClient } from "@/supabase/client"
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query"

import { Recipe } from "@/lib/types"
import { Typography } from "@/components/ui/typography"
import { RecipeCard } from "@/app/recipes/recipe-card"

export function RecipeList() {
  const supabase = createClient()
  const { data, error } = useQuery(getRecipes(supabase))

  if (error) {
    return <div>Error loading recipes</div>
  }

  const recipes = data as unknown as Recipe[]

  return (
    <section className="mx-auto flex h-full w-5/6 max-w-6xl -translate-y-8 flex-col gap-y-8 py-16 md:py-0">
      {recipes && recipes.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:gap-8">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} display="wide" />
          ))}
        </div>
      ) : (
        <div className="text-center">
          <Typography variant="h3">No recipes found</Typography>
          <Typography variant="p" className="mt-2">
            Try adjusting your search or filters, or add a new recipe.
          </Typography>
        </div>
      )}
    </section>
  )
}
