import { useEffect, useState } from "react";

import { createSupaClient } from "@/supabase/client";
import { getAll } from "@/supabase/helpers";
import { Recipe, UnitMeasurement } from "@/types/supabase";

export default function useUnits() {
  const supabase = createSupaClient();
  const [units, setUnits] = useState<UnitMeasurement[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUnits = async (): Promise<void> => {
      setLoading(true);
      const data: Recipe[] | null = await getAll(
        {
          db: "recipes",
          column: "ingredients",
        },
        supabase
      );

      const units: Set<UnitMeasurement> = new Set();

      if (data) {
        data.forEach((recipe) => {
          recipe.ingredients.forEach((unit) => {
            if (unit.unitMeasurement) {
              units.add(unit.unitMeasurement);
            }
          });
        });
      }

      const unitArray: Array<UnitMeasurement> = Array.from(units);
      const additionalUnits: Array<UnitMeasurement> = [
        "gram",
        "milliliter",
        "whole",
        "sprig",
        "pinch",
      ];
      additionalUnits.forEach((unit) => {
        if (!units.has(unit)) {
          unitArray.push(unit);
        }
      });

      // if (error) {
      //   setError(error.message)
      // }

      setLoading(false);
      setUnits(unitArray);
    };

    getUnits();
  }, []);

  return {
    loading,
    units,
  };
}
