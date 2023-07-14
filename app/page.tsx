import CookingSvg from '/public/images/CookingSvg.svg';
import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';

import { RecipeCard } from '@/components/RecipeCard';
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
    <section className="w-full py-12">
      <div className="relative w-screen h-32 md:h-48 aspect-auto lg:h-64">
        <Image
          src="https://eebioglnufbnareanhqf.supabase.co/storage/v1/object/public/photos/banner-full.jpeg"
          alt="Medina Familty Banner"
          fill
          priority
          sizes="(max-width: 768px) 100vw"
          className="contain"
        />
      </div>

      <div className="flex flex-col items-center px-4 py-20 lg:flex-row gap-y-4 lg:gap-0">
        <div className="w-full prose lg:w-3/5 lg:translate-x-20">
          <h1>Welcome to the Medina Family Recipe Collection!</h1>
          <p>
            You like flavor, don't you? <br /> Good, you're in the right place.
          </p>
          {!user && (
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
        <div className="w-5/6 rounded-full -z-10 md:w-2/3 lg:w-2/5 bg-stone-300/90">
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

      <h3 className="w-2/3 mx-auto text-2xl font-bold text-center">
        Check out some of our featured recipes:
      </h3>
      <div className="grid w-full grid-cols-1 md:grid-cols-3">
        {recipes?.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} className="col-span-1" />
        ))}
      </div>
    </section>
  );
}
