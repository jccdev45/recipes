import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { createClient } from "@/supabase/actions"
import { getOne } from "@/supabase/helpers"

import { Recipe } from "@/types/supabase"

export const dynamic = "force-dynamic"

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const supabase = createClient(cookies())

  const queryParams = {
    filters: {
      column: "slug",
      value: params.slug,
    },
  }

  try {
    const data: Recipe = await getOne(supabase, "recipes", queryParams)

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error: ", error)
    return null
  }
}
