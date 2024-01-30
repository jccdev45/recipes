import { cookies } from "next/headers"
import { createServerClient, type CookieOptions } from "@supabase/ssr"

export function createClient(cookieStore: ReturnType<typeof cookies>) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        // NOTE:
        // @ts-expect-error no clue
        set(name: string, value: string, options: CookieOptions) {
          return cookieStore.set({ name, value, ...options })
        },
        // NOTE:
        // @ts-expect-error no clue
        remove(name: string, options: CookieOptions) {
          return cookieStore.set({ name, value: "", ...options })
        },
      },
    }
  )
}
