import { Fragment, ReactNode } from "react"
import { Bean, Drumstick, LucideIcon, Sprout } from "lucide-react"

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { FeaturedRecipeCard } from "@/components/landing/featured-recipe-card"
import { getUser } from "@/app/(auth)/actions"

import type { Recipe } from "@/lib/types"

interface FeaturedRecipesProps {
  recipes: Recipe[]
}

export async function FeaturedRecipes({ recipes }: FeaturedRecipesProps) {
  const { user } = await getUser()

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
        <FeaturedRecipeCard
          key={recipe.id}
          recipe={recipe}
          user={user}
          className="h-full"
        />
      ))}
    </Fragment>
  )
}
