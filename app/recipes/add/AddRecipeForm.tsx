"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/supabase/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { User } from "@supabase/supabase-js"
import { Plus } from "lucide-react"
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
  UseFormProps,
} from "react-hook-form"
import * as z from "zod"

import { maxAmount, minAmount } from "@/lib/constants"
import { cn, genId, toSlug } from "@/lib/utils"
import { AddRecipeFormValues, RecipeFormSchema } from "@/lib/zod/schema"
import useUniqueTags from "@/hooks/useTags"
import useUnits from "@/hooks/useUnits"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { TagCombobox } from "@/app/recipes/add/TagCombobox"

import { FileInput } from "./ImageUpload"

function useZodForm<TSchema extends z.ZodType>(
  props: Omit<UseFormProps<TSchema["_input"]>, "resolver"> & {
    schema: TSchema
  }
) {
  const form = useForm<TSchema["_input"]>({
    ...props,
    resolver: zodResolver(props.schema, undefined, {
      raw: true,
    }),
  })

  return form
}

type AddRecipeFormProps = {
  className: string
  user: User | null
}

export function AddRecipeForm({ className, user }: AddRecipeFormProps) {
  const supabase = createClient()
  const router = useRouter()
  const { uniqueTags, isLoading, error } = useUniqueTags()
  const { units, loading } = useUnits()

  const [imgURL, setImgURL] = useState("")
  const [recipeError, setRecipeError] = useState("")
  const [uploadError, setUploadError] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)

  const form = useZodForm({
    schema: RecipeFormSchema,
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
    handleSubmit,
    register,
    control,
    formState: { isValid, errors, isValidating, isDirty },
    reset,
  } = form

  const ingFieldArray = useFieldArray({
    name: "ingredients",
    control,
  })
  const stepFieldArray = useFieldArray({
    name: "steps",
    control,
  })
  const tagFieldArray = useFieldArray({
    name: "tags",
    control,
  })

  const update = (index: number, obj: { id: string; tag: string }) => {
    tagFieldArray.update(index, obj)
  }

  const handleImageUpload = async (file: File | null) => {
    const fileExt = file?.name.split(".").pop()
    const filePath = `recipes/${form.getValues(
      "recipe_name"
    )}/${Math.random()}.${fileExt}`

    if (file) {
      const { data, error } = await supabase.storage
        .from("photos")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        })

      if (error) {
        setUploadError(error.message)
      } else {
        setImgURL(data.path)
        setIsUploading(false)
        setUploadError("")
      }
    } else {
      setUploadError("No file selected")
    }
  }

  const isSubmittable = !!isDirty && !!isValid

  const onSubmit: SubmitHandler<AddRecipeFormValues> = async (
    values: AddRecipeFormValues,
    e
  ) => {
    e?.preventDefault()

    if (!imgURL && !isConfirmed) {
      setRecipeError(
        "You haven't selected an image, are you sure you want to continue? (you can still upload one later)"
      )
      return
    } else {
      const updatedValues = {
        ...values,
        author: user?.user_metadata.first_name,
        user_id: user?.id,
        slug: toSlug(values.recipe_name),
        img:
          imgURL.length > 0
            ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos/${imgURL}`
            : "http://loremflickr.com/g/500/500/food",
      }

      const { data, error } = await supabase
        .from("recipes")
        .insert(updatedValues)
        .select()

      if (!error) {
        reset()
        router.push(`/recipes/${data?.[0].slug}`)
        router.refresh()
      }
    }
  }

  const nameForImage =
    !errors.recipe_name && form.getValues("recipe_name").length > 0

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          `gap-y-6 rounded-lg bg-background dark:bg-stone-900 md:p-6`,
          className
        )}
      >
        <div className="col-span-1 grid grid-cols-1 lg:grid-cols-2">
          <FormField
            control={control}
            name="recipe_name"
            render={({ field }) => (
              <FormItem className="col-span-2 w-full lg:col-span-1">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Chicken Parm"
                    {...field}
                    className="w-full border border-border"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="quote"
            render={({ field }) => (
              <FormItem className="col-span-2 w-full lg:col-span-1">
                <FormLabel>Quote</FormLabel>
                <FormControl>
                  <Input
                    placeholder="From my plate to yours"
                    {...field}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator className="col-span-1 my-2 h-1 rounded-lg" />

        <div className="col-span-1 space-y-6">
          <div>
            {ingFieldArray.fields.map((feeld, index) => {
              return (
                <div className="flex items-center gap-y-4" key={feeld?.id}>
                  <div className="grid w-full grid-cols-4 items-end gap-2 lg:grid-cols-8">
                    {/* NOTE: AMOUNT */}
                    <Controller
                      control={control}
                      name={`ingredients.${index}.amount`}
                      render={({ field }) => (
                        <FormItem className="col-span-1 lg:col-span-1">
                          <FormLabel
                            className={index === 0 ? `block` : `hidden`}
                          >
                            Amount
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step={0.1}
                              min={minAmount}
                              max={maxAmount}
                              placeholder="0.0"
                              className="col-span-1 border border-border p-2"
                              {...field}
                              {...register(
                                `ingredients.${index}.amount` as const,
                                {
                                  valueAsNumber: true,
                                }
                              )}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* NOTE: UNIT */}
                    <Controller
                      control={control}
                      name={`ingredients.${index}.unitMeasurement`}
                      // {({ field: { onChange, onBlur, value, ref }, formState, fieldState })
                      render={({ field }) => (
                        <FormItem className="col-span-3 lg:col-span-2">
                          <FormLabel
                            className={index === 0 ? `block` : `hidden`}
                          >
                            Unit Measurement
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a measurement" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {units.map((unit) => (
                                <SelectItem key={unit} value={unit}>
                                  {unit}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* NOTE: ING */}
                    <Controller
                      control={control}
                      name={`ingredients.${index}.ingredient`}
                      render={({ field }) => (
                        <FormItem className="col-span-3 lg:col-span-4">
                          <FormLabel
                            className={index === 0 ? `block` : `hidden`}
                          >
                            Ingredient
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="sugar"
                              className="col-span-1 border border-border p-2"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="button"
                      variant="destructive"
                      className={cn(
                        `col-span-1`,
                        ingFieldArray.fields.length === 1 &&
                          `cursor-not-allowed`
                      )}
                      onClick={() => ingFieldArray.remove(index)}
                      disabled={ingFieldArray.fields.length === 1}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              )
            })}
            <Button
              type="button"
              className="mx-auto my-4"
              onClick={() =>
                ingFieldArray.append({
                  id: genId(),
                  ingredient: "",
                  amount: 0,
                  unitMeasurement: "",
                })
              }
            >
              <Plus />
              Add Ingredient
            </Button>
          </div>

          <Separator className="my-2 h-1 rounded-lg" />

          {/* NOTE: STEPS FIELD ARRAY */}
          <div>
            {stepFieldArray.fields.map((feeld, index) => {
              return (
                <div className="flex items-center gap-y-4" key={feeld?.id}>
                  <div className="grid w-full grid-cols-1 items-end lg:grid-cols-8 lg:gap-x-2">
                    <Controller
                      control={control}
                      name={`steps.${index}.step`}
                      render={({ field }) => (
                        <FormItem className="col-span-3 lg:col-span-7">
                          <FormLabel
                            className={index === 0 ? `block` : `hidden`}
                          >
                            Recipe Steps
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Boil water, eat it"
                              className="border border-border p-2"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="button"
                      variant="destructive"
                      className={cn(
                        `col-span-1 ml-auto w-1/4 lg:w-full`,
                        stepFieldArray.fields.length === 1 &&
                          `cursor-not-allowed`
                      )}
                      onClick={() => stepFieldArray.remove(index)}
                      disabled={stepFieldArray.fields.length === 1}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              )
            })}
            <Button
              type="button"
              className="mx-auto my-4"
              onClick={() =>
                stepFieldArray.append({
                  id: genId(),
                  step: "",
                })
              }
            >
              <Plus />
              Add Step
            </Button>
          </div>

          <Separator className="my-2 h-1 rounded-lg" />

          {/* NOTE: TAGS FIELD ARRAY */}
          <div>
            {tagFieldArray.fields.map((feeld, index) => {
              return (
                <div className="flex items-center gap-y-4" key={feeld?.id}>
                  <div className="grid w-full grid-cols-1 items-end lg:w-2/3 lg:grid-cols-7 lg:gap-x-2">
                    <Controller
                      control={control}
                      name={`tags.${index}.tag`}
                      render={({ field }) => (
                        <FormItem className="col-span-6">
                          <FormLabel
                            className={index === 0 ? `block` : `hidden`}
                          >
                            Tags
                          </FormLabel>
                          <TagCombobox
                            uniqueTags={uniqueTags}
                            className="mx-auto w-full"
                            field={field}
                            form={form}
                            update={update}
                            index={index}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="button"
                      variant="destructive"
                      className={cn(
                        `col-span-1 ml-auto w-1/4 lg:w-full`,
                        tagFieldArray.fields.length === 1 &&
                          `cursor-not-allowed`
                      )}
                      onClick={() => tagFieldArray.remove(index)}
                      disabled={tagFieldArray.fields.length === 1}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              )
            })}
            <Button
              type="button"
              className={cn(
                `col-span-1 my-4`,
                tagFieldArray.fields.length >= 5 && `hover:cursor-not-allowed`
              )}
              onClick={() =>
                tagFieldArray.append({
                  id: genId(),
                  tag: "",
                })
              }
              disabled={tagFieldArray.fields.length >= 5}
            >
              <Plus />
              Add Tag
            </Button>
          </div>

          {nameForImage && (
            <>
              <FileInput
                onFileChange={handleImageUpload}
                className={cn(
                  `rounded-md border border-border px-2 py-4`,
                  recipeError && `border-destructive`
                )}
                type="recipe"
              />
              {uploadError && <p className="text-destructive">{uploadError}</p>}
              {recipeError && (
                <p className="text-destructive">
                  {recipeError}
                  <Button
                    className="mx-4"
                    variant="default"
                    onClick={() => {
                      setRecipeError("")
                      setIsConfirmed(true)
                    }}
                  >
                    Continue
                  </Button>
                </p>
              )}
            </>
          )}
        </div>

        <Button
          type="submit"
          disabled={!isSubmittable}
          className={cn(
            `ml-auto w-1/4 md:w-1/5`,
            !isSubmittable && `cursor-not-allowed`
          )}
        >
          Submit
        </Button>
      </form>
    </Form>
  )
}
