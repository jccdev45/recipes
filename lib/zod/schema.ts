import * as z from "zod"

import { maxAmount, minAmount } from "../constants"

const sharedFields = {
  auth: {
    email: z
      .string({ invalid_type_error: "Invalid email" })
      .email({ message: "Must be a valid email" }),
    password: z
      .string({
        invalid_type_error: "Invalid password",
      })
      .min(8, { message: "Password must be at least 8 characters" })
      .max(32, { message: "Password must be less than 32 characters" })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[!@#$%^&*(),.?":{}|<>]/, {
        message: "Password must contain at least one special character",
      }),
  },
  user: {
    first_name: z
      .string()
      .min(2, { message: "First name must be at least 2 characters" })
      .max(50, { message: "First name must be less than 50 characters" }),
    last_name: z
      .string()
      .min(2, { message: "Last name must be at least 2 characters" })
      .max(50, { message: "Last name must be less than 50 characters" })
      .optional(),
  },
}

export const IngredientSchema = z.array(
  z.object({
    id: z.string(),
    ingredient: z
      .string()
      .min(3, { message: "Ingredient must be at least 3 characters" })
      .max(50, { message: "Ingredient must be less than 500 characters" }),
    amount: z
      .number()
      .min(minAmount, { message: `Amount must be greater than ${minAmount}` })
      .max(maxAmount, { message: `Amount must be less than ${maxAmount}` }),
    unitMeasurement: z.string(),
  })
)

export const StepSchema = z.array(
  z.object({
    id: z.string(),
    step: z
      .string()
      .min(3, { message: "Step must be at least 3 characters" })
      .max(500, { message: "Step must be less than 500 characters" }),
  })
)

export const TagSchema = z
  .array(
    z.object({
      id: z.string(),
      tag: z
        .string()
        .min(3, { message: "Tag must be at least 3 characters" })
        .max(15, { message: "Tag must be less than 15 characters" }),
    })
  )
  .max(5, { message: "No more than 5 tags" })

export const RecipeFormSchema = z.object({
  recipe_name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(50, { message: "Name must be less than 50 characters" }),
  quote: z
    .string()
    .min(3, { message: "Quote must be at least 3 characters" })
    .max(50, { message: "Quote must be less than 50 characters" }),
  ingredients: IngredientSchema,
  steps: StepSchema,
  tags: TagSchema,
})

export const LoginSchema = z.object({
  ...sharedFields.auth,
})

export const RegisterSchema = z
  .object({
    ...sharedFields.auth,
    ...sharedFields.user,
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  })

export const EditProfileSchema = z
  .object({
    ...sharedFields.auth,
    ...sharedFields.user,
    confirm_password: z.string(),
  })
  .partial()
  .refine(
    (data) => {
      if (data.password || data.confirm_password) {
        return data.password === data.confirm_password
      }
      return true
    },
    {
      message: "Passwords do not match",
      path: ["confirm_password"],
    }
  )

export const CommentSchema = z.object({
  message: z
    .string()
    .min(1, { message: "Must be at least 1 character " })
    .max(500, { message: "Max 500 characters" }),
})

export type AddRecipeFormValues = z.infer<typeof RecipeFormSchema>
export type CommentFormValues = z.infer<typeof CommentSchema>
export type LoginFormValues = z.infer<typeof LoginSchema>
export type RegisterFormValues = z.infer<typeof RegisterSchema>
