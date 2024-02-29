import { NextResponse } from "next/server"
import { getOne } from "@/supabase/helpers"
import { createClient } from "@/supabase/server"
import { Recipe } from "@/supabase/types"

export async function GET(
  request: Request,
  { params }: { params: { user_id: string } }
) {
  const supabase = createClient()
  const queryParams = {
    filters: {
      column: "id",
      value: params.user_id,
    },
  }

  try {
    const data: Recipe = await getOne(supabase, "profiles", queryParams)

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error: ", error)
  }
}
