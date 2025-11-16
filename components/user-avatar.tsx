import { forwardRef } from "react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import type { ComponentProps } from "react"

const sizeMap = {
  sm: { root: "size-8", text: "text-xs" },
  md: { root: "size-12", text: "text-sm" },
  lg: { root: "size-16", text: "text-base" },
  xl: { root: "size-20", text: "text-lg" },
}

export type UserAvatarSize = keyof typeof sizeMap

export interface UserAvatarProps extends ComponentProps<typeof Avatar> {
  firstName?: string | null
  lastName?: string | null
  email?: string | null
  src?: string | null
  alt?: string
  size?: UserAvatarSize
  fallbackClassName?: string
}

const getFallbackInitial = (
  firstName?: string | null,
  email?: string | null
) => {
  const firstInitial = firstName?.trim().charAt(0)
  if (firstInitial) {
    return firstInitial.toUpperCase()
  }

  const emailInitial = email?.trim().charAt(0)
  if (emailInitial) {
    return emailInitial.toUpperCase()
  }

  return "?"
}

const getDisplayName = (
  firstName?: string | null,
  lastName?: string | null
) => {
  const parts = [firstName, lastName].filter(
    (part) => typeof part === "string" && part.trim().length > 0
  ) as string[]

  if (parts.length === 0) {
    return undefined
  }

  return parts.join(" ")
}

export const UserAvatar = forwardRef<HTMLSpanElement, UserAvatarProps>(
  (
    {
      firstName,
      lastName,
      email,
      src,
      alt,
      className,
      size = "md",
      fallbackClassName,
      ...avatarProps
    },
    ref
  ) => {
    const displayName = getDisplayName(firstName, lastName)
    const fallbackInitial = getFallbackInitial(firstName, email)
    const resolvedAlt =
      alt ??
      (displayName ? `${displayName}'s avatar` : "User avatar showing initials")

    return (
      <Avatar
        ref={ref}
        className={cn(sizeMap[size].root, className)}
        {...avatarProps}
      >
        <AvatarImage src={src ?? undefined} alt={resolvedAlt} />
        <AvatarFallback
          className={cn(
            "bg-primary/10 text-primary font-semibold uppercase",
            sizeMap[size].text,
            fallbackClassName
          )}
          aria-hidden="true"
        >
          {fallbackInitial}
        </AvatarFallback>
      </Avatar>
    )
  }
)

UserAvatar.displayName = "UserAvatar"
