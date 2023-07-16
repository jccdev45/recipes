"use client";

import { Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
  UseFormProps,
} from "react-hook-form";
import * as z from "zod";

import { TagCombobox } from "@/app/recipes/add/TagCombobox";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import useUniqueTags from "@/hooks/useTags";
import { maxAmount, minAmount } from "@/lib/constants";
import { cn, genId, toSlug } from "@/lib/utils";
import { AddRecipeFormValues, RecipeFormSchema } from "@/lib/zod/schema";
import {
  Database,
  Ingredient,
  Step,
  Tag,
  UnitMeasurement,
} from "@/types/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createClientComponentClient,
  User,
} from "@supabase/auth-helpers-nextjs";

import { FileInput } from "./ImageUpload";

function useZodForm<TSchema extends z.ZodType>(
  props: Omit<UseFormProps<TSchema["_input"]>, "resolver"> & {
    schema: TSchema;
  }
) {
  const form = useForm<TSchema["_input"]>({
    ...props,
    resolver: zodResolver(props.schema, undefined, {
      // This makes it so we can use `.transform()`s on the schema without same transform getting applied again when it reaches the server
      raw: true,
    }),
  });

  return form;
}

type AddRecipeFormProps = {
  className: string;
  user: User | null;
};

export function AddRecipeForm({ className, user }: AddRecipeFormProps) {
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();
  const { uniqueTags, isLoading, error } = useUniqueTags();
  const [units, setUnits] = useState<UnitMeasurement[]>([]);
  const [imgURL, setImgURL] = useState("");
  const [recipeError, setRecipeError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const getUnits = async (): Promise<void> => {
      const { data } = await supabase.from("recipes").select("ingredients");

      const units: Set<UnitMeasurement> = new Set();

      if (data) {
        data.forEach((recipe) => {
          recipe.ingredients.forEach((unit) => {
            if (unit.unitMeasurement) {
              units.add(unit.unitMeasurement);
            }
          });
        });
      }

      const unitArray: Array<UnitMeasurement> = Array.from(units);
      const additionalUnits: Array<UnitMeasurement> = [
        "gram",
        "milliliter",
        "whole",
        "sprig",
        "pinch",
      ];
      additionalUnits.forEach((unit) => {
        if (!units.has(unit)) {
          unitArray.push(unit);
        }
      });

      setUnits(unitArray);
    };

    getUnits();
  }, []);

  const form = useZodForm({
    schema: RecipeFormSchema,
    defaultValues: {
      recipeName: "",
      quote: "",
      ingredients: [
        { id: genId(), amount: 0, unitMeasurement: "", ingredient: "" },
      ],
      steps: [{ id: genId(), step: "" }],
      tags: [{ id: genId(), tag: "" }],
    },
    mode: "onChange",
  });

  const {
    handleSubmit,
    register,
    control,
    formState: { isValid, errors, isValidating, isDirty },
    reset,
  } = form;

  const ingFieldArray = useFieldArray({
    name: "ingredients",
    control,
  });
  const stepFieldArray = useFieldArray({
    name: "steps",
    control,
  });
  const tagFieldArray = useFieldArray({
    name: "tags",
    control,
  });

  const update = (index: number, obj: { id: string; tag: string }) => {
    tagFieldArray.update(index, obj);
  };

  const handleImageUpload = async (file: File | null) => {
    const fileExt = file?.name.split(".").pop();
    const filePath = `recipes/${form.getValues(
      "recipeName"
    )}/${Math.random()}.${fileExt}`;

    if (file) {
      const { data, error } = await supabase.storage
        .from("photos")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        setUploadError(error.message);
      } else {
        setImgURL(data.path);
        setIsUploading(false);
        setUploadError("");
      }
    } else {
      setUploadError("No file selected");
    }
  };

  const isSubmittable = !!isDirty && !!isValid;

  const onSubmit: SubmitHandler<AddRecipeFormValues> = async (
    values: AddRecipeFormValues,
    e
  ) => {
    e?.preventDefault();

    const updatedValues = {
      ...values,
      author: user?.user_metadata.first_name,
      user_id: user?.id,
      slug: toSlug(values.recipeName),
      img: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos/${imgURL}`,
    };

    const { data, error } = await supabase
      .from("recipes")
      .insert(updatedValues)
      .select();

    if (!error) {
      reset();
      router.push(`/recipes/${data?.[0].slug}`);
      router.refresh();
    }
  };

  const nameForImage =
    !errors.recipeName && form.getValues("recipeName").length > 0;

  if (isLoading) {
    return (
      <div className="w-16 h-16 m-auto border-4 border-solid rounded-full border-t-transparent border-border animate-spin"></div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          `rounded-lg md:p-6 bg-background dark:bg-stone-900 gap-y-6`,
          className
        )}
      >
        <div className="grid grid-cols-1 col-span-1 lg:grid-cols-2">
          <FormField
            control={control}
            name="recipeName"
            render={({ field }) => (
              <FormItem className="w-full col-span-2 lg:col-span-1">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Chicken Parm"
                    {...field}
                    className="w-full border border-border"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="quote"
            render={({ field }) => (
              <FormItem className="w-full col-span-2 lg:col-span-1">
                <FormLabel>Quote</FormLabel>
                <FormControl>
                  <Input
                    placeholder="From my plate to yours"
                    {...field}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator className="h-1 col-span-1 my-2 rounded-lg" />

        <div className="col-span-1 space-y-6">
          <div className="">
            {ingFieldArray.fields.map((feeld, index) => {
              return (
                <div className="flex items-center gap-y-4" key={feeld?.id}>
                  <div className="grid items-end w-full grid-cols-4 gap-2 lg:grid-cols-8">
                    {/* NOTE: AMOUNT */}
                    <Controller
                      control={control}
                      name={`ingredients.${index}.amount`}
                      render={({ field }) => (
                        <FormItem className="col-span-1 lg:col-span-1">
                          <FormLabel
                            className={index === 0 ? `block` : `hidden`}
                          >
                            Amount
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step={0.1}
                              min={minAmount}
                              max={maxAmount}
                              placeholder="0.0"
                              className="col-span-1 p-2 border border-border"
                              {...field}
                              {...register(
                                `ingredients.${index}.amount` as const,
                                {
                                  valueAsNumber: true,
                                }
                              )}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* NOTE: UNIT */}
                    <Controller
                      control={control}
                      name={`ingredients.${index}.unitMeasurement`}
                      render={({ field }) => (
                        <FormItem className="col-span-3 lg:col-span-2">
                          <FormLabel
                            className={index === 0 ? `block` : `hidden`}
                          >
                            Unit Measurement
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a measurement" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {units.map((unit) => (
                                <SelectItem key={unit} value={unit}>
                                  {unit}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* NOTE: ING */}
                    <Controller
                      control={control}
                      name={`ingredients.${index}.ingredient`}
                      render={({ field }) => (
                        <FormItem className="col-span-3 lg:col-span-4">
                          <FormLabel
                            className={index === 0 ? `block` : `hidden`}
                          >
                            Ingredient
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="sugar"
                              className="col-span-1 p-2 border border-border"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="button"
                      variant="destructive"
                      className={cn(
                        `col-span-1`,
                        ingFieldArray.fields.length === 1 &&
                          `cursor-not-allowed`
                      )}
                      onClick={() => ingFieldArray.remove(index)}
                      disabled={ingFieldArray.fields.length === 1}
                    >
                      <X />
                      Delete
                    </Button>
                  </div>
                </div>
              );
            })}
            <Button
              type="button"
              className="mx-auto my-4"
              onClick={() =>
                ingFieldArray.append({
                  id: genId(),
                  ingredient: "",
                  amount: 0,
                  unitMeasurement: "",
                })
              }
            >
              <Plus />
              Add Ingredient
            </Button>
          </div>

          <Separator className="h-1 my-2 rounded-lg" />

          {/* NOTE: STEPS FIELD ARRAY */}
          <div className="">
            {stepFieldArray.fields.map((feeld, index) => {
              return (
                <div className="flex items-center gap-y-4" key={feeld?.id}>
                  <div className="grid items-end w-full grid-cols-1 lg:grid-cols-8 lg:gap-x-2">
                    <Controller
                      control={control}
                      name={`steps.${index}.step`}
                      render={({ field }) => (
                        <FormItem className="col-span-3 lg:col-span-7">
                          <FormLabel
                            className={index === 0 ? `block` : `hidden`}
                          >
                            Recipe Steps
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Boil water, eat it"
                              className="p-2 border border-border"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="button"
                      variant="destructive"
                      className={cn(
                        `col-span-1`,
                        stepFieldArray.fields.length === 1 &&
                          `cursor-not-allowed`
                      )}
                      onClick={() => stepFieldArray.remove(index)}
                      disabled={stepFieldArray.fields.length === 1}
                    >
                      <X />
                      Delete
                    </Button>
                  </div>
                </div>
              );
            })}
            <Button
              type="button"
              className="mx-auto my-4"
              onClick={() =>
                stepFieldArray.append({
                  id: genId(),
                  step: "",
                })
              }
            >
              <Plus />
              Add Step
            </Button>
          </div>

          <Separator className="h-1 my-2 rounded-lg" />

          {/* NOTE: TAGS FIELD ARRAY */}
          <div className="">
            {tagFieldArray.fields.map((feeld, index) => {
              return (
                <div className="flex items-center gap-y-4" key={feeld?.id}>
                  <div className="grid items-end w-full grid-cols-1 lg:w-2/3 lg:grid-cols-7 lg:gap-x-2">
                    <Controller
                      control={control}
                      name={`tags.${index}.tag`}
                      render={({ field }) => (
                        <FormItem className="col-span-6">
                          <FormLabel
                            className={index === 0 ? `block` : `hidden`}
                          >
                            Tags
                          </FormLabel>
                          <TagCombobox
                            uniqueTags={uniqueTags}
                            className="w-full mx-auto"
                            field={field}
                            form={form}
                            update={update}
                            index={index}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="button"
                      variant="destructive"
                      className={cn(
                        `col-span-1`,
                        tagFieldArray.fields.length === 1 &&
                          `cursor-not-allowed`
                      )}
                      onClick={() => tagFieldArray.remove(index)}
                      disabled={tagFieldArray.fields.length === 1}
                    >
                      <X />
                      Delete
                    </Button>
                  </div>
                </div>
              );
            })}
            <Button
              type="button"
              className={cn(
                `col-span-1 my-4`,
                tagFieldArray.fields.length >= 5 && `hover:cursor-not-allowed`
              )}
              onClick={() =>
                tagFieldArray.append({
                  id: genId(),
                  tag: "",
                })
              }
              disabled={tagFieldArray.fields.length >= 5}
            >
              <Plus />
              Add Tag
            </Button>
          </div>

          {!nameForImage && (
            <FileInput
              onFileChange={handleImageUpload}
              className="px-2 py-4 border rounded-md border-border"
            />
          )}
        </div>

        <Button
          type="submit"
          disabled={!isSubmittable}
          className={cn(
            `w-1/4 md:w-1/5 ml-auto`,
            !isSubmittable && `cursor-not-allowed`
          )}
        >
          Submit
        </Button>
      </form>
    </Form>
  );
}
