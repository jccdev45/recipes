import { NotebookPen } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import {
  addRecipeDefaultValuesShape,
  getErrorId,
  getNameFromPath,
  withAddRecipeForm,
} from "../add-recipe-form.hook"

export const RecipeBasicsSection = withAddRecipeForm({
  defaultValues: addRecipeDefaultValuesShape,
  render: function Render({ form }) {
    const FormField = form.Field

    return (
      <Card className="shadow-md">
        <CardHeader className="space-y-3">
          <div className="flex items-center gap-2">
            <NotebookPen aria-hidden="true" className="text-primary h-5 w-5" />
            <CardTitle className="text-xl font-semibold">
              Recipe basics
            </CardTitle>
          </div>
          <CardDescription>
            Set the name and a short pull quote to introduce the dish.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FieldSet className="space-y-6">
            <FieldLegend className="sr-only">Recipe basics</FieldLegend>

            <FormField name="recipe_name">
              {(field) => {
                const fieldId = getNameFromPath(field.name)
                const errorId = getErrorId(field.name)
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                const recipeName = field.state.value as string

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={fieldId}>Recipe name</FieldLabel>
                    <FieldContent>
                      <Input
                        id={fieldId}
                        value={recipeName}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
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
            </FormField>

            <FormField name="quote">
              {(field) => {
                const fieldId = getNameFromPath(field.name)
                const errorId = getErrorId(field.name)
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                const quoteValue = field.state.value as string

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={fieldId}>
                      Feature quote (optional)
                    </FieldLabel>
                    <FieldContent>
                      <Input
                        id={fieldId}
                        value={quoteValue}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                        onBlur={field.handleBlur}
                        placeholder="Why is this recipe special?"
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
            </FormField>
          </FieldSet>
        </CardContent>
      </Card>
    )
  },
})
