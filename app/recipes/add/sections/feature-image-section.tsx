import { useEffect, useMemo, useState } from "react"
import { useStore } from "@tanstack/react-form"

import { resolveStorageImageUrl } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ImageUploadField } from "@/components/image-upload-field"

import {
  addRecipeDefaultValuesShape,
  withAddRecipeForm,
} from "../add-recipe-form.hook"

export const FeatureImageSection = withAddRecipeForm({
  defaultValues: addRecipeDefaultValuesShape,
  props: {
    isUploading: false,
    onFileChange: ((_) => undefined) as (
      file: File | null
    ) => void | Promise<void>,
    imagePath: undefined as string | undefined,
  },
  render: function Render({ form, isUploading, onFileChange, imagePath }) {
    const recipeNameValue = useStore(
      form.store,
      (state) => state.values.recipe_name || ""
    )
    const recipeNameMeta = useStore(
      form.store,
      (state) => state.fieldMeta.recipe_name
    )

    const nameForImage =
      recipeNameValue.trim().length > 0 &&
      (recipeNameMeta?.errors?.length ?? 0) === 0

    const [selectedFileName, setSelectedFileName] = useState<string>("")
    const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null)

    const updateLocalPreviewUrl = (next: string | null) => {
      setLocalPreviewUrl((prev) => {
        if (prev) {
          URL.revokeObjectURL(prev)
        }
        return next
      })
    }

    useEffect(() => {
      return () => {
        if (localPreviewUrl) {
          URL.revokeObjectURL(localPreviewUrl)
        }
      }
    }, [localPreviewUrl])

    useEffect(() => {
      if (!isUploading && imagePath) {
        updateLocalPreviewUrl(null)
      }
    }, [imagePath, isUploading])

    useEffect(() => {
      if (imagePath && !localPreviewUrl) {
        const segments = imagePath.split("/")
        const inferredName = segments[segments.length - 1] ?? ""
        setSelectedFileName(inferredName)
      }

      if (!imagePath && !localPreviewUrl) {
        setSelectedFileName("")
      }
    }, [imagePath, localPreviewUrl])

    const resolvedImagePath = useMemo(
      () => (imagePath ? resolveStorageImageUrl(imagePath) : null),
      [imagePath]
    )

    const previewSrc = localPreviewUrl ?? resolvedImagePath ?? null
    const previewAlt = recipeNameValue
      ? `Preview of ${recipeNameValue}`
      : "Recipe image preview"

    const triggerUpload = (file: File | null) => {
      try {
        Promise.resolve(onFileChange(file)).catch((error: unknown) => {
          console.error("Recipe image upload failed", error)
        })
      } catch (error) {
        console.error("Recipe image upload failed", error)
      }
    }

    const handleSelectFile = (file: File | null) => {
      if (!file) {
        setSelectedFileName("")
        updateLocalPreviewUrl(null)
        triggerUpload(file)
        return
      }

      setSelectedFileName(file.name)

      const nextPreview = URL.createObjectURL(file)
      updateLocalPreviewUrl(nextPreview)

      triggerUpload(file)
    }

    return (
      <Card className="shadow-md">
        <CardHeader className="space-y-3">
          <CardTitle className="text-xl font-semibold">Feature image</CardTitle>
          <CardDescription>
            Upload an optional photo to showcase your recipe. You can skip this
            step and add one later.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {!nameForImage && (
            <p className="text-muted-foreground text-sm">
              Add a recipe name to enable image uploads. The recipe name helps
              title the file in storage.
            </p>
          )}
          <ImageUploadField
            hideCurrent
            className="border-primary/30 bg-muted/40 rounded-xl border border-dashed px-4 py-6"
            onSelectFile={handleSelectFile}
            isUploading={isUploading}
            uploadLabel="Upload image"
            uploadingLabel="Uploading..."
            fileName={selectedFileName}
            preview={
              previewSrc ? (
                <img
                  src={previewSrc}
                  alt={previewAlt}
                  className="h-48 w-full rounded-xl object-cover"
                />
              ) : null
            }
            previewDescription={
              previewSrc ? (
                <span>
                  This preview will appear on your recipe once you publish it.
                </span>
              ) : (
                <span>
                  No image selected yet. Your recipe will use a solid color
                  background.
                </span>
              )
            }
            helperText="Images display best at 1200 x 800 pixels. Files up to 10MB are supported."
            disabled={!nameForImage || isUploading}
            buttonAriaLabel="Upload recipe image"
            inputProps={{
              "aria-label": "Choose recipe feature image",
              accept: "image/*",
            }}
            maxFileSize={10 * 1024 * 1024}
          />
        </CardContent>
      </Card>
    )
  },
})
