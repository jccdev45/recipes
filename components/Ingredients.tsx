import { cn } from "@/lib/utils";
import { Ingredient } from "@/types/supabase";

type IngredientsProps = {
  className: string;
  ingredients: Ingredient[];
};

export function Ingredients({ ingredients, className }: IngredientsProps) {
  return (
    <div className={cn(``, className)}>
      <h3 className="prose">Ingredients</h3>
      {/* TODO:  EXTRACT TO 'INGREDIENTS' COMPONENT FOR SCALING AMOUNTS? */}
      <ul className="">
        {ingredients.map(({ id, ingredient, amount, unitMeasurement }) => (
          <li key={id} className="flex items-center gap-x-1">
            <span>{amount}</span>
            <span>
              {unitMeasurement === "unit"
                ? ``
                : amount > 1
                ? `${unitMeasurement}s`
                : unitMeasurement}
            </span>
            <span>{ingredient}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
