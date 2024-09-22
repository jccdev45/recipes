import { createClient } from "@/supabase/client"
import { useQuery } from "@tanstack/react-query"

import { Ingredient, UnitMeasurement } from "@/lib/types"

export default function useUnits() {
  const supabase = createClient()

  return useQuery({
    queryKey: ["units"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recipes")
        .select("ingredients")

      if (error) {
        throw new Error(error.message)
      }

      const typedData = data as unknown as { ingredients: Ingredient[] }[]

      const units: Set<UnitMeasurement> = new Set()

      if (typedData) {
        typedData.forEach((recipe) => {
          recipe.ingredients.forEach((ingredient) => {
            if (ingredient?.unitMeasurement) {
              units.add(ingredient?.unitMeasurement)
            }
          })
        })
      }

      const unitArray: Array<UnitMeasurement> = Array.from(units)
      const additionalUnits: Array<UnitMeasurement> = [
        "gram",
        "milliliter",
        "whole",
        "sprig",
        "pinch",
      ]
      additionalUnits.forEach((unit) => {
        if (!units.has(unit)) {
          unitArray.push(unit)
        }
      })

      return unitArray
    },
  })
}
