"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User } from "@supabase/supabase-js"
import {
  CopyIcon,
  ExternalLinkIcon,
  HeartIcon,
  MailIcon,
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { UserAvatar } from "@/components/user-avatar"
import { toggleFavorite } from "@/app/recipes/actions"

import type { Recipe } from "@/lib/types"

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
  const {
    recipe_name,
    slug,
    quote,
    author,
    img,
    tags,
    user_id,
    id,
    commentCount: rawCommentCount,
    isFavorite: rawIsFavorite,
  } = recipe
  const [isHovered, setIsHovered] = React.useState(false)
  const router = useRouter()
  const commentCount = rawCommentCount ?? 0
  const [isFavorite, setIsFavorite] = React.useState(Boolean(rawIsFavorite))
  const [favoriteError, setFavoriteError] = React.useState<string | null>(null)
  const [isFavoritePending, startTransition] = React.useTransition()
  const [shareUrl, setShareUrl] = React.useState(`/recipes/${slug}`)
  const [shareFeedback, setShareFeedback] = React.useState<string | null>(null)
  const clearShareFeedbackRef = React.useRef<number | null>(null)
  const canFavorite = Boolean(user)
  const isAuthor = Boolean(user?.id && user_id && user.id === user_id)
  const favoriteLabel = isFavorite
    ? "Remove from favorites"
    : "Save to favorites"
  const commentLabel = commentCount === 1 ? "comment" : "comments"

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

  React.useEffect(() => {
    setIsFavorite(Boolean(rawIsFavorite))
  }, [rawIsFavorite])

  React.useEffect(() => {
    const envUrl = process.env.NEXT_PUBLIC_SITE_URL
    const runtimeOrigin =
      typeof window !== "undefined" && window.location.origin
        ? window.location.origin
        : ""
    const baseUrl = (envUrl || runtimeOrigin || "").replace(/\/$/, "")
    setShareUrl(`${baseUrl}/recipes/${slug}`)
  }, [slug])

  React.useEffect(() => {
    return () => {
      if (clearShareFeedbackRef.current) {
        window.clearTimeout(clearShareFeedbackRef.current)
      }
    }
  }, [])

  const handleToggleFavorite = () => {
    if (!user) {
      setFavoriteError("Sign in to favorite recipes.")
      return
    }

    setFavoriteError(null)
    startTransition(() => {
      toggleFavorite(id)
        .then((result) => {
          if (result?.error) {
            setFavoriteError(result.error)
            return
          }

          if (result?.data) {
            setIsFavorite(result.data.isFavorite)
          }
        })
        .catch((error) => {
          console.error("featured:favorites:toggle", error)
          setFavoriteError("Unable to update favorite. Please try again.")
        })
    })
  }

  const handleCommentNavigate = () => {
    router.push(`/recipes/${slug}#recipe-comments`)
  }

  const handleCopyShareLink = async () => {
    if (!shareUrl) {
      return
    }

    try {
      if (typeof navigator === "undefined" || !navigator.clipboard) {
        throw new Error("Clipboard API unavailable")
      }
      await navigator.clipboard.writeText(shareUrl)
      setShareFeedback("Link copied to clipboard")
    } catch {
      setShareFeedback("Unable to copy link. Please copy it manually.")
    }

    if (clearShareFeedbackRef.current) {
      window.clearTimeout(clearShareFeedbackRef.current)
    }
    clearShareFeedbackRef.current = window.setTimeout(() => {
      setShareFeedback(null)
    }, 2500)
  }

  const emailShareHref = React.useMemo(() => {
    const subject = encodeURIComponent(`Check out ${recipe_name}`)
    const body = encodeURIComponent(
      `I thought you'd enjoy this recipe: ${shareUrl}`
    )
    return `mailto:?subject=${subject}&body=${body}`
  }, [recipe_name, shareUrl])

  const xShareHref = React.useMemo(() => {
    const text = encodeURIComponent(
      `Cooking inspiration: ${recipe_name} via Family Recipes. ${shareUrl}`
    )
    return `https://twitter.com/intent/tweet?text=${text}`
  }, [recipe_name, shareUrl])

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
                      href={`/recipes/${slug}/edit`}
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

      <CardFooter className="flex flex-col gap-2 border-t px-2 py-2">
        <div className="grid w-full grid-cols-1 gap-1 sm:flex sm:justify-center">
          <Button
            variant={isFavorite ? "secondary" : "ghost"}
            className={cn(
              "text-muted-foreground inline-flex items-center justify-center gap-2",
              isFavorite && "bg-primary/10 text-primary"
            )}
            type="button"
            onClick={handleToggleFavorite}
            aria-pressed={isFavorite}
            aria-label={favoriteLabel}
            disabled={isFavoritePending}
            title={!canFavorite ? "Sign in to save favorites" : undefined}
          >
            <HeartIcon
              className={cn("h-4 w-4", isFavorite ? "fill-current" : undefined)}
              aria-hidden="true"
            />
          </Button>

          <Button
            variant="ghost"
            className="text-muted-foreground inline-flex items-center justify-center gap-2"
            type="button"
            onClick={handleCommentNavigate}
            aria-label={`View ${commentCount} ${commentLabel}`}
          >
            <MessageCircleIcon className="h-4 w-4" aria-hidden="true" />
            <span aria-hidden="true" className="text-xs font-semibold">
              {commentCount}
            </span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="text-muted-foreground inline-flex items-center justify-center gap-2"
                type="button"
                aria-label="Share recipe"
              >
                <ShareIcon className="h-4 w-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem
                className="gap-2"
                onSelect={() => {
                  handleCopyShareLink()
                }}
              >
                <CopyIcon className="h-4 w-4" aria-hidden="true" />
                <span>Copy link</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a
                  href={emailShareHref}
                  className="flex w-full items-center gap-2"
                >
                  <MailIcon className="h-4 w-4" aria-hidden="true" />
                  Share via email
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a
                  href={xShareHref}
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full items-center gap-2"
                >
                  <ExternalLinkIcon className="h-4 w-4" aria-hidden="true" />
                  Share on X
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {favoriteError ? (
          <p
            role="status"
            aria-live="polite"
            className="text-destructive text-right text-xs font-medium"
          >
            {favoriteError}
          </p>
        ) : null}
      </CardFooter>
    </Card>
  )
}
