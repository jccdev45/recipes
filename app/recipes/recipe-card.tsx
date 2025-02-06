"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"

import { STORAGE_URL, SUPABASE_URL } from "@/lib/constants"
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
}

export function RecipeCard({
  recipe,
  className,
  display = "wide",
}: RecipeCardProps) {
  const path = usePathname()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className={cn(className, "overflow-hidden rounded-lg shadow-lg")}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <RecipeImage
        img={recipe.img}
        recipe_name={recipe.recipe_name}
        display={display}
        isHovered={isHovered}
      />
      <RecipeContent
        recipe_name={recipe.recipe_name}
        slug={recipe.slug}
        tags={recipe.tags}
        quote={recipe.quote}
        author={recipe.author}
        user_id={recipe.user_id}
        display={display}
        isHovered={isHovered}
        path={path}
      />
    </motion.div>
  )
}

function RecipeImage({
  img,
  recipe_name,
  display,
  isHovered,
}: RecipeImageProps) {
  const imageUrl = img
    ? `${SUPABASE_URL}${STORAGE_URL}${img}`
    : `https://placehold.co/700x475?text=${recipe_name}`

  return (
    <AspectRatio ratio={display === "compact" ? 4 / 3 : 16 / 9}>
      <motion.img
        src={imageUrl}
        alt={recipe_name}
        className={cn(
          "h-full w-full object-cover transition-transform duration-300",
          { "hover:scale-105": isHovered }
        )}
        style={{
          backgroundImage: `url("data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}")`,
        }}
      />
    </AspectRatio>
  )
}

function RecipeContent({
  recipe_name,
  tags,
  quote,
  author,
  isHovered,
  slug,
}: RecipeContentProps) {
  return (
    <div
      className={cn(
        "space-y-2 border p-1",
        isHovered ? "bg-card" : "bg-card/80"
      )}
    >
      <RecipeHeader recipe_name={recipe_name} slug={slug} />
      <Typography variant="small">"{quote}"</Typography>
      <div className="flex gap-2">
        {tags.map((tag) => (
          <Badge key={tag.id} variant="secondary">
            {tag.tag}
          </Badge>
        ))}
      </div>
      <Typography variant="muted">Author: {author}</Typography>
    </div>
  )
}

function RecipeHeader({ recipe_name, slug }: RecipeHeaderProps) {
  return (
    <Typography variant="h4" className="recipe-header">
      <Link
        href={`/recipes/${slug}`}
        className="underline transition-all duration-200 ease-in-out md:no-underline md:hover:underline"
      >
        {recipe_name}
      </Link>
    </Typography>
  )
}
