"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/supabase/client"
import { useForm, useStore } from "@tanstack/react-form"
import {
  Beef,
  ListOrdered,
  NotebookPen,
  PencilLine,
  Plus,
  Tag as TagIcon,
  X as XIcon,
} from "lucide-react"

import { maxAmount, minAmount } from "@/lib/constants"
import { cn, genId, toSlug } from "@/lib/utils"
import { AddRecipeFormValues, RecipeFormSchema } from "@/lib/zod/schema"
import { useRecipes } from "@/hooks/useRecipes"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Spinner } from "@/components/ui/spinner"
import { Typography } from "@/components/ui/typography"
import { ErrorDisplay } from "@/components/error/error-display"
import { FormInfoAlert } from "@/components/form-info-alert"
import { FileInput } from "@/app/recipes/add/image-upload"

import type { User } from "@supabase/supabase-js"

type AddRecipeFormProps = {
  className: string
  user: User | null
}

const getNameFromPath = (name: unknown) =>
  String(name).replace(/\./g, "-").replace(/\[/g, "-").replace(/\]/g, "")

const getErrorId = (name: unknown) => `error-${getNameFromPath(name)}`

export function AddRecipeForm({ className, user }: AddRecipeFormProps) {
  const supabase = createClient()
  const router = useRouter()

  const { tags, units, error: recipeError, isLoading } = useRecipes()

  const [imgURL, setImgURL] = useState("")
  const [formError, setFormError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)

  const [pendingIngredient, setPendingIngredient] = useState({
    amount: "",
    unitMeasurement: "",
    ingredient: "",
  })
  const [ingredientHelper, setIngredientHelper] = useState<string | null>(null)
  const [editingIngredient, setEditingIngredient] = useState<{
    id: string
    index: number
    amount: string
    unitMeasurement: string
    ingredient: string
  } | null>(null)

  const [pendingStep, setPendingStep] = useState("")
  const [stepHelper, setStepHelper] = useState<string | null>(null)
  const [editingStep, setEditingStep] = useState<{
    id: string
    index: number
    value: string
  } | null>(null)

  const [pendingTag, setPendingTag] = useState("")
  const [tagHelper, setTagHelper] = useState<string | null>(null)
  const [tagEditState, setTagEditState] = useState<{
    id: string
    index: number
    value: string
  } | null>(null)

  const amountInputRef = useRef<HTMLInputElement>(null)
  const unitInputRef = useRef<HTMLInputElement>(null)
  const ingredientInputRef = useRef<HTMLInputElement>(null)
  const stepInputRef = useRef<HTMLInputElement>(null)
  const tagInputRef = useRef<HTMLInputElement>(null)

  const defaultValues: AddRecipeFormValues = {
    recipe_name: "",
    quote: "",
    ingredients: [
      { id: genId(), amount: 0, unitMeasurement: "", ingredient: "" },
    ],
    steps: [{ id: genId(), step: "" }],
    tags: [{ id: genId(), tag: "" }],
  }

  const form = useForm({
    defaultValues,
    validators: {
      onChange: RecipeFormSchema,
      onSubmit: RecipeFormSchema,
    },
    onSubmit: async ({ value }) => {
      setFormError(null)

      if (!imgURL && !isConfirmed) {
        setFormError(
          "You have not selected an image. Continue to submit without one or upload a photo now."
        )
        return
      }

      const updatedValues = {
        ...value,
        author: user?.user_metadata.first_name || "Anonymous User",
        user_id: user?.id,
        slug: toSlug(value.recipe_name),
        img: imgURL
          ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos/${imgURL}`
          : "http://loremflickr.com/g/500/500/food",
      }

      try {
        const { data, error } = await supabase
          .from("recipes")
          .insert(updatedValues)
          .select()

        if (error) throw error

        form.reset()
        setImgURL("")
        setIsConfirmed(false)
        router.push(`/recipes/${data[0].slug}`)
        router.refresh()
      } catch (error) {
        console.error("Error submitting recipe:", error)
        setFormError(
          error instanceof Error
            ? error.message
            : "An error occurred while submitting the recipe."
        )
      }
    },
  })

  const FormField = form.Field

  const recipeNameValue = useStore(
    form.store,
    (state) => state.values.recipe_name
  )
  const recipeNameMeta = useStore(
    form.store,
    (state) => state.fieldMeta.recipe_name
  )
  const nameForImage =
    recipeNameValue.trim().length > 0 &&
    (recipeNameMeta?.errors?.length ?? 0) === 0

  const handleImageUpload = async (file: File | null) => {
    const recipeName = form.state.values.recipe_name
    const fileExt = file?.name.split(".").pop()
    const filePath = `recipes/${recipeName}/${Math.random()}.${fileExt}`

    if (!file) {
      setFormError("No file selected")
      return
    }

    setIsUploading(true)
    const { data, error } = await supabase.storage
      .from("photos")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      })

    if (error) {
      setFormError(error.message)
    } else if (data) {
      setImgURL(data.path)
      setFormError(null)
    }

    setIsUploading(false)
  }

  if (isLoading) {
    return (
      <div
        className={cn(
          "border-border/60 bg-card/80 flex min-h-80 w-full items-center justify-center rounded-3xl border p-10 shadow-lg",
          className
        )}
      >
        <Spinner size="xl" aria-label="Loading recipe form" />
      </div>
    )
  }

  if (recipeError) {
    return (
      <Alert
        variant="destructive"
        className={cn(
          "border-destructive/40 bg-destructive/10 rounded-3xl border p-6 shadow-lg",
          className
        )}
      >
        <AlertTitle>We could not load the form</AlertTitle>
        <AlertDescription>{recipeError.message}</AlertDescription>
      </Alert>
    )
  }

  const normalizedUnits = units?.filter(
    (unit) => unit && unit.trim().length > 0
  )
  const suggestedTags = tags?.slice(0, 8) ?? []

  return (
    <form
      id="add-recipe-form"
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        void form.handleSubmit()
      }}
      className={cn(
        "border-border/60 bg-card/85 space-y-10 rounded-3xl border p-6 shadow-xl backdrop-blur-sm md:p-10",
        className
      )}
    >
      <div className="space-y-3">
        <Typography
          variant="h3"
          className="text-foreground text-2xl font-semibold"
        >
          Craft your recipe
        </Typography>
        <Typography variant="muted" className="text-muted-foreground text-base">
          Build each section with the guidance below. You can update anything
          after publishing.
        </Typography>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="space-y-6">
          <Card className="shadow-md">
            <CardHeader className="space-y-3">
              <div className="flex items-center gap-2">
                <NotebookPen
                  aria-hidden="true"
                  className="text-primary h-5 w-5"
                />
                <CardTitle className="text-xl font-semibold">
                  Recipe basics
                </CardTitle>
              </div>
              <CardDescription>
                Set the name and a short pull quote to introduce the dish.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FieldSet className="space-y-6">
                <FieldLegend className="sr-only">Recipe basics</FieldLegend>

                <FormField name="recipe_name">
                  {(field) => {
                    const fieldId = getNameFromPath(field.name)
                    const errorId = getErrorId(field.name)
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid
                    const recipeName = field.state.value as string

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={fieldId}>Recipe name</FieldLabel>
                        <FieldContent>
                          <Input
                            id={fieldId}
                            value={recipeName}
                            onChange={(event) =>
                              field.handleChange(event.target.value)
                            }
                            onBlur={field.handleBlur}
                            placeholder="Enter recipe name"
                            aria-invalid={isInvalid}
                            aria-describedby={isInvalid ? errorId : undefined}
                          />
                          {isInvalid && (
                            <FieldError
                              id={errorId}
                              errors={field.state.meta.errors}
                            />
                          )}
                        </FieldContent>
                      </Field>
                    )
                  }}
                </FormField>

                <FormField name="quote">
                  {(field) => {
                    const fieldId = getNameFromPath(field.name)
                    const errorId = getErrorId(field.name)
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid
                    const quoteValue = field.state.value as string

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={fieldId}>
                          Feature quote (optional)
                        </FieldLabel>
                        <FieldContent>
                          <Input
                            id={fieldId}
                            value={quoteValue}
                            onChange={(event) =>
                              field.handleChange(event.target.value)
                            }
                            onBlur={field.handleBlur}
                            placeholder="Why is this recipe special?"
                            aria-invalid={isInvalid}
                            aria-describedby={isInvalid ? errorId : undefined}
                          />
                          {isInvalid && (
                            <FieldError
                              id={errorId}
                              errors={field.state.meta.errors}
                            />
                          )}
                        </FieldContent>
                      </Field>
                    )
                  }}
                </FormField>
              </FieldSet>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="space-y-3">
              <div className="flex items-center gap-2">
                <Beef aria-hidden="true" className="text-primary h-5 w-5" />
                <CardTitle className="text-xl font-semibold">
                  Ingredients
                </CardTitle>
              </div>
              <CardDescription>
                Capture each component with a clear measurement and name.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormInfoAlert
                type="info"
                title="Ingredient guidance"
                desc="Keep units consistent and round amounts to the nearest tenth
                  so cooks can scale servings confidently."
              />

              <FormField name="ingredients">
                {(ingredientsField) => {
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
                    event: React.KeyboardEvent<HTMLInputElement>
                  ) => {
                    if (event.key === "Enter") {
                      event.preventDefault()
                      handleAddIngredient()
                    }
                  }

                  const fieldId = getNameFromPath(ingredientsField.name)
                  const errorId = getErrorId(ingredientsField.name)

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
                        Enter the amount, unit, and ingredient name. Press Enter
                        or choose “Add ingredient” to store it.
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
                        <Input
                          ref={unitInputRef}
                          value={pendingIngredient.unitMeasurement}
                          onChange={(event) =>
                            setPendingIngredient((previous) => ({
                              ...previous,
                              unitMeasurement: event.target.value,
                            }))
                          }
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              event.preventDefault()
                              ingredientInputRef.current?.focus()
                            }
                          }}
                          placeholder="Unit (e.g., cup)"
                          aria-label="Ingredient unit"
                          list="unit-suggestions"
                        />
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

                      {normalizedUnits?.length ? (
                        <div className="text-muted-foreground flex flex-wrap gap-2 text-xs">
                          <span className="font-medium">Popular units:</span>
                          {normalizedUnits.slice(0, 8).map((unit) => (
                            <Button
                              key={unit}
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setPendingIngredient((previous) => ({
                                  ...previous,
                                  unitMeasurement: unit,
                                }))
                              }
                            >
                              {unit}
                            </Button>
                          ))}
                        </div>
                      ) : null}

                      {ingredientHelper && (
                        <FieldError>{ingredientHelper}</FieldError>
                      )}

                      {ingredientsField.state.meta.errors?.length ? (
                        <FieldError
                          id={errorId}
                          errors={ingredientsField.state.meta.errors}
                        />
                      ) : null}

                      <ul className="space-y-3" aria-live="polite">
                        {ingredientsField.state.value.map(
                          (ingredient, index) => {
                            if (!ingredient?.id) {
                              return null
                            }

                            const isEditing =
                              editingIngredient?.id === ingredient.id

                            if (isEditing && editingIngredient) {
                              return (
                                <li
                                  key={ingredient.id}
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
                                                unitMeasurement:
                                                  event.target.value,
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
                                key={ingredient.id}
                                className="border-border/60 bg-background/70 flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4 shadow-sm"
                              >
                                <div className="flex flex-col">
                                  <span className="text-foreground font-medium">
                                    {ingredient.amount}{" "}
                                    {ingredient.unitMeasurement}
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
                                        unitMeasurement:
                                          ingredient.unitMeasurement,
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
                                    <XIcon
                                      aria-hidden="true"
                                      className="h-4 w-4"
                                    />
                                  </Button>
                                </div>
                              </li>
                            )
                          }
                        )}
                      </ul>

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

          <Card className="shadow-md">
            <CardHeader className="space-y-3">
              <div className="flex items-center gap-2">
                <ListOrdered
                  aria-hidden="true"
                  className="text-primary h-5 w-5"
                />
                <CardTitle className="text-xl font-semibold">Steps</CardTitle>
              </div>
              <CardDescription>
                Break instructions into focused actions so readers can follow
                along easily.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormInfoAlert
                type="info"
                title="Instruction tip"
                desc="Start each step with a verb and keep sentences short for
                  people cooking on smaller screens."
              />

              <FormField name="steps">
                {(stepsField) => {
                  const handleAddStep = () => {
                    const trimmedStep = pendingStep.trim()

                    if (!trimmedStep) {
                      setStepHelper(
                        "Add an instruction before saving the step."
                      )
                      stepInputRef.current?.focus()
                      return
                    }

                    stepsField.pushValue({ id: genId(), step: trimmedStep })
                    setPendingStep("")
                    setStepHelper(null)
                    stepInputRef.current?.focus()
                  }

                  const handleSaveStep = () => {
                    if (!editingStep) return

                    const trimmedStep = editingStep.value.trim()

                    if (!trimmedStep) {
                      setStepHelper("Step text cannot be empty when editing.")
                      return
                    }

                    const current = stepsField.state.value[editingStep.index]

                    if (!current) return

                    stepsField.replaceValue(editingStep.index, {
                      ...current,
                      step: trimmedStep,
                    })

                    setStepHelper(null)
                    setEditingStep(null)
                  }

                  const fieldId = getNameFromPath(stepsField.name)
                  const errorId = getErrorId(stepsField.name)

                  return (
                    <FieldSet
                      className="space-y-5"
                      aria-describedby={
                        stepsField.state.meta.errors?.length
                          ? errorId
                          : undefined
                      }
                    >
                      <FieldLegend className="sr-only">Steps</FieldLegend>
                      <FieldDescription>
                        Use Enter to quickly add each instruction. Steps can be
                        edited inline later.
                      </FieldDescription>

                      <div className="flex flex-col gap-3 sm:flex-row">
                        <Input
                          ref={stepInputRef}
                          value={pendingStep}
                          onChange={(event) =>
                            setPendingStep(event.target.value)
                          }
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              event.preventDefault()
                              handleAddStep()
                            }
                          }}
                          placeholder="Add a step"
                          aria-label="Add recipe step"
                        />
                        <Button
                          type="button"
                          onClick={handleAddStep}
                          variant="outline"
                        >
                          <Plus aria-hidden="true" className="h-4 w-4" />
                          Add step
                        </Button>
                      </div>

                      {stepHelper && <FieldError>{stepHelper}</FieldError>}

                      {stepsField.state.meta.errors?.length ? (
                        <FieldError
                          id={errorId}
                          errors={stepsField.state.meta.errors}
                        />
                      ) : null}

                      <ol
                        className="list-decimal space-y-3 pl-6"
                        aria-live="polite"
                      >
                        {stepsField.state.value.map((step, index) => {
                          if (!step?.id) {
                            return null
                          }

                          const isEditing = editingStep?.id === step.id

                          if (isEditing && editingStep) {
                            return (
                              <li
                                key={step.id}
                                className="border-border/60 bg-background/70 rounded-2xl border p-4 shadow-sm"
                              >
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                  <Input
                                    id={`edit-step-${step.id}`}
                                    value={editingStep.value}
                                    onChange={(event) =>
                                      setEditingStep((previous) =>
                                        previous
                                          ? {
                                              ...previous,
                                              value: event.target.value,
                                            }
                                          : previous
                                      )
                                    }
                                    onKeyDown={(event) => {
                                      if (event.key === "Enter") {
                                        event.preventDefault()
                                        handleSaveStep()
                                      }
                                    }}
                                    aria-label={`Edit step ${index + 1}`}
                                  />
                                  <div className="flex flex-wrap gap-2">
                                    <Button
                                      type="button"
                                      size="sm"
                                      onClick={handleSaveStep}
                                    >
                                      Save changes
                                    </Button>
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => setEditingStep(null)}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      type="button"
                                      variant="destructive"
                                      size="icon-sm"
                                      onClick={() => {
                                        stepsField.removeValue(index)
                                        setEditingStep(null)
                                      }}
                                      aria-label={`Remove step ${index + 1}`}
                                    >
                                      <XIcon
                                        aria-hidden="true"
                                        className="h-4 w-4"
                                      />
                                    </Button>
                                  </div>
                                </div>
                              </li>
                            )
                          }

                          return (
                            <li
                              key={step.id}
                              className="border-border/60 bg-background/70 flex flex-col gap-3 rounded-2xl border p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                            >
                              <span className="text-foreground text-sm sm:text-base">
                                {step.step}
                              </span>
                              <div className="flex flex-wrap gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setEditingStep({
                                      id: step.id,
                                      index,
                                      value: step.step,
                                    })
                                    requestAnimationFrame(() =>
                                      document
                                        .getElementById(`edit-step-${step.id}`)
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
                                  onClick={() => stepsField.removeValue(index)}
                                  aria-label={`Remove step ${index + 1}`}
                                >
                                  <XIcon
                                    aria-hidden="true"
                                    className="h-4 w-4"
                                  />
                                </Button>
                              </div>
                            </li>
                          )
                        })}
                      </ol>
                    </FieldSet>
                  )
                }}
              </FormField>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="space-y-3">
              <div className="flex items-center gap-2">
                <TagIcon aria-hidden="true" className="text-primary h-5 w-5" />
                <CardTitle className="text-xl font-semibold">Tags</CardTitle>
              </div>
              <CardDescription>
                Help people discover your recipe by choosing up to five relevant
                tags.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormInfoAlert
                type="info"
                title="Tagging tip"
                desc="Mix course types (breakfast, dessert) with key ingredients to
                  improve search results."
              />

              <FormField name="tags">
                {(tagsField) => {
                  const handleAddTag = () => {
                    const trimmedTag = pendingTag.trim()

                    if (!trimmedTag) {
                      setTagHelper("Add a tag before continuing.")
                      tagInputRef.current?.focus()
                      return
                    }

                    if (tagsField.state.value.length >= 5) {
                      setTagHelper("You can add up to five tags per recipe.")
                      return
                    }

                    const normalized = trimmedTag.toLowerCase()
                    const alreadyExists = tagsField.state.value.some(
                      (tag) => tag.tag.toLowerCase() === normalized
                    )

                    if (alreadyExists) {
                      setTagHelper("That tag is already added to this recipe.")
                      return
                    }

                    tagsField.pushValue({ id: genId(), tag: trimmedTag })
                    setPendingTag("")
                    setTagHelper(null)
                    tagInputRef.current?.focus()
                  }

                  const handleSaveTag = () => {
                    if (!tagEditState) return
                    const trimmedTag = tagEditState.value.trim()

                    if (!trimmedTag) {
                      setTagHelper("Tag text cannot be empty when editing.")
                      return
                    }

                    const normalized = trimmedTag.toLowerCase()
                    const duplicate = tagsField.state.value.some(
                      (tag, idx) =>
                        idx !== tagEditState.index &&
                        tag.tag.toLowerCase() === normalized
                    )

                    if (duplicate) {
                      setTagHelper("Another tag already uses that text.")
                      return
                    }

                    const current = tagsField.state.value[tagEditState.index]
                    if (!current) return

                    tagsField.replaceValue(tagEditState.index, {
                      ...current,
                      tag: trimmedTag,
                    })

                    setTagHelper(null)
                    setTagEditState(null)
                  }

                  const fieldId = getNameFromPath(tagsField.name)
                  const errorId = getErrorId(tagsField.name)

                  return (
                    <FieldSet
                      className="space-y-5"
                      aria-describedby={
                        tagsField.state.meta.errors?.length
                          ? errorId
                          : undefined
                      }
                    >
                      <FieldLegend className="sr-only">Tags</FieldLegend>
                      <FieldDescription>
                        Press Enter to add tags quickly. Tags appear as badges
                        that you can edit or remove later.
                      </FieldDescription>

                      <div className="flex flex-col gap-3 sm:flex-row">
                        <Input
                          ref={tagInputRef}
                          value={pendingTag}
                          onChange={(event) =>
                            setPendingTag(event.target.value)
                          }
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              event.preventDefault()
                              handleAddTag()
                            }
                          }}
                          placeholder="Add a tag"
                          aria-label="Add recipe tag"
                        />
                        <Button
                          type="button"
                          onClick={handleAddTag}
                          variant="outline"
                        >
                          <Plus aria-hidden="true" className="h-4 w-4" />
                          Add tag
                        </Button>
                      </div>

                      {suggestedTags.length ? (
                        <div className="text-muted-foreground flex flex-wrap gap-2 text-xs">
                          <span className="font-medium">Suggested tags:</span>
                          {suggestedTags.map((tag) => (
                            <Button
                              key={tag.id}
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setPendingTag(tag.tag)}
                            >
                              {tag.tag}
                            </Button>
                          ))}
                        </div>
                      ) : null}

                      {tagHelper && <FieldError>{tagHelper}</FieldError>}

                      {tagsField.state.meta.errors?.length ? (
                        <FieldError
                          id={errorId}
                          errors={tagsField.state.meta.errors}
                        />
                      ) : null}

                      <div
                        className="flex flex-wrap gap-3"
                        role="list"
                        aria-live="polite"
                      >
                        {tagsField.state.value.map((tag, index) => {
                          if (!tag?.id) {
                            return null
                          }

                          const isEditing = tagEditState?.id === tag.id

                          return (
                            <div
                              key={tag.id}
                              role="listitem"
                              className="flex items-center gap-2"
                            >
                              <Popover
                                open={isEditing}
                                onOpenChange={(open) => {
                                  if (open) {
                                    setTagEditState({
                                      id: tag.id,
                                      index,
                                      value: tag.tag,
                                    })
                                  } else {
                                    setTagEditState((previous) =>
                                      previous?.id === tag.id ? null : previous
                                    )
                                  }
                                }}
                              >
                                <PopoverTrigger asChild>
                                  <Badge asChild variant="secondary">
                                    <button
                                      type="button"
                                      className="flex items-center gap-2"
                                      aria-label={`Edit tag ${tag.tag}`}
                                    >
                                      <span>{tag.tag}</span>
                                      <PencilLine
                                        aria-hidden="true"
                                        className="h-3.5 w-3.5"
                                      />
                                    </button>
                                  </Badge>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-64 space-y-3"
                                  align="start"
                                >
                                  <div className="space-y-2">
                                    <Label htmlFor={`edit-tag-${tag.id}`}>
                                      Update tag
                                    </Label>
                                    <Input
                                      id={`edit-tag-${tag.id}`}
                                      value={
                                        tagEditState?.id === tag.id
                                          ? tagEditState.value
                                          : tag.tag
                                      }
                                      onChange={(event) =>
                                        setTagEditState((previous) =>
                                          previous?.id === tag.id
                                            ? {
                                                ...previous,
                                                value: event.target.value,
                                              }
                                            : previous
                                        )
                                      }
                                      onKeyDown={(event) => {
                                        if (event.key === "Enter") {
                                          event.preventDefault()
                                          handleSaveTag()
                                        }
                                      }}
                                    />
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    <Button
                                      type="button"
                                      size="sm"
                                      onClick={handleSaveTag}
                                    >
                                      Save
                                    </Button>
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => setTagEditState(null)}
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </PopoverContent>
                              </Popover>
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon-sm"
                                onClick={() => {
                                  tagsField.removeValue(index)
                                  if (tagEditState?.id === tag.id) {
                                    setTagEditState(null)
                                  }
                                }}
                                aria-label={`Remove tag ${tag.tag}`}
                              >
                                <XIcon aria-hidden="true" className="h-4 w-4" />
                              </Button>
                            </div>
                          )
                        })}
                      </div>
                    </FieldSet>
                  )
                }}
              </FormField>
            </CardContent>
          </Card>

          {nameForImage && (
            <Card className="shadow-md">
              <CardHeader className="space-y-3">
                <CardTitle className="text-xl font-semibold">
                  Feature image
                </CardTitle>
                <CardDescription>
                  Upload an optional photo to showcase your recipe. You can skip
                  this step and add one later.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileInput
                  onFileChange={handleImageUpload}
                  isUploading={isUploading}
                  className="border-primary/30 bg-muted/40 rounded-xl border border-dashed px-4 py-6"
                  type="recipe"
                />
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="border-primary/20 bg-primary/5 shadow-md">
            <CardHeader className="space-y-2">
              <CardTitle className="text-lg font-semibold">
                Submission checklist
              </CardTitle>
              <CardDescription>
                Quick reminders before you publish.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-3 text-sm">
              <ul className="grid list-disc gap-2 pl-5">
                <li>Double-check spelling and measurements for clarity.</li>
                <li>
                  Group ingredients by component (batter, frosting) if your dish
                  has multiple parts.
                </li>
                <li>
                  Preview the generated slug from your title to ensure it reads
                  well.
                </li>
                <li>
                  Add an image after submitting to make the recipe stand out in
                  search results.
                </li>
              </ul>
              <FormInfoAlert
                type="pause"
                title="Need to pause?"
                desc="Your recipe saves to your profile once submitted, so you can
                  return and continue editing any time."
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="border-border/60 bg-background/80 flex flex-col gap-4 rounded-2xl border border-dashed p-6 sm:flex-row sm:items-center sm:justify-between">
        <Typography variant="muted" className="text-muted-foreground text-sm">
          Submit now and you will be redirected to your published recipe for a
          final review.
        </Typography>
        <Button
          type="submit"
          size="lg"
          className="w-full sm:w-auto"
          disabled={!form.state.canSubmit || form.state.isSubmitting}
        >
          {form.state.isSubmitting ? (
            <>
              <Spinner />
              Submitting...
            </>
          ) : (
            "Publish"
          )}
        </Button>
      </div>

      {formError && (
        <ErrorDisplay error={formError} title="Heads up">
          {!imgURL && (
            <div className="flex flex-wrap gap-3 pt-3">
              <Button
                type="button"
                onClick={() => {
                  setFormError(null)
                  setIsConfirmed(true)
                }}
              >
                Continue without image
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setFormError(null)}
              >
                Cancel
              </Button>
            </div>
          )}
        </ErrorDisplay>
      )}
    </form>
  )
}
