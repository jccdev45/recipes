import { createFormHook, createFormHookContexts } from "@tanstack/react-form"

import { genId } from "@/lib/utils"

import type { AddRecipeFormValues } from "@/lib/zod/schema"

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts()

const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {} as Record<string, never>,
  formComponents: {} as Record<string, never>,
})

export const useAddRecipeForm = useAppForm
export const withAddRecipeForm = withForm

export const addRecipeDefaultValuesShape: AddRecipeFormValues = {
  recipe_name: "",
  quote: "",
  ingredients: [] as AddRecipeFormValues["ingredients"],
  steps: [] as AddRecipeFormValues["steps"],
  tags: [] as AddRecipeFormValues["tags"],
}

export const createAddRecipeDefaultValues = (): AddRecipeFormValues => ({
  recipe_name: "",
  quote: "",
  ingredients: [],
  steps: [],
  tags: [],
})

export const getNameFromPath = (name: unknown) =>
  String(name).replace(/\./g, "-").replace(/\[/g, "-").replace(/\]/g, "")

export const getErrorId = (name: unknown) => `error-${getNameFromPath(name)}`
