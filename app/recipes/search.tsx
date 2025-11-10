"use client"

import { useCallback, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import {
  MIN_SEARCH_QUERY_LENGTH,
  RecipeSearchResult,
  searchRecipes,
} from "@/queries/recipe-queries"
import { createClient } from "@/supabase/client"
import { useQuery } from "@tanstack/react-query"
import { useDebounceValue, useOnClickOutside } from "usehooks-ts"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Spinner } from "@/components/ui/spinner"

import type { RefObject } from "react"

type SearchbarProps = {
  className?: string
}

const SEARCH_RESULTS_LIMIT = 8
const SEARCH_INPUT_ID = "recipe-search-input"
const SEARCH_RESULTS_ID = "recipe-search-results"

const getTagPreview = (tags: RecipeSearchResult["tags"]) =>
  tags
    .map((tag) => tag.tag?.trim())
    .filter((tag): tag is string => Boolean(tag))
    .slice(0, 3)

const buildMetaLabel = (recipe: RecipeSearchResult) => {
  const author = recipe.author?.trim()
  const tagPreview = getTagPreview(recipe.tags)

  const metaParts = [
    author ? `By ${author}` : null,
    tagPreview.length ? tagPreview.join(", ") : null,
  ].filter((value): value is string => Boolean(value))

  return metaParts.join(" • ")
}

const SearchMessage = ({
  tone = "muted",
  children,
}: {
  tone?: "muted" | "error"
  children: React.ReactNode
}) => (
  <div
    role="status"
    className={cn(
      "px-4 py-6 text-sm",
      tone === "error" ? "text-destructive" : "text-muted-foreground"
    )}
  >
    {children}
  </div>
)

export function Searchbar({ className }: SearchbarProps) {
  const router = useRouter()
  const supabase = createClient()
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm] = useDebounceValue(searchTerm, 200)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useOnClickOutside(containerRef as RefObject<HTMLDivElement>, () =>
    setOpen(false)
  )

  const trimmedTerm = debouncedSearchTerm.trim()
  const isQueryReady = trimmedTerm.length >= MIN_SEARCH_QUERY_LENGTH

  const { data, isFetching, isError, error } = useQuery({
    queryKey: ["recipe-search", trimmedTerm],
    queryFn: () =>
      searchRecipes(supabase, trimmedTerm, { limit: SEARCH_RESULTS_LIMIT }),
    enabled: isQueryReady,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  })

  const results = useMemo(
    () => (isQueryReady ? (data ?? []) : []),
    [data, isQueryReady]
  )

  const handleSelect = useCallback(
    (slug: string) => {
      if (!slug) {
        return
      }

      setOpen(false)
      setSearchTerm("")
      router.push(`/recipes/${slug}`)
    },
    [router]
  )

  const statusContent = useMemo(() => {
    if (!open) {
      return null
    }

    if (!isQueryReady) {
      return (
        <SearchMessage>
          Type at least {MIN_SEARCH_QUERY_LENGTH} characters to search family
          recipes.
        </SearchMessage>
      )
    }

    if (isFetching) {
      return (
        <div className="flex items-center gap-3 px-4 py-6">
          <Spinner size="sm" aria-label="Searching recipes" />
          <span className="text-muted-foreground text-sm">
            Searching recipes…
          </span>
        </div>
      )
    }

    if (isError) {
      return (
        <SearchMessage tone="error">
          {error instanceof Error
            ? error.message
            : "Something went wrong while searching. Please try again."}
        </SearchMessage>
      )
    }

    if (results.length === 0) {
      return (
        <SearchMessage>
          No recipes matched “{trimmedTerm}”. Try a different keyword or explore
          filters on the recipes page.
        </SearchMessage>
      )
    }

    return (
      <CommandGroup heading="Search results">
        {results.map((recipe) => {
          const tagPreview = getTagPreview(recipe.tags)
          const metaLabel = buildMetaLabel(recipe)
          const slug = recipe.slug ?? ""
          const recipeHref = slug ? `/recipes/${slug}` : null

          return (
            <CommandItem
              key={recipe.id}
              value={slug}
              disabled={!recipeHref}
              onSelect={handleSelect}
              onPointerEnter={() => {
                if (recipeHref) {
                  router.prefetch(recipeHref)
                }
              }}
              className="flex cursor-pointer flex-col items-start gap-1 px-3 py-2"
            >
              <span className="text-foreground text-sm font-medium">
                {recipe.recipe_name}
              </span>
              {metaLabel ? (
                <span className="text-muted-foreground text-xs">
                  {metaLabel}
                </span>
              ) : null}
              {recipe.quote ? (
                <span className="text-muted-foreground/80 text-xs italic">
                  “{recipe.quote.trim()}”
                </span>
              ) : null}
              {tagPreview.length ? (
                <div className="flex flex-wrap gap-1 pt-1">
                  {tagPreview.map((tag) => (
                    <Badge
                      key={`${recipe.id}-${tag}`}
                      variant="outline"
                      className="border-border/50 bg-background/60 text-[10px]"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              ) : null}
            </CommandItem>
          )
        })}
      </CommandGroup>
    )
  }, [
    open,
    isQueryReady,
    isFetching,
    isError,
    results,
    trimmedTerm,
    router,
    error,
    handleSelect,
  ])

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full", className)}
      role="search"
    >
      <Command
        shouldFilter={false}
        className="bg-background overflow-visible rounded-lg md:border-0"
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setOpen(false)
            setSearchTerm("")
          }
        }}
      >
        <CommandInput
          id={SEARCH_INPUT_ID}
          value={searchTerm}
          onValueChange={(value) => {
            setSearchTerm(value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search recipes, ingredients, or authors"
          aria-expanded={open}
          aria-controls={SEARCH_RESULTS_ID}
          aria-autocomplete="list"
          autoComplete="off"
        />
        <CommandList
          id={SEARCH_RESULTS_ID}
          className={cn(
            "bg-popover absolute top-full left-0 z-50 mt-2 w-full rounded-lg border shadow-xl",
            open ? "block" : "hidden"
          )}
        >
          {statusContent}
        </CommandList>
      </Command>
    </div>
  )
}
