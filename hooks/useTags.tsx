import { createClient } from "@/supabase/client"
import { useQuery } from "@tanstack/react-query"

import { Tag } from "@/lib/types"
import { genId } from "@/lib/utils"

export default function useUniqueTags() {
  const supabase = createClient()

  return useQuery({
    queryKey: ["uniqueTags"],
    queryFn: async () => {
      const { data, error } = await supabase.from("recipes").select("tags")

      if (error) {
        throw new Error(error.message)
      }

      const tags = data as unknown as { tags: Tag[] }[]

      const uniqueTags = tags.reduce((acc: Tag[], recipe) => {
        recipe.tags.forEach((tag) => {
          const tagExists = acc.some(
            (existingTag) => existingTag.tag === tag?.tag
          )

          if (!tagExists && tag?.tag) {
            acc.push({
              id: genId(),
              tag: tag.tag,
            })
          }
        })
        return acc
      }, [])

      return uniqueTags
    },
  })
}
