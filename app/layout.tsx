import "./globals.css";

import { Footer } from "@/components/Footer";
import { MainNav } from "@/components/MainNav";
import { ThemeProvider } from "@/components/theme-provider";
import { getAuthUser } from "@/supabase/helpers";
import { createSupaServer } from "@/supabase/server";

import Searchbar from "./recipes/Search";

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
  const supabase = createSupaServer();
  const user = (await getAuthUser(supabase)) || null;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="relative min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex flex-col justify-between max-w-screen-xl min-h-screen mx-auto">
            <MainNav
              user={user}
              className="py-6 mx-auto md:p-6 max-h-24 shrink"
            />
            <Searchbar className="flex items-center w-5/6 mx-auto my-2 md:w-1/2" />
            <main className="w-full h-full grow">{children}</main>
            <Footer className="w-full py-8" user={user} />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
