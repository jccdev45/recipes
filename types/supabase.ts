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
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      recipes: {
        Row: {
          created_at: string;
          author: string;
          id: number;
          img: string | null;
          ingredients: Ingredient[];
          last_updated: string;
          quote: string | null;
          recipe_name: string;
          search_vector: unknown | null;
          slug: string;
          steps: Step[];
          tags: Tag[];
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          author?: string;
          id?: never;
          img?: string | null;
          ingredients: Ingredient[];
          last_updated?: string;
          quote?: string | null;
          recipe_name: string;
          search_vector?: unknown | null;
          slug: string;
          steps: Step[];
          tags: Tag[];
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          author?: string;
          id?: never;
          img?: string | null;
          ingredients?: Ingredient[];
          last_updated?: string;
          quote?: string | null;
          recipe_name?: string;
          search_vector?: unknown | null;
          slug?: string;
          steps?: Step[];
          tags?: Tag[];
          user_id?: string | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          created_at: string;
          first_name: string | null;
          last_name: string | null;
          id: string;
          avatar_url: string | null;
          last_updated: string;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          first_name?: string | null;
          last_name?: string | null;
          id: string;
          avatar_url?: string | null;
          last_updated?: string;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          first_name?: string | null;
          last_name?: string | null;
          id?: string;
          avatar_url?: string | null;
          last_updated?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      delete_avatar: {
        Args: {
          avatar_url: string;
        };
        Returns: Record<string, unknown>;
      };
      delete_storage_object: {
        Args: {
          bucket: string;
          object: string;
        };
        Returns: Record<string, unknown>;
      };
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
