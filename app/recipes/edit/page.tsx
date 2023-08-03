import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { TypographyH1, TypographyP } from "@/components/typography";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export default async function EditRecipePage() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <section>
      <TypographyH1>Profile</TypographyH1>
      <TypographyP>{user?.email}</TypographyP>
    </section>
  );
}
