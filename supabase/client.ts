import { useMemo } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { SupabaseClient } from "@supabase/supabase-js"

import type { Database } from "@/supabase/supabase-types"

export type TypedSupabaseClient = SupabaseClient<Database>

let client: TypedSupabaseClient | undefined

export function createClient() {
  if (client) {
    return client
  }

  client = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  return client
}
