import * as z from "zod";
import { maxAmount, minAmount } from "../constants";

export const ingredientSchema = z.array(
  z.object({
    id: z.string(),
    ingredient: z
      .string()
      .min(3, { message: "Ingredient must be at least 3 characters" })
      .max(50, { message: "Ingredient must be less than 500 characters" }),
    amount: z
      .number()
      .min(minAmount, { message: "Amount must be greater than 0.1" })
      .max(maxAmount, { message: "Amount must be less than 1000" }),
    unitMeasurement: z.string(),
    // .min(3, { message: "Unit must be at least 3 characters" })
    // .max(50),
  })
);

export const stepSchema = z.array(
  z.object({
    id: z.string(),
    step: z
      .string()
      .min(3, { message: "Step must be at least 3 characters" })
      .max(500, { message: "Step must be less than 500 characters" }),
  })
);

export const tagSchema = z
  .array(
    z.object({
      id: z.string(),
      tag: z
        .string()
        .min(3, { message: "Tag must be at least 3 characters" })
        .max(15, { message: "Tag must be less than 15 characters" }),
    })
  )
  .max(5, { message: "No more than 5 tags" });

export const recipeFormSchema = z.object({
  id: z.string(),
  recipeName: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(50, { message: "Name must be less than 50 characters" }),
  quote: z
    .string()
    .min(3, { message: "Quote must be at least 3 characters" })
    .max(50, { message: "Quote must be less than 50 characters" }),
  ingredients: ingredientSchema,
  steps: stepSchema,
  tags: tagSchema,
});

export const registerFormSchema = z
  .object({
    email: z.string().email({ message: "Must be a valid email" }),
    // displayName: z
    //   .string()
    //   .min(3, { message: "Must be at least 3 characters" })
    //   .max(20, { message: "Must be less than 20 characters" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginFormSchema = z.object({
  email: z.string().email({ message: "Must be a valid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export const commentSchema = z.object({
  message: z
    .string()
    .min(1, { message: "Must be at least 1 character " })
    .max(500, { message: "Max 500 characters" }),
});

// export type Ingredient = AddRecipeFormValues["ingredients"][number];
// export type Step = AddRecipeFormValues["steps"][number];
// export type Tag = AddRecipeFormValues["tags"][number];

const AddRecipeFormValues = recipeFormSchema.omit({ id: true });
export type AddRecipeFormValues = z.infer<typeof AddRecipeFormValues>;
export type CommentFormValues = z.infer<typeof commentSchema>;
export type LoginFormValues = z.infer<typeof loginFormSchema>;
export type RegisterFormValues = z.infer<typeof registerFormSchema>;
