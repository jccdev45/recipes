"use client";

import { ArrowDown, ArrowUp, ListRestart } from 'lucide-react';
import { number2fraction } from 'number2fraction';
import { Fragment, useEffect, useState } from 'react';

import { TypographyH3 } from '@/components/typography/TypographyH3';
import { TypographyH4 } from '@/components/typography/TypographyH4';
import { TypographyList } from '@/components/typography/TypographyList';
import { cn, scaleIngredients } from '@/lib/utils';
import { Ingredient } from '@/types/supabase';

import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Separator } from '../../../components/ui/separator';

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
      <TypographyH4>
        Enter a whole number then fine tune with the arrow buttons.
      </TypographyH4>
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
            <li className="flex items-center justify-start gap-x-1">
              {unitMeasurement === "unit" || serving === 0 ? (
                <div className="w-[12%] m-0">-</div>
              ) : (
                <div className="m-0 w-[12%]">
                  {amount === Math.floor(amount)
                    ? amount
                    : number2fraction(amount, true)}
                </div>
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
      </TypographyList>
    </div>
  );
}
