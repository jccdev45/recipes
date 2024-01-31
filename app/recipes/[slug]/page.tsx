import { Metadata, ResolvingMetadata } from "next"
import { cookies } from "next/headers"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getAuthUser } from "@/supabase/helpers"
import { createClient } from "@/supabase/server"
import { Recipe } from "@/supabase/types"

import { apiUrl } from "@/lib/constants"
import { shimmer, toBase64 } from "@/lib/utils"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  TypographyBlockquote,
  TypographyH1,
  TypographyList,
} from "@/components/ui/typography"
import { GradientBanner } from "@/components/GradientBanner"
import { CommentsSection } from "@/app/recipes/[slug]/Comments"

import { Ingredients } from "./Ingredients"
import { Steps } from "./Steps"

type Props = {
  params: { slug: string }
}

export async function generateMetadata(
  { params: { slug } }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // fetch data
  const res = await fetch(`${apiUrl}/recipes/${slug}`)
  const recipe: Recipe = await res.json()
  const previousTitle = (await parent).title?.absolute || ""

  return {
    title: `${previousTitle} | ${recipe?.recipe_name}`,
  }
}

export default async function RecipePage({ params: { slug } }: Props) {
  const res = await fetch(`${apiUrl}/recipes/${slug}`)
  const recipe: Recipe = await res.json()

  const supabase = createClient(cookies())
  const user = await getAuthUser(supabase)

  {
    !recipe && notFound()
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
  } = recipe

  return (
    <section className="h-full w-full">
      <GradientBanner />

      <div className="-translate-y-16 p-4 md:-translate-y-24">
        <div className="flex flex-col items-center lg:flex-row lg:justify-center">
          <div className="mx-auto h-full w-5/6 rounded-lg lg:w-2/5">
            <AspectRatio ratio={5 / 4}>
              <Image
                src={img || "http://unsplash.it/g/300/300?gravity=center"}
                alt={recipe_name || "Generic fallback"}
                fill
                className="m-0 h-auto w-auto rounded-lg object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,${toBase64(
                  shimmer(444, 355)
                )}`}
              />
            </AspectRatio>
          </div>
          <div className="h-full w-full flex-col items-center justify-center text-center lg:w-1/2">
            <TypographyH1>{recipe_name}</TypographyH1>
            <TypographyBlockquote className="flex flex-col items-center md:flex-row md:justify-center md:gap-x-2">
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
          {ingredients && (
            <Ingredients
              ingredients={ingredients}
              className="col-span-full flex flex-col lg:col-span-1"
            />
          )}
          {steps && (
            <Steps
              steps={steps}
              className="col-span-full flex flex-col lg:col-span-1"
            />
          )}
        </div>
        <Separator className="my-2 h-1 rounded-lg bg-slate-400" />
        <CommentsSection
          currentUser={user!}
          recipe_id={id}
          className="flex w-full max-w-full flex-col"
        />
      </div>
    </section>
  )
}

// function RecipeFallback() {
//   return (
//     <div className="w-full h-full">
//       <div className="flex flex-col items-center justify-between lg:flex-row gap-y-4 lg:justify-center">
//         <div className="w-5/6 h-full mx-auto rounded-lg lg:w-1/3">
//           <Skeleton className="w-[316px] h-[253px] mx-auto" />
//         </div>
//         <div className="flex-col items-center w-full mx-auto gap-y-4 lg:w-1/2">
//           <Skeleton className="h-6 mx-auto w-52" />
//           <Skeleton className="h-12 mx-auto w-52" />
//           <div className="flex items-center justify-center gap-x-2">
//             {Array.from({ length: 3 }).map((_, index) => (
//               <Skeleton key={index} className="w-16 h-6" />
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 mt-8 h-96 lg:grid-cols-2">
//         {Array.from({ length: 2 }).map((_, index) => (
//           <div
//             key={index}
//             className="w-full h-full col-span-full lg:col-span-1"
//           >
//             <Skeleton className="w-5/6 h-full mx-auto" />
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }
