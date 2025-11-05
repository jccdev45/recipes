"use client"

import { useMemo } from "react"
import { User } from "@supabase/supabase-js"
import { SlidersHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"
import { Spinner } from "@/components/ui/spinner"
import { Typography } from "@/components/ui/typography"
import { FilterSidebarTrigger } from "@/components/filter-sidebar-trigger"
import { useRecipeFilters } from "@/app/recipes/filter-sidebar"
import { RecipeCard } from "@/app/recipes/recipe-card"

interface RecipeListProps {
  user: User | null
  searchTerm?: string
}

export function RecipeList({ user, searchTerm }: RecipeListProps) {
  const {
    recipes,
    isLoading,
    error,
    selectedAuthors,
    selectedTags,
    selectedIngredients,
    appliedFilterCount,
    displayMode,
    clearAllFilters,
  } = useRecipeFilters()
  const { toggleSidebar } = useSidebar()

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <Alert variant="destructive">
          <AlertTitle>We hit a snag</AlertTitle>
          <AlertDescription>
            Something went wrong while loading recipes. Please try refreshing
            the page or come back later.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex w-full justify-center px-4 py-16">
        <Spinner size="2xl" />
      </div>
    )
  }

  const filteredRecipes = useMemo(() => {
    const hasAuthorFilters = selectedAuthors.length > 0
    const hasTagFilters = selectedTags.length > 0
    const hasIngredientFilters = selectedIngredients.length > 0

    if (!hasAuthorFilters && !hasTagFilters && !hasIngredientFilters) {
      return recipes
    }

    return recipes.filter((recipe) => {
      const matchesAuthor =
        hasAuthorFilters &&
        recipe.author !== undefined &&
        recipe.author !== null
          ? selectedAuthors.includes(recipe.author)
          : false
      const matchesTag =
        hasTagFilters && recipe.tags.length > 0
          ? recipe.tags.some((recipeTag) =>
              selectedTags.includes(recipeTag.tag)
            )
          : false
      const matchesIngredient =
        hasIngredientFilters && recipe.ingredients.length > 0
          ? recipe.ingredients.some((recipeIngredient) =>
              selectedIngredients.includes(recipeIngredient.ingredient)
            )
          : false

      return matchesAuthor || matchesTag || matchesIngredient
    })
  }, [recipes, selectedAuthors, selectedTags, selectedIngredients])

  const hasActiveFilters = appliedFilterCount > 0
  const displayRecipes = hasActiveFilters ? filteredRecipes : recipes
  const totalRecipes = recipes.length
  const visibleRecipes = displayRecipes.length
  const noResults = hasActiveFilters && filteredRecipes.length === 0
  const isCompactLayout = displayMode === "compact"
  const summaryMessage = (() => {
    if (totalRecipes === 0) {
      return "No recipes to show yet. Check back soon or add your first recipe."
    }

    if (noResults) {
      return "No recipes match your current filters."
    }

    if (hasActiveFilters) {
      return `Showing ${visibleRecipes} of ${totalRecipes} recipes`
    }

    return `Showing all ${visibleRecipes} recipes`
  })()

  return (
    <section
      aria-labelledby="recipe-results-heading"
      className="mx-auto w-full max-w-6xl px-4 pb-16 lg:px-6"
    >
      <div className="flex flex-col gap-6">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2 text-center lg:text-left">
            <Typography
              id="recipe-results-heading"
              variant="h2"
              className="text-3xl font-semibold tracking-tight"
            >
              {searchTerm
                ? `Recipes matching “${searchTerm}”`
                : "Browse recipes"}
            </Typography>
            <FilterSidebarTrigger />
            <Typography variant="muted" className="text-sm">
              {summaryMessage}
            </Typography>
          </div>
          <div className="flex justify-center lg:hidden">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="inline-flex items-center gap-2"
              onClick={toggleSidebar}
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              Filters
              {appliedFilterCount > 0 ? (
                <Badge
                  variant="secondary"
                  className="ml-1 inline-flex min-w-6 justify-center"
                >
                  {appliedFilterCount}
                </Badge>
              ) : null}
            </Button>
          </div>
        </header>

        {noResults ? (
          <Alert>
            <AlertTitle>No matches found</AlertTitle>
            <AlertDescription>
              Try removing a filter or adjusting your selections. You can also
              clear all filters to view every recipe.
            </AlertDescription>
            <div className="mt-4">
              <Button variant="outline" size="sm" onClick={clearAllFilters}>
                Clear all filters
              </Button>
            </div>
          </Alert>
        ) : (
          <div
            className={cn(
              "w-full",
              isCompactLayout
                ? "grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
                : "flex flex-col gap-6"
            )}
          >
            {displayRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                user={user}
                display={displayMode}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
