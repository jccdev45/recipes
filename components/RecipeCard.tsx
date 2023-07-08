import { Recipe } from "@/types/supabase";
import Image from "next/image";

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  const { recipeName, author, tags, img, quote } = recipe;

  return (
    // <Image src={img} />
    <div>
      <h1>{recipeName}</h1>
    </div>
  );
}
