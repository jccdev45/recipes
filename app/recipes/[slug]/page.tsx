import { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { CommentsSection } from "@/app/recipes/[slug]/Comments";
import { GradientBanner } from "@/components/GradientBanner";
import { TypographyH1 } from "@/components/typography/TypographyH1";
import { TypographyList } from "@/components/typography/TypographyList";
import { TypographyBlockquote } from "@/components/typography/TypographyQuote";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { apiUrl } from "@/lib/constants";
import { shimmer, toBase64 } from "@/lib/utils";
import { getAuthUser } from "@/supabase/helpers";
import { createSupaServer } from "@/supabase/server";
import { Recipe } from "@/types/supabase";

import { Ingredients } from "./Ingredients";
import { Steps } from "./Steps";

type Props = {
  params: { slug: string };
};

export async function generateMetadata(
  { params: { slug } }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // fetch data
  const res = await fetch(`${apiUrl}/recipes/${slug}`);
  const recipe: Recipe = await res.json();
  const previousTitle = (await parent).title?.absolute || "";

  return {
    title: `${previousTitle} | ${recipe?.recipe_name}`,
  };
}

export default async function RecipePage({ params: { slug } }: Props) {
  const res = await fetch(`${apiUrl}/recipes/${slug}`);
  const recipe: Recipe = await res.json();

  const supabase = createSupaServer();
  const user = (await getAuthUser(supabase)) || null;

  {
    !recipe && notFound();
  }

  const {
    author,
    id,
    img,
    ingredients,
    quote,
    recipe_name,
    steps,
    tags,
    user_id,
  } = recipe;

  return (
    <section className="w-full h-full">
      <GradientBanner />

      <div className="p-4 -translate-y-16 md:-translate-y-24">
        <Suspense fallback={<RecipeFallback />}>
          <div className="flex flex-col items-center lg:flex-row lg:justify-center">
            <div className="w-5/6 h-full mx-auto rounded-lg lg:w-2/5">
              <AspectRatio ratio={5 / 4}>
                <Image
                  src={img || "http://unsplash.it/g/300/300?gravity=center"}
                  alt={recipe_name || "Generic fallback"}
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
            <div className="flex-col items-center justify-center w-full h-full text-center lg:w-1/2">
              <TypographyH1>{recipe_name}</TypographyH1>
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
                  {/* <UserCircle2 /> */}
                </figure>
              </TypographyBlockquote>
              <TypographyList className="flex items-center justify-center gap-x-1">
                {tags?.map(({ id, tag }) => (
                  <Badge key={id}>{tag}</Badge>
                ))}
              </TypographyList>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {ingredients && (
              <Ingredients
                ingredients={ingredients}
                className="flex flex-col col-span-full lg:col-span-1"
              />
            )}
            {steps && (
              <Steps
                steps={steps}
                className="flex flex-col col-span-full lg:col-span-1"
              />
            )}
          </div>
          <Separator className="h-1 my-2 rounded-lg bg-slate-400" />
          <CommentsSection
            currentUser={user}
            recipe_id={id}
            className="flex flex-col w-full max-w-full"
          />
        </Suspense>
      </div>
    </section>
  );
}

function RecipeFallback() {
  return (
    <div className="w-full h-full">
      <div className="flex flex-col items-center justify-between lg:flex-row gap-y-4 lg:justify-center">
        <div className="w-5/6 h-full mx-auto rounded-lg lg:w-1/3">
          <Skeleton className="w-[316px] h-[253px] mx-auto" />
        </div>
        <div className="flex-col items-center w-full mx-auto gap-y-4 lg:w-1/2">
          <Skeleton className="h-6 mx-auto w-52" />
          <Skeleton className="h-12 mx-auto w-52" />
          <div className="flex items-center justify-center gap-x-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="w-16 h-6" />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 mt-8 h-96 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div className="w-full h-full col-span-full lg:col-span-1">
            <Skeleton key={index} className="w-5/6 h-full mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
