"use client"

import { useMemo } from "react"
import { Check } from "lucide-react"

import { Ingredient, Tag } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  Tags,
  TagsContent,
  TagsEmpty,
  TagsGroup,
  TagsInput,
  TagsItem,
  TagsList,
  TagsTrigger,
  TagsValue,
} from "@/components/kibo-ui/tags"

interface RecipeFilterProps {
  authors: string[]
  tags: Tag[]
  ingredients: Ingredient[]
  selectedAuthors: string[]
  selectedTags: string[]
  selectedIngredients: string[]
  onToggleAuthor: (author: string) => void
  onToggleTag: (tag: string) => void
  onToggleIngredient: (ingredient: string) => void
  onClearAll: () => void
}

type FilterOption = {
  label: string
  value: string
}

function FilterSection({
  label,
  placeholder,
  options,
  selected,
  onToggle,
  emptyText,
}: {
  label: string
  placeholder: string
  options: FilterOption[]
  selected: string[]
  onToggle: (value: string) => void
  emptyText: string
}) {
  return (
    <div className="space-y-2">
      <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
        {label}
      </p>
      <Tags className="w-full">
        <TagsTrigger
          placeholder={placeholder}
          aria-label={`Filter recipes by ${label.toLowerCase()}`}
        >
          {selected.map((value) => (
            <TagsValue
              key={value}
              onRemove={() => onToggle(value)}
              aria-label={`Remove ${label} filter ${value}`}
            >
              {value}
            </TagsValue>
          ))}
        </TagsTrigger>
        <TagsContent align="start">
          <TagsInput placeholder={`Search ${label.toLowerCase()}...`} />
          <TagsList>
            <TagsEmpty>{emptyText}</TagsEmpty>
            <TagsGroup>
              {options.map((option) => {
                const isSelected = selected.includes(option.value)
                return (
                  <TagsItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => onToggle(option.value)}
                    aria-selected={isSelected}
                    aria-checked={isSelected}
                  >
                    <span>{option.label}</span>
                    {isSelected ? (
                      <Check
                        className="text-primary ml-2 h-4 w-4"
                        aria-hidden="true"
                      />
                    ) : null}
                  </TagsItem>
                )
              })}
            </TagsGroup>
          </TagsList>
        </TagsContent>
      </Tags>
    </div>
  )
}

export function RecipeFilter({
  authors,
  tags,
  ingredients,
  selectedAuthors,
  selectedTags,
  selectedIngredients,
  onToggleAuthor,
  onToggleTag,
  onToggleIngredient,
  onClearAll,
}: RecipeFilterProps) {
  const authorOptions = useMemo<FilterOption[]>(
    () =>
      [...authors]
        .sort((a, b) => a.localeCompare(b))
        .map((author) => ({
          label: author,
          value: author,
        })),
    [authors]
  )

  const tagOptions = useMemo<FilterOption[]>(
    () =>
      [...tags]
        .sort((a, b) => a.tag.localeCompare(b.tag))
        .map((tag) => ({
          label: tag.tag,
          value: tag.tag,
        })),
    [tags]
  )

  const ingredientOptions = useMemo<FilterOption[]>(
    () =>
      [...ingredients]
        .sort((a, b) => a.ingredient.localeCompare(b.ingredient))
        .map((ingredient) => ({
          label: ingredient.ingredient,
          value: ingredient.ingredient,
        })),
    [ingredients]
  )

  const hasFilters =
    selectedAuthors.length + selectedTags.length + selectedIngredients.length >
    0

  return (
    <div className="space-y-6">
      <FilterSection
        label="Authors"
        placeholder="Select authors"
        options={authorOptions}
        selected={selectedAuthors}
        onToggle={onToggleAuthor}
        emptyText="No authors found."
      />
      <FilterSection
        label="Tags"
        placeholder="Select tags"
        options={tagOptions}
        selected={selectedTags}
        onToggle={onToggleTag}
        emptyText="No tags found."
      />
      <FilterSection
        label="Ingredients"
        placeholder="Select ingredients"
        options={ingredientOptions}
        selected={selectedIngredients}
        onToggle={onToggleIngredient}
        emptyText="No ingredients found."
      />
      <div className="flex items-center justify-between">
        {hasFilters ? (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearAll}
            aria-label="Clear all applied filters"
          >
            Clear filters
          </Button>
        ) : (
          <p className="text-muted-foreground text-xs">
            No filters applied yet.
          </p>
        )}
      </div>
    </div>
  )
}
