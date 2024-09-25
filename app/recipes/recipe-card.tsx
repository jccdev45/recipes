"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"

import { cn, shimmer, toBase64 } from "@/lib/utils"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import { Typography } from "@/components/ui/typography"

import type { Recipe } from "@/lib/types"

interface RecipeCardProps {
  recipe: Recipe
  className?: string
  display?: "compact" | "wide"
}

interface RecipeImageProps {
  img: Recipe["img"]
  recipe_name: Recipe["recipe_name"]
  display: "compact" | "wide"
  isHovered: boolean
}

interface RecipeContentProps {
  recipe_name: Recipe["recipe_name"]
  slug: Recipe["slug"]
  tags: Recipe["tags"]
  quote: Recipe["quote"]
  author: Recipe["author"]
  user_id: Recipe["user_id"]
  display: "compact" | "wide"
  isHovered: boolean
  path: string
}

interface RecipeHeaderProps {
  recipe_name: Recipe["recipe_name"]
  slug: Recipe["slug"]
  display: "compact" | "wide"
  path: string
}

interface RecipeTagsProps {
  tags: Recipe["tags"]
}

interface RecipeQuoteProps {
  quote: Recipe["quote"]
}

interface RecipeAuthorProps {
  author: Recipe["author"]
  user_id: Recipe["user_id"]
  isHovered: boolean
}

export function RecipeCard({
  recipe,
  className,
  display = "compact",
}: RecipeCardProps) {
  const { author, img, quote, recipe_name, slug, tags, user_id } = recipe
  const path = usePathname()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.article
      className={cn(
        "group relative rounded-lg border border-border bg-muted shadow transition-all duration-300 ease-in-out",
        display === "wide" ? "flex flex-col md:flex-row" : "col-span-1",
        display === "compact" && "hover:shadow-lg",
        path === "/" && "mx-auto w-3/4 md:w-5/6",
        className
      )}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <RecipeImage
        img={img}
        recipe_name={recipe_name}
        display={display}
        isHovered={isHovered}
      />
      <RecipeContent
        recipe_name={recipe_name}
        slug={slug}
        tags={tags}
        quote={quote}
        author={author}
        user_id={user_id}
        display={display}
        isHovered={isHovered}
        path={path}
      />
    </motion.article>
  )
}

function RecipeImage({
  img,
  recipe_name,
  display,
  isHovered,
}: RecipeImageProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg",
        display === "wide" ? "md:w-2/5" : "w-full"
      )}
    >
      <AspectRatio ratio={display === "wide" ? 16 / 9 : 4 / 3}>
        <motion.div
          className="size-full overflow-hidden"
          initial={false}
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src={img || `https://placehold.it/350`}
            alt={recipe_name}
            fill
            sizes={
              display === "wide"
                ? "(max-width: 768px) 100vw, 40vw"
                : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            }
            className="m-0 size-full object-cover"
            placeholder="blur"
            blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(304, 203))}`}
          />
        </motion.div>
      </AspectRatio>
    </div>
  )
}

function RecipeContent({
  recipe_name,
  slug,
  tags,
  quote,
  author,
  user_id,
  display,
  isHovered,
  path,
}: RecipeContentProps) {
  return (
    <motion.div
      className={cn(
        "flex flex-col p-4",
        display === "wide"
          ? "justify-between space-y-4 md:w-3/5"
          : "absolute inset-x-0 bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent p-3"
      )}
      initial={false}
      animate={{ y: isHovered ? -5 : 0 }}
      transition={{ duration: 0.2 }}
    >
      <RecipeHeader
        recipe_name={recipe_name}
        slug={slug}
        display={display}
        path={path}
      />
      {display === "wide" && (
        <>
          <RecipeTags tags={tags} />
          <RecipeQuote quote={quote} />
          <RecipeAuthor
            author={author}
            user_id={user_id}
            isHovered={isHovered}
          />
        </>
      )}
    </motion.div>
  )
}

function RecipeHeader({ recipe_name, slug, display, path }: RecipeHeaderProps) {
  return (
    <Typography variant={display === "wide" ? "h3" : "large"} className="mb-2">
      <Link
        href={`/recipes/${slug}`}
        className={cn(
          "overflow-hidden text-ellipsis whitespace-nowrap transition-all duration-300 ease-in-out hover:underline",
          path !== "/recipes" && "text-center",
          display === "compact" && "text-white"
        )}
      >
        {recipe_name}
      </Link>
    </Typography>
  )
}

function RecipeTags({ tags }: RecipeTagsProps) {
  return (
    <motion.div
      className="mb-4 flex flex-wrap gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.3 }}
    >
      {tags.map(({ tag, id }) => (
        <Badge key={id}>{tag}</Badge>
      ))}
    </motion.div>
  )
}

function RecipeQuote({ quote }: RecipeQuoteProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.3 }}
      className="mb-4"
    >
      <Typography variant="blockquote">"{quote}"</Typography>
    </motion.div>
  )
}

function RecipeAuthor({ author, user_id, isHovered }: RecipeAuthorProps) {
  return (
    <motion.div
      className="mt-auto"
      initial={false}
      animate={{ opacity: isHovered ? 1 : 0.8 }}
      transition={{ duration: 0.2 }}
    >
      <Typography variant="large">
        {user_id ? (
          <Link
            href={`/profile/${user_id}`}
            className="mr-auto block w-fit transition-all duration-300 ease-in-out hover:underline"
          >
            By {author}
          </Link>
        ) : (
          `By ${author}`
        )}
      </Typography>
    </motion.div>
  )
}
