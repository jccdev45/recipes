import { useEffect, useState } from "react";

import { genId } from "@/lib/utils";
import { Database, Tag } from "@/types/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function useUniqueTags() {
  const supabase = createClientComponentClient<Database>();
  const [uniqueTags, setUniqueTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const getTags = async () => {
      setIsLoading(true);
      const { data, error } = await supabase.from("recipes").select("tags");

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

      if (error) {
        setError(error.message);
      }

      setIsLoading(false);
      setUniqueTags(tags);
    };

    getTags();
  }, []);

  return {
    error,
    isLoading,
    uniqueTags,
  };
}
