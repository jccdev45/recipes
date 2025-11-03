"use client"

import { Fragment } from "react"

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { RecipeCard } from "@/app/recipes/recipe-card"

import type { Recipe } from "@/lib/types"

interface FeaturedRecipesProps {
  recipes: Recipe[]
}

export function FeaturedRecipes({ recipes }: FeaturedRecipesProps) {
  if (!recipes.length) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No featured recipes yet</EmptyTitle>
          <EmptyDescription>
            Add a new recipe to highlight it on the home page.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <Fragment>
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} className="h-full" />
      ))}
    </Fragment>
  )
}
