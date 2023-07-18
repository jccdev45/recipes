import { Edit, UserCircle2, UserX } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { RecipeCard } from "@/app/recipes/RecipeCard";
import { GradientBanner } from "@/components/GradientBanner";
import { TypographyH2 } from "@/components/typography/TypographyH2";
import { TypographyH3 } from "@/components/typography/TypographyH3";
import { TypographyH4 } from "@/components/typography/TypographyH4";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { shimmer, toBase64 } from "@/lib/utils";
import { getAll, getOne } from "@/supabase/helpers";
import { createSupaServer } from "@/supabase/server";
import { Recipe, User } from "@/types/supabase";
import { AvatarImage } from "@radix-ui/react-avatar";

export default async function ProfilePage({
  params: { user_id },
}: {
  params: { user_id: string };
}) {
  const supabase = createSupaServer();
  const { data } = await supabase.auth.getUser();

  const userParams = {
    filters: {
      column: "id",
      value: user_id,
    },
  };
  const recipeParams = {
    filters: {
      column: "user_id",
      value: user_id,
    },
  };

  const user = (await getOne(supabase, "profiles", userParams)) as User | null;
  const recipes = (await getAll(
    { db: "recipes", params: recipeParams },
    supabase
  )) as Recipe[] | null;

  // const avatar_url = user && user.avatar_url;
  // const first_name = user && user.first_name;
  // const last_name = user && user?.last_name;
  const { first_name, last_name, avatar_url, created_at, last_updated } =
    user || {};

  return (
    <section className="h-full">
      <GradientBanner />

      {
        !user &&
          // <TypographyH2 className="mx-auto my-8 text-center max-w-max">
          // <UserX className="inline w-10 h-10" /> User not found
          notFound()
        // </TypographyH2>
      }

      {user && (
        <div className="flex flex-col justify-between w-5/6 mx-auto md:px-8 md:flex-row">
          {/* TODO: add change avatar dialog */}
          <div className="w-full md:w-4/5 -translate-y-1/4">
            <div className="w-24 h-24">
              <AspectRatio ratio={1 / 1}>
                <Image
                  src={avatar_url || `http://unsplash.it/g/100/100`}
                  // width={100}
                  // height={100}
                  fill
                  alt={`${first_name} ${last_name}`}
                  className="border-2 rounded-full border-foreground"
                  placeholder="blur"
                  blurDataURL={`data:image/svg+xml;base64,${toBase64(
                    shimmer(100, 100)
                  )}`}
                />
              </AspectRatio>
            </div>
            <TypographyH2>
              {first_name} {last_name}
            </TypographyH2>
            {data.user?.id === user_id && (
              <TypographyH4>Email: {data.user?.email}</TypographyH4>
            )}

            {created_at && (
              <TypographyH4>
                Joined: {new Date(created_at).toLocaleDateString()}
              </TypographyH4>
            )}

            <Button asChild>
              <Link href={`/profile/${user_id}/edit`} className="flex my-4">
                <Edit /> Edit Profile
              </Link>
            </Button>
          </div>
          <aside className="grid w-full grid-cols-1 md:w-1/4">
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
      )}
    </section>
  );
}
