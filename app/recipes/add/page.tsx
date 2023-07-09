"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Controller,
  SubmitHandler,
  UseFormProps,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Database, Ingredient, Step, Tag } from "@/types/supabase";

import { cn, genId } from "@/lib/utils";
import { AddRecipeFormValues, recipeFormSchema } from "@/lib/zod/schema";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { TagCombobox } from "@/components/TagCombobox";
import { Separator } from "@/components/ui/separator";
import { X, Plus } from "lucide-react";

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

export default function AddRecipePage() {
  const [uniqueTags, setUniqueTags] = useState<Tag[]>([]);

  useEffect(() => {
    const supabase = createClientComponentClient<Database>();

    const getTags = async () => {
      const { data } = await supabase.from("recipes").select("tags");

      const tags: Tag[] = [];

      if (data) {
        data.forEach((recipe) => {
          recipe.tags.forEach((tag) => {
            const tagExists = tags.some(
              (existingTag) => existingTag.tag === tag.tag
            );

            if (!tagExists) {
              tags.push({
                id: genId(),
                tag: tag.tag,
              });
            }
          });
        });
      }

      setUniqueTags(tags);
    };

    getTags();
  }, []);

  const form = useZodForm({
    schema: recipeFormSchema,
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
  // const { update } = tagFieldArray;
  const update = (index: number, obj: { id: string; tag: string }) => {
    tagFieldArray.update(index, obj);
  };

  const isSubmittable = !!isDirty && !!isValid;

  const onSubmit: SubmitHandler<AddRecipeFormValues> = (
    values: AddRecipeFormValues,
    // e: React.FormEvent<HTMLInputElement>,
    e
  ) => {
    console.log("hi");

    e?.preventDefault();

    console.log(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid w-5/6 grid-cols-12 mx-auto gap-y-6"
      >
        <div className="grid grid-cols-1 col-span-12 lg:grid-cols-2">
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
                    className="w-full"
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

        <Separator className="h-1 my-2 rounded-lg bg-slate-400" />

        <div className="col-span-12 space-y-6">
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
                              placeholder="1.5"
                              className="col-span-1 p-2 border border-gray-300"
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
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="teaspoon"
                              className="col-span-1 p-2 border border-gray-300"
                            />
                          </FormControl>
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
                              className="col-span-1 p-2 border border-gray-300"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="button"
                      variant="destructive"
                      className="col-span-1"
                      onClick={() => ingFieldArray.remove(index)}
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
              className="mx-auto my-4 bg-blue-600"
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

          <Separator className="h-1 my-2 rounded-lg bg-slate-400" />

          {/* NOTE: STEPS FIELD ARRAY */}
          <div className="">
            {stepFieldArray.fields.map((feeld, index) => {
              const errorForField = errors?.steps?.[index]?.step;
              return (
                <div className="flex items-center gap-y-4" key={feeld?.id}>
                  <div className="grid items-end w-full grid-cols-1 lg:grid-cols-8 lg:gap-x-2">
                    <Controller
                      control={control}
                      name={`steps.${index}.step`}
                      render={({ field }) => (
                        <FormItem className="col-span-3 lg:col-span-6">
                          <FormLabel
                            className={index === 0 ? `block` : `hidden`}
                          >
                            Recipe Steps
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Boil water, eat it"
                              className="col-span-7 p-2 border border-gray-300"
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
                      className="col-span-1"
                      onClick={() => stepFieldArray.remove(index)}
                    >
                      <X />
                      Delete
                    </Button>
                  </div>

                  <p className="col-span-1">
                    {errorForField?.message ?? <>&nbsp;</>}
                  </p>
                </div>
              );
            })}
            <Button
              type="button"
              className="mx-auto my-4 bg-blue-600"
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

          <Separator className="h-1 my-2 rounded-lg bg-slate-400" />

          {/* NOTE: TAGS FIELD ARRAY */}
          <div className="">
            {tagFieldArray.fields.map((feeld, index) => {
              return (
                <div className="flex items-center gap-y-4" key={feeld?.id}>
                  <div className="grid w-full grid-cols-1 lg:grid-cols-5 lg:gap-x-2">
                    <Controller
                      control={control}
                      name={`tags.${index}.tag`}
                      render={({ field }) => (
                        <FormItem className="col-span-4">
                          <FormLabel
                            className={index === 0 ? `block` : `hidden`}
                          >
                            Tags
                          </FormLabel>
                          <TagCombobox
                            uniqueTags={uniqueTags}
                            className="w-1/2 mx-auto"
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
                      className="col-span-1"
                      onClick={() => tagFieldArray.remove(index)}
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
              className="mx-auto my-4 bg-blue-600"
              onClick={() =>
                tagFieldArray.append({
                  id: genId(),
                  tag: "",
                })
              }
            >
              <Plus />
              Add Tag
            </Button>
          </div>
        </div>

        <Button type="submit" disabled={isSubmittable}>
          Submit
        </Button>
      </form>
    </Form>
  );
}
