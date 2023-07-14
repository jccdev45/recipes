"use client";

import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useState } from 'react';
import { useForm } from 'react-hook-form';

import { FileInput } from '@/app/recipes/add/ImageUpload';
import { Button } from '@/components/ui/button';
import { ButtonLoading } from '@/components/ui/button-loading';
import {
    Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RegisterFormValues, RegisterSchema } from '@/lib/zod/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { AuthError, User } from '@supabase/supabase-js';

type RegisterFormProps = {
  setView: Dispatch<SetStateAction<string>>;
};

export function RegisterForm({ setView }: RegisterFormProps) {
  const supabase = createClientComponentClient();

  const [imgURL, setImgURL] = useState("");
  const [authError, setAuthError] = useState<AuthError | null>();
  const [uploadError, setUploadError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      confirm_password: "",
      first_name: "",
      last_name: "",
    },
    mode: "onChange",
  });

  const {
    formState: { errors, isValid, isDirty, isSubmitting },
  } = form;

  const isSubmittable = !!isValid && !!isDirty;

  const handleImageUpload = async (file: File | null) => {
    const fileExt = file?.name.split(".").pop();
    const filePath = `${form.getValues("email")}/${Math.random()}.${fileExt}`;

    if (file) {
      setIsUploading(true);

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

  const handleSignUp = async (values: RegisterFormValues) => {
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
        data: {
          first_name: values.first_name,
          last_name: values.last_name,
          avatar_url: imgURL,
        },
      },
    });

    data && setView("check-email");

    if (error) {
      console.log(error);
      setAuthError(error);
    }
  };

  authError && <div>{authError.message}</div>;

  const emailForImage = !errors.email && form.getValues("email").length > 0;

  return (
    <Form {...form}>
      <form
        className="flex flex-col justify-center flex-1 w-full gap-2 mx-auto text-foreground"
        onSubmit={form.handleSubmit(handleSignUp)}
      >
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input
                  className="px-4 py-2 mb-6 border rounded-md bg-inherit"
                  placeholder="Mark"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input
                  className="px-4 py-2 mb-6 border rounded-md bg-inherit"
                  placeholder="Jobber"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  className="px-4 py-2 mb-6 border rounded-md bg-inherit"
                  placeholder="you@example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  className="px-4 py-2 mb-6 border rounded-md bg-inherit"
                  placeholder="••••••••"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirm_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  className="px-4 py-2 mb-6 border rounded-md bg-inherit"
                  placeholder="••••••••"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {emailForImage && (
          <FileInput
            onFileChange={handleImageUpload}
            className="flex items-center w-full p-3 my-3 border border-gray-500 rounded-md"
          />
        )}

        {isUploading ? (
          <ButtonLoading className="w-1/3 mx-auto" />
        ) : (
          <Button
            type="submit"
            disabled={!isSubmittable || isSubmitting}
            className="w-1/3 mx-auto"
          >
            Sign Up
          </Button>
        )}
      </form>
    </Form>
  );
}
