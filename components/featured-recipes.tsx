"use client"

import { getFeaturedRecipes } from "@/queries/recipe-queries"
import { createClient } from "@/supabase/client"
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query"

import { Recipe } from "@/lib/types"
import { RecipeCard } from "@/app/recipes/recipe-card"

export function FeaturedRecipes() {
  const supabase = createClient()
  const { data, isLoading, error } = useQuery(getFeaturedRecipes(supabase))
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  const recipes = data as unknown as Recipe[]

  return (
    <>
      {recipes.map((recipe: Recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </>
  )
}
