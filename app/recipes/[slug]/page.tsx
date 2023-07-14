import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';

import { CommentsSection } from '@/components/Comments';
import { Ingredients } from '@/components/Ingredients';
import { Steps } from '@/components/Steps';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

import type { Database, Recipe } from "@/types/supabase";
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
      <div className="w-16 h-16 border-4 border-blue-400 border-solid rounded-full border-t-transparent animate-spin"></div>
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
  } = recipe as Recipe;

  return (
    <section className="w-full p-4">
      {error && <div>{JSON.stringify(error)}</div>}

      <div className="flex flex-col items-center lg:flex-row lg:justify-center">
        <div className="w-3/4 h-full mx-auto rounded-lg lg:w-1/3">
          <AspectRatio ratio={5 / 4}>
            <Image
              src={img || "http://unsplash.it/g/300/300?gravity=center"}
              alt={recipeName}
              // width={250}
              // height={250}
              fill
              className="object-cover w-auto h-auto m-0 rounded-md"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              // placeholder="blur"
              // blurDataURL={`data:image/svg+xml;base64,${toBase64(
              //   shimmer(304, 203)
              // )}`}
            />
          </AspectRatio>
        </div>
        <div className="flex-col items-center justify-center w-full prose-sm text-center lg:w-1/2 md:prose-base lg:prose-lg">
          <h1>{recipeName}</h1>
          <blockquote className="flex flex-col items-center md:flex-row md:gap-x-2 md:justify-center">
            <span className="italic">"{quote}"</span>
            {user_id ? (
              <Link
                href={`/profile/${user_id}`}
                className="flex items-center underline gap-x-4"
              >
                - {author}{" "}
              </Link>
            ) : (
              author
            )}
            <Avatar className="block md:inline">
              <AvatarImage src="https://placehold.it/100" />
              <AvatarFallback>OK</AvatarFallback>
            </Avatar>
          </blockquote>

          <ul className="flex items-center justify-center gap-x-1">
            {tags.map(({ id, tag }) => (
              <Badge key={id}>{tag}</Badge>
            ))}
          </ul>
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
        className="flex flex-col w-full"
      />
    </section>
  );
}
