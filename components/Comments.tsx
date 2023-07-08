"use client";

import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Comment as CommentType, Database } from "@/types/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Form } from "./ui/form";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type CommentsSectionProps = {
  id: number;
};

export async function CommentsSection({ id }: CommentsSectionProps) {
  const supabase = createClientComponentClient<Database>();
  const { data: comments } = await supabase
    .from("comments")
    .select("*")
    .eq("recipeId", id);

  return (
    <div className="flex flex-col items-start">
      <form>
        <Label htmlFor="comment-form"></Label>
        <Input id="comment-form" />
        <Button type="submit">Submit</Button>
      </form>

      {comments?.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  );
}

type CommentProps = {
  comment: CommentType;
};

function Comment({ comment }: CommentProps) {
  const {
    author,
    createdAt,
    id,
    likedBy,
    likes,
    message,
    recipeId,
    userId,
  } = comment;

  return (
    <div className="">
      <p className="prose">{message}</p>
      <Link
        href={`/profile/${userId}`}
        className="flex items-center underline gap-x-4"
      >
        <Avatar>
          <AvatarImage src="https://placehold.it/100" />
          <AvatarFallback>OK</AvatarFallback>
        </Avatar>
        <span className="font-bold underline">{author}</span>
      </Link>
    </div>
  );
}
