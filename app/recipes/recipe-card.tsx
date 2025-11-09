"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { User } from "@supabase/supabase-js"
import { motion, useScroll, useTransform } from "framer-motion"
import { Heart, MoreHorizontal, Pencil } from "lucide-react"

import { cn, resolveStorageImageUrl } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Typography } from "@/components/ui/typography"

import type { Recipe } from "@/lib/types"

interface RecipeCardProps {
  recipe: Recipe
  user: User | null
  className?: string
  display?: "compact" | "wide"
}

export function RecipeCard({
  recipe,
  user,
  className,
  display = "wide",
}: RecipeCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  })

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1, 0.96])
  const { img, recipe_name, slug, tags, quote, author, user_id } = recipe
  const canEdit = user?.id === user_id
  const isCompact = display === "compact"

  return (
    <motion.article
      ref={cardRef}
      style={{ scale }}
      className={cn(
        "group relative flex w-full overflow-hidden rounded-xl border shadow-sm transition-shadow duration-300",
        isCompact ? "bg-card flex-col" : "bg-background flex-col sm:flex-row",
        className
      )}
    >
      <RecipeImage img={img} recipe_name={recipe_name} isCompact={isCompact} />
      <RecipeContent
        recipe_name={recipe_name}
        slug={slug}
        tags={tags}
        quote={quote}
        author={author}
        canEdit={canEdit}
        isCompact={isCompact}
      />
    </motion.article>
  )
}

function RecipeImage({
  img,
  recipe_name,
  isCompact,
}: {
  img: Recipe["img"]
  recipe_name: Recipe["recipe_name"]
  isCompact: boolean
}) {
  const resolvedImageUrl = resolveStorageImageUrl(img)
  const imageUrl =
    resolvedImageUrl ||
    `https://placehold.co/700x475?text=${encodeURIComponent(recipe_name)}`

  return (
    <motion.figure
      className={cn(
        "bg-muted relative w-full overflow-hidden",
        isCompact
          ? "h-60 sm:h-64"
          : "h-64 sm:h-auto sm:min-h-[280px] sm:max-w-[380px] sm:flex-none sm:self-stretch"
      )}
      initial={{ opacity: 0, scale: 1.02 }}
      whileInView={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <Image
        src={imageUrl}
        alt={recipe_name}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 720px"
        loading="lazy"
      />
    </motion.figure>
  )
}

function RecipeContent({
  recipe_name,
  slug,
  tags,
  quote,
  author,
  canEdit,
  isCompact,
}: {
  recipe_name: Recipe["recipe_name"]
  slug: Recipe["slug"]
  tags: Recipe["tags"]
  quote: Recipe["quote"]
  author: Recipe["author"]
  canEdit: boolean
  isCompact: boolean
}) {
  return (
    <motion.div
      className={cn(
        "flex flex-1 flex-col justify-between",
        isCompact ? "gap-4 p-5" : "bg-muted/60 gap-6 p-6"
      )}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <Typography variant="h3" className="flex-1 text-balance">
              <Link
                href={`/recipes/${slug}`}
                className="text-foreground hover:text-primary focus-visible:ring-ring inline-flex max-w-full items-center transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                {recipe_name}
              </Link>
            </Typography>
            <RecipeActionsMenu slug={slug} canEdit={canEdit} />
          </div>
          <Typography variant="small" className="text-muted-foreground">
            By {author}
          </Typography>
        </div>
        {quote ? (
          <motion.blockquote
            className="border-primary/40 text-muted-foreground border-l-2 pl-4 text-sm italic"
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            “{quote}”
          </motion.blockquote>
        ) : null}
      </div>
      {tags.length ? (
        <motion.ul
          className={cn("flex flex-wrap", isCompact ? "gap-1.5" : "gap-2")}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                staggerChildren: 0.05,
                delayChildren: 0.15,
              },
            },
          }}
        >
          {tags.map((tag) => (
            <motion.li
              key={tag.id ?? `${tag.tag}`}
              variants={{
                hidden: { opacity: 0, y: 8 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <Badge variant="secondary">{tag.tag}</Badge>
            </motion.li>
          ))}
        </motion.ul>
      ) : null}
    </motion.div>
  )
}

function RecipeActionsMenu({
  slug,
  canEdit,
}: {
  slug: Recipe["slug"]
  canEdit: boolean
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground rounded-full"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">More actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem className="gap-2">
          <Heart className="h-4 w-4" />
          Favorite
        </DropdownMenuItem>
        {canEdit ? (
          <DropdownMenuItem asChild className="gap-2">
            <Link
              href={`/recipes/${slug}/edit`}
              className="flex w-full items-center gap-2"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Link>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem disabled className="gap-2 opacity-70">
            <Pencil className="h-4 w-4" />
            Edit
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
