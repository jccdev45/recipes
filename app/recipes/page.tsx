import { cookies } from 'next/headers';

import { GradientBanner } from '@/components/GradientBanner';
import { Database } from '@/types/supabase';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

import { RecipeList } from './RecipeList';

export default async function RecipesPage() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data: recipes } = await supabase.from("recipes").select();

  return (
    <section className="flex flex-col">
      <GradientBanner />

      <RecipeList
        recipes={recipes}
        className="flex flex-col w-5/6 h-full max-w-6xl py-16 mx-auto -translate-y-40 md:py-0 gap-y-8"
      />
    </section>
  );
}
