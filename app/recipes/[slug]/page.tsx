import { UserCircle2 } from "lucide-react";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";

import { CommentsSection } from "@/components/Comments";
import { GradientBanner } from "@/components/GradientBanner";
import { TypographyH1 } from "@/components/typography/TypographyH1";
import { TypographyList } from "@/components/typography/TypographyList";
import { TypographyBlockquote } from "@/components/typography/TypographyQuote";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cookTimeEstimator, shimmer, toBase64 } from "@/lib/utils";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { Ingredients } from "./Ingredients";
import { Steps } from "./Steps";

import type { Database } from "@/types/supabase";
export default async function RecipePage({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: recipe, error } = await supabase
    .from("recipes")
    .select("*")
    .match({ slug })
    .single();
  if (!recipe) {
    return (
      <TypographyH1>No recipe found, please try one mo again</TypographyH1>
    );
  }
  const {
    author,
    id,
    img,
    ingredients,
    quote,
    recipeName,
    steps,
    tags,
    user_id,
  } = recipe;

  return (
    <section className="w-full">
      <GradientBanner />

      <div className="p-4 -translate-y-16 md:-translate-y-32">
        <div className="flex flex-col items-center lg:flex-row lg:justify-center">
          <div className="w-5/6 h-full mx-auto rounded-lg lg:w-1/3">
            <AspectRatio ratio={5 / 4}>
              <Image
                src={img || "http://unsplash.it/g/300/300?gravity=center"}
                alt={recipeName}
                fill
                className="object-cover w-auto h-auto m-0 rounded-lg"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,${toBase64(
                  shimmer(444, 355)
                )}`}
              />
            </AspectRatio>
          </div>
          <div className="flex-col items-center justify-center w-full prose-sm text-center lg:w-1/2 md:prose-base lg:prose-lg">
            <TypographyH1>{recipeName}</TypographyH1>
            <TypographyBlockquote className="flex flex-col items-center md:flex-row md:gap-x-2 md:justify-center">
              "{quote}"
              <figure className="flex items-center justify-center gap-x-4">
                {user_id ? (
                  <Link
                    href={`/profile/${user_id}`}
                    className="flex items-center text-lg underline"
                  >
                    <figcaption>- {author}</figcaption>
                  </Link>
                ) : (
                  author
                )}
                <Avatar className="">
                  <AvatarImage />
                  <AvatarFallback>
                    <UserCircle2 />
                  </AvatarFallback>
                </Avatar>
              </figure>
            </TypographyBlockquote>
            <TypographyList className="flex items-center justify-center gap-x-1">
              {tags.map(({ id, tag }) => (
                <Badge key={id}>{tag}</Badge>
              ))}
            </TypographyList>
          </div>
        </div>
        {/* <div>Estimated cook time: {cookTimeEstimator(ingredients)}</div> */}
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <Ingredients
            ingredients={ingredients}
            className="flex flex-col col-span-full lg:col-span-1"
          />
          <Steps
            steps={steps}
            className="flex flex-col col-span-full lg:col-span-1"
          />
        </div>
        <Separator className="h-1 my-2 rounded-lg bg-slate-400" />
        <CommentsSection
          currentUser={user}
          recipe_id={id}
          className="flex flex-col w-full"
        />
      </div>
    </section>
  );
}
