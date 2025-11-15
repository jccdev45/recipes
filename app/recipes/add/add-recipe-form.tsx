"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/supabase/client"

import { cn, toSlug } from "@/lib/utils"
import { RecipeFormSchema } from "@/lib/zod/schema"
import { useSupabaseUpload } from "@/hooks/use-supabase-upload"
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
  const [isConfirmed, setIsConfirmed] = useState(false)

  const ensureUniqueSlug = async (baseSlug: string) => {
    let attempt = 0
    let candidate = baseSlug

    while (attempt < 20) {
      const { count, error } = await supabase
        .from("recipes")
        .select("slug", { count: "exact", head: true })
        .eq("slug", candidate)

      if (error && error.code !== "PGRST116") {
        throw error
      }

      if (!count || count === 0) {
        return candidate
      }

      attempt += 1
      candidate = `${baseSlug}-${attempt}`
    }

    throw new Error(
      "We could not generate a unique URL for this recipe. Try a different name."
    )
  }

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

      if (value.ingredients.length === 0 || value.steps.length === 0) {
        setFormError(
          "Add at least one ingredient and one step before publishing your recipe."
        )
        return
      }

      const recipeName = value.recipe_name.trim()

      if (!recipeName) {
        setFormError("Add a recipe name before publishing your recipe.")
        return
      }

      const baseSlug = toSlug(recipeName)

      if (!baseSlug) {
        setFormError(
          "Recipe name must include letters or numbers before publishing."
        )
        return
      }

      let uniqueSlug = baseSlug

      try {
        uniqueSlug = await ensureUniqueSlug(baseSlug)
      } catch (slugError) {
        setFormError(
          slugError instanceof Error
            ? slugError.message
            : "We could not generate a URL for this recipe."
        )
        return
      }

      const normalizedQuote = value.quote?.trim() ?? ""

      const storageImagePath =
        imgURL && imgURL.trim().length > 0
          ? imgURL.startsWith("/")
            ? imgURL
            : `/${imgURL}`
          : null

      const updatedValues = {
        ...value,
        recipe_name: recipeName,
        author: user?.user_metadata.first_name || "Anonymous User",
        user_id: user?.id,
        slug: uniqueSlug,
        quote: normalizedQuote.length > 0 ? normalizedQuote : null,
        img: storageImagePath,
      }

      try {
        const { data, error } = await supabase
          .from("recipes")
          .insert(updatedValues)
          .select("slug")

        if (error) throw error

        formApi.reset(createAddRecipeDefaultValues())
        setImgURL("")
        setIsConfirmed(false)
        const nextSlug = data?.[0]?.slug ?? uniqueSlug
        router.push(`/recipes/${nextSlug}`)
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

  const {
    addFiles: addRecipeImageFiles,
    reset: resetRecipeImageUpload,
    onUpload: uploadRecipeImage,
    loading: isUploadingImage,
  } = useSupabaseUpload({
    bucketName: "photos",
    maxFiles: 1,
    allowedMimeTypes: ["image/*"],
    maxFileSize: 10 * 1024 * 1024,
    cacheControl: 3600,
    upsert: false,
    createFilePath: ({ file, defaultPath }) => {
      const recipeNameValue = form.state.values.recipe_name?.trim() ?? ""
      const safeRecipeName = toSlug(recipeNameValue)
      const baseName = safeRecipeName || "recipe"

      const extension = file.name.split(".").pop()?.toLowerCase()
      const normalizedExtension = extension?.replace(/[^a-z0-9]/gi, "")
      const uniqueSuffix =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}`

      const fileName = normalizedExtension
        ? `${baseName}-${uniqueSuffix}.${normalizedExtension}`
        : `${baseName}-${uniqueSuffix}`

      return `recipes/${baseName}/${fileName}`
    },
    onUploadComplete: ({ path }) => {
      const normalizedPath = path.startsWith("/") ? path : `/${path}`
      setImgURL(normalizedPath)
      setFormError(null)
      setIsConfirmed(false)
    },
    onUploadError: ({ message }) => {
      setFormError(message)
    },
  })

  const handleImageUpload = async (file: File | null) => {
    if (!file) {
      setFormError("No file selected")
      resetRecipeImageUpload()
      return
    }

    const recipeName = form.state.values.recipe_name?.trim()

    if (!recipeName) {
      setFormError("Add a recipe name before uploading an image.")
      resetRecipeImageUpload()
      return
    }

    const safeRecipeName = toSlug(recipeName)

    if (!safeRecipeName) {
      setFormError(
        "Recipe name must include letters or numbers before uploading an image."
      )
      resetRecipeImageUpload()
      return
    }

    setFormError(null)
    addRecipeImageFiles([file], { replace: true })

    const results = await uploadRecipeImage()

    if (!results || results.length === 0) {
      setFormError("We couldn’t upload the image. Please try again.")
      resetRecipeImageUpload()
      return
    }

    const errorResult = results.find((result) => result.status === "error")

    if (errorResult?.status === "error") {
      setFormError(errorResult.message)
      resetRecipeImageUpload()
      return
    }

    const successResult = results.find((result) => result.status === "success")

    if (successResult?.status === "success") {
      const normalizedPath = successResult.path
      setImgURL(normalizedPath)
      setIsConfirmed(false)
      resetRecipeImageUpload()
    }
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
              isUploading={isUploadingImage}
              onFileChange={handleImageUpload}
              imagePath={imgURL}
            />
          </div>
        </div>

        <SubmitActions
          form={form}
          submitLabel="Publish Recipe"
          helperText="Make sure all fields are filled out correctly before submitting."
          submittingLabel="Publishing..."
        />

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
