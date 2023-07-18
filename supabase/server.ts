import { cookies } from "next/headers";
import { cache } from "react";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import type { Database } from "@/types/supabase";
export const createSupaServer = cache(() =>
  createServerComponentClient<Database>({
    cookies,
  })
);
