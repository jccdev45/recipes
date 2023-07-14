"use client";

import { ListRestart } from "lucide-react";
import { Fragment, useEffect, useState } from "react";

import { maxAmount, minAmount } from "@/lib/constants";
import { cn, scaleIngredients } from "@/lib/utils";
import { Ingredient } from "@/types/supabase";

import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Separator } from "../../../components/ui/separator";

type IngredientsProps = {
  className: string;
  ingredients: Ingredient[];
};

export function Ingredients({ ingredients, className }: IngredientsProps) {
  const [adjusted, setAdjusted] = useState<Ingredient[]>(ingredients);
  const [serving, setServing] = useState(1);

  useEffect(() => {
    const newIngs = scaleIngredients(ingredients, serving);

    setAdjusted(newIngs);
  }, [serving]);

  return (
    <div className={cn(`prose`, className)}>
      <h3 className="">Ingredients</h3>
      <span className="flex items-center justify-center w-2/3 mx-auto gap-x-4">
        <span className="flex items-center justify-center">
          <Input
            type="number"
            name="servings"
            value={serving}
            onChange={(e) => setServing(Number(e.target.value))}
            step={0.5}
            min={0.5}
            max={50}
            className="w-16 text-lg"
          />
          <Label htmlFor="servings">Servings</Label>
        </span>
        <Button
          variant="outline"
          onClick={() => setAdjusted(ingredients)}
          className="w-1/3 mx-auto"
        >
          <ListRestart />
          Reset Amounts
        </Button>
      </span>

      <ul className="">
        {adjusted.map(({ id, ingredient, amount, unitMeasurement }, index) => (
          <Fragment key={id}>
            <li className="flex items-center justify-start gap-x-1">
              {unitMeasurement === "unit" ? (
                <div className="m-0 w-[12%] text-sm">-</div>
              ) : (
                <div className="m-0 w-[12%]">{amount}</div>
              )}
              <Label className="w-5/6 my-auto space-x-2" htmlFor={ingredient}>
                <span>
                  {unitMeasurement === "unit"
                    ? `(to taste)`
                    : amount > 1
                    ? `${unitMeasurement}s`
                    : unitMeasurement}
                </span>
                <span className="">{ingredient}</span>
              </Label>
            </li>
            <Separator className="my-1 border border-gray-300" />
          </Fragment>
        ))}
      </ul>
    </div>
  );
}
