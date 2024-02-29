import { NextResponse, type NextRequest } from "next/server"
import { getAll, searchRecipes } from "@/supabase/helpers"
import { createClient } from "@/supabase/server"
import { Recipe } from "@/supabase/types"

export const dynamic = "force-dynamic"
export const revalidate = 3600

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams

  const supabase = createClient()
  const recipes: Recipe[] | null = params.get("search")
    ? await searchRecipes(supabase, params.get("search")!)
    : await getAll({ db: "recipes" }, supabase)

  return NextResponse.json(recipes)
}
