import { createClient } from "@/supabase/server"
import { Database } from "@/supabase/supabase-types"
import { QueryData } from "@supabase/supabase-js"

const supabase = createClient()
const profileQuery = supabase.from("profiles").select(`*, recipes (*)`).single()
type GeneratedUserWithRecipes = QueryData<typeof profileQuery>

type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"]
type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"]
type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"]

export type Tag = {
  id?: string
  tag: string
}

export type Step = {
  id?: string
  step: string
}

export type Ingredient = {
  id?: string
  ingredient: string
  amount: number
  unitMeasurement: string
}

export type UnitMeasurement = Ingredient["unitMeasurement"]

export interface Recipe
  extends Omit<Tables<"recipes">, "tags" | "steps" | "ingredients"> {
  tags: Tag[]
  steps: Step[]
  ingredients: Ingredient[]
}

export interface RecipeInsert
  extends Omit<TablesInsert<"recipes">, "tags" | "steps" | "ingredients"> {
  tags?: Tag[]
  steps?: Step[]
  ingredients?: Ingredient[]
}

export interface RecipeUpdate
  extends Omit<TablesUpdate<"recipes">, "tags" | "steps" | "ingredients"> {
  tags?: Tag[]
  steps?: Step[]
  ingredients?: Ingredient[]
}

export type Comment = Tables<"comments">
export type CommentInsert = TablesInsert<"comments">
export type CommentUpdate = TablesUpdate<"comments">

export type User = Tables<"profiles">
export type UserInsert = TablesInsert<"profiles">
export type UserUpdate = TablesUpdate<"profiles">
export interface UserWithRecipes
  extends Omit<GeneratedUserWithRecipes, "recipes"> {
  recipes: Recipe[]
}
