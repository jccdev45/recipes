import { Database } from "@/types/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const createSupaClient = () => createClientComponentClient<Database>();
