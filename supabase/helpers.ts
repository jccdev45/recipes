import { Recipe } from "@/types/supabase";
import { SupabaseClient, User } from "@supabase/supabase-js";

// import { createSupaServer } from "./server";

export async function getAuthUser(
  supabase: SupabaseClient
): Promise<User | undefined | null> {
  // const supabase = createSupaServer();
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

interface QueryParams {
  filters?: { column: string; value: any };
  order?: {
    column: string;
    options?: {
      ascending: boolean;
    };
  };
  // range?: object;
  limit?: number;
}

export interface GetAllOptions {
  db: string;
  params?: QueryParams;
  column?: string;
}

export async function getAll(
  options: GetAllOptions,
  supabase: SupabaseClient
): Promise<any[] | null> {
  const { db, column, params } = options;

  try {
    let query = supabase.from(db).select(column && column);
    if (params) {
      if (params.filters) {
        query = query.eq(params.filters.column, params.filters.value);
      }
      if (params.order) {
        query = query.order(params.order.column, params.order.options);
      }
      if (params.limit) {
        query = query.limit(params.limit);
      }
    }
    const { data } = await query;
    return data;
  } catch (error) {
    console.error("Error: ", error);
    return null;
  }
}
export async function getOne(
  supabase: SupabaseClient,
  db: string,
  params?: QueryParams
): Promise<any> {
  // const supabase = createSupaServer();
  try {
    let query = supabase.from(db).select();
    if (params) {
      if (params.filters) {
        query = query.eq(params.filters.column, params.filters.value);
      }
    }
    const { data } = await query.single();
    return data;
    // const { data } = await supabase
    //   .from(db)
    //   .select()
    //   .match({ toMatch })
    //   .single();
    // return data;
  } catch (error) {
    console.error("Error: ", error);
    return null;
  }
}

export async function searchRecipes(
  supabase: SupabaseClient,
  searchTerm: string
): Promise<Recipe[] | null> {
  // const supabase = createSupaServer();
  try {
    const { data } = await supabase
      .from("recipes")
      .select()
      .textSearch("search_vector", searchTerm);
    return data;
  } catch (error) {
    console.error("Error: ", error);
    return null;
  }
}
