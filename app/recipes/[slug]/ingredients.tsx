"use client"

import { useEffect, useMemo, useState } from "react"
import { Info, Minus, Plus } from "lucide-react"

import { Ingredient } from "@/lib/types"
import { cn, formatFractionalQuantity, scaleIngredients } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
  new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 1,
    useGrouping: false,
  }).format(value)

const formatUnitLabel = (unitMeasurement?: string | null) => {
  if (!unitMeasurement || unitMeasurement === "unit") {
    return ""
  }

  return unitMeasurement.replace(/_/g, " ")
}

const buildIngredientKey = (ingredient: Ingredient, index: number) =>
  ingredient.id ?? `${ingredient.ingredient}-${index}`

const getCheckboxId = (key: string, index: number) => {
  const normalized = key
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

  return `ingredient-${normalized || "item"}-${index}`
}

const ServingAdjuster = ({ serving, setServing }: ServingAdjusterProps) => {
  const updateServing = (next: number) => {
    const rounded = Number(next.toFixed(2))
    setServing(Math.max(0, rounded))
  }

  const scaleDescription =
    serving === 0
      ? "Scaling is disabled; showing the recorded measurements."
      : serving === 1
        ? "Showing the original recipe measurements."
        : `Scaling ingredient quantities by ×${formatServingCount(serving)}.`

  return (
    <div className="space-y-2 text-sm">
      <div className="flex flex-wrap items-center gap-3">
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
      </div>
      <span id="servings-helper" className="text-muted-foreground text-xs">
        Supports half increments. Set to 0 to prep without scaling.
      </span>
      <p className="text-muted-foreground text-xs" aria-live="polite">
        {scaleDescription}
      </p>
    </div>
  )
}

interface IngredientItemProps {
  ingredient: Ingredient
  checkboxId: string
  isChecked: boolean
  onToggle: (checked: boolean) => void
  serving: number
}

const IngredientItem = ({
  ingredient,
  checkboxId,
  isChecked,
  onToggle,
  serving,
}: IngredientItemProps) => {
  const { amount, unitMeasurement } = ingredient
  const hasMeasurement = Number.isFinite(amount) && amount > 0
  const isToTaste =
    !hasMeasurement || unitMeasurement === "unit" || serving === 0

  const formattedAmount = isToTaste
    ? "To taste"
    : formatFractionalQuantity(amount ?? 0)

  const baseUnitLabel = formatUnitLabel(unitMeasurement)
  const unitLabel =
    !isToTaste && baseUnitLabel
      ? amount && amount > 1
        ? `${baseUnitLabel}s`
        : baseUnitLabel
      : ""

  return (
    <li className="flex items-start gap-3 py-3">
      <Checkbox
        id={checkboxId}
        checked={isChecked}
        onCheckedChange={(checked) => onToggle(checked === true)}
        className="mt-1 shrink-0"
      />
      <label
        htmlFor={checkboxId}
        className="flex flex-1 cursor-pointer flex-wrap items-baseline gap-x-3 gap-y-1"
      >
        <span className="text-foreground text-sm font-semibold">
          {formattedAmount}
        </span>
        {unitLabel ? (
          <span className="text-muted-foreground text-sm">{unitLabel}</span>
        ) : null}
        <span className="text-foreground text-base font-medium">
          {ingredient.ingredient}
        </span>
      </label>
    </li>
  )
}

export function Ingredients({ ingredients, className }: IngredientsProps) {
  const [serving, setServing] = useState(1)
  const [preparedIngredients, setPreparedIngredients] = useState<
    Record<string, boolean>
  >({})

  const adjustedIngredients = useMemo(
    () => scaleIngredients(ingredients, serving),
    [ingredients, serving]
  )

  useEffect(() => {
    setPreparedIngredients({})
  }, [ingredients])

  const toggleIngredientPrepared = (key: string, nextValue: boolean) => {
    setPreparedIngredients((previous) => {
      if (!nextValue) {
        const { [key]: _removed, ...rest } = previous
        return rest
      }

      return { ...previous, [key]: true }
    })
  }

  const preparedCount = Object.keys(preparedIngredients).length
  const totalCount = ingredients.length
  const clearPrepared = () => setPreparedIngredients({})

  return (
    <section id="recipe-ingredients" className={cn("space-y-4", className)}>
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-2xl font-semibold tracking-tight">Ingredients</h2>
        <HoverCard>
          <HoverCardTrigger aria-label="How serving adjustments work">
            <Info className="h-4 w-4" />
          </HoverCardTrigger>
          <HoverCardContent className="max-w-xs text-sm">
            Enter a serving amount or use the increment controls to scale this
            family recipe. Treat measurements as guidance rather than exact
            science.
          </HoverCardContent>
        </HoverCard>
      </div>
      <ServingAdjuster serving={serving} setServing={setServing} />
      <div className="bg-card text-card-foreground relative rounded-sm border p-1">
        <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-3 px-3 py-2 text-xs">
          <p aria-live="polite">
            {preparedCount} of {totalCount} ingredients prepped
          </p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 px-2"
            disabled={preparedCount === 0}
            onClick={clearPrepared}
          >
            Clear marks
          </Button>
        </div>
        <ul
          className="divide-border/70 h-fit divide-y"
          aria-label="Recipe ingredients"
        >
          {adjustedIngredients.map((ingredient, index) => {
            const ingredientKey = buildIngredientKey(ingredient, index)
            const checkboxId = getCheckboxId(ingredientKey, index)

            return (
              <IngredientItem
                key={ingredientKey}
                ingredient={ingredient}
                checkboxId={checkboxId}
                isChecked={Boolean(preparedIngredients[ingredientKey])}
                onToggle={(checked) =>
                  toggleIngredientPrepared(ingredientKey, checked)
                }
                serving={serving}
              />
            )
          })}
        </ul>
      </div>
    </section>
  )
}
