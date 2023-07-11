import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Recipe } from "@/types/supabase";
import { AspectRatio } from "./ui/aspect-ratio";
import { Badge } from "./ui/badge";
import { cn, shimmer, toBase64 } from "@/lib/utils";

type RecipeCardProps = {
  recipe: Recipe;
  className: string;
};

export function RecipeCard({ recipe, className }: RecipeCardProps) {
  const { author, id, img, quote, recipeName, slug, tags, user_id } = recipe;

  return (
    <Card className={cn(`rounded-md bg-zinc-200`, className)}>
      <CardHeader className="flex flex-col items-center w-full">
        <AspectRatio ratio={3 / 2}>
          <Image
            src={img || `https://placehold.it/350`}
            alt={recipeName}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover w-auto h-auto rounded-lg"
            placeholder="blur"
            blurDataURL={`data:image/svg+xml;base64,${toBase64(
              shimmer(304, 203)
            )}`}
          />
        </AspectRatio>
        <CardTitle>
          <Link href={`/recipes/${slug}`} className="underline">
            {recipeName}
          </Link>
        </CardTitle>
        <CardDescription>
          "{quote}" -
          {user_id ? (
            <Link href={`/profile/${user_id}`} className="underline">
              {author}
            </Link>
          ) : (
            author
          )}
        </CardDescription>
        <CardFooter>
          {tags.map(({ tag, id }) => (
            <Badge key={id} className="mx-1">
              {tag}
            </Badge>
          ))}
        </CardFooter>
      </CardHeader>
    </Card>
  );
}
