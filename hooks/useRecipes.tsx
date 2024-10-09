import { getRecipes } from "@/queries/recipe-queries"
import { createClient } from "@/supabase/client"
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query"

import { Ingredient, Recipe, Tag, UnitMeasurement } from "@/lib/types"

export function useRecipes() {
  const supabase = createClient()
  const { data, isLoading, error } = useQuery(getRecipes(supabase))

  const recipes = data as Recipe[]
  const ingredientMap = new Map<string, Ingredient>()
  const tagMap = new Map<string, Tag>()
  const unitSet = new Set<string>()
  const authorSet = new Set<string>()

  recipes.forEach((recipe, recipeIndex) => {
    if (recipe.author) authorSet.add(recipe.author)

    recipe.ingredients.forEach((ingredient: Ingredient, ingredientIndex) => {
      const uniqueId = `${recipeIndex}-${ingredientIndex}`
      if (ingredient.ingredient) {
        ingredientMap.set(ingredient.ingredient, {
          ...ingredient,
          id: uniqueId,
        })
      }
      if (ingredient.unitMeasurement) unitSet.add(ingredient.unitMeasurement)
    })

    recipe.tags.forEach((tag: Tag, tagIndex) => {
      const uniqueId = `${recipeIndex}-${tagIndex}`
      if (tag.tag) {
        tagMap.set(tag.tag, { ...tag, id: uniqueId })
      }
    })

    // Ensure steps are unique within each recipe
    recipe.steps = Array.from(
      new Set(recipe.steps.map((step) => step.step))
    ).map((step, index) => ({ id: `${recipeIndex}-${index}`, step }))
  })

  const additionalUnits: UnitMeasurement[] = [
    "gram",
    "milliliter",
    "whole",
    "sprig",
    "pinch",
  ]
  additionalUnits.forEach((unit) => unitSet.add(unit))

  return {
    error,
    isLoading,
    recipes,
    authors: Array.from(authorSet),
    ingredients: Array.from(ingredientMap.values()),
    tags: Array.from(tagMap.values()),
    units: Array.from(unitSet),
  }
}
