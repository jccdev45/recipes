"use client"

import { getRecipes } from "@/queries/recipe-queries"
import { createClient } from "@/supabase/client"
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query"

import { Recipe } from "@/lib/types"
import { RecipeCard } from "@/app/recipes/RecipeCard"

export function RecipeList() {
  const supabase = createClient()
  const { data, error } = useQuery(getRecipes(supabase))

  if (error) {
    return <div>Error loading recipes</div>
  }

  const recipes = data as unknown as Recipe[]

  return (
    <section className="mx-auto flex h-full w-5/6 max-w-6xl -translate-y-8 flex-col gap-y-8 py-16 md:py-0">
      <div className="grid grid-cols-1 gap-2 gap-y-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-4">
        {!recipes ? (
          <div></div>
        ) : (
          recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              className="col-span-1 duration-100 hover:translate-x-baseX hover:translate-y-baseY hover:shadow-none"
            />
          ))
        )}
      </div>
    </section>
  )
}
