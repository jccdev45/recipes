import CookingSvg from "/public/images/CookingSvg.svg";
import Image from "next/image";
import Link from "next/link";

import { RecipeCard } from "@/app/recipes/RecipeCard";
import {
  TypographyH1,
  TypographyH4,
  TypographyLarge,
  TypographyP,
} from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getAll, getAuthUser } from "@/supabase/helpers";
import { createSupaServer } from "@/supabase/server";
import { Recipe } from "@/types/supabase";

export default async function Index() {
  const supabase = createSupaServer();
  const user = (await getAuthUser(supabase)) || null;
  const params = {
    order: {
      column: "id",
      options: { ascending: false },
    },
    limit: 3,
  };
  const data = (await getAll({ db: "recipes", params }, supabase)) as Recipe[];

  return (
    <section className="w-full">
      <div className="relative h-32 md:h-48 aspect-auto lg:h-64">
        <Image
          src="https://eebioglnufbnareanhqf.supabase.co/storage/v1/object/public/photos/banner-full.jpeg"
          alt="Medina Family Banner"
          fill
          priority
          sizes="(max-width: 768px) 100vw"
          className="object-cover object-top"
        />
      </div>

      <div className="flex flex-col items-center px-4 py-10 md:py-14 lg:flex-row gap-y-4 lg:gap-0">
        <div className="w-full px-8 my-6 lg:w-3/5 lg:translate-x-20 md:my-0">
          <TypographyH1 className="rounded-md dark:bg-black/80 max-w-max">
            Welcome!
          </TypographyH1>
          <TypographyP>You like flavor, don't you?</TypographyP>
          <TypographyLarge className="my-2">
            <strong>Good!</strong> You're in the right place.
          </TypographyLarge>
          {!user ? (
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href="/recipes">Recipes</Link>
            </Button>
          )}
        </div>
        <div className="w-5/6 rounded-full -z-10 md:w-1/2 lg:w-2/5 bg-stone-300/90 dark:bg-stone-900 lg:-translate-x-1/4">
          <Image
            src={CookingSvg}
            alt="Cartoon style depiction of man sitting on large chef hat, with spoon and salt/pepper shakers"
            width={500}
            height={500}
            className="contain translate-x-[10%] md:translate-x-1/4"
          />
        </div>
      </div>

      <Separator className="w-5/6 h-2 mx-auto my-8 rounded-lg bg-foreground" />

      <div className="p-2">
        <TypographyH4 className="my-4 text-center">
          Featured recipes:
        </TypographyH4>
        <div className="grid w-full grid-cols-1 gap-y-2 md:gap-x-1 md:grid-cols-3 ">
          {data?.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              className="w-11/12 col-span-1 mx-auto"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
