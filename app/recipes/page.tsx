"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { RecipeCard } from "@/components/RecipeCard";
import { Database, Recipe } from "@/types/supabase";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

export default function RecipesPage() {
  const supabase = createClientComponentClient<Database>();
  const [search, setSearch] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const getAllRecipes = async () => {
      const { data } = await supabase.from("recipes").select();

      if (data) {
        setRecipes(data);
      }
    };
    const searchRecipes = async () => {
      const { data } = await supabase
        .from("recipes")
        .select()
        .textSearch("recipeName", `'${search}'`);

      if (data) {
        setRecipes(data);
      }
    };

    !search.trim() ? getAllRecipes() : searchRecipes();
  }, [search]);

  // useEffect(() => {
  //   const filteredRecipes = recipes?.filter((recipe) => {
  //     return recipe.recipeName.toLowerCase().includes(search.toLowerCase());
  //   });

  //   setRecipes(filteredRecipes);
  // }, [search]);

  // TODO: ADD LOADING STATE, SKELETONS / SUSPENSE

  return (
    <section className="flex flex-col">
      <Input
        value={search}
        className="border"
        placeholder="Search..."
        onChange={(e) => setSearch(e.target.value)}
      />

      {recipes.length === 0 && <div>No results found</div>}

      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
        {recipes?.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} className="col-span-1" />
        ))}
      </div>
    </section>
  );
}
