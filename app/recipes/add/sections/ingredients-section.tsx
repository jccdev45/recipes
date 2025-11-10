import { useRef, useState } from "react"
import { Beef, Check, PencilLine, Plus, X as XIcon } from "lucide-react"

import { maxAmount, minAmount } from "@/lib/constants"
import { genId } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  FieldDescription,
  FieldError,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { FormInfoAlert } from "@/components/form-info-alert"
import {
  Tags,
  TagsContent,
  TagsEmpty,
  TagsGroup,
  TagsInput,
  TagsItem,
  TagsList,
  TagsTrigger,
  TagsValue,
} from "@/components/tags"

import {
  addRecipeDefaultValuesShape,
  getErrorId,
  getNameFromPath,
  withAddRecipeForm,
} from "../add-recipe-form.hook"
import type { KeyboardEvent } from "react"

export const IngredientsSection = withAddRecipeForm({
  defaultValues: addRecipeDefaultValuesShape,
  props: {
    normalizedUnits: undefined as string[] | undefined,
  },
  render: function Render({ form, normalizedUnits }) {
    const [pendingIngredient, setPendingIngredient] = useState({
      amount: "",
      unitMeasurement: "",
      ingredient: "",
    })
    const [ingredientHelper, setIngredientHelper] = useState<string | null>(
      null
    )
    const [editingIngredient, setEditingIngredient] = useState<{
      id: string
      index: number
      amount: string
      unitMeasurement: string
      ingredient: string
    } | null>(null)
    const [unitSuggestionsOpen, setUnitSuggestionsOpen] = useState(false)

    const amountInputRef = useRef<HTMLInputElement>(null)
    const unitInputRef = useRef<HTMLInputElement>(null)
    const ingredientInputRef = useRef<HTMLInputElement>(null)

    const FormField = form.Field

    return (
      <Card className="shadow-md">
        <CardHeader className="space-y-3">
          <div className="flex items-center gap-2">
            <Beef aria-hidden="true" className="text-primary h-5 w-5" />
            <CardTitle className="text-xl font-semibold">Ingredients</CardTitle>
          </div>
          <CardDescription>
            Capture each component with a clear measurement and name.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormInfoAlert
            type="info"
            title="Ingredient guidance"
            desc="Keep units consistent and round amounts to the nearest tenth so cooks can scale servings confidently."
          />

          <FormField name="ingredients">
            {(ingredientsField) => {
              const fieldId = getNameFromPath(ingredientsField.name)
              const errorId = getErrorId(ingredientsField.name)

              const handleAddIngredient = () => {
                const trimmedAmount = pendingIngredient.amount.trim()
                const trimmedUnit = pendingIngredient.unitMeasurement.trim()
                const trimmedName = pendingIngredient.ingredient.trim()
                const parsedAmount = Number(trimmedAmount)

                if (!trimmedAmount) {
                  setIngredientHelper(
                    "Add an amount before saving the ingredient."
                  )
                  amountInputRef.current?.focus()
                  return
                }

                if (Number.isNaN(parsedAmount)) {
                  setIngredientHelper("Use a valid number for the amount.")
                  amountInputRef.current?.focus()
                  return
                }

                if (parsedAmount < minAmount || parsedAmount > maxAmount) {
                  setIngredientHelper(
                    `Amount must be between ${minAmount} and ${maxAmount}.`
                  )
                  amountInputRef.current?.focus()
                  return
                }

                if (!trimmedUnit) {
                  setIngredientHelper(
                    "Add a unit measurement before continuing."
                  )
                  unitInputRef.current?.focus()
                  return
                }

                if (!trimmedName) {
                  setIngredientHelper(
                    "Add the ingredient name before continuing."
                  )
                  ingredientInputRef.current?.focus()
                  return
                }

                ingredientsField.pushValue({
                  id: genId(),
                  amount: parsedAmount,
                  unitMeasurement: trimmedUnit,
                  ingredient: trimmedName,
                })

                setIngredientHelper(null)
                setPendingIngredient({
                  amount: "",
                  unitMeasurement: "",
                  ingredient: "",
                })
                amountInputRef.current?.focus()
              }

              const handleEditIngredientSave = () => {
                if (!editingIngredient) return

                const trimmedAmount = editingIngredient.amount.trim()
                const trimmedUnit = editingIngredient.unitMeasurement.trim()
                const trimmedName = editingIngredient.ingredient.trim()
                const parsedAmount = Number(trimmedAmount)

                if (!trimmedAmount || Number.isNaN(parsedAmount)) {
                  setIngredientHelper(
                    "Provide a valid number when updating an ingredient."
                  )
                  return
                }

                if (parsedAmount < minAmount || parsedAmount > maxAmount) {
                  setIngredientHelper(
                    `Updated amount must be between ${minAmount} and ${maxAmount}.`
                  )
                  return
                }

                if (!trimmedUnit || !trimmedName) {
                  setIngredientHelper(
                    "Complete all ingredient fields before saving changes."
                  )
                  return
                }

                const current =
                  ingredientsField.state.value[editingIngredient.index]

                if (!current) return

                ingredientsField.replaceValue(editingIngredient.index, {
                  ...current,
                  amount: parsedAmount,
                  unitMeasurement: trimmedUnit,
                  ingredient: trimmedName,
                })

                setIngredientHelper(null)
                setEditingIngredient(null)
              }

              const handleIngredientKeyDown = (
                event: KeyboardEvent<HTMLInputElement>
              ) => {
                if (event.key === "Enter") {
                  event.preventDefault()
                  handleAddIngredient()
                }
              }

              return (
                <FieldSet
                  className="space-y-5"
                  aria-describedby={
                    ingredientsField.state.meta.errors?.length
                      ? errorId
                      : undefined
                  }
                >
                  <FieldLegend className="sr-only">Ingredients</FieldLegend>
                  <FieldDescription>
                    Enter the amount, unit, and ingredient name. Press Enter or
                    choose “Add ingredient” to store it.
                  </FieldDescription>

                  <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,2fr)_auto]">
                    <Input
                      ref={amountInputRef}
                      type="number"
                      inputMode="decimal"
                      min={minAmount}
                      max={maxAmount}
                      step="0.1"
                      value={pendingIngredient.amount}
                      onChange={(event) =>
                        setPendingIngredient((previous) => ({
                          ...previous,
                          amount: event.target.value,
                        }))
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault()
                          unitInputRef.current?.focus()
                        }
                      }}
                      placeholder="Amount"
                      aria-label="Ingredient amount"
                    />
                    <Tags
                      className="sm:max-w-xs"
                      open={unitSuggestionsOpen}
                      onOpenChange={setUnitSuggestionsOpen}
                    >
                      <TagsTrigger
                        placeholder="Browse units"
                        aria-label="Browse units"
                      >
                        {pendingIngredient.unitMeasurement ? (
                          <TagsValue
                            onRemove={() =>
                              setPendingIngredient((previous) => ({
                                ...previous,
                                unitMeasurement: "",
                              }))
                            }
                            aria-label={`Clear selected unit ${pendingIngredient.unitMeasurement}`}
                          >
                            {pendingIngredient.unitMeasurement}
                          </TagsValue>
                        ) : null}
                      </TagsTrigger>
                      <TagsContent align="start">
                        <TagsInput placeholder="Search units..." />
                        <TagsList>
                          <TagsEmpty>No units found.</TagsEmpty>
                          <TagsGroup>
                            {normalizedUnits?.length &&
                              normalizedUnits.map((unit) => {
                                const displayUnit = unit.trim()
                                const isSelected =
                                  pendingIngredient.unitMeasurement.toLowerCase() ===
                                  displayUnit.toLowerCase()

                                return (
                                  <TagsItem
                                    key={displayUnit}
                                    value={displayUnit}
                                    onSelect={() => {
                                      setPendingIngredient((previous) => ({
                                        ...previous,
                                        unitMeasurement: displayUnit,
                                      }))
                                      setIngredientHelper(null)
                                      setUnitSuggestionsOpen(false)
                                      ingredientInputRef.current?.focus()
                                    }}
                                    aria-selected={isSelected}
                                    aria-checked={isSelected}
                                  >
                                    <span>{displayUnit}</span>
                                    {isSelected ? (
                                      <Check
                                        aria-hidden="true"
                                        className="text-primary ml-2 h-4 w-4"
                                      />
                                    ) : null}
                                  </TagsItem>
                                )
                              })}
                          </TagsGroup>
                        </TagsList>
                      </TagsContent>
                    </Tags>
                    <Input
                      ref={ingredientInputRef}
                      value={pendingIngredient.ingredient}
                      onChange={(event) =>
                        setPendingIngredient((previous) => ({
                          ...previous,
                          ingredient: event.target.value,
                        }))
                      }
                      onKeyDown={handleIngredientKeyDown}
                      placeholder="Ingredient name"
                      aria-label="Ingredient name"
                    />
                    <Button
                      type="button"
                      onClick={handleAddIngredient}
                      variant="outline"
                      className="self-start"
                    >
                      <Plus aria-hidden="true" className="h-4 w-4" />
                      Add ingredient
                    </Button>
                  </div>

                  {ingredientHelper && (
                    <FieldError>{ingredientHelper}</FieldError>
                  )}

                  {ingredientsField.state.meta.errors?.length ? (
                    <FieldError
                      id={errorId}
                      errors={ingredientsField.state.meta.errors}
                    />
                  ) : null}

                  {ingredientsField.state.value.length === 0 ? (
                    <Empty
                      aria-live="polite"
                      className="border-border/50 bg-muted/30 border"
                    >
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <Beef aria-hidden="true" className="h-5 w-5" />
                        </EmptyMedia>
                        <EmptyTitle>No ingredients yet</EmptyTitle>
                        <EmptyDescription>
                          Add the amount, unit, and ingredient name, then choose
                          “Add ingredient” to build your list.
                        </EmptyDescription>
                      </EmptyHeader>
                      <EmptyContent>
                        <span className="text-muted-foreground text-sm">
                          The form fields above stay focused so you can quickly
                          add each ingredient.
                        </span>
                      </EmptyContent>
                    </Empty>
                  ) : (
                    <ul className="space-y-3" aria-live="polite">
                      {ingredientsField.state.value.map((ingredient, index) => {
                        if (!ingredient?.id) {
                          return null
                        }

                        const isEditing =
                          editingIngredient?.id === ingredient.id

                        if (isEditing && editingIngredient) {
                          return (
                            <li
                              key={`${ingredient.id}-${index}`}
                              className="border-border/60 bg-background/70 flex flex-col gap-3 rounded-2xl border p-4 shadow-sm"
                            >
                              <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,2fr)]">
                                <Input
                                  id={`edit-ingredient-amount-${ingredient.id}`}
                                  type="number"
                                  inputMode="decimal"
                                  min={minAmount}
                                  max={maxAmount}
                                  step="0.1"
                                  value={editingIngredient.amount}
                                  onChange={(event) =>
                                    setEditingIngredient((previous) =>
                                      previous
                                        ? {
                                            ...previous,
                                            amount: event.target.value,
                                          }
                                        : previous
                                    )
                                  }
                                  aria-label={`Edit amount for ${ingredient.ingredient}`}
                                />
                                <Input
                                  value={editingIngredient.unitMeasurement}
                                  onChange={(event) =>
                                    setEditingIngredient((previous) =>
                                      previous
                                        ? {
                                            ...previous,
                                            unitMeasurement: event.target.value,
                                          }
                                        : previous
                                    )
                                  }
                                  aria-label={`Edit unit for ${ingredient.ingredient}`}
                                />
                                <Input
                                  value={editingIngredient.ingredient}
                                  onChange={(event) =>
                                    setEditingIngredient((previous) =>
                                      previous
                                        ? {
                                            ...previous,
                                            ingredient: event.target.value,
                                          }
                                        : previous
                                    )
                                  }
                                  onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                      event.preventDefault()
                                      handleEditIngredientSave()
                                    }
                                  }}
                                  aria-label={`Edit ingredient name for ${ingredient.ingredient}`}
                                />
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <Button
                                  type="button"
                                  size="sm"
                                  onClick={handleEditIngredientSave}
                                >
                                  Save changes
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setEditingIngredient(null)}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon-sm"
                                  onClick={() => {
                                    ingredientsField.removeValue(index)
                                    setEditingIngredient(null)
                                  }}
                                  aria-label={`Remove ingredient ${ingredient.ingredient}`}
                                >
                                  <XIcon
                                    aria-hidden="true"
                                    className="h-4 w-4"
                                  />
                                </Button>
                              </div>
                            </li>
                          )
                        }

                        return (
                          <li
                            key={`${ingredient.id}-${index}`}
                            className="border-border/60 bg-background/70 flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4 shadow-sm"
                          >
                            <div className="flex flex-col">
                              <span className="text-foreground font-medium">
                                {ingredient.amount} {ingredient.unitMeasurement}
                              </span>
                              <span className="text-muted-foreground text-sm">
                                {ingredient.ingredient}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setEditingIngredient({
                                    id: ingredient.id,
                                    index,
                                    amount: ingredient.amount.toString(),
                                    unitMeasurement: ingredient.unitMeasurement,
                                    ingredient: ingredient.ingredient,
                                  })
                                  requestAnimationFrame(() =>
                                    document
                                      .getElementById(
                                        `edit-ingredient-amount-${ingredient.id}`
                                      )
                                      ?.focus()
                                  )
                                }}
                              >
                                <PencilLine
                                  aria-hidden="true"
                                  className="h-4 w-4"
                                />
                                Edit
                              </Button>
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon-sm"
                                onClick={() =>
                                  ingredientsField.removeValue(index)
                                }
                                aria-label={`Remove ingredient ${ingredient.ingredient}`}
                              >
                                <XIcon aria-hidden="true" className="h-4 w-4" />
                              </Button>
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  )}

                  <datalist id="unit-suggestions">
                    {normalizedUnits?.map((unit) => (
                      <option key={unit} value={unit} />
                    ))}
                  </datalist>
                </FieldSet>
              )
            }}
          </FormField>
        </CardContent>
      </Card>
    )
  },
})
