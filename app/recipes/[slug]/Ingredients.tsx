"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import { number2fraction } from "number2fraction";
import { Fragment, useEffect, useState } from "react";

import {
  TypographyH3,
  TypographyList,
  TypographyP,
} from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn, scaleIngredients } from "@/lib/utils";
import { Ingredient } from "@/types/supabase";

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
    <div className={cn(``, className)}>
      <TypographyH3>Ingredients</TypographyH3>
      <TypographyP>
        Enter a serving amount or use the arrows to adjust by 1/2 (servings are
        *very* approximated as not all recipes were recorded with serving size,
        use your best judgment)
      </TypographyP>
      <span className="flex items-center justify-center w-2/3 mx-auto gap-x-4">
        <span className="flex items-center justify-center">
          <Input
            pattern="[0-9]+"
            name="servings"
            value={serving}
            onChange={(e) => {
              if (isNaN(Number(e.target.value))) {
                return;
              }
              setServing(Number(e.target.value));
            }}
            className="w-16 text-lg"
          />
          <span>
            <Button variant="ghost" size="icon">
              <ArrowUp onClick={() => setServing(serving + 0.5)} />
            </Button>
            <Button variant="ghost" size="icon" disabled={serving === 0}>
              <ArrowDown onClick={() => setServing(serving - 0.5)} />
            </Button>
          </span>
          <Label htmlFor="servings">Servings</Label>
        </span>
      </span>

      <TypographyList>
        {adjusted.map(({ id, ingredient, amount, unitMeasurement }) => (
          <Fragment key={id}>
            <li className="flex items-center justify-start my-1 gap-x-1">
              {unitMeasurement === "unit" || serving === 0 ? (
                <div className="w-[12%] m-0">-</div>
              ) : (
                <div className="m-0 w-[12%]">
                  {amount === Math.floor(amount)
                    ? amount
                    : number2fraction(amount, true)}
                </div>
              )}
              <Label
                className="w-5/6 my-auto space-x-2 text-base border-b border-border"
                htmlFor={ingredient}
              >
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
            {/* <Separator className="my-1 border border-gray-300" /> */}
          </Fragment>
        ))}
      </TypographyList>
    </div>
  );
}
