import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getOne } from "@/supabase/helpers";
import { Database, Recipe } from "@/types/supabase";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

// export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { user_id: string } }
) {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  const queryParams = {
    filters: {
      column: "id",
      value: params.user_id,
    },
  };

  try {
    const data: Recipe = await getOne(supabase, "profiles", queryParams);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error: ", error);
    return null;
  }
}
