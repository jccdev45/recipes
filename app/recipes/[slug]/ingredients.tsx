"use client"

import { useState } from "react"
import { ArrowDown, ArrowUp, Info } from "lucide-react"
import { number2fraction } from "number2fraction"

import { Ingredient } from "@/lib/types"
import { cn, scaleIngredients } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Typography } from "@/components/ui/typography"

interface IngredientsProps {
  className?: string
  ingredients: Ingredient[]
}

const ServingAdjuster = ({
  serving,
  setServing,
}: {
  serving: number
  setServing: (value: number) => void
}) => (
  <span className="mx-auto flex w-2/3 items-center justify-center gap-x-4">
    <span className="flex items-center justify-center">
      <Input
        type="number"
        name="servings"
        value={serving}
        onChange={(e) => {
          const value = Number(e.target.value)
          if (!isNaN(value) && value >= 0) {
            setServing(value)
          }
        }}
        className="w-16 text-lg"
        min="0"
        step="0.5"
      />
      <span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setServing(serving + 0.5)}
        >
          <ArrowUp />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setServing(Math.max(0, serving - 0.5))}
          disabled={serving === 0}
        >
          <ArrowDown />
        </Button>
      </span>
      <Label htmlFor="servings">Servings</Label>
    </span>
  </span>
)

const IngredientItem = ({
  ingredient,
  amount,
  unitMeasurement,
  serving,
}: Ingredient & { serving: number }) => (
  <li className="my-1 flex items-center justify-start gap-x-1">
    {unitMeasurement === "unit" || serving === 0 ? (
      <div className="m-0 w-[12%]">-</div>
    ) : (
      <div className="m-0 w-[12%]">
        {amount === Math.floor(amount) ? amount : number2fraction(amount, true)}
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
)

export function Ingredients({ ingredients, className }: IngredientsProps) {
  const [serving, setServing] = useState(1)

  const adjustedIngredients = scaleIngredients(ingredients, serving)

  return (
    <section className={cn("", className)}>
      <div className="flex items-center gap-4 border-b">
        <Typography variant="h2" className="border-0">
          Ingredients
        </Typography>
        <HoverCard>
          <HoverCardTrigger>
            <Info />
          </HoverCardTrigger>
          <HoverCardContent>
            Enter a serving amount or use arrows to adjust (servings are *very*
            approximated as not all recipes were recorded with serving size)
          </HoverCardContent>
        </HoverCard>
      </div>

      <ServingAdjuster serving={serving} setServing={setServing} />

      <Typography variant="list">
        {adjustedIngredients.map((ingredient) => (
          <IngredientItem
            key={ingredient.id}
            {...ingredient}
            serving={serving}
          />
        ))}
      </Typography>
    </section>
  )
}
