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

  useEffect(() => {}, [search]);

  return (
    <div className={cn(``, className)}>
      <Input
        value={search}
        className="border"
        placeholder="Search..."
        onChange={(e) => setSearch(e.target.value)}
      />

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
