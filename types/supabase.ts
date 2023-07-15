export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Tag = {
  id?: string;
  tag: string;
};
export type Step = {
  id?: string;
  step: string;
};
export type Ingredient = {
  id?: string;
  ingredient: string;
  amount: number;
  unitMeasurement: string;
};
export type UnitMeasurement = Ingredient["unitMeasurement"];

export interface Database {
  public: {
    Tables: {
      comments: {
        Row: {
          author: string;
          avatar_url: string | null;
          created_at: string;
          id?: string;
          liked_by: Json[];
          likes: number;
          message: string;
          recipe_id: number;
          user_id: string;
        };
        Insert: {
          author?: string;
          avatar_url?: string | null;
          created_at?: string;
          id?: string;
          liked_by?: Json[];
          likes?: number;
          message?: string;
          recipe_id?: number;
          user_id?: string;
        };
        Update: {
          author?: string;
          avatar_url?: string | null;
          created_at?: string;
          id?: string;
          liked_by?: Json[];
          likes?: number;
          message?: string;
          recipe_id?: number;
          user_id?: string;
        };
        Relationships: [];
      };
      recipes: {
        Row: {
          author: string;
          id: number;
          img: string | null;
          ingredients: Ingredient[];
          quote: string | null;
          recipeName: string;
          slug: string;
          steps: Step[];
          tags: Tag[];
          user_id: string | null;
        };
        Insert: {
          author?: string;
          id?: never;
          img?: string | null;
          ingredients: Ingredient[];
          quote?: string | null;
          recipeName: string;
          slug: string;
          steps: Step[];
          tags: Tag[];
          user_id?: string | null;
        };
        Update: {
          author?: string;
          id?: never;
          img?: string | null;
          ingredients?: Ingredient[];
          quote?: string | null;
          recipeName?: string;
          slug?: string;
          steps?: Step[];
          tags?: Tag[];
          user_id?: string | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          first_name: string | null;
          last_name: string | null;
          id: string;
          avatar_url: string | null;
          user_id: string | null;
        };
        Insert: {
          first_name?: string | null;
          last_name?: string | null;
          id: string;
          avatar_url?: string | null;
          user_id?: string | null;
        };
        Update: {
          first_name?: string | null;
          last_name?: string | null;
          id?: string;
          avatar_url?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Recipe = Database["public"]["Tables"]["recipes"]["Row"];
export type InsertRecipes = Database["public"]["Tables"]["recipes"]["Insert"];
export type UpdateRecipes = Database["public"]["Tables"]["recipes"]["Update"];

export type Comment = Database["public"]["Tables"]["comments"]["Row"];
export type InsertComment = Database["public"]["Tables"]["comments"]["Insert"];
export type UpdateComment = Database["public"]["Tables"]["comments"]["Update"];

export type User = Database["public"]["Tables"]["profiles"]["Row"];
export type InsertUser = Database["public"]["Tables"]["profiles"]["Insert"];
export type UpdateUser = Database["public"]["Tables"]["profiles"]["Update"];
