import { MainNav } from "@/components/MainNav";
import { Footer } from "@/components/Footer";
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
      <body className="flex flex-col items-center min-h-screen bg-background">
        <MainNav />
        <main className="h-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
