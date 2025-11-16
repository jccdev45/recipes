import { RecipeFormSchema } from "@/lib/zod/schema"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Typography } from "@/components/ui/typography"

import {
  addRecipeDefaultValuesShape,
  withAddRecipeForm,
} from "../add-recipe-form.hook"

export const SubmitActions = withAddRecipeForm({
  defaultValues: addRecipeDefaultValuesShape,
  props: {
    submitLabel: "Publish" as string,
    helperText:
      "Submit now and you will be redirected to your published recipe for a final review." as string,
    submittingLabel: "Submitting..." as string,
  },
  render: function Render({ form, submitLabel, helperText, submittingLabel }) {
    return (
      <form.Subscribe
        selector={(state) => ({
          canSubmit: state.canSubmit,
          isSubmitting: state.isSubmitting,
          isDirty: state.isDirty,
          values: state.values,
        })}
      >
        {({ canSubmit, isSubmitting, isDirty, values }) => {
          const isFormValid = RecipeFormSchema.safeParse(values).success
          const hasIngredients = Array.isArray(values.ingredients)
            ? values.ingredients.length > 0
            : false
          const hasSteps = Array.isArray(values.steps)
            ? values.steps.length > 0
            : false
          const meetsContentRequirements = hasIngredients && hasSteps
          const shouldDisable =
            isSubmitting ||
            !isFormValid ||
            !meetsContentRequirements ||
            (!isDirty && !canSubmit)

          return (
            <div className="border-border/60 bg-background/80 flex flex-col gap-4 rounded-2xl border border-dashed p-6 sm:flex-row sm:items-center sm:justify-between">
              <Typography
                variant="muted"
                className="text-muted-foreground text-sm"
              >
                {helperText}
              </Typography>
              <Button
                type="submit"
                size="lg"
                className="w-full sm:w-auto"
                disabled={shouldDisable}
              >
                {isSubmitting ? (
                  <>
                    <Spinner />
                    {submittingLabel}
                  </>
                ) : (
                  submitLabel
                )}
              </Button>
            </div>
          )
        }}
      </form.Subscribe>
    )
  },
})
