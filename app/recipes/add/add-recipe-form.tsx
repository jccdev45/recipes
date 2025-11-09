"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/supabase/client"

import { cn, toSlug } from "@/lib/utils"
import { RecipeFormSchema } from "@/lib/zod/schema"
import { useRecipes } from "@/hooks/useRecipes"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Typography } from "@/components/ui/typography"
import { ErrorDisplay } from "@/components/error/error-display"

import {
  createAddRecipeDefaultValues,
  useAddRecipeForm,
} from "./add-recipe-form.hook"
import { FeatureImageSection } from "./sections/feature-image-section"
import { IngredientsSection } from "./sections/ingredients-section"
import { RecipeBasicsSection } from "./sections/recipe-basics-section"
import { StepsSection } from "./sections/steps-section"
import { SubmissionChecklist } from "./sections/submission-checklist"
import { SubmitActions } from "./sections/submit-actions"
import { TagsSection } from "./sections/tags-section"
import type { User } from "@supabase/supabase-js"
import type { SuggestedTag } from "./sections/tags-section"

type AddRecipeFormProps = {
  className: string
  user: User | null
}

export function AddRecipeForm({ className, user }: AddRecipeFormProps) {
  const supabase = createClient()
  const router = useRouter()

  const { tags, units, error: recipeError, isLoading } = useRecipes()

  const [imgURL, setImgURL] = useState("")
  const [formError, setFormError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)

  const form = useAddRecipeForm({
    defaultValues: createAddRecipeDefaultValues(),
    validators: {
      onChange: RecipeFormSchema,
      onSubmit: RecipeFormSchema,
    },
    onSubmit: async ({ value, formApi }) => {
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

        formApi.reset(createAddRecipeDefaultValues())
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

  const normalizedUnits = useMemo(
    () => units?.filter((unit) => unit && unit.trim().length > 0) ?? [],
    [units]
  )

  const suggestedTags = useMemo<SuggestedTag[]>(
    () => (tags?.slice(0, 8) ?? []) as SuggestedTag[],
    [tags]
  )

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
      <ErrorDisplay
        title="We could not load the form"
        error={recipeError.message}
      />
    )
  }

  return (
    <form.AppForm>
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
          <Typography
            variant="muted"
            className="text-muted-foreground text-base"
          >
            Build each section with the guidance below. You can update anything
            after publishing.
          </Typography>
        </div>

        <div className="grid gap-8">
          <div className="space-y-6">
            <SubmissionChecklist />
            <RecipeBasicsSection form={form} />
            <IngredientsSection form={form} normalizedUnits={normalizedUnits} />
            <StepsSection form={form} />
            <TagsSection form={form} suggestedTags={suggestedTags} />
            <FeatureImageSection
              form={form}
              isUploading={isUploading}
              onFileChange={handleImageUpload}
            />
          </div>
        </div>

        <SubmitActions form={form} />

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
    </form.AppForm>
  )
}
