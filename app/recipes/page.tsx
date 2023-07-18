import { GradientBanner } from "@/components/GradientBanner";
import { TypographyH1 } from "@/components/typography/TypographyH1";
import { getAll, searchRecipes } from "@/supabase/helpers";
import { createSupaServer } from "@/supabase/server";
import { Recipe } from "@/types/supabase";

import { RecipeCard } from "./RecipeCard";
import Searchbar from "./Search";

export const revalidate = 60;

export default async function RecipesPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  const supabase = createSupaServer();
  const search = searchParams?.search;

  const recipes: Recipe[] | null = search
    ? await searchRecipes(supabase, search)
    : await getAll({ db: "recipes" }, supabase);

  if (!recipes) {
    return <TypographyH1 className="mx-auto">No recipes found</TypographyH1>;
  }

  return (
    <section className="h-full">
      <GradientBanner />

      <div className="flex flex-col w-5/6 h-full max-w-6xl py-16 mx-auto -translate-y-32 md:py-0 gap-y-8">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 gap-y-4 lg:gap-4">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              className="hover:shadow-xl hover:scale-[1.01] col-span-1 shadow-lg"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
