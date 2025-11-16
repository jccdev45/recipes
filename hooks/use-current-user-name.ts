"use client"

import { useEffect, useMemo, useState } from "react"
import { createClient } from "@/supabase/client"

import type { Session } from "@supabase/supabase-js"

const toSafeString = (value: unknown): string | undefined => {
  if (typeof value !== "string") {
    return undefined
  }

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

const resolveDisplayName = (session: Session | null): string | null => {
  const firstName = toSafeString(session?.user.user_metadata?.first_name)
  const lastName = toSafeString(session?.user.user_metadata?.last_name)
  const email = toSafeString(session?.user.email)

  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim()
  if (fullName.length > 0) {
    return fullName
  }

  return email ?? null
}

const resolveInitialDisplay = (
  initialName?: string | null,
  initialEmail?: string | null
): string | null => {
  const safeInitialName = toSafeString(initialName)
  if (safeInitialName) {
    return safeInitialName
  }

  const safeInitialEmail = toSafeString(initialEmail)
  return safeInitialEmail ?? null
}

export function useCurrentUserName(
  initialName?: string | null,
  initialEmail?: string | null
) {
  const initialDisplay = useMemo(
    () => resolveInitialDisplay(initialName, initialEmail),
    [initialEmail, initialName]
  )
  const [name, setName] = useState<string | null>(initialDisplay)

  useEffect(() => {
    let isMounted = true
    const supabase = createClient()

    const applyName = (session: Session | null) => {
      if (!isMounted) {
        return
      }

      const nextName = resolveDisplayName(session)
      setName((prev) => (prev === nextName ? prev : nextName))
    }

    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error("Unable to fetch current session name", error)
        return
      }

      applyName(data.session ?? null)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        applyName(session ?? null)
      }
    )

    return () => {
      isMounted = false
      listener?.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    setName((prev) => {
      if (prev === initialDisplay) {
        return prev
      }
      return initialDisplay
    })
  }, [initialDisplay])

  return name
}
