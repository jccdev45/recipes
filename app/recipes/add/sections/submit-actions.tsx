import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Typography } from "@/components/ui/typography"

import {
  addRecipeDefaultValuesShape,
  withAddRecipeForm,
} from "../add-recipe-form.hook"

export const SubmitActions = withAddRecipeForm({
  defaultValues: addRecipeDefaultValuesShape,
  render: function Render({ form }) {
    return (
      <form.Subscribe
        selector={(state) => ({
          canSubmit: state.canSubmit,
          isSubmitting: state.isSubmitting,
        })}
      >
        {({ canSubmit, isSubmitting }) => (
          <div className="border-border/60 bg-background/80 flex flex-col gap-4 rounded-2xl border border-dashed p-6 sm:flex-row sm:items-center sm:justify-between">
            <Typography
              variant="muted"
              className="text-muted-foreground text-sm"
            >
              Submit now and you will be redirected to your published recipe for
              a final review.
            </Typography>
            <Button
              type="submit"
              size="lg"
              className="w-full sm:w-auto"
              disabled={!canSubmit || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner />
                  Submitting...
                </>
              ) : (
                "Publish"
              )}
            </Button>
          </div>
        )}
      </form.Subscribe>
    )
  },
})
