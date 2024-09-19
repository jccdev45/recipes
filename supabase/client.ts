import { useMemo } from "react"
import type { Database } from "@/supabase/types"
import { createBrowserClient } from "@supabase/ssr"
import { SupabaseClient } from "@supabase/supabase-js"

export type TypedSupabaseClient = SupabaseClient<Database>

let client: TypedSupabaseClient | undefined

function getSupabaseClient() {
  if (client) {
    return client
  }

  client = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  return client
}

export const createClient = () => {
  return useMemo(getSupabaseClient, [])
}
