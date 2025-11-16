"use client"

import { useMemo } from "react"

import { useCurrentUserImage } from "@/hooks/use-current-user-image"
import { useCurrentUserName } from "@/hooks/use-current-user-name"
import { UserAvatar } from "@/components/user-avatar"

import type { UserAvatarProps, UserAvatarSize } from "@/components/user-avatar"

interface CurrentUserAvatarProps
  extends Pick<UserAvatarProps, "className" | "fallbackClassName"> {
  size?: UserAvatarSize
  initialFirstName?: string | null
  initialLastName?: string | null
  initialEmail?: string | null
  initialAvatarPath?: string | null
}

const splitName = (value: string | null | undefined) => {
  if (!value || value.includes("@")) {
    return { first: undefined, last: undefined }
  }

  const segments = value
    .split(/\s+/)
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0)

  if (segments.length === 0) {
    return { first: undefined, last: undefined }
  }

  const [first, ...rest] = segments
  return { first, last: rest.length > 0 ? rest.join(" ") : undefined }
}

export function CurrentUserAvatar({
  size = "md",
  className,
  fallbackClassName,
  initialFirstName,
  initialLastName,
  initialEmail,
  initialAvatarPath,
}: CurrentUserAvatarProps) {
  const initialFullName = useMemo(() => {
    const parts = [initialFirstName, initialLastName]
      .map((part) => (typeof part === "string" ? part.trim() : ""))
      .filter((part) => part.length > 0)

    return parts.length > 0 ? parts.join(" ") : undefined
  }, [initialFirstName, initialLastName])

  const displayName = useCurrentUserName(initialFullName, initialEmail)
  const profileImage = useCurrentUserImage(initialAvatarPath)

  const { first: derivedFirstName, last: derivedLastName } = useMemo(
    () => splitName(displayName),
    [displayName]
  )

  const altText = useMemo(() => {
    if (displayName && !displayName.includes("@")) {
      return `${displayName}'s avatar`
    }

    return "Current user avatar"
  }, [displayName])

  return (
    <UserAvatar
      size={size}
      className={className}
      fallbackClassName={fallbackClassName}
      firstName={derivedFirstName ?? initialFirstName ?? null}
      lastName={derivedLastName ?? initialLastName ?? null}
      email={initialEmail ?? null}
      src={profileImage}
      alt={altText}
    />
  )
}
