// TODO: Extract filters to URL instead of state

"use client"

import { X } from "lucide-react"

import { FilterState, Ingredient, Tag } from "@/lib/types"
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
      onFilterChange((prevFilters) => ({
        ...prevFilters,
        authors: prevFilters.authors.includes(author)
          ? prevFilters.authors.filter((a) => a !== author)
          : [...prevFilters.authors, author],
      }))
    }
  }

  const handleTagSelect = (tag: Tag | null) => {
    if (tag) {
      onFilterChange((prevFilters) => ({
        ...prevFilters,
        tags: prevFilters.tags.some((t) => t.tag === tag.tag)
          ? prevFilters.tags.filter((t) => t.tag !== tag.tag)
          : [...prevFilters.tags, tag],
      }))
    }
  }

  const handleIngredientSelect = (ingredient: Ingredient | null) => {
    if (ingredient) {
      onFilterChange((prevFilters) => ({
        ...prevFilters,
        ingredients: prevFilters.ingredients.some(
          (i) => i.ingredient === ingredient.ingredient
        )
          ? prevFilters.ingredients.filter(
              (i) => i.ingredient !== ingredient.ingredient
            )
          : [...prevFilters.ingredients, ingredient],
      }))
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
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
      <DisplayCurrentFilters
        filters={filters}
        onFilterChange={onFilterChange}
      />
    </div>
  )
}

function DisplayCurrentFilters({ filters, onFilterChange }: FilterProps) {
  const hasFilters =
    filters.authors.length + filters.tags.length + filters.ingredients.length >
    0

  function handleRemoveTag(tag: Tag) {
    return () =>
      onFilterChange((prevFilters) => ({
        ...prevFilters,
        tags: prevFilters.tags.filter((item) => item !== tag),
      }))
  }

  function handleRemoveIngredient(ingredient: Ingredient) {
    return () =>
      onFilterChange((prevFilters) => ({
        ...prevFilters,
        ingredients: prevFilters.ingredients.filter(
          (item) => item !== ingredient
        ),
      }))
  }

  function handleRemoveAuthor(author: string) {
    return () =>
      onFilterChange((prevFilters) => ({
        ...prevFilters,
        authors: prevFilters.authors.filter((item) => item !== author),
      }))
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {filters.authors.map((author) => (
          <Badge key={author} variant="secondary" className="relative pr-7">
            {author}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1/2 right-1 size-5 -translate-y-1/2 rounded-full p-0"
              onClick={handleRemoveAuthor(author)}
              aria-label={`Remove author filter ${author}`}
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </Button>
          </Badge>
        ))}
        {filters.tags.map((tag) => (
          <Badge key={tag.tag} variant="secondary" className="relative pr-7">
            {tag.tag}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1/2 right-1 size-5 -translate-y-1/2 rounded-full p-0"
              onClick={handleRemoveTag(tag)}
              aria-label={`Remove tag filter ${tag.tag}`}
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </Button>
          </Badge>
        ))}
        {filters.ingredients.map((ingredient) => (
          <Badge
            key={ingredient.ingredient}
            variant="secondary"
            className="relative pr-7"
          >
            {ingredient.ingredient}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1/2 right-1 size-5 -translate-y-1/2 rounded-full p-0"
              onClick={handleRemoveIngredient(ingredient)}
              aria-label={`Remove ingredient filter ${ingredient.ingredient}`}
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </Button>
          </Badge>
        ))}
      </div>
      {hasFilters ? (
        <Button
          variant="outline"
          size="sm"
          className="w-fit"
          onClick={() =>
            onFilterChange({ authors: [], tags: [], ingredients: [] })
          }
        >
          Clear filters
        </Button>
      ) : (
        <p className="text-muted-foreground text-xs">No filters applied yet.</p>
      )}
    </div>
  )
}
