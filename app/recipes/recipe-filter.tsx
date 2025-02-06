"use client"

import { X } from "lucide-react"

import { FilterState, Ingredient, Recipe, Tag } from "@/lib/types"
import { useRecipes } from "@/hooks/useRecipes"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FilterCombobox } from "@/app/recipes/filter-combobox"

interface FilterProps {
  filters: FilterState
  onFilterChange: (
    filters: FilterState | ((prevFilters: FilterState) => FilterState)
  ) => void
}

export function RecipeFilter({ filters, onFilterChange }: FilterProps) {
  const { authors, ingredients, tags } = useRecipes()

  const handleAuthorSelect = (author: string | null) => {
    if (author) {
      onFilterChange({
        ...filters,
        authors: filters.authors.includes(author)
          ? filters.authors.filter((a) => a !== author)
          : [...filters.authors, author],
      })
    }
  }

  const handleTagSelect = (tag: Tag | null) => {
    if (tag) {
      onFilterChange({
        ...filters,
        tags: filters.tags.some((t) => t.tag === tag.tag)
          ? filters.tags.filter((t) => t.tag !== tag.tag)
          : [...filters.tags, tag],
      })
    }
  }

  const handleIngredientSelect = (ingredient: Ingredient | null) => {
    if (ingredient) {
      onFilterChange({
        ...filters,
        ingredients: filters.ingredients.some(
          (i) => i.ingredient === ingredient.ingredient
        )
          ? filters.ingredients.filter(
              (i) => i.ingredient !== ingredient.ingredient
            )
          : [...filters.ingredients, ingredient],
      })
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-6">
        <FilterCombobox<string>
          items={authors}
          placeholder="Search author..."
          emptyText="No author found."
          selectedItems={filters.authors}
          onSelect={handleAuthorSelect}
          getLabel={(author) => author}
          getValue={(author) => author}
        />
        <FilterCombobox<Tag>
          items={tags}
          placeholder="Search tag..."
          emptyText="No tag found."
          selectedItems={filters.tags}
          onSelect={handleTagSelect}
          getLabel={(tag) => tag.tag}
          getValue={(tag) => tag.id || tag.tag}
        />
        <FilterCombobox<Ingredient>
          items={ingredients}
          placeholder="Search ingredient..."
          emptyText="No ingredient found."
          selectedItems={filters.ingredients}
          onSelect={handleIngredientSelect}
          getLabel={(ingredient) => ingredient.ingredient}
          getValue={(ingredient) => ingredient.id || ingredient.ingredient}
        />
      </div>
      <div className="flex flex-col items-center justify-center gap-2">
        <DisplayCurrentFilters
          filters={filters}
          onFilterChange={onFilterChange}
        />
      </div>
    </>
  )
}

function DisplayCurrentFilters({ filters, onFilterChange }: FilterProps) {
  function handleRemoveTag(tag: Tag) {
    return () =>
      onFilterChange({
        ...filters,
        tags: filters.tags.filter((item) => item !== tag),
      })
  }

  function handleRemoveIngredient(ingredient: Ingredient) {
    return () =>
      onFilterChange({
        ...filters,
        ingredients: filters.ingredients.filter((item) => item !== ingredient),
      })
  }

  function handleRemoveAuthor(author: string) {
    return () =>
      onFilterChange({
        ...filters,
        authors: filters.authors.filter((item) => item !== author),
      })
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {filters.authors.map((author) => (
          <Badge key={author} variant="default" className="relative">
            {author}
            <Button
              variant="destructive"
              size="icon"
              className="absolute -right-2 -top-1/2 size-6 scale-50 rounded-full p-0"
              onClick={handleRemoveAuthor(author)}
            >
              <X className="rounded-full border border-destructive-foreground text-foreground" />
            </Button>
          </Badge>
        ))}
        {filters.tags.map((tag) => (
          <Badge key={tag.tag} variant="default" className="relative">
            {tag.tag}
            <Button
              variant="destructive"
              size="icon"
              className="absolute -right-2 -top-1/2 size-6 scale-50 rounded-full p-0"
              onClick={handleRemoveTag(tag)}
            >
              <X className="rounded-full border border-destructive-foreground text-foreground" />
            </Button>
          </Badge>
        ))}
        {filters.ingredients.map((ingredient) => (
          <Badge
            key={ingredient.ingredient}
            variant="default"
            className="relative"
          >
            {ingredient.ingredient}
            <Button
              variant="destructive"
              size="icon"
              className="absolute -right-2 -top-1/2 size-6 scale-50 rounded-full p-0"
              onClick={handleRemoveIngredient(ingredient)}
            >
              <X className="rounded-full border border-destructive-foreground text-foreground" />
            </Button>
          </Badge>
        ))}
      </div>
      <Button
        variant="destructive"
        size="sm"
        onClick={() =>
          onFilterChange({ authors: [], tags: [], ingredients: [] })
        }
      >
        Clear Filters
      </Button>
    </div>
  )
}
