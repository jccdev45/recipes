"use client";

// TODO: Duplicate or move this file outside the `_examples` folder to make it a route

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

export default function ClientComponent() {
  const [recipes, setRecipes] = useState<any[]>([]);

  // Create a Supabase client configured to use cookies
  const supabase = createClientComponentClient();

  useEffect(() => {
    const getRecipes = async () => {
      // This assumes you have a `recipes` table in Supabase. Check out
      // the `Create Table and seed with data` section of the README 👇
      // https://github.com/vercel/next.js/blob/canary/examples/with-supabase/README.md
      const { data } = await supabase.from("recipess").select();
      if (data) {
        setRecipes(data);
      }
    };

    getRecipes();
  }, [supabase, setRecipes]);

  return <pre>{JSON.stringify(recipes, null, 2)}</pre>;
}
