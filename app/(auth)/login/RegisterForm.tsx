"use client";

import Link from 'next/link';
import { Dispatch, SetStateAction, useState } from 'react';
import { useForm } from 'react-hook-form';

import { FileInput } from '@/app/recipes/add/ImageUpload';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { userFormItems } from '@/lib/constants';
import { cn, trimAvatarUrl } from '@/lib/utils';
import { RegisterFormValues, RegisterSchema } from '@/lib/zod/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';

type RegisterFormProps = {
  className: string;
  setView?: Dispatch<SetStateAction<string>>;
  type: "register" | "edit-profile";
  user?: User | null;
};

type FormItems = {
  fieldName: "";
};

export function RegisterForm({
  className,
  setView,
  type,
  user,
}: RegisterFormProps) {
  const supabase = createClientComponentClient();

  const [imgURL, setImgURL] = useState("");
  const [authError, setAuthError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues:
      type === "register"
        ? {
            email: "",
            password: "",
            confirm_password: "",
            first_name: "",
            last_name: "",
          }
        : {
            email: user?.email,
            password: "",
            confirm_password: "",
            first_name: user?.user_metadata.first_name,
            last_name: user?.user_metadata.last_name,
          },
    mode: "onChange",
  });

  const {
    formState: { errors, isValid, isDirty, isSubmitting, dirtyFields },
  } = form;

  const registerSubmittable = !!isValid && !!isDirty;
  const editSubmittable = !!isDirty && !!errors && !!isValid;

  const handleImageUpload = async (file: File | null) => {
    const fileExt = file?.name.split(".").pop();
    const filePath = `avatar/${Math.random()}.${fileExt}`;
    const trimmedUpdatePath = trimAvatarUrl(user?.user_metadata.avatar_url);

    if (file) {
      setIsUploading(true);

      const { data, error } =
        type === "register"
          ? await supabase.storage.from("photos").upload(filePath, file, {
              cacheControl: "3600",
              upsert: false,
            })
          : await supabase.storage
              .from("photos")
              .update(trimmedUpdatePath, file, {
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

  const handleSubmit = async (values: RegisterFormValues) => {
    const authValues = {
      email: values.email,
      password: values.password,
    };
    const dataValues = {
      data: {
        first_name: values.first_name,
        last_name: values.last_name,
        avatar_url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos/${imgURL}`,
      },
    };

    const { data, error } =
      type === "register"
        ? await supabase.auth.signUp({
            ...authValues,
            options: {
              emailRedirectTo: `${location.origin}/auth/callback`,
              ...dataValues,
            },
          })
        : await supabase.auth.updateUser({
            ...authValues,
            ...dataValues,
          });

    if (data && type === "register") {
      setView && setView("check-email");
    }

    if (data && type === "edit-profile") {
      setView && setView("change-email");
    }

    if (error) {
      console.log(error);
      setAuthError(error.message);
    }
  };

  authError && <div>{authError}</div>;
  uploadError && <div>{uploadError}</div>;

  return (
    <Form {...form}>
      <form
        className={cn(
          `border shadow-xl rounded-lg border-slate-300 bg-background dark:bg-stone-900 text-foreground`,
          className
        )}
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        {userFormItems.map(({ id, fieldName, placeholder, label }) => (
          <FormField
            key={id}
            control={form.control}
            // @ts-expect-error
            name={fieldName}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                  <Input
                    className="px-4 py-2 mb-6 border rounded-md shadow-inner bg-inherit"
                    placeholder={placeholder}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <FileInput
          isUploading={isUploading}
          onFileChange={handleImageUpload}
          className="flex items-center w-full p-3 my-3 border border-gray-500 rounded-md"
        />

        {type === "register" ? (
          <Button
            type="submit"
            disabled={!registerSubmittable || isSubmitting}
            className="w-1/4 mx-auto"
          >
            Sign Up
          </Button>
        ) : (
          <>
            {/* <div className="flex items-center gap-x-1">
              Changes made to:{" "}
              {Object.keys(dirtyFields).map((field) => (
                <Badge key={field}>{field}</Badge>
              ))}
            </div> */}
            <div className="flex items-center gap-x-4">
              <AlertDialog>
                <AlertDialogTrigger className="w-1/4 mx-auto">
                  Cancel
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Any changes you may have made will be discarded. Do you
                      still want to exit?
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction>
                        <Link href={`/profile/${user?.id}`}>Confirm</Link>
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogHeader>
                </AlertDialogContent>
              </AlertDialog>

              <Button
                type="submit"
                disabled={!editSubmittable || isSubmitting}
                className="w-1/4 mx-auto"
              >
                Update
              </Button>
            </div>
          </>
        )}
      </form>
    </Form>
  );
}
