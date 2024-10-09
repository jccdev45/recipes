"use client"

import { FilterState, Ingredient, Recipe, Tag } from "@/lib/types"
import { useRecipes } from "@/hooks/useRecipes"
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
    </>
  )
}
