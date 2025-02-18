"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"

import { STORAGE_URL, SUPABASE_URL } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import { Typography } from "@/components/ui/typography"

import type { Recipe } from "@/lib/types"

interface RecipeCardProps {
  recipe: Recipe
  className?: string
  display?: "compact" | "wide"
}

export function RecipeCard({
  recipe,
  className,
  display = "wide",
}: RecipeCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const { img, recipe_name, slug, tags, quote, author } = recipe

  return (
    <motion.div
      className={cn(
        "overflow-hidden rounded-lg shadow-lg transition-shadow duration-300",
        className,
        isHovered && "shadow-xl"
      )}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link href={`/recipes/${slug}`} className="block">
        <RecipeImage
          img={img}
          recipe_name={recipe_name}
          display={display}
          isHovered={isHovered}
        />
        <RecipeContent
          recipe_name={recipe_name}
          tags={tags}
          quote={quote}
          author={author}
          isHovered={isHovered}
        />
      </Link>
    </motion.div>
  )
}

function RecipeImage({
  img,
  recipe_name,
  display,
  isHovered,
}: {
  img: Recipe["img"]
  recipe_name: Recipe["recipe_name"]
  display: "compact" | "wide"
  isHovered: boolean
}) {
  const imageUrl = img
    ? `${SUPABASE_URL}${STORAGE_URL}${img}`
    : `https://placehold.co/700x475?text=${encodeURIComponent(recipe_name)}`

  return (
    <AspectRatio ratio={display === "compact" ? 4 / 3 : 16 / 9}>
      <motion.div
        className="relative h-full w-full"
        animate={{ scale: isHovered ? 1.05 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <Image
          src={imageUrl}
          alt={recipe_name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </motion.div>
    </AspectRatio>
  )
}

function RecipeContent({
  recipe_name,
  tags,
  quote,
  author,
  isHovered,
}: {
  recipe_name: Recipe["recipe_name"]
  tags: Recipe["tags"]
  quote: Recipe["quote"]
  author: Recipe["author"]
  isHovered: boolean
}) {
  return (
    <motion.div
      className={cn(
        "space-y-2 border p-4 transition-colors duration-300",
        isHovered ? "bg-muted" : "bg-muted/80"
      )}
      initial={false}
    >
      <Typography variant="h3">{recipe_name}</Typography>
      <Typography variant="muted">"{quote}"</Typography>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge key={tag.id} variant="secondary">
            {tag.tag}
          </Badge>
        ))}
      </div>
      <Typography variant="small">By {author}</Typography>
    </motion.div>
  )
}
