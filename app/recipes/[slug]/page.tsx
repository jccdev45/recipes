import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CommentsSection } from "@/app/recipes/[slug]/Comments";
import { GradientBanner } from "@/components/GradientBanner";
import { TypographyH1 } from "@/components/typography/TypographyH1";
import { TypographyList } from "@/components/typography/TypographyList";
import { TypographyBlockquote } from "@/components/typography/TypographyQuote";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { shimmer, toBase64 } from "@/lib/utils";
import { getAuthUser, getOne } from "@/supabase/helpers";
import { createSupaServer } from "@/supabase/server";
import { Recipe } from "@/types/supabase";

import { Ingredients } from "./Ingredients";
import { Steps } from "./Steps";

export default async function RecipePage({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const supabase = createSupaServer();
  const user = (await getAuthUser(supabase)) || null;

  const params = {
    filters: {
      column: "slug",
      value: slug,
    },
  };
  const recipe = (await getOne(supabase, "recipes", params)) as Recipe | null;

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
  } = (recipe as Recipe) || {};

  return (
    <section className="w-full h-full">
      <GradientBanner />

      {!recipe && notFound()}

      <div className="p-4 -translate-y-16 md:-translate-y-24">
        <div className="flex flex-col items-center lg:flex-row lg:justify-center">
          <div className="w-5/6 h-full mx-auto rounded-lg lg:w-2/5">
            <AspectRatio ratio={5 / 4}>
              <Image
                src={img || "http://unsplash.it/g/300/300?gravity=center"}
                alt={recipe_name}
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
              {tags.map(({ id, tag }) => (
                <Badge key={id}>{tag}</Badge>
              ))}
            </TypographyList>
          </div>
        </div>
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
          className="flex flex-col w-full max-w-full"
        />
      </div>
    </section>
  );
}
