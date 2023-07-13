import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { MainNav } from "@/components/MainNav";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata = {
  title: "Medina Recipes",
  description:
    "Collection of signature recipes from the Medina Collective. Expect lots of flavor and lots of love. Enjoy.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-background">
        <MainNav user={user} className="p-6 mx-auto" />
        <main className="w-full grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
