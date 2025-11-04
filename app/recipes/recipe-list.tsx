"use client"

import { useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { User } from "@supabase/supabase-js"
import { LayoutGrid, PanelLeft, SlidersHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { useRecipes } from "@/hooks/useRecipes"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Spinner } from "@/components/ui/spinner"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Typography } from "@/components/ui/typography"
import { RecipeCard } from "@/app/recipes/recipe-card"
import { RecipeFilter } from "@/app/recipes/recipe-filter"

interface RecipeListProps {
  user: User | null
  searchTerm?: string
}

export function RecipeList({ user, searchTerm }: RecipeListProps) {
  const { recipes, isLoading, error, authors, tags, ingredients } = useRecipes()
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [displayMode, setDisplayMode] = useState<"wide" | "compact">("wide")

  const searchParamsKey = searchParams.toString()

  const selectedAuthors = useMemo(
    () => searchParams.getAll("author"),
    [searchParamsKey]
  )
  const selectedTags = useMemo(
    () => searchParams.getAll("tag"),
    [searchParamsKey]
  )
  const selectedIngredients = useMemo(
    () => searchParams.getAll("ingredient"),
    [searchParamsKey]
  )

  const appliedFilterCount =
    selectedAuthors.length + selectedTags.length + selectedIngredients.length

  const replaceSearchParams = (params: URLSearchParams) => {
    const query = params.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    })
  }

  const toggleFilterValue = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    const values = params.getAll(key)
    const hasValue = values.includes(value)
    const nextValues = hasValue
      ? values.filter((item) => item !== value)
      : [...values, value]

    params.delete(key)
    nextValues.forEach((item) => params.append(key, item))
    replaceSearchParams(params)
  }

  const clearAllFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    ;["author", "tag", "ingredient"].forEach((key) => params.delete(key))
    replaceSearchParams(params)
  }

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
            <Typography variant="muted" className="text-sm">
              {summaryMessage}
            </Typography>
          </div>
          <div className="flex justify-center lg:hidden">
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="inline-flex items-center gap-2"
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
              </SheetTrigger>
              <SheetContent side="left" className="w-full max-w-md sm:max-w-lg">
                <SheetHeader>
                  <SheetTitle>Refine results</SheetTitle>
                  <SheetDescription>
                    Narrow recipes by author, tags, or ingredients. All changes
                    apply instantly.
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  <LayoutToggle
                    value={displayMode}
                    onChange={setDisplayMode}
                    className="justify-start"
                  />
                  <RecipeFilter
                    authors={authors}
                    tags={tags}
                    ingredients={ingredients}
                    selectedAuthors={selectedAuthors}
                    selectedTags={selectedTags}
                    selectedIngredients={selectedIngredients}
                    onToggleAuthor={(value: string) =>
                      toggleFilterValue("author", value)
                    }
                    onToggleTag={(value: string) =>
                      toggleFilterValue("tag", value)
                    }
                    onToggleIngredient={(value: string) =>
                      toggleFilterValue("ingredient", value)
                    }
                    onClearAll={() => {
                      clearAllFilters()
                      setIsFilterOpen(false)
                    }}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </header>

        <div className="gap-10 lg:grid lg:grid-cols-[320px,1fr]">
          <aside className="hidden lg:block" aria-label="Recipe filters">
            <div className="border-border/60 bg-card/70 sticky top-28 space-y-6 rounded-2xl border p-6 shadow-sm backdrop-blur">
              <div className="flex items-center justify-between">
                <Typography variant="h3" className="text-xl font-semibold">
                  Filters
                </Typography>
                {appliedFilterCount > 0 ? (
                  <Badge variant="secondary" className="px-2 py-0.5">
                    {appliedFilterCount}
                  </Badge>
                ) : null}
              </div>
              <Typography variant="muted" className="text-xs">
                Select one or more options to focus on specific recipes.
              </Typography>
              <LayoutToggle value={displayMode} onChange={setDisplayMode} />
              <RecipeFilter
                authors={authors}
                tags={tags}
                ingredients={ingredients}
                selectedAuthors={selectedAuthors}
                selectedTags={selectedTags}
                selectedIngredients={selectedIngredients}
                onToggleAuthor={(value: string) =>
                  toggleFilterValue("author", value)
                }
                onToggleTag={(value: string) => toggleFilterValue("tag", value)}
                onToggleIngredient={(value: string) =>
                  toggleFilterValue("ingredient", value)
                }
                onClearAll={clearAllFilters}
              />
            </div>
          </aside>

          <div className="flex min-w-0 flex-col gap-6">
            {noResults ? (
              <Alert>
                <AlertTitle>No matches found</AlertTitle>
                <AlertDescription>
                  Try removing a filter or adjusting your selections. You can
                  also clear all filters to view every recipe.
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
        </div>
      </div>
    </section>
  )
}

interface LayoutToggleProps {
  value: "wide" | "compact"
  onChange: (value: "wide" | "compact") => void
  className?: string
}

function LayoutToggle({ value, onChange, className }: LayoutToggleProps) {
  return (
    <div className="space-y-2">
      <Typography
        variant="small"
        className="text-muted-foreground text-xs font-medium tracking-wide uppercase"
      >
        Card layout
      </Typography>
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={(layout) => {
          if (layout === "wide" || layout === "compact") {
            onChange(layout)
          }
        }}
        className={cn("w-full justify-start", className)}
        aria-label="Card layout"
      >
        <ToggleGroupItem
          value="wide"
          aria-label="Use wide card layout"
          className="flex-1 gap-2"
        >
          <PanelLeft className="h-4 w-4" aria-hidden="true" />
          Wide
        </ToggleGroupItem>
        <ToggleGroupItem
          value="compact"
          aria-label="Use compact card layout"
          className="flex-1 gap-2"
        >
          <LayoutGrid className="h-4 w-4" aria-hidden="true" />
          Compact
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}
