"use client";

import { Heart, UserCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { TypographyH4, TypographyP } from "@/components/typography";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CommentFormValues, CommentSchema } from "@/lib/zod/schema";
import { createSupaClient } from "@/supabase/client";
import { getAll } from "@/supabase/helpers";
import { Comment as CommentType } from "@/types/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@supabase/auth-helpers-nextjs";

type CommentsSectionProps = {
  className: string;
  currentUser: User | null;
  recipe_id: number;
};
const supabase = createSupaClient();

export function CommentsSection({
  className,
  currentUser,
  recipe_id,
}: CommentsSectionProps) {
  const [comments, setComments] = useState<Array<CommentType>>([]);

  useEffect(() => {
    const getComments = async () => {
      const params = {
        db: "comments",
        params: {
          filters: {
            column: "recipe_id",
            value: recipe_id,
          },
          order: {
            column: "created_at",
            ascending: false,
          },
        },
      };

      const comments: CommentType[] | null = await getAll(params, supabase);

      if (comments) {
        setComments(comments);
      }
    };

    getComments();
  }, [supabase, setComments]);

  const form = useForm<CommentFormValues>({
    resolver: zodResolver(CommentSchema),
    defaultValues: {
      message: "",
    },
  });

  const {
    handleSubmit,
    formState: { errors, isDirty, isValid, isSubmitting },
  } = form;
  const isSubmittable = !!isValid && !!isDirty;

  // TODO: ADD LOADING STATES FOR COMMENT SUBMIT
  const handleSubmitComment = async (values: CommentFormValues) => {
    const author = currentUser?.user_metadata.first_name
      ? currentUser?.user_metadata.first_name
      : currentUser?.email;

    const newValues = {
      author: author.toString(),
      avatar_url: null,
      message: values.message,
      liked_by: [""],
      likes: 0,
      recipe_id: recipe_id,
      user_id: currentUser?.id,
    };

    const { data, error } = await supabase.from("comments").insert(newValues);

    if (data) {
      setComments([...comments, data]);
      form.reset();
    }
  };

  return (
    <div className={cn(`space-y-8 p-4`, className)}>
      <Form {...form}>
        <form
          className="flex flex-col w-full max-w-2xl my-0 rounded-lg"
          onSubmit={handleSubmit(handleSubmitComment)}
        >
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Leave a comment</FormLabel>
                <FormControl>
                  <Textarea
                    className=""
                    placeholder={
                      currentUser
                        ? "Wow great recipe!"
                        : "You must be signed in to comment"
                    }
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="my-2 ml-auto"
            disabled={!currentUser || !isSubmittable}
          >
            Submit
          </Button>
        </form>
      </Form>

      {!comments && (
        <div className="flex">
          <Skeleton className="w-10 h-10" />

          <div>
            <Skeleton className="w-10 h-4" />
            <Skeleton className="w-12 h-4" />
            <Skeleton className="w-16 h-4" />
            <Skeleton className="w-6 h-6" />
          </div>
        </div>
      )}

      {/* {comments?.length === 0 && <TypographyH4>No comments yet</TypographyH4>} */}

      {comments?.map((comment) => (
        <Comment key={comment.id} comment={comment} currentUser={currentUser} />
      ))}
    </div>
  );
}

type CommentProps = {
  comment: CommentType;
  currentUser: User | null;
};

function Comment({ comment, currentUser }: CommentProps) {
  const router = useRouter();
  const {
    author,
    avatar_url,
    created_at,
    id,
    liked_by,
    likes,
    message,
    recipe_id,
    user_id,
  } = comment;
  const [liked, setLiked] = useState(likes);

  const handleLike = async () => {
    if (liked_by.includes(user_id)) {
      return;
    } else {
      const { data, error } = await supabase
        .from("comments")
        .update({ likes: likes + 1, liked_by: [...liked_by, user_id] })
        .eq("id", id)
        .select();

      if (data) {
        // setLiked(data?.[0].likes);
        console.log(data);
      }
    }
  };

  const handleDelete = async () => {
    try {
      const { data, error } = await supabase
        .from("comments")
        .delete()
        .eq("id", id)
        .select();

      if (data) {
        router.refresh();
      }
      if (error) {
      }
    } catch (error) {
      console.error("Error: ", error);
      return null;
    }
  };

  return (
    <div className="relative flex w-full p-2 border rounded-md shadow-md md:w-1/2 bg-background dark:bg-slate-900 border-foreground/40">
      <Avatar className="mr-2">
        <AvatarImage src={avatar_url || ``} />
        <AvatarFallback>
          <UserCircle2 />
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col w-full m-0">
        <Link
          href={`/profile/${user_id}`}
          className="font-bold underline gap-x-4 max-w-max"
        >
          {author}
        </Link>
        <span className="text-sm max-w-max">
          {new Date(created_at).toLocaleDateString()}
        </span>
        <TypographyP>{message}</TypographyP>
      </div>

      {/* <div className="flex items-center justify-center h-10 ml-auto gap-x-2">
        <Heart
          color="red"
          className={cn(
            `active:animate-ping bg-gradient-to-br bg-clip-text from-red-500 to-red-800 fill-red-400`,
            liked_by.includes(user_id) && `cursor-default`
          )}
          onClick={handleLike}
        />
        <span className="">{liked}</span>
      </div> */}

      {currentUser?.id === user_id && (
        <AlertDialog>
          <AlertDialogTrigger>
            <Badge variant="destructive" className="absolute bottom-2 right-2">
              Delete
            </Badge>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to delete this comment?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="shadow-sm bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
