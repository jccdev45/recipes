import { Edit } from 'lucide-react';
import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';

import { RecipeCard } from '@/app/recipes/RecipeCard';
import { GradientBanner } from '@/components/GradientBanner';
import { TypographyH2 } from '@/components/typography/TypographyH2';
import { TypographyH3 } from '@/components/typography/TypographyH3';
import { TypographyP } from '@/components/typography/TypographyP';
import { Button } from '@/components/ui/button';
import { shimmer, toBase64 } from '@/lib/utils';
import { Database } from '@/types/supabase';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

export default async function ProfilePage({
  params: { user_id },
}: {
  params: { user_id: string };
}) {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data: user } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user_id)
    .single();

  const { data: recipes } = await supabase
    .from("recipes")
    .select("*")
    .match({ user_id });

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <TypographyP>User not found</TypographyP>
      </div>
    );
  }

  const avatar_url = user && user.avatar_url;
  const first_name = user && user.first_name;
  const last_name = user && user?.last_name;

  return (
    <section className="">
      <GradientBanner />

      <div className="flex flex-col justify-between w-5/6 mx-auto md:w-2/3 md:px-8 md:flex-row">
        {/* TODO: add change avatar dialog */}
        <div className="w-full md:w-4/5 -translate-y-1/4">
          <Image
            src={avatar_url || `http://unsplash.it/g/300/300?gravity=center`}
            width={100}
            height={100}
            alt={`${first_name} ${last_name}`}
            className="w-24 h-24 border border-white rounded-full"
            placeholder="blur"
            blurDataURL={`data:image/svg+xml;base64,${toBase64(
              shimmer(96, 96)
            )}`}
          />
          <TypographyH2>
            {first_name} {last_name}
          </TypographyH2>

          <Button asChild>
            <Link href={`/profile/${user_id}/edit`} className="flex my-4">
              <Edit /> Edit Profile
            </Link>
          </Button>
        </div>
        <aside className="grid w-full grid-cols-1 md:w-1/5">
          <TypographyH3>{first_name}'s recipes</TypographyH3>
          {recipes?.map((recipe) => {
            return (
              <RecipeCard
                key={recipe.id}
                className="w-full col-span-1 mx-auto"
                recipe={recipe}
              />
            );
          })}
        </aside>
      </div>
    </section>
  );
}
