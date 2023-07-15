import CookingSvg from '/public/images/CookingSvg.svg';
import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';

import { RecipeCard } from '@/app/recipes/RecipeCard';
import { TypographyH1 } from '@/components/typography/TypographyH1';
import { TypographyH3 } from '@/components/typography/TypographyH3';
import { TypographyP } from '@/components/typography/TypographyP';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

export default async function Index() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: recipes } = await supabase
    .from("recipes")
    .select()
    .order("id", { ascending: false })
    .limit(3);

  return (
    <section className="w-full py-6 md:py-12">
      <div className="relative h-32 md:h-48 aspect-auto lg:h-64">
        <Image
          src="https://eebioglnufbnareanhqf.supabase.co/storage/v1/object/public/photos/banner-full.jpeg"
          alt="Medina Family Banner"
          fill
          priority
          sizes="(max-width: 768px) 100vw"
          className=" md:contain"
        />
      </div>

      <div className="flex flex-col items-center px-4 py-20 lg:flex-row gap-y-4 lg:gap-0">
        <div className="w-full lg:w-3/5 lg:translate-x-20">
          <TypographyH1>
            Welcome to the Medina Family Recipe Collection!
          </TypographyH1>
          <TypographyP>You like flavor, don't you?</TypographyP>
          <TypographyP>
            <strong>Good!</strong> You're in the right place.
          </TypographyP>
          {!user && (
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
        <div className="w-5/6 rounded-full -z-10 md:w-2/3 lg:w-2/5 bg-stone-300/90 md:-translate-x-1/4">
          <Image
            src={CookingSvg}
            alt="Cartoon style depiction of man sitting on large chef hat, with spoon and salt/pepper shakers"
            width={500}
            height={500}
            className="contain translate-x-[10%] md:translate-x-1/4"
          />
        </div>
      </div>

      <Separator className="w-5/6 h-2 mx-auto my-8 rounded-lg bg-slate-300" />

      <center className="my-4">
        <TypographyH3>Check out some of our featured recipes:</TypographyH3>
      </center>
      <div className="grid w-full grid-cols-1 gap-y-2 md:gap-x-1 md:grid-cols-3 ">
        {recipes?.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            className="w-11/12 col-span-1 mx-auto"
          />
        ))}
      </div>
    </section>
  );
}
