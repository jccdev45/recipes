"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { searchRecipes } from "@/queries/recipe-queries"
import { createClient } from "@/supabase/client"
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query"
import { Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Typography } from "@/components/ui/typography"

export function Searchbar({ className }: { className?: string }) {
  const supabase = createClient()
  const [searchTerm, setSearchTerm] = useState("")

  const {
    data: searchResults,
    isLoading,
    error,
  } = useQuery(searchRecipes(supabase, searchTerm))

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const renderSearchResults = useMemo(() => {
    if (isLoading) {
      return <Typography variant="p">Loading...</Typography>
    }

    if (error) {
      return <Typography variant="p">{error.message}</Typography>
    }

    if (!searchResults || searchResults.length === 0) {
      return <Typography variant="p">No results found</Typography>
    }

    return (
      <>
        <Typography variant="h4">Showing results for: {searchTerm}</Typography>
        <ul>
          {searchResults.map((recipe) => (
            <li key={recipe.id}>
              <Link
                href={`/recipes/${recipe.slug}`}
                className="block p-2 hover:bg-accent"
              >
                {recipe.recipe_name}
              </Link>
            </li>
          ))}
        </ul>
      </>
    )
  }, [isLoading, error, searchResults, searchTerm])

  return (
    <div className={cn("relative w-full", className)} role="search">
      <Label htmlFor="search" className="sr-only">
        Search recipes
      </Label>
      <div className="relative w-full">
        <Input
          id="search"
          type="search"
          value={searchTerm}
          className="w-full pr-10"
          placeholder="Search recipes, ingredients, etc.."
          onChange={handleChange}
          autoComplete="off"
        />

        <Search className="absolute right-2 top-0 size-5 h-full" />
      </div>
      {searchTerm && (
        <div className="absolute top-full z-10 mt-1 w-full rounded-md bg-muted-foreground text-muted shadow-lg">
          {renderSearchResults}
        </div>
      )}
    </div>
  )
}
