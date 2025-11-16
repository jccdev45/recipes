"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { User } from "@supabase/supabase-js"
import {
  HeartIcon,
  MessageCircleIcon,
  MoreHorizontalIcon,
  ShareIcon,
  SquarePenIcon,
} from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { cn, resolveStorageImageUrl } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { UserAvatar } from "@/components/user-avatar"

import type { Recipe } from "@/lib/types"
import type { ReactNode } from "react"

interface FeaturedRecipeCardProps {
  recipe: Recipe
  user: User | null
  className?: string
}

export function FeaturedRecipeCard({
  recipe,
  user,
  className,
}: FeaturedRecipeCardProps) {
  const { recipe_name, slug, quote, author, img, tags } = recipe
  const [isHovered, setIsHovered] = React.useState(false)
  const isAuthor = user?.id === recipe.user_id

  const resolvedImageUrl = resolveStorageImageUrl(img)
  const imageUrl =
    resolvedImageUrl ||
    `https://placehold.co/900x600.png?text=${encodeURIComponent(recipe_name)}`

  const authorSafe = author?.trim() ?? "Unknown cook"
  const authorSegments = authorSafe.includes("@")
    ? []
    : authorSafe
        .split(/\s+/)
        .map((segment) => segment.trim())
        .filter((segment) => segment.length > 0)

  const authorFirstName = authorSegments[0]
  const authorLastName =
    authorSegments.length > 1 ? authorSegments.slice(1).join(" ") : undefined

  const srTags = tags.length
    ? `Tags: ${tags.map((tag) => tag.tag).join(", ")}.`
    : "No tags listed."
  const srQuote = quote ? `Quote: ${quote}. ` : ""
  const descriptionId = `featured-recipe-${slug}-details`
  const srSummary = `By ${author}. ${srTags}`

  const handleActiveChange = (active: boolean) => {
    setIsHovered(active)
  }

  const handleFocus = (event: React.FocusEvent<HTMLDivElement>) => {
    const previousFocus = event.relatedTarget as Node | null
    if (!previousFocus || !event.currentTarget.contains(previousFocus)) {
      handleActiveChange(true)
    }
  }

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    const nextFocus = event.relatedTarget as Node | null
    if (!nextFocus || !event.currentTarget.contains(nextFocus)) {
      handleActiveChange(false)
    }
  }

  return (
    <Card
      className={cn(
        "group border-border/40 bg-card/95 relative w-full max-w-sm gap-0 overflow-hidden shadow-none transition-colors",
        "focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        className
      )}
      onPointerEnter={() => handleActiveChange(true)}
      onPointerLeave={() => handleActiveChange(false)}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <CardHeader className="flex flex-row items-center justify-between gap-2 py-2.5">
        <Item className="w-full gap-2.5 p-0">
          <ItemMedia>
            <UserAvatar
              size="sm"
              firstName={authorFirstName}
              lastName={authorLastName}
              alt={`${authorSafe}'s avatar`}
            />
          </ItemMedia>
          <ItemContent className="gap-0">
            <ItemTitle className="text-foreground text-sm font-semibold">
              {author}
            </ItemTitle>
          </ItemContent>
          {isAuthor ? (
            <ItemActions className="-me-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    aria-label="More options"
                  >
                    <MoreHorizontalIcon
                      className="h-4 w-4"
                      aria-hidden="true"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link
                      href="/recipes/edit"
                      className="flex w-full items-center gap-2"
                    >
                      <SquarePenIcon className="h-4 w-4" aria-hidden="true" />
                      <span>Edit recipe</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </ItemActions>
          ) : null}
        </Item>
      </CardHeader>

      <CardContent className="p-0">
        <div className="bg-muted relative aspect-video overflow-hidden border-y">
          <Image
            src={imageUrl}
            alt={recipe_name}
            fill
            sizes="(max-width: 768px) 100vw, 420px"
            className="object-cover"
            priority={false}
          />
        </div>
        <motion.div
          className="px-6 py-5"
          initial={false}
          animate={isHovered ? "hover" : "rest"}
          variants={{
            rest: { y: 0 },
            hover: { y: quote ? -6 : 0 },
          }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <Link
            href={`/recipes/${slug}`}
            className="text-foreground text-lg leading-tight font-semibold underline-offset-4 hover:underline focus-visible:outline-none"
            aria-describedby={descriptionId}
          >
            {recipe_name}
          </Link>
          <AnimatePresence initial={false}>
            {quote ? (
              <motion.p
                key="quote"
                className="text-muted-foreground mt-2 text-sm"
                initial={{ opacity: 0, y: 10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: 10, height: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                &ldquo;{quote}&rdquo;
              </motion.p>
            ) : null}
          </AnimatePresence>
          {Array(tags) && (
            <div className="mt-2 flex flex-wrap gap-1">
              {tags.map(({ tag, id }) => (
                <Badge key={id} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          <span id={descriptionId} className="sr-only">
            {srQuote}
            {srSummary}
          </span>
        </motion.div>
      </CardContent>

      <CardFooter className="flex gap-1 border-t px-2 py-2">
        <Button
          variant="ghost"
          className="text-muted-foreground flex grow items-center justify-center gap-2"
          type="button"
        >
          <HeartIcon className="h-4 w-4" aria-hidden="true" />
          <span className="text-sm">Like</span>
        </Button>
        <Button
          variant="ghost"
          className="text-muted-foreground flex grow items-center justify-center gap-2"
          type="button"
        >
          <MessageCircleIcon className="h-4 w-4" aria-hidden="true" />
          <span className="text-sm">Comment</span>
        </Button>
        <Button
          variant="ghost"
          className="text-muted-foreground flex grow items-center justify-center gap-2"
          type="button"
        >
          <ShareIcon className="h-4 w-4" aria-hidden="true" />
          <span className="text-sm">Share</span>
        </Button>
      </CardFooter>
    </Card>
  )
}
