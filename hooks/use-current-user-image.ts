"use client"

import { useEffect, useMemo, useState } from "react"
import { createClient } from "@/supabase/client"

import { resolveStorageImageUrl } from "@/lib/utils"

const toResolvedImage = (value: unknown): string | null => {
  if (typeof value !== "string" || value.trim().length === 0) {
    return null
  }

  return resolveStorageImageUrl(value)
}

export function useCurrentUserImage(initialPath?: string | null) {
  const initialImage = useMemo(
    () => toResolvedImage(initialPath),
    [initialPath]
  )
  const [image, setImage] = useState<string | null>(initialImage)

  useEffect(() => {
    let isMounted = true
    const supabase = createClient()

    const applyImage = (next?: unknown) => {
      if (!isMounted) {
        return
      }

      setImage(toResolvedImage(next))
    }

    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error("Unable to fetch current session image", error)
        return
      }

      const avatarPath = data.session?.user.user_metadata?.avatar_url
      applyImage(avatarPath)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const avatarPath = session?.user.user_metadata?.avatar_url
        applyImage(avatarPath)
      }
    )

    return () => {
      isMounted = false
      listener?.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    setImage(initialImage)
  }, [initialImage])

  return image
}
