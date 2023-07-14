"use client";

import { useEffect, useState } from 'react';

import { RecipeCard } from '@/components/RecipeCard';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Database, Recipe } from '@/types/supabase';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function RecipesPage() {
  const supabase = createClientComponentClient<Database>();
  const [search, setSearch] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      let query = supabase.from("recipes").select();

      if (search.trim()) {
        query = query.textSearch("recipeName", `'%${search}%'`, {
          type: "websearch",
        });
      }

      const { data } = await query;

      if (data) {
        setRecipes(data);
      }
    };

    fetchData();
  }, [search]);

  return (
    <section className="flex flex-col">
      <Input
        value={search}
        className="border"
        placeholder="Search..."
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
        {recipes.length === 0 && (
          <div className="col-span-1">
            <Skeleton className="w-[325px] h-[215px] lg:w-[400px] lg:h-[266px]" />
            <Skeleton className="w-12 h-5"></Skeleton>
            <Skeleton className="h-5 w-[182px]"></Skeleton>
            <Skeleton className="w-24 h-5"></Skeleton>
          </div>
        )}

        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} className="col-span-1" />
        ))}
      </div>
    </section>
  );
}
