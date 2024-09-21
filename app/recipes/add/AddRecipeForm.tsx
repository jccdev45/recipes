"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/supabase/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { User } from "@supabase/supabase-js"
import { Beef, ListOrdered } from "lucide-react"
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form"
import * as z from "zod"

import { maxAmount, minAmount } from "@/lib/constants"
import { cn, genId, toSlug } from "@/lib/utils"
import { AddRecipeFormValues, RecipeFormSchema } from "@/lib/zod/schema"
import useUniqueTags from "@/hooks/useTags"
import useUnits from "@/hooks/useUnits"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { FormCombobox } from "@/app/recipes/add/form-combobox"

import { FileInput } from "./ImageUpload"

type AddRecipeFormProps = {
  className: string
  user: User | null
}

export function AddRecipeForm({ className, user }: AddRecipeFormProps) {
  const supabase = createClient()
  const router = useRouter()

  // NOTE: React Query hooks
  const {
    data: uniqueTags,
    isLoading: tagLoading,
    error: tagError,
  } = useUniqueTags()
  const { data: units, isLoading: unitLoading, error: unitError } = useUnits()

  // Form state
  const [imgURL, setImgURL] = useState("")
  const [recipeError, setRecipeError] = useState("")
  const [uploadError, setUploadError] = useState("")
  const [formError, setFormError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)

  // Form setup
  const form = useForm<z.infer<typeof RecipeFormSchema>>({
    resolver: zodResolver(RecipeFormSchema),
    defaultValues: {
      recipe_name: "",
      quote: "",
      ingredients: [
        { id: genId(), amount: 0, unitMeasurement: "", ingredient: "" },
      ],
      steps: [{ id: genId(), step: "" }],
      tags: [{ id: genId(), tag: "" }],
    },
    mode: "onChange",
  })

  const {
    register,
    control,
    formState: { isValid, errors, isDirty },
    reset,
    getValues,
  } = form

  // Field arrays
  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({ name: "ingredients", control })
  const {
    fields: stepFields,
    append: appendStep,
    remove: removeStep,
  } = useFieldArray({ name: "steps", control })
  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
  } = useFieldArray({ name: "tags", control })

  // Helper functions
  const updateUnits = (
    index: number,
    ingredient: AddRecipeFormValues["ingredients"][number]
  ) => {
    form.setValue(`ingredients.${index}`, ingredient, { shouldValidate: true })
  }

  const updateTags = (index: number, tag: { id?: string; tag: string }) => {
    form.setValue(
      `tags.${index}`,
      { id: tag.id || genId(), tag: tag.tag },
      { shouldValidate: true }
    )
  }

  const handleImageUpload = async (file: File | null) => {
    const fileExt = file?.name.split(".").pop()
    const filePath = `recipes/${form.getValues("recipe_name")}/${Math.random()}.${fileExt}`

    if (file) {
      setIsUploading(true)
      const { data, error } = await supabase.storage
        .from("photos")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        })

      if (error) {
        setFormError(error.message)
      } else {
        setImgURL(data.path)
        setFormError(null)
      }
      setIsUploading(false)
    } else {
      setFormError("No file selected")
    }
  }

  const isSubmittable = !!isDirty && !!isValid

  const onSubmit: SubmitHandler<AddRecipeFormValues> = async (values, e) => {
    e?.preventDefault()
    setFormError(null) // Clear any previous errors

    if (!imgURL && !isConfirmed) {
      setFormError(
        "You haven't selected an image, are you sure you want to continue? (you can still upload one later)"
      )
      return
    }

    const updatedValues = {
      ...values,
      author: user?.user_metadata.first_name || "Anonymous User",
      user_id: user?.id,
      slug: toSlug(values.recipe_name),
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

      reset()
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
  }

  const nameForImage =
    !errors.recipe_name && getValues("recipe_name").length > 0

  // Render logic
  if (tagLoading || unitLoading) return <div>Loading...</div>
  if (tagError || unitError)
    return (
      <div>An error occurred: {tagError?.message || unitError?.message}</div>
    )

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(`rounded-lg bg-muted md:p-6`, className)}
      >
        <div className="grid grid-cols-1 col-span-1 gap-2 lg:grid-cols-2">
          {/* Recipe Name */}
          <FormField
            control={control}
            name="recipe_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recipe Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter recipe name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Quote */}
          <FormField
            control={control}
            name="quote"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quote</FormLabel>
                <FormControl>
                  <Input placeholder="Enter a quote" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator className="h-1 my-2 rounded-lg bg-muted-foreground" />

        <Alert>
          <Beef />
          <AlertTitle className="text-lg font-bold">Ingredient</AlertTitle>
          <AlertDescription>
            Adjust your numerical amount, select your unit type and add the name
            of the ingredient.
          </AlertDescription>
        </Alert>

        {/* Ingredients */}
        <div>
          <FormLabel>Ingredients</FormLabel>
          {ingredientFields.map((field, index) => (
            <div key={field.id} className="flex items-center space-x-2">
              <Input
                type="number"
                placeholder="Amount"
                {...register(`ingredients.${index}.amount` as const, {
                  valueAsNumber: true,
                  min: minAmount,
                  max: maxAmount,
                })}
              />
              <Controller
                name={`ingredients.${index}.unitMeasurement`}
                control={control}
                render={({ field }) => (
                  <FormCombobox<
                    AddRecipeFormValues,
                    `ingredients.${number}.unitMeasurement`
                  >
                    className="w-[180px]"
                    field={field}
                    index={index}
                    update={(index, value) => {
                      if (typeof value === "string") {
                        updateUnits(index, {
                          ...form.getValues(`ingredients.${index}`),
                          unitMeasurement: value,
                        })
                      }
                    }}
                    items={units || []}
                    placeholder="Select unit"
                  />
                )}
              />
              <Input
                placeholder="Ingredient"
                {...register(`ingredients.${index}.ingredient` as const)}
              />
              <Button
                type="button"
                onClick={() => removeIngredient(index)}
                disabled={ingredientFields.length === 1}
              >
                Delete
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={() =>
              appendIngredient({
                id: genId(),
                amount: 0,
                unitMeasurement: "",
                ingredient: "",
              })
            }
          >
            Add Ingredient
          </Button>
        </div>

        <Separator className="h-1 my-2 rounded-lg bg-muted-foreground" />

        <Alert>
          <ListOrdered />
          <AlertTitle className="text-lg font-bold">Steps</AlertTitle>
          <AlertDescription>
            Add your recipe's instructions here. Try to break your steps up into
            clear, concise parts - line by line.
          </AlertDescription>
        </Alert>

        {/* Steps */}
        <div>
          <FormLabel>Steps</FormLabel>
          <p className="text-sm text-muted-foreground">
            Add your recipe's instructions here. Try to break your steps up into
            clear, concise parts - line by line.
          </p>
          {stepFields.map((field, index) => (
            <div key={field.id} className="flex items-center mt-2 space-x-2">
              <Input
                placeholder="Step"
                {...register(`steps.${index}.step` as const)}
              />
              <Button
                type="button"
                onClick={() => removeStep(index)}
                disabled={stepFields.length === 1}
              >
                Delete
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={() => appendStep({ id: genId(), step: "" })}
            className="mt-2"
          >
            Add Step
          </Button>
        </div>

        {/* Tags */}
        <div>
          <FormLabel>Tags</FormLabel>
          <p className="text-sm text-muted-foreground">
            Select from existing tags or add your own. This will help with
            searching and organizing recipes. Nobody likes a messy kitchen.
          </p>
          {tagFields.map((field, index) => (
            <div key={field.id} className="flex items-center mt-2 space-x-2">
              <Controller
                name={`tags.${index}.tag`}
                control={control}
                render={({ field }) => (
                  <FormCombobox<AddRecipeFormValues, `tags.${number}.tag`>
                    className="w-[180px]"
                    field={field}
                    index={index}
                    update={(index, value) => {
                      if (typeof value === "object" && "tag" in value) {
                        updateTags(index, value)
                      }
                    }}
                    items={uniqueTags || []}
                    placeholder="Select tag"
                  />
                )}
              />
              <Button
                type="button"
                onClick={() => removeTag(index)}
                disabled={tagFields.length === 1}
              >
                Delete
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={() => appendTag({ id: genId(), tag: "" })}
            className={cn(
              "mt-2",
              tagFields.length >= 5 && "hover:cursor-not-allowed"
            )}
            disabled={tagFields.length >= 5}
          >
            Add Tag
          </Button>
        </div>

        {/* Image Upload */}
        {nameForImage && (
          <FileInput
            onFileChange={handleImageUpload}
            className={cn(
              `rounded-md border border-border px-2 py-4`,
              recipeError && `border-destructive`
            )}
            type="recipe"
          />
        )}

        {/* Submit Button */}
        <Button type="submit" disabled={!isSubmittable}>
          Submit
        </Button>

        {/* Error Messages */}
        {formError && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{formError}</AlertDescription>
            {!imgURL && (
              <Button
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
    </Form>
  )
}
