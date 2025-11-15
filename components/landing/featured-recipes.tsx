import { Fragment, ReactNode } from "react"
import { Bean, Drumstick, LucideIcon, Sprout } from "lucide-react"

import { EmptyStateDisplay } from "@/components/empty-state-display"
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
      <EmptyStateDisplay
        icon={<Sprout className="h-6 w-6" aria-hidden="true" />}
        title="No featured recipes yet"
        description="Add a new recipe to highlight it on the home page."
      />
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
