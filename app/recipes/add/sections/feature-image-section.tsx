import { useStore } from "@tanstack/react-form"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FileInput } from "@/app/recipes/add/image-upload"

import {
  addRecipeDefaultValuesShape,
  withAddRecipeForm,
} from "../add-recipe-form.hook"

export const FeatureImageSection = withAddRecipeForm({
  defaultValues: addRecipeDefaultValuesShape,
  props: {
    isUploading: false,
    onFileChange: ((_) => undefined) as (file: File | null) => void,
  },
  render: function Render({ form, isUploading, onFileChange }) {
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
          <FileInput
            onFileChange={onFileChange}
            isUploading={isUploading}
            className="border-primary/30 bg-muted/40 rounded-xl border border-dashed px-4 py-6"
            type="recipe"
            disabled={!nameForImage}
          />
        </CardContent>
      </Card>
    )
  },
})
