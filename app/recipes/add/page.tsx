import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { GradientBanner } from '@/components/GradientBanner';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

import { AddRecipeForm } from './AddRecipeForm';

export default async function AddRecipePage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <GradientBanner />
      <AddRecipeForm
        className="grid w-5/6 max-w-4xl grid-cols-12 p-4 mx-auto -translate-y-20 rounded-lg md:p-6 bg-background dark:bg-stone-900 gap-y-6"
        user={user}
      />
    </>
  );
}
