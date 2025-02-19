import { Database } from "@/supabase/supabase-types"

// Database types
namespace DB {
  export type Tables = Database["public"]["Tables"]
  export type TableName = keyof Tables

  export type Row<T extends TableName> = Tables[T]["Row"]
  export type Insert<T extends TableName> = Tables[T]["Insert"]
  export type Update<T extends TableName> = Tables[T]["Update"]
}

// Utility types
type WithoutFields<T, K extends keyof T> = Omit<T, K>
type WithFields<T, K extends Record<string, any>> = T & K

// Custom types
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

// Recipe types
export type Recipe = WithFields<
  WithoutFields<DB.Row<"recipes">, "tags" | "steps" | "ingredients">,
  {
    tags: Tag[]
    steps: Step[]
    ingredients: Ingredient[]
  }
>

export type RecipeInsert = WithFields<
  WithoutFields<DB.Insert<"recipes">, "tags" | "steps" | "ingredients">,
  {
    tags?: Tag[]
    steps?: Step[]
    ingredients?: Ingredient[]
  }
>

export type RecipeUpdate = WithFields<
  WithoutFields<DB.Update<"recipes">, "tags" | "steps" | "ingredients">,
  {
    tags?: Tag[]
    steps?: Step[]
    ingredients?: Ingredient[]
  }
>

export type RecipeWithComments = Recipe & {
  comments: Comment[]
}

// Comment types
export type Comment = DB.Row<"comments">
export type CommentInsert = DB.Insert<"comments">
export type CommentUpdate = DB.Update<"comments">

// User types
export type User = DB.Row<"profiles">
export type UserInsert = DB.Insert<"profiles">
export type UserUpdate = DB.Update<"profiles">

export type UserWithRecipes = User & {
  recipes: Recipe[]
}

// Filter state
export interface FilterState {
  authors: string[]
  tags: Tag[]
  ingredients: Ingredient[]
}
