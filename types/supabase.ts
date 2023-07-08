export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      comments: {
        Row: {
          author: string | null;
          createdAt: Json | null;
          firestore_id: string | null;
          id: string;
          likedBy: Json | null;
          likes: number | null;
          message: string | null;
          recipeId: string | null;
          userId: string | null;
        };
        Insert: {
          author?: string | null;
          createdAt?: Json | null;
          firestore_id?: string | null;
          id: string;
          likedBy?: Json | null;
          likes?: number | null;
          message?: string | null;
          recipeId?: string | null;
          userId?: string | null;
        };
        Update: {
          author?: string | null;
          createdAt?: Json | null;
          firestore_id?: string | null;
          id?: string;
          likedBy?: Json | null;
          likes?: number | null;
          message?: string | null;
          recipeId?: string | null;
          userId?: string | null;
        };
        Relationships: [];
      };
      ingredients: {
        Row: {
          amount: number | null;
          id: string;
          ingredient: string | null;
          recipe_id: string | null;
          unitMeasurement: string | null;
        };
        Insert: {
          amount?: number | null;
          id: string;
          ingredient?: string | null;
          recipe_id?: string | null;
          unitMeasurement?: string | null;
        };
        Update: {
          amount?: number | null;
          id?: string;
          ingredient?: string | null;
          recipe_id?: string | null;
          unitMeasurement?: string | null;
        };
        Relationships: [];
      };
      recipe_ingredients: {
        Row: {
          id: number;
          ingredient_id: string | null;
          recipe_id: string | null;
        };
        Insert: {
          id?: never;
          ingredient_id?: string | null;
          recipe_id?: string | null;
        };
        Update: {
          id?: never;
          ingredient_id?: string | null;
          recipe_id?: string | null;
        };
        Relationships: [];
      };
      recipes: {
        Row: {
          author: string | null;
          firestore_id: string | null;
          id: string;
          img: string | null;
          quote: string | null;
          recipeName: string | null;
          slug: string | null;
          steps: Json | null;
          tags: Json | null;
          userId: string | null;
        };
        Insert: {
          author?: string | null;
          firestore_id?: string | null;
          id: string;
          img?: string | null;
          quote?: string | null;
          recipeName?: string | null;
          slug?: string | null;
          steps?: Json | null;
          tags?: Json | null;
          userId?: string | null;
        };
        Update: {
          author?: string | null;
          firestore_id?: string | null;
          id?: string;
          img?: string | null;
          quote?: string | null;
          recipeName?: string | null;
          slug?: string | null;
          steps?: Json | null;
          tags?: Json | null;
          userId?: string | null;
        };
        Relationships: [];
      };
      recipess: {
        Row: {
          author: string | null;
          id: number;
          img: string | null;
          ingredients: Json[] | null;
          quote: string | null;
          recipeName: string | null;
          slug: string | null;
          steps: Json[] | null;
          tags: Json[] | null;
          user_id: string | null;
        };
        Insert: {
          author?: string | null;
          id?: never;
          img?: string | null;
          ingredients?: Json[] | null;
          quote?: string | null;
          recipeName?: string | null;
          slug?: string | null;
          steps?: Json[] | null;
          tags?: Json[] | null;
          user_id?: string | null;
        };
        Update: {
          author?: string | null;
          id?: never;
          img?: string | null;
          ingredients?: Json[] | null;
          quote?: string | null;
          recipeName?: string | null;
          slug?: string | null;
          steps?: Json[] | null;
          tags?: Json[] | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      users: {
        Row: {
          displayName: string | null;
          email: string | null;
          firestore_id: string | null;
          id: string;
          photoURL: string | null;
          userId: string | null;
        };
        Insert: {
          displayName?: string | null;
          email?: string | null;
          firestore_id?: string | null;
          id: string;
          photoURL?: string | null;
          userId?: string | null;
        };
        Update: {
          displayName?: string | null;
          email?: string | null;
          firestore_id?: string | null;
          id?: string;
          photoURL?: string | null;
          userId?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      with_ingredients: {
        Row: {
          amount: number | null;
          author: string | null;
          img: string | null;
          ingredient: string | null;
          quote: string | null;
          recipeId: string | null;
          recipeName: string | null;
          slug: string | null;
          steps: Json | null;
          tags: Json | null;
          unitMeasurement: string | null;
          userId: string | null;
        };
        Relationships: [];
      };
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

export type Recipe = Database["public"]["Tables"]["recipess"]["Row"];

export type Ingredient = Pick<Recipe, "ingredients">;
export type Step = Pick<Recipe, "steps">;
export type Tag = Pick<Recipe, "tags">;

export type Comment = Database["public"]["Tables"]["comments"]["Row"];

export type User = Database["public"]["Tables"]["users"]["Row"];
