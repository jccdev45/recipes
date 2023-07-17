import "./globals.css";

import { cookies } from "next/headers";

import { Footer } from "@/components/Footer";
import { MainNav } from "@/components/MainNav";
import { ThemeProvider } from "@/components/theme-provider";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

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
    <html lang="en" suppressHydrationWarning>
      <body className="relative flex flex-col max-w-screen-xl min-h-screen mx-auto">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <MainNav
            user={user}
            className="py-6 mx-auto md:p-6 max-h-24 shrink"
          />
          <main className="w-full grow">{children}</main>
          <Footer className="w-full" user={user} />
        </ThemeProvider>
      </body>
    </html>
  );
}
