"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { LayoutGrid, PanelLeft, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { useRecipes } from "@/hooks/useRecipes"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Typography } from "@/components/ui/typography"
import { RecipeFilter } from "@/app/recipes/recipe-filter"

import type { Ingredient, Recipe, Tag } from "@/lib/types"
import type { ReactNode } from "react"

type DisplayMode = "wide" | "compact"
type FilterKey = "author" | "tag" | "ingredient"

interface RecipeFiltersContextValue {
  recipes: Recipe[]
  isLoading: boolean
  error: unknown
  authors: string[]
  tags: Tag[]
  ingredients: Ingredient[]
  selectedAuthors: string[]
  selectedTags: string[]
  selectedIngredients: string[]
  appliedFilterCount: number
  displayMode: DisplayMode
  setDisplayMode: (mode: DisplayMode) => void
  toggleAuthor: (value: string) => void
  toggleTag: (value: string) => void
  toggleIngredient: (value: string) => void
  clearAllFilters: () => void
}

const RecipeFiltersContext = createContext<RecipeFiltersContextValue | null>(
  null
)

export function RecipeFiltersProvider({ children }: { children: ReactNode }) {
  const { recipes, isLoading, error, authors, tags, ingredients } = useRecipes()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [displayMode, setDisplayModeState] = useState<DisplayMode>("wide")

  const searchParamsKey = searchParams.toString()

  const selectedAuthors = useMemo(() => {
    const params = new URLSearchParams(searchParamsKey)
    return params.getAll("author")
  }, [searchParamsKey])

  const selectedTags = useMemo(() => {
    const params = new URLSearchParams(searchParamsKey)
    return params.getAll("tag")
  }, [searchParamsKey])

  const selectedIngredients = useMemo(() => {
    const params = new URLSearchParams(searchParamsKey)
    return params.getAll("ingredient")
  }, [searchParamsKey])

  const appliedFilterCount =
    selectedAuthors.length + selectedTags.length + selectedIngredients.length

  const replaceSearchParams = useCallback(
    (params: URLSearchParams) => {
      const query = params.toString()
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      })
    },
    [router, pathname]
  )

  const toggleFilterValue = useCallback(
    (key: FilterKey, value: string) => {
      const params = new URLSearchParams(searchParamsKey)
      const values = params.getAll(key)
      const hasValue = values.includes(value)
      const nextValues = hasValue
        ? values.filter((item) => item !== value)
        : [...values, value]

      params.delete(key)
      nextValues.forEach((item) => params.append(key, item))
      replaceSearchParams(params)
    },
    [searchParamsKey, replaceSearchParams]
  )

  const clearAllFilters = useCallback(() => {
    if (appliedFilterCount === 0) {
      return
    }

    const params = new URLSearchParams(searchParamsKey)
    ;["author", "tag", "ingredient"].forEach((key) => params.delete(key))
    replaceSearchParams(params)
  }, [appliedFilterCount, searchParamsKey, replaceSearchParams])

  const setDisplayMode = useCallback((mode: DisplayMode) => {
    setDisplayModeState(mode)
  }, [])

  const value = useMemo<RecipeFiltersContextValue>(
    () => ({
      recipes,
      isLoading,
      error,
      authors,
      tags,
      ingredients,
      selectedAuthors,
      selectedTags,
      selectedIngredients,
      appliedFilterCount,
      displayMode,
      setDisplayMode,
      toggleAuthor: (value: string) => toggleFilterValue("author", value),
      toggleTag: (value: string) => toggleFilterValue("tag", value),
      toggleIngredient: (value: string) =>
        toggleFilterValue("ingredient", value),
      clearAllFilters,
    }),
    [
      recipes,
      isLoading,
      error,
      authors,
      tags,
      ingredients,
      selectedAuthors,
      selectedTags,
      selectedIngredients,
      appliedFilterCount,
      displayMode,
      setDisplayMode,
      toggleFilterValue,
      clearAllFilters,
    ]
  )

  return (
    <RecipeFiltersContext.Provider value={value}>
      {children}
    </RecipeFiltersContext.Provider>
  )
}

export function useRecipeFilters() {
  const context = useContext(RecipeFiltersContext)
  if (!context) {
    throw new Error(
      "useRecipeFilters must be used within a RecipeFiltersProvider"
    )
  }

  return context
}

export function FilterSidebar() {
  const {
    authors,
    tags,
    ingredients,
    selectedAuthors,
    selectedTags,
    selectedIngredients,
    appliedFilterCount,
    displayMode,
    setDisplayMode,
    toggleAuthor,
    toggleTag,
    toggleIngredient,
    clearAllFilters,
  } = useRecipeFilters()
  const { toggleSidebar } = useSidebar()

  return (
    <Sidebar variant="floating">
      <SidebarHeader className="border-sidebar-border/60 border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <Typography variant="h3" className="text-lg font-semibold">
            Filters
          </Typography>

          <Button
            variant="destructive"
            size="icon-sm"
            className="self-end"
            onClick={toggleSidebar}
          >
            <XIcon />
          </Button>
        </div>
        <Typography variant="muted" className="text-xs">
          Select one or more options to focus on specific recipes.
        </Typography>
      </SidebarHeader>
      <SidebarContent className="px-6 py-6">
        <SidebarGroup className="border-border/60 bg-card/70 space-y-6 rounded-2xl border p-6 shadow-sm backdrop-blur">
          <LayoutToggle value={displayMode} onChange={setDisplayMode} />
          <RecipeFilter
            appliedFilterCount={appliedFilterCount}
            authors={authors}
            tags={tags}
            ingredients={ingredients}
            selectedAuthors={selectedAuthors}
            selectedTags={selectedTags}
            selectedIngredients={selectedIngredients}
            onToggleAuthor={toggleAuthor}
            onToggleTag={toggleTag}
            onToggleIngredient={toggleIngredient}
            onClearAll={clearAllFilters}
          />
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

interface LayoutToggleProps {
  value: DisplayMode
  onChange: (value: DisplayMode) => void
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
