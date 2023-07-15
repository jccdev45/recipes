import { cookies } from "next/headers";

import { Database } from "@/types/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { RecipeList } from "./RecipeList";

export default async function RecipesPage() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data: recipes } = await supabase.from("recipes").select();

  return (
    <section className="flex flex-col">
      <RecipeList recipes={recipes} className="flex flex-col" />
    </section>
  );
}
