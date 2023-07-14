"use client";

import { useEffect, useState } from 'react';

import { Recipe } from '@/types/supabase';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function ClientComponent() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const supabase = createClientComponentClient();

  useEffect(() => {
    const getRecipes = async () => {
      const { data } = await supabase.from("recipes").select();
      if (data) {
        setRecipes(data);
      }
    };

    getRecipes();
  }, [supabase, setRecipes]);

  return <pre>{JSON.stringify(recipes, null, 2)}</pre>;
}
