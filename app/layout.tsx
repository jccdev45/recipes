import { MainNav } from "@/components/MainNav";
import "./globals.css";

export const metadata = {
  title: "Medina Recipes",
  description:
    "Collection of signature recipes from the Medina Collective. Expect lots of flavor and lots of love. Enjoy.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main className="flex flex-col items-center min-h-screen bg-background">
          <MainNav />
          {children}
        </main>
      </body>
    </html>
  );
}
