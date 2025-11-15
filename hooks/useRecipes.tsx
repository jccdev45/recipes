import { getRecipes } from "@/queries/recipe-queries"
import { createClient } from "@/supabase/client"
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query"

import { Ingredient, Recipe, Tag, UnitMeasurement } from "@/lib/types"

type RecipeRow = Recipe & {
  comment_meta?: { count: number }[]
}

export function useRecipes() {
  const supabase = createClient()
  const { data, isLoading, error } = useQuery(getRecipes(supabase))

  const recipes = Array.isArray(data) ? (data as unknown as RecipeRow[]) : []
  const ingredientMap = new Map<string, Ingredient>()
  const tagMap = new Map<string, Tag>()
  const unitSet = new Set<string>()
  const authorSet = new Set<string>()

  recipes.forEach((recipe, recipeIndex) => {
    if (recipe.author) authorSet.add(recipe.author)

    const ingredients = Array.isArray(recipe.ingredients)
      ? recipe.ingredients
      : []
    recipe.ingredients = ingredients

    ingredients.forEach((ingredient: Ingredient, ingredientIndex) => {
      const uniqueId = `${recipeIndex}-${ingredientIndex}`
      if (ingredient.ingredient) {
        ingredientMap.set(ingredient.ingredient, {
          ...ingredient,
          id: uniqueId,
        })
      }
      if (ingredient.unitMeasurement) unitSet.add(ingredient.unitMeasurement)
    })

    const commentCount = Array.isArray(recipe.comment_meta)
      ? (recipe.comment_meta[0]?.count ?? 0)
      : 0
    recipe.commentCount = commentCount

    const tags = Array.isArray(recipe.tags) ? recipe.tags : []
    recipe.tags = tags

    tags.forEach((tag: Tag, tagIndex) => {
      const uniqueId = `${recipeIndex}-${tagIndex}`
      if (tag.tag) {
        tagMap.set(tag.tag, { ...tag, id: uniqueId })
      }
    })

    // Ensure steps are unique within each recipe
    const steps = Array.isArray(recipe.steps) ? recipe.steps : []
    recipe.steps = Array.from(new Set(steps.map((step) => step.step))).map(
      (step, index) => ({ id: `${recipeIndex}-${index}`, step })
    )

    if (recipe.comment_meta) {
      delete recipe.comment_meta
    }
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
