"use client"

import { useMemo, useState } from "react"

import { FilterState, Recipe } from "@/lib/types"
import { useRecipes } from "@/hooks/useRecipes"
import { Spinner } from "@/components/ui/spinner"
import { Typography } from "@/components/ui/typography"
import { RecipeCard } from "@/app/recipes/recipe-card"
import { RecipeFilter } from "@/app/recipes/recipe-filter"

export function RecipeList() {
  const { recipes: data, isLoading, error } = useRecipes()
  const [filters, setFilters] = useState<FilterState>({
    authors: [],
    tags: [],
    ingredients: [],
  })

  if (error) {
    return <div>Error loading recipes</div>
  }

  if (isLoading) {
    return <Spinner size="2xl" />
  }

  const recipes = data as Recipe[]

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      const authorMatch =
        filters.authors.length === 0 || filters.authors.includes(recipe.author)
      const tagMatch =
        filters.tags.length === 0 ||
        filters.tags.some((filterTag) =>
          recipe.tags.some((recipeTag) => recipeTag.tag === filterTag.tag)
        )
      const ingredientMatch =
        filters.ingredients.length === 0 ||
        filters.ingredients.some((filterIngredient) =>
          recipe.ingredients.some(
            (recipeIngredient) =>
              recipeIngredient.ingredient === filterIngredient.ingredient
          )
        )
      return authorMatch && tagMatch && ingredientMatch
    })
  }, [recipes, filters])

  const handleFilterChange = (
    newFilters: FilterState | ((prevFilters: FilterState) => FilterState)
  ) => {
    setFilters((prevFilters) => {
      if (typeof newFilters === "function") {
        return newFilters(prevFilters)
      }
      return newFilters
    })
  }

  const displayRecipes = filteredRecipes.length > 0 ? filteredRecipes : recipes

  return (
    <section className="mx-auto grid grid-cols-1 gap-0 p-8 md:grid-cols-3 md:gap-4">
      <div className="sticky inset-x-0 top-2 z-10 col-span-1 mb-6 flex h-fit flex-col items-center gap-4 rounded-lg border border-foreground/50 bg-muted p-4 pb-12 text-muted-foreground md:top-8">
        <Typography variant="h3">Filter Results</Typography>
        <RecipeFilter filters={filters} onFilterChange={handleFilterChange} />
      </div>
      {displayRecipes.length > 0 ? (
        <div className="col-span-2 grid grid-cols-1 gap-6 md:gap-8">
          {displayRecipes.map((recipe) => (
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
