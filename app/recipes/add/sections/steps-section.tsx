import { useRef, useState } from "react"
import { ListOrdered, PencilLine, Plus, X as XIcon } from "lucide-react"

import { genId } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  FieldDescription,
  FieldError,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { EmptyStateDisplay } from "@/components/empty-state-display"
import { FormInfoAlert } from "@/components/form-info-alert"

import {
  addRecipeDefaultValuesShape,
  getErrorId,
  getNameFromPath,
  withAddRecipeForm,
} from "../add-recipe-form.hook"
import type { KeyboardEvent } from "react"

export const StepsSection = withAddRecipeForm({
  defaultValues: addRecipeDefaultValuesShape,
  render: function Render({ form }) {
    const [pendingStep, setPendingStep] = useState("")
    const [stepHelper, setStepHelper] = useState<string | null>(null)
    const [editingStep, setEditingStep] = useState<{
      id: string
      index: number
      value: string
    } | null>(null)

    const stepInputRef = useRef<HTMLInputElement>(null)

    const FormField = form.Field

    return (
      <Card className="shadow-md">
        <CardHeader className="space-y-3">
          <div className="flex items-center gap-2">
            <ListOrdered aria-hidden="true" className="text-primary h-5 w-5" />
            <CardTitle className="text-xl font-semibold">Steps</CardTitle>
          </div>
          <CardDescription>
            Break instructions into focused actions so readers can follow along
            easily.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormInfoAlert
            type="info"
            title="Instruction tip"
            desc="Start each step with a verb and keep sentences short for people cooking on smaller screens."
          />

          <FormField name="steps">
            {(stepsField) => {
              const fieldId = getNameFromPath(stepsField.name)
              const errorId = getErrorId(stepsField.name)

              const handleAddStep = () => {
                const trimmedStep = pendingStep.trim()

                if (!trimmedStep) {
                  setStepHelper("Add an instruction before saving the step.")
                  stepInputRef.current?.focus()
                  return
                }

                stepsField.pushValue({ id: genId(), step: trimmedStep })
                setPendingStep("")
                setStepHelper(null)
                stepInputRef.current?.focus()
              }

              const handleSaveStep = () => {
                if (!editingStep) return

                const trimmedStep = editingStep.value.trim()

                if (!trimmedStep) {
                  setStepHelper("Step text cannot be empty when editing.")
                  return
                }

                const current = stepsField.state.value[editingStep.index]

                if (!current) return

                stepsField.replaceValue(editingStep.index, {
                  ...current,
                  step: trimmedStep,
                })

                setStepHelper(null)
                setEditingStep(null)
              }

              const handleAddKeyDown = (
                event: KeyboardEvent<HTMLInputElement>
              ) => {
                if (event.key === "Enter") {
                  event.preventDefault()
                  handleAddStep()
                }
              }

              return (
                <FieldSet
                  className="space-y-5"
                  aria-describedby={
                    stepsField.state.meta.errors?.length ? errorId : undefined
                  }
                >
                  <FieldLegend className="sr-only">Steps</FieldLegend>
                  <FieldDescription>
                    Use Enter to quickly add each instruction. Steps can be
                    edited inline later.
                  </FieldDescription>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Input
                      ref={stepInputRef}
                      value={pendingStep}
                      onChange={(event) => setPendingStep(event.target.value)}
                      onKeyDown={handleAddKeyDown}
                      placeholder="Add a step"
                      aria-label="Add recipe step"
                    />
                    <Button
                      type="button"
                      onClick={handleAddStep}
                      variant="outline"
                    >
                      <Plus aria-hidden="true" className="h-4 w-4" />
                      Add step
                    </Button>
                  </div>

                  {stepHelper && <FieldError>{stepHelper}</FieldError>}

                  {stepsField.state.meta.errors?.length ? (
                    <FieldError
                      id={errorId}
                      errors={stepsField.state.meta.errors}
                    />
                  ) : null}

                  {stepsField.state.value.length === 0 ? (
                    <EmptyStateDisplay
                      aria-live="polite"
                      className="border-border/50 bg-muted/30 border"
                      icon={
                        <ListOrdered aria-hidden="true" className="h-5 w-5" />
                      }
                      title="No steps yet"
                      description='Add each instruction using the field above, then choose "Add step" to build your recipe.'
                    >
                      <span className="text-muted-foreground text-sm">
                        Your steps appear below once saved so you can edit or
                        remove them with the inline controls.
                      </span>
                    </EmptyStateDisplay>
                  ) : (
                    <ol
                      className="list-decimal space-y-3 pl-6"
                      aria-live="polite"
                    >
                      {stepsField.state.value.map((step, index) => {
                        if (!step?.id) {
                          return null
                        }

                        const isEditing = editingStep?.id === step.id

                        if (isEditing && editingStep) {
                          return (
                            <li
                              key={`${step.id}-${index}`}
                              className="border-border/60 bg-background/70 rounded-2xl border p-4 shadow-sm"
                            >
                              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <Input
                                  id={`edit-step-${step.id}`}
                                  value={editingStep.value}
                                  onChange={(event) =>
                                    setEditingStep((previous) =>
                                      previous
                                        ? {
                                            ...previous,
                                            value: event.target.value,
                                          }
                                        : previous
                                    )
                                  }
                                  onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                      event.preventDefault()
                                      handleSaveStep()
                                    }
                                  }}
                                  aria-label={`Edit step ${index + 1}`}
                                />
                                <div className="flex flex-wrap gap-2">
                                  <Button
                                    type="button"
                                    size="sm"
                                    onClick={handleSaveStep}
                                  >
                                    Save changes
                                  </Button>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setEditingStep(null)}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon-sm"
                                    onClick={() => {
                                      stepsField.removeValue(index)
                                      setEditingStep(null)
                                    }}
                                    aria-label={`Remove step ${index + 1}`}
                                  >
                                    <XIcon
                                      aria-hidden="true"
                                      className="h-4 w-4"
                                    />
                                  </Button>
                                </div>
                              </div>
                            </li>
                          )
                        }

                        return (
                          <li
                            key={`${step.id}-${index}`}
                            className="border-border/60 bg-background/70 flex flex-col gap-3 rounded-2xl border p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                          >
                            <span className="text-foreground text-sm sm:text-base">
                              {index + 1}) {step.step}
                            </span>
                            <div className="flex flex-wrap gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setEditingStep({
                                    id: step.id,
                                    index,
                                    value: step.step,
                                  })
                                  requestAnimationFrame(() =>
                                    document
                                      .getElementById(`edit-step-${step.id}`)
                                      ?.focus()
                                  )
                                }}
                              >
                                <PencilLine
                                  aria-hidden="true"
                                  className="h-4 w-4"
                                />
                                Edit
                              </Button>
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon-sm"
                                onClick={() => stepsField.removeValue(index)}
                                aria-label={`Remove step ${index + 1}`}
                              >
                                <XIcon aria-hidden="true" className="h-4 w-4" />
                              </Button>
                            </div>
                          </li>
                        )
                      })}
                    </ol>
                  )}
                </FieldSet>
              )
            }}
          </FormField>
        </CardContent>
      </Card>
    )
  },
})
