"use client"

import { getRecipes } from "@/queries/get-recipes"
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
    <section className="flex flex-col w-5/6 h-full max-w-6xl py-16 mx-auto -translate-y-8 gap-y-8 md:py-0">
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
