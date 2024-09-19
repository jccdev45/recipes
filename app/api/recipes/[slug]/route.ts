import { NextResponse } from "next/server"
import { getOne } from "@/supabase/helpers"
import { createClient } from "@/supabase/server"
import { Recipe } from "@/supabase/types"

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const supabase = createClient()

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
  }
}
