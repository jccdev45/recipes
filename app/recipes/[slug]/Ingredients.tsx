"use client"

import { useEffect, useState } from "react"
import { Ingredient } from "@/supabase/types"
import { ArrowDown, ArrowUp } from "lucide-react"
import { number2fraction } from "number2fraction"

import { cn, scaleIngredients } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  TypographyH2,
  TypographyList,
  TypographyP,
} from "@/components/ui/typography"

type IngredientsProps = {
  className: string
  ingredients: Ingredient[]
}

export function Ingredients({ ingredients, className }: IngredientsProps) {
  const [adjusted, setAdjusted] = useState<Ingredient[]>(ingredients)
  const [serving, setServing] = useState(1)

  useEffect(() => {
    const newIngs = scaleIngredients(ingredients, serving)

    setAdjusted(newIngs)
  }, [serving])

  return (
    <div className={cn(``, className)}>
      <TypographyH2>Ingredients</TypographyH2>
      <TypographyP>
        Enter a serving amount or use the arrows to adjust by 1/2 (servings are
        *very* approximated as not all recipes were recorded with serving size,
        use your best judgment)
      </TypographyP>
      <span className="mx-auto flex w-2/3 items-center justify-center gap-x-4">
        <span className="flex items-center justify-center">
          <Input
            pattern="[0-9]+"
            name="servings"
            value={serving}
            onChange={(e) => {
              if (isNaN(Number(e.target.value))) {
                return
              }
              setServing(Number(e.target.value))
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
          <li key={id} className="my-1 flex items-center justify-start gap-x-1">
            {unitMeasurement === "unit" || serving === 0 ? (
              <div className="m-0 w-[12%]">-</div>
            ) : (
              <div className="m-0 w-[12%]">
                {amount === Math.floor(amount)
                  ? amount
                  : number2fraction(amount, true)}
              </div>
            )}
            <Label
              className="my-auto w-5/6 space-x-2 border-b border-border text-base"
              htmlFor={ingredient}
            >
              <span>
                {unitMeasurement === "unit"
                  ? `(to taste)`
                  : amount > 1
                    ? `${unitMeasurement}s`
                    : unitMeasurement}
              </span>
              <span>{ingredient}</span>
            </Label>
          </li>
        ))}
      </TypographyList>
    </div>
  )
}
