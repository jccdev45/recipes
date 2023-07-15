"use client";

import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Recipe } from "@/types/supabase";

import { RecipeCard } from "./RecipeCard";

type RecipeListProps = {
  className: string;
  recipes: Recipe[] | null;
};

export function RecipeList({ className, recipes }: RecipeListProps) {
  const [search, setSearch] = useState("");
  const [updatedRecipes, setUpdatedRecipes] = useState<Recipe[] | null>(
    recipes
  );

  useEffect(() => {
    if (!search) {
      setUpdatedRecipes(recipes);
    }

    const filteredRecipes = recipes?.filter((recipe) => {
      const nameMatch = recipe.recipeName
        .toLowerCase()
        .includes(search.toLowerCase());

      const authorMatch = recipe.author
        .toLowerCase()
        .includes(search.toLowerCase());

      const ingredientsMatch = recipe.ingredients.some(({ ingredient }) => {
        return ingredient.toLowerCase().includes(search.toLowerCase());
      });

      const tagsMatch = recipe.tags.some(({ tag }) => {
        return tag.toLowerCase().includes(search.toLowerCase());
      });

      return nameMatch || ingredientsMatch || tagsMatch || authorMatch;
    });

    if (filteredRecipes) {
      setUpdatedRecipes(filteredRecipes);
    }
  }, [search]);

  return (
    <div className={cn(``, className)}>
      <Input
        value={search}
        className="w-full mx-auto border border-gray-500 md:w-1/2"
        placeholder="Search recipes, authors, ingredients, etc.."
        onChange={(e) => setSearch(e.target.value)}
      />

      {updatedRecipes?.length === 0 && (
        <p className="text-center">No recipes found</p>
      )}

      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
        {updatedRecipes?.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            className="hover:shadow-lg hover:scale-[1.01] col-span-1"
          />
        ))}
      </div>
    </div>
  );
}
