"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import { Beef, ListOrdered } from "lucide-react"
import { useForm, useStore } from "@tanstack/react-form"

import { FormCombobox } from "@/app/recipes/add/form-combobox"
import { FileInput } from "@/app/recipes/add/image-upload"
import { useRecipes } from "@/hooks/useRecipes"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
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
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { Typography } from "@/components/ui/typography"
import { createClient } from "@/supabase/client"
import { maxAmount, minAmount } from "@/lib/constants"
import { cn, genId, toSlug } from "@/lib/utils"
import { AddRecipeFormValues, RecipeFormSchema } from "@/lib/zod/schema"

type AddRecipeFormProps = {
  className: string
  user: User | null
}

const getNameFromPath = (name: unknown) =>
  String(name)
    .replace(/\./g, "-")
    .replace(/\[/g, "-")
    .replace(/\]/g, "")

const getErrorId = (name: unknown) => `error-${getNameFromPath(name)}`

export function AddRecipeForm({ className, user }: AddRecipeFormProps) {
  const supabase = createClient()
  const router = useRouter()

  const { tags, units, error: recipeError, isLoading } = useRecipes()

  const [imgURL, setImgURL] = useState("")
  const [formError, setFormError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)

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
          "You haven't selected an image, are you sure you want to continue? (you can still upload one later)"
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
            : "An error occurred while submitting the recipe"
        )
      }
    },
  })

  const FormField = form.Field

  const recipeNameValue = useStore(form.store, (state) => state.values.recipe_name)
  const recipeNameMeta = useStore(
    form.store,
    (state) => state.fieldMeta.recipe_name
  )
  const nameForImage =
    recipeNameValue.trim().length > 0 && (recipeNameMeta?.errors?.length ?? 0) === 0

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

  if (isLoading) return <Spinner size="xl" />
  if (recipeError)
    return (
      <Typography variant="error">
        An error occurred: {recipeError.message}
      </Typography>
    )

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        void form.handleSubmit()
      }}
      className={cn("rounded-lg bg-muted md:p-6", className)}
    >
      <FieldSet className="gap-4">
        <FormField
          name="recipe_name"
          children={(field) => {
            const fieldId = getNameFromPath(field.name)
            const errorId = getErrorId(field.name)
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            const recipeName = field.state.value as string

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={fieldId}>Recipe Name</FieldLabel>
                <FieldContent>
                  <Input
                    id={fieldId}
                    value={recipeName}
                    onChange={(event) => field.handleChange(event.target.value)}
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
        />

        <FormField
          name="quote"
          children={(field) => {
            const fieldId = getNameFromPath(field.name)
            const errorId = getErrorId(field.name)
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            const quoteValue = field.state.value as string

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={fieldId}>Quote</FieldLabel>
                <FieldContent>
                  <Input
                    id={fieldId}
                    value={quoteValue}
                    onChange={(event) => field.handleChange(event.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Enter a quote"
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
        />
      </FieldSet>

      <Separator className="my-4 h-1 rounded-lg bg-muted-foreground" />

      <Alert>
        <Beef />
        <AlertTitle className="text-lg font-bold">Ingredient</AlertTitle>
        <AlertDescription>
          Adjust your numerical amount, select your unit type and add the name
          of the ingredient.
        </AlertDescription>
      </Alert>

      <FormField
        name="ingredients"
        children={(ingredientsField) => (
          <FieldSet className="gap-4">
            <FieldLegend>Ingredients</FieldLegend>
            {ingredientsField.state.value.map((ingredient, index) => {
              const ingredientKey = ingredient.id || index

              return (
                <div
                  key={ingredientKey}
                  className="flex flex-col gap-3 lg:flex-row lg:items-end"
                >
                  <FormField
                    name={`ingredients[${index}].amount`}
                    children={(field) => {
                      const fieldId = getNameFromPath(field.name)
                      const errorId = getErrorId(field.name)
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid
                      const numericValue = field.state.value as number | undefined

                      return (
                        <Field data-invalid={isInvalid} className="lg:w-28">
                          <FieldLabel htmlFor={fieldId}>Amount</FieldLabel>
                          <FieldContent>
                            <Input
                              id={fieldId}
                              type="number"
                              min={minAmount}
                              max={maxAmount}
                              step={0.1}
                              value={numericValue ?? ""}
                              onChange={(event) => {
                                const value = event.target.value
                                field.handleChange(
                                  value === ""
                                    ? (undefined as unknown as number)
                                    : Number(value)
                                )
                              }}
                              onBlur={field.handleBlur}
                              placeholder="0"
                              aria-invalid={isInvalid}
                              aria-describedby={
                                isInvalid ? errorId : undefined
                              }
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
                  />

                  <FormField
                    name={`ingredients[${index}].unitMeasurement`}
                    children={(field) => {
                      const fieldId = getNameFromPath(field.name)
                      const errorId = getErrorId(field.name)
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid
                      const unitValue = field.state.value as string | undefined

                      return (
                        <Field data-invalid={isInvalid} className="lg:w-48">
                          <FieldLabel htmlFor={fieldId}>Unit</FieldLabel>
                          <FieldContent>
                            <FormCombobox
                              id={fieldId}
                              className="w-full"
                              value={unitValue}
                              onSelect={(selection) => {
                                if (typeof selection === "string") {
                                  field.handleChange(selection)
                                }
                              }}
                              items={units || []}
                              placeholder="Select unit"
                              disabled={!units?.length}
                              ariaInvalid={isInvalid}
                              ariaDescribedBy={
                                isInvalid ? errorId : undefined
                              }
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
                  />

                  <FormField
                    name={`ingredients[${index}].ingredient`}
                    children={(field) => {
                      const fieldId = getNameFromPath(field.name)
                      const errorId = getErrorId(field.name)
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid
                      const ingredientValue = field.state.value as string | undefined

                      return (
                        <Field data-invalid={isInvalid} className="flex-1">
                          <FieldLabel htmlFor={fieldId}>Ingredient</FieldLabel>
                          <FieldContent>
                            <Input
                              id={fieldId}
                              value={ingredientValue ?? ""}
                              onChange={(event) =>
                                field.handleChange(event.target.value)
                              }
                              onBlur={field.handleBlur}
                              placeholder="Ingredient"
                              aria-invalid={isInvalid}
                              aria-describedby={
                                isInvalid ? errorId : undefined
                              }
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
                  />

                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => ingredientsField.removeValue(index)}
                    disabled={ingredientsField.state.value.length === 1}
                  >
                    Delete
                  </Button>
                </div>
              )
            })}
            <Button
              type="button"
              onClick={() =>
                ingredientsField.pushValue({
                  id: genId(),
                  amount: 0,
                  unitMeasurement: "",
                  ingredient: "",
                })
              }
            >
              Add Ingredient
            </Button>
          </FieldSet>
        )}
      />

      <Separator className="my-4 h-1 rounded-lg bg-muted-foreground" />

      <Alert>
        <ListOrdered />
        <AlertTitle className="text-lg font-bold">Steps</AlertTitle>
        <AlertDescription>
          Add your recipe's instructions here. Try to break your steps up into
          clear, concise parts - line by line.
        </AlertDescription>
      </Alert>

      <FormField
        name="steps"
        children={(stepsField) => (
          <FieldSet className="gap-4">
            <FieldLegend>Steps</FieldLegend>
            <FieldDescription>
              Add your recipe's instructions here. Try to break your steps up
              into clear, concise parts - line by line.
            </FieldDescription>
            {stepsField.state.value.map((step, index) => {
              const stepKey = step.id || index

              return (
                <div
                  key={stepKey}
                  className="flex flex-col gap-3 lg:flex-row lg:items-end"
                >
                  <FormField name={`steps[${index}].step`}>
                    {(field) => {
                      const fieldId = getNameFromPath(field.name)
                      const errorId = getErrorId(field.name)
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid
                      const stepValue = field.state.value as string | undefined

                      return (
                        <Field data-invalid={isInvalid} className="flex-1">
                          <FieldLabel htmlFor={fieldId}>{`Step ${
                            index + 1
                          }`}</FieldLabel>
                          <FieldContent>
                            <Input
                              id={fieldId}
                              value={stepValue ?? ""}
                              onChange={(event) =>
                                field.handleChange(event.target.value)
                              }
                              onBlur={field.handleBlur}
                              placeholder="Describe the step"
                              aria-invalid={isInvalid}
                              aria-describedby={
                                isInvalid ? errorId : undefined
                              }
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
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => stepsField.removeValue(index)}
                    disabled={stepsField.state.value.length === 1}
                  >
                    Delete
                  </Button>
                </div>
              )
            })}
            <Button
              type="button"
              onClick={() => stepsField.pushValue({ id: genId(), step: "" })}
            >
              Add Step
            </Button>
          </FieldSet>
        )}
      />

      <Separator className="my-4 h-1 rounded-lg bg-muted-foreground" />

      <FormField
        name="tags"
        children={(tagsField) => (
          <FieldSet className="gap-4">
            <FieldLegend>Tags</FieldLegend>
            <FieldDescription>
              Select from existing tags or add your own. This will help with
              searching and organizing recipes. Nobody likes a messy kitchen.
            </FieldDescription>
            {tagsField.state.value.map((tag, index) => {
              const tagKey = tag.id || index

              return (
                <div
                  key={tagKey}
                  className="flex flex-col gap-3 lg:flex-row lg:items-end"
                >
                  <FormField name={`tags[${index}].tag`}>
                    {(field) => {
                      const fieldId = getNameFromPath(field.name)
                      const errorId = getErrorId(field.name)
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid
                      const tagValue = field.state.value as string | undefined

                      return (
                        <Field data-invalid={isInvalid} className="lg:w-56">
                          <FieldLabel htmlFor={fieldId}>Tag</FieldLabel>
                          <FieldContent>
                            <FormCombobox
                              id={fieldId}
                              className="w-full"
                              value={tagValue}
                              onSelect={(selection) => {
                                if (typeof selection === "string") {
                                  field.handleChange(selection)
                                  tagsField.replaceValue(index, {
                                    ...tagsField.state.value[index],
                                    tag: selection,
                                  })
                                } else {
                                  const resolvedId =
                                    selection.id || tag.id || genId()
                                  field.handleChange(selection.tag)
                                  tagsField.replaceValue(index, {
                                    id: resolvedId,
                                    tag: selection.tag,
                                  })
                                }
                                field.handleBlur()
                              }}
                              items={tags || []}
                              placeholder="Select tag"
                              disabled={!tags?.length}
                              ariaInvalid={isInvalid}
                              ariaDescribedBy={isInvalid ? errorId : undefined}
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

                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => tagsField.removeValue(index)}
                    disabled={tagsField.state.value.length === 1}
                  >
                    Delete
                  </Button>
                </div>
              )
            })}
            <Button
              type="button"
              onClick={() => tagsField.pushValue({ id: genId(), tag: "" })}
              className={cn(
                tagsField.state.value.length >= 5 && "hover:cursor-not-allowed"
              )}
              disabled={tagsField.state.value.length >= 5}
            >
              Add Tag
            </Button>
          </FieldSet>
        )}
      />

      {nameForImage && (
        <FileInput
          onFileChange={handleImageUpload}
          isUploading={isUploading}
          className={cn(
            "mt-4 rounded-md border border-border px-2 py-4",
            recipeError && "border-destructive"
          )}
          type="recipe"
        />
      )}

      <Button
        type="submit"
        className="mt-4"
        disabled={!form.state.canSubmit || form.state.isSubmitting}
      >
        {form.state.isSubmitting ? "Submitting..." : "Submit"}
      </Button>

      {formError && (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{formError}</AlertDescription>
          {!imgURL && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setFormError(null)
                setIsConfirmed(true)
              }}
            >
              Continue
            </Button>
          )}
        </Alert>
      )}
    </form>
  )
}
