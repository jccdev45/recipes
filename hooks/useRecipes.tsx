import { useQuery } from "@tanstack/react-query"

import { Ingredient, Recipe, Tag, UnitMeasurement } from "@/lib/types"

type RecipesResponse = {
  recipes: Recipe[]
}

export function useRecipes() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["recipes"],
    queryFn: async () => {
      const response = await fetch("/api/recipes", {
        credentials: "include",
      })

      if (!response.ok) {
        const message = await response.text()
        throw new Error(message || "Failed to load recipes")
      }

      const payload = (await response.json()) as RecipesResponse
      return payload.recipes ?? []
    },
  })

  const recipes = Array.isArray(data) ? [...data] : []
  const ingredientMap = new Map<string, Ingredient>()
  const tagMap = new Map<string, Tag>()
  const unitSet = new Set<string>()
  const authorSet = new Set<string>()

  recipes.forEach((recipe, recipeIndex) => {
    if (recipe.author) authorSet.add(recipe.author)

    recipe.commentCount = recipe.commentCount ?? 0
    recipe.isFavorite = recipe.isFavorite ?? false

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
  })

  const additionalUnits: UnitMeasurement[] = [
    "gram",
    "milliliter",
    "whole",
    "sprig",
    "pinch",
  ]
  additionalUnits.forEach((unit) => unitSet.add(unit))

  const normalizedError = error
    ? error instanceof Error
      ? error
      : new Error("Failed to load recipes")
    : null

  return {
    error: normalizedError,
    isLoading,
    recipes,
    authors: Array.from(authorSet),
    ingredients: Array.from(ingredientMap.values()),
    tags: Array.from(tagMap.values()),
    units: Array.from(unitSet),
  }
}
