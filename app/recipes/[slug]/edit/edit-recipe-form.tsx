"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { getRecipeBySlug } from "@/queries/recipe-queries"
import { createClient } from "@/supabase/client"
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query"

import { cn, extractErrorMessage, genId, toSlug } from "@/lib/utils"
import { RecipeFormSchema } from "@/lib/zod/schema"
import { useSupabaseUpload } from "@/hooks/use-supabase-upload"
import { useRecipes } from "@/hooks/useRecipes"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Typography } from "@/components/ui/typography"
import { ErrorDisplay } from "@/components/error/error-display"
import { useAddRecipeForm } from "@/app/recipes/add/add-recipe-form.hook"
import { FeatureImageSection } from "@/app/recipes/add/sections/feature-image-section"
import { IngredientsSection } from "@/app/recipes/add/sections/ingredients-section"
import { RecipeBasicsSection } from "@/app/recipes/add/sections/recipe-basics-section"
import { StepsSection } from "@/app/recipes/add/sections/steps-section"
import { SubmissionChecklist } from "@/app/recipes/add/sections/submission-checklist"
import { SubmitActions } from "@/app/recipes/add/sections/submit-actions"
import { TagsSection } from "@/app/recipes/add/sections/tags-section"

import type { SuggestedTag } from "@/app/recipes/add/sections/tags-section"
import type { Ingredient, Recipe, Step, Tag } from "@/lib/types"
import type { AddRecipeFormValues } from "@/lib/zod/schema"
import type { User } from "@supabase/supabase-js"

type EditRecipeFormProps = {
  slug: string
  className?: string
  user: User
  initialRecipe?: Recipe
}

type EditRecipeFormInnerProps = {
  recipe: Recipe
  slug: string
  className?: string
  user: User
  normalizedUnits: string[]
  suggestedTags: SuggestedTag[]
}

const normalizeStoragePath = (path?: string | null) => {
  if (!path) {
    return ""
  }

  const trimmed = path.trim()

  if (!trimmed) {
    return ""
  }

  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`
}

const ensureLocalId = (candidate: unknown, prefix: string, index: number) => {
  if (typeof candidate === "string" && candidate.trim().length > 0) {
    return candidate
  }

  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`
  }

  return `${prefix}-${genId()}-${index}`
}

const mapRecipeToFormValues = (recipe: Recipe): AddRecipeFormValues => {
  const ingredients = Array.isArray(recipe.ingredients)
    ? (recipe.ingredients as Ingredient[])
        .map((ingredient, index) => {
          const ingredientName =
            typeof ingredient.ingredient === "string"
              ? ingredient.ingredient.trim()
              : ""
          const unitMeasurement =
            typeof ingredient.unitMeasurement === "string"
              ? ingredient.unitMeasurement.trim()
              : ""
          const amountValue =
            typeof ingredient.amount === "number"
              ? ingredient.amount
              : Number.NaN

          if (!ingredientName || !Number.isFinite(amountValue)) {
            return null
          }

          return {
            id: ensureLocalId(ingredient.id, "ingredient", index),
            ingredient: ingredientName,
            amount: amountValue,
            unitMeasurement,
          }
        })
        .filter((value): value is NonNullable<typeof value> => Boolean(value))
    : []

  const steps = Array.isArray(recipe.steps)
    ? (recipe.steps as Step[])
        .map((step, index) => {
          const stepText = typeof step.step === "string" ? step.step.trim() : ""

          if (!stepText) {
            return null
          }

          return {
            id: ensureLocalId(step.id, "step", index),
            step: stepText,
          }
        })
        .filter((value): value is NonNullable<typeof value> => Boolean(value))
    : []

  const tags = Array.isArray(recipe.tags)
    ? (recipe.tags as Tag[])
        .map((tag, index) => {
          const tagText = typeof tag.tag === "string" ? tag.tag.trim() : ""

          if (!tagText) {
            return null
          }

          return {
            id: ensureLocalId(tag.id, "tag", index),
            tag: tagText,
          }
        })
        .filter((value): value is NonNullable<typeof value> => Boolean(value))
    : []

  return {
    recipe_name: recipe.recipe_name ?? "",
    quote: recipe.quote ?? "",
    ingredients,
    steps,
    tags,
  }
}

export function EditRecipeForm({
  slug,
  className,
  user,
  initialRecipe,
}: EditRecipeFormProps) {
  const supabase = createClient()
  const shouldFetch = !initialRecipe
  const {
    data: recipeData,
    isLoading: isRecipeLoading,
    error: recipeError,
  } = useQuery(getRecipeBySlug(supabase, slug), {
    enabled: shouldFetch,
  })

  const {
    tags,
    units,
    error: catalogError,
    isLoading: isCatalogLoading,
  } = useRecipes()

  const normalizedUnits = useMemo(() => {
    const unitList = Array.isArray(units) ? units : []
    return unitList.filter((unit) => unit && unit.trim().length > 0)
  }, [units])

  const suggestedTags = useMemo(() => {
    const tagList = Array.isArray(tags) ? tags : []
    return tagList.slice(0, 8) as SuggestedTag[]
  }, [tags])

  const isLoading = isRecipeLoading || isCatalogLoading

  if (isLoading && !initialRecipe) {
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
        title="We could not load the recipe"
        error={recipeError.message}
      />
    )
  }

  if (!recipeData) {
    return (
      <ErrorDisplay
        title="Recipe unavailable"
        error="We were unable to find this recipe."
      />
    )
  }

  const recipe = (initialRecipe ?? recipeData) as Recipe

  if (recipe.user_id && recipe.user_id !== user.id) {
    return (
      <ErrorDisplay
        title="Access denied"
        error="You do not have permission to edit this recipe."
      />
    )
  }

  if (catalogError) {
    return (
      <ErrorDisplay
        title="We could not load supporting data"
        error={catalogError.message}
      />
    )
  }

  return (
    <EditRecipeFormInner
      key={recipe.id}
      recipe={recipe}
      slug={slug}
      user={user}
      className={className}
      normalizedUnits={normalizedUnits}
      suggestedTags={suggestedTags}
    />
  )
}

function EditRecipeFormInner({
  recipe,
  slug,
  className,
  user,
  normalizedUnits,
  suggestedTags,
}: EditRecipeFormInnerProps) {
  const router = useRouter()
  const supabase = createClient()
  const originalImagePath = useMemo(
    () => normalizeStoragePath(recipe.img),
    [recipe.img]
  )
  const [imgURL, setImgURL] = useState(originalImagePath)
  const [formError, setFormError] = useState<string | null>(null)
  const [isConfirmed, setIsConfirmed] = useState(() => !originalImagePath)

  const initialValues = useMemo(() => mapRecipeToFormValues(recipe), [recipe])

  const form = useAddRecipeForm({
    defaultValues: initialValues,
    validators: {
      onChange: RecipeFormSchema,
      onSubmit: RecipeFormSchema,
    },
    onSubmit: async ({ value }) => {
      setFormError(null)

      if (!imgURL && !isConfirmed) {
        setFormError(
          "You have not selected an image. Continue to save without one or upload a photo now."
        )
        return
      }

      if (value.ingredients.length === 0 || value.steps.length === 0) {
        setFormError(
          "Add at least one ingredient and one step before saving your recipe."
        )
        return
      }

      const recipeName = value.recipe_name.trim()

      if (!recipeName) {
        setFormError("Add a recipe name before saving your recipe.")
        return
      }

      const baseSlug = toSlug(recipeName)

      if (!baseSlug) {
        setFormError(
          "Recipe name must include letters or numbers before saving."
        )
        return
      }

      const ensureUniqueSlug = async (candidateSlug: string) => {
        let attempt = 0
        let candidate = candidateSlug

        while (attempt < 20) {
          if (candidate === recipe.slug) {
            return candidate
          }

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
          candidate = `${candidateSlug}-${attempt}`
        }

        throw new Error(
          "We could not generate a unique URL for this recipe. Try a different name."
        )
      }

      let nextSlug = slug

      try {
        nextSlug = await ensureUniqueSlug(baseSlug)
      } catch (slugError) {
        setFormError(
          extractErrorMessage(
            slugError,
            "We could not generate a URL for this recipe."
          )
        )
        return
      }

      const normalizedQuote = value.quote?.trim() ?? ""

      const storageImagePath = imgURL ? normalizeStoragePath(imgURL) : null

      const updatedValues = {
        recipe_name: recipeName,
        quote: normalizedQuote.length > 0 ? normalizedQuote : null,
        ingredients: value.ingredients,
        steps: value.steps,
        tags: value.tags,
        slug: nextSlug,
        img: storageImagePath,
        author:
          recipe.author || user.user_metadata?.first_name || "Anonymous User",
        user_id: recipe.user_id ?? user.id,
        last_updated: new Date().toISOString(),
      }

      try {
        const { data, error } = await supabase
          .from("recipes")
          .update(updatedValues)
          .eq("id", recipe.id)
          .select("slug")
          .maybeSingle()

        if (error) {
          throw error
        }

        const resolvedSlug = data?.slug ?? nextSlug

        router.push(`/recipes/${resolvedSlug}`)
        router.refresh()
      } catch (error) {
        console.error("Error updating recipe:", error)
        setFormError(
          extractErrorMessage(
            error,
            "An error occurred while saving the recipe."
          )
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
    createFilePath: ({ file }) => {
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
      const normalizedPath = normalizeStoragePath(path)
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
      setImgURL("")
      setIsConfirmed(true)
      return
    }

    const recipeNameValue = form.state.values.recipe_name?.trim()

    if (!recipeNameValue) {
      setFormError("Add a recipe name before uploading an image.")
      resetRecipeImageUpload()
      return
    }

    const safeRecipeName = toSlug(recipeNameValue)

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
      setFormError("We could not upload the image. Please try again.")
      resetRecipeImageUpload()
      return
    }

    const errorResult = results.find((result) => result.status === "error")

    if (errorResult) {
      setFormError(errorResult.message)
      resetRecipeImageUpload()
      return
    }

    const successResult = results.find((result) => result.status === "success")

    if (successResult) {
      const normalizedPath = normalizeStoragePath(successResult.path)
      setImgURL(normalizedPath)
      setIsConfirmed(false)
      resetRecipeImageUpload()
    }
  }

  return (
    <form.AppForm>
      <form
        id="edit-recipe-form"
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
            Update your recipe
          </Typography>
          <Typography
            variant="muted"
            className="text-muted-foreground text-base"
          >
            Refine details below. Changes publish immediately so loved ones see
            the freshest version.
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
          submitLabel="Save changes"
          helperText="Save now to update your published recipe immediately."
          submittingLabel="Saving..."
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
