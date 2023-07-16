import "./globals.css";

import { cookies } from "next/headers";

import { Footer } from "@/components/Footer";
import { MainNav } from "@/components/MainNav";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/ui/theme-toggle";
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
      <body className="relative flex flex-col min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <MainNav
            user={user}
            className="py-6 mx-auto md:p-6 max-h-20 shrink"
          />
          <main className="w-full grow">{children}</main>
          <Footer />
          <div className="fixed right-8 bottom-8">
            <ThemeToggle />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
