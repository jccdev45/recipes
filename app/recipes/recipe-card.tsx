"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn, shimmer, toBase64 } from "@/lib/utils"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import { Typography } from "@/components/ui/typography"

import type { Recipe } from "@/lib/types"

type RecipeCardProps = {
  recipe: Recipe
  className?: string
}

export function RecipeCard({ recipe, className }: RecipeCardProps) {
  const { author, id, img, quote, recipe_name, slug, tags, user_id } = recipe
  const path = usePathname()

  return (
    <article
      className={cn(
        `group relative rounded-lg border border-foreground/40 shadow transition-all duration-300 ease-in-out dark:hover:bg-slate-800`,
        className
      )}
    >
      <AspectRatio ratio={4 / 3}>
        <Image
          src={img || `https://placehold.it/350`}
          alt={recipe_name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="m-0 h-auto w-auto rounded-lg object-cover transition-transform duration-300 group-hover:saturate-[1.1]"
          placeholder="blur"
          blurDataURL={`data:image/svg+xml;base64,${toBase64(
            shimmer(304, 203)
          )}`}
        />
      </AspectRatio>
      <div className="absolute left-0 top-0 flex w-full max-w-fit flex-wrap gap-0.5 p-2">
        {tags.map(({ tag, id }) => (
          <Badge key={id} className="mx-1">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-1 mx-auto w-fit rounded-md bg-primary/70 px-3 py-1 text-center text-white drop-shadow-md backdrop-blur dark:text-foreground lg:px-6">
        <div className="flex items-center justify-between">
          <Typography variant="large">
            <Link
              href={`/recipes/${slug}`}
              className={cn(
                "overflow-hidden text-ellipsis whitespace-nowrap underline transition-all duration-300 ease-in-out hover:underline lg:no-underline",
                path !== "/recipes" && "text-center"
              )}
            >
              {recipe_name}
            </Link>
          </Typography>

          {/* <Heart /> */}
        </div>

        {path === "/recipes" && (
          <Typography variant="small">
            <em>"{quote}" - </em>
            {user_id ? (
              <Link
                href={`/profile/${user_id}`}
                className="mr-auto block w-fit transition-all duration-300 ease-in-out hover:underline"
              >
                {author}
              </Link>
            ) : (
              author
            )}
          </Typography>
        )}
      </div>
    </article>
  )
}
