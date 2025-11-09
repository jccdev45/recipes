"use client"

import { useMemo, useState } from "react"
import { Info, Minus, Plus } from "lucide-react"
import { number2fraction } from "number2fraction"

import { Ingredient } from "@/lib/types"
import { cn, scaleIngredients } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"

interface IngredientsProps {
  className?: string
  ingredients: Ingredient[]
}

interface ServingAdjusterProps {
  serving: number
  setServing: (value: number) => void
}

const formatServingCount = (value: number) =>
  new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 }).format(value)

const ServingAdjuster = ({ serving, setServing }: ServingAdjusterProps) => {
  const updateServing = (next: number) => {
    const rounded = Number(next.toFixed(2))
    setServing(Math.max(0, rounded))
  }

  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <Label htmlFor="servings" className="text-muted-foreground font-medium">
        Servings
      </Label>
      <InputGroup className="h-10 w-full max-w-[220px]">
        <InputGroupButton
          aria-label="Decrease servings"
          onClick={() => updateServing(serving - 0.5)}
          disabled={serving <= 0}
        >
          <Minus className="h-4 w-4" />
        </InputGroupButton>
        <InputGroupInput
          id="servings"
          type="number"
          inputMode="decimal"
          step={0.5}
          min={0}
          value={Number.isFinite(serving) ? serving : ""}
          onChange={(event) => {
            const rawValue = event.target.value
            if (rawValue === "") {
              setServing(0)
              return
            }

            const parsed = Number(rawValue)
            if (Number.isNaN(parsed) || parsed < 0) {
              return
            }

            updateServing(parsed)
          }}
          aria-describedby="servings-helper"
        />
        <InputGroupButton
          aria-label="Increase servings"
          onClick={() => updateServing(serving + 0.5)}
        >
          <Plus className="h-4 w-4" />
        </InputGroupButton>
        <InputGroupAddon align="inline-end">
          <InputGroupText>servings</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 px-2 text-xs"
        onClick={() => setServing(1)}
      >
        Reset
      </Button>
      <span id="servings-helper" className="text-muted-foreground text-xs">
        Supports half increments. Set to 0 to prep without scaling.
      </span>
    </div>
  )
}

interface IngredientItemProps {
  ingredient: Ingredient
  serving: number
}

const IngredientItem = ({ ingredient, serving }: IngredientItemProps) => {
  const { amount, unitMeasurement } = ingredient
  const isToTaste = unitMeasurement === "unit" || serving === 0

  const formattedAmount = isToTaste
    ? "To taste"
    : amount === Math.floor(amount)
      ? `${amount}`
      : number2fraction(amount, true)

  const unitLabel = isToTaste
    ? "Add as needed"
    : amount > 1
      ? `${unitMeasurement}s`
      : unitMeasurement

  return (
    <li className="flex flex-wrap items-baseline gap-x-3 gap-y-1 py-3">
      <span className="text-foreground text-sm font-semibold">
        {formattedAmount}
      </span>
      {!isToTaste ? (
        <span className="text-muted-foreground text-sm">{unitLabel}</span>
      ) : null}
      <span className="text-foreground text-base font-medium">
        {ingredient.ingredient}
      </span>
    </li>
  )
}

export function Ingredients({ ingredients, className }: IngredientsProps) {
  const [serving, setServing] = useState(1)

  const adjustedIngredients = useMemo(
    () => scaleIngredients(ingredients, serving),
    [ingredients, serving]
  )

  return (
    <section id="recipe-ingredients" className={cn("space-y-4", className)}>
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-2xl font-semibold tracking-tight">Ingredients</h2>
        <HoverCard>
          <HoverCardTrigger asChild>
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              aria-label="How serving adjustments work"
            >
              <Info className="h-4 w-4" />
            </button>
          </HoverCardTrigger>
          <HoverCardContent className="max-w-xs text-sm">
            Enter a serving amount or use the increment controls to scale this
            family recipe. Measurements come from relatives, so treat them as
            guidance rather than exact science.
          </HoverCardContent>
        </HoverCard>
      </div>
      <p className="text-muted-foreground text-sm">
        Scale the recipe and keep track of what's prepped at a glance.
      </p>
      <ServingAdjuster serving={serving} setServing={setServing} />
      <div className="bg-card text-card-foreground relative rounded-sm border p-1">
        <ScrollArea className="h-[420px] pr-3">
          <ul className="divide-border/70 divide-y">
            {adjustedIngredients.map((ingredient, index) => (
              <IngredientItem
                key={ingredient.id ?? `${ingredient.ingredient}-${index}`}
                ingredient={ingredient}
                serving={serving}
              />
            ))}
          </ul>
        </ScrollArea>
      </div>
    </section>
  )
}
