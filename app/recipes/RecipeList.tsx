"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";

import { TypographyH1 } from "@/components/typography/TypographyH1";
// import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import useUniqueTags from "@/hooks/useTags";
import { cn } from "@/lib/utils";
import { Recipe } from "@/types/supabase";

import { RecipeCard } from "./RecipeCard";

type RecipeListProps = {
  className: string;
  recipes: Recipe[] | null;
};

export function RecipeList({ className, recipes }: RecipeListProps) {
  // const { uniqueTags, isLoading, error } = useUniqueTags();
  // const [tagsForSort, setTagsForSort] = useState<Tag[]>([]);
  const [search, setSearch] = useState("");
  const [updatedRecipes, setUpdatedRecipes] = useState<Recipe[] | null>(
    recipes
  );

  useEffect(() => {
    if (!search) {
      setUpdatedRecipes(recipes);
    }

    const filteredRecipes = recipes?.filter((recipe) => {
      const nameMatch = recipe.recipeName
        .toLowerCase()
        .includes(search.toLowerCase());

      const authorMatch = recipe.author
        .toLowerCase()
        .includes(search.toLowerCase());

      const ingredientsMatch = recipe.ingredients.some(({ ingredient }) => {
        return ingredient.toLowerCase().includes(search.toLowerCase());
      });

      const tagSearchMatch = recipe.tags.some(({ tag }) => {
        return tag.toLowerCase().includes(search.toLowerCase());
      });

      // const tagClickMatch = recipe.tags.some(({ tag }) => {
      //   return tagsForSort.some((filter) => {
      //     return filter.tag.toLowerCase() === tag.toLowerCase();
      //   });
      // });

      return (
        nameMatch ||
        ingredientsMatch ||
        tagSearchMatch ||
        // tagClickMatch ||
        authorMatch
      );
    });

    if (filteredRecipes) {
      setUpdatedRecipes(filteredRecipes);
    }
  }, [search]);

  return (
    <div className={cn(``, className)}>
      <Label className="relative flex items-center w-full mx-auto md:w-1/2">
        <Input
          type="search"
          value={search}
          className="w-full mx-auto border border-border placeholder:text-xs md:placeholder:text-base"
          placeholder="Search recipes, ingredients, etc.."
          onChange={(e) => setSearch(e.target.value)}
        />
        <Search className="absolute right-8" />
      </Label>

      {/* <div className="flex flex-wrap items-center justify-center gap-1">
        {uniqueTags?.map(({ id, tag }) => {
          const isMatch = tagsForSort.some((tagMatch) => tag === tagMatch.tag);

          return (
            <Badge
              key={id}
              className={cn(`mx-1 relative`, isMatch && `invert`)}
              onClick={() =>
                setTagsForSort((tagsForSort) => [...tagsForSort, { id, tag }])
              }
            >
              {tag}
              <X
                className={cn(
                  `absolute top-0 right-0 w-3 h-3 translate-x-1/2 -translate-y-1/2 bg-red-400 rounded-full`,
                  !isMatch && `hidden`
                )}
                onClick={() => {
                  setTagsForSort((tagsForSort) =>
                    tagsForSort.filter((filterTag) => tag !== filterTag.tag)
                  );
                }}
              />
            </Badge>
          );
        })}
      </div> */}

      {updatedRecipes?.length === 0 && (
        <span className="mx-auto">
          <TypographyH1>No recipes found</TypographyH1>
        </span>
      )}

      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 gap-y-4 lg:gap-4">
        {updatedRecipes?.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            className="hover:shadow-xl hover:scale-[1.01] col-span-1 shadow-lg"
          />
        ))}
      </div>
    </div>
  );
}
