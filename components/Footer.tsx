import { Github, Heart, Linkedin, UtensilsCrossed } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { User } from "@supabase/supabase-js";

import { TypographyP } from "./typography";

export function Footer({
  className,
  user,
}: {
  className?: string;
  user: User | null;
}) {
  return (
    <footer className={cn(``, className)}>
      <div className="flex flex-col flex-wrap px-5 mx-auto md:items-center lg:items-start md:flex-row md:flex-nowrap">
        <div className="flex-shrink-0 w-64 mx-auto mt-10 text-center md:mx-0 md:text-left md:mt-0">
          <div className="flex items-center justify-center font-medium title-font md:justify-start">
            <UtensilsCrossed className="w-20 h-20" />
            <span className="ml-3 text-xl">Medina Family Recipes</span>
          </div>
        </div>
        <div className="flex flex-wrap flex-grow order-first -mb-10 text-center md:pr-20 md:text-left">
          <div className="w-full px-4 lg:w-1/4 md:w-1/2">
            <nav className="flex flex-col mb-10">
              <Link href="/" className="">
                Home
              </Link>
              <Link href="/recipes" className="">
                Recipes
              </Link>
              <Link href={`/profile/${user?.id}`}>Profile</Link>
            </nav>
          </div>
        </div>
      </div>
      <div className="container flex flex-col items-center justify-center w-full px-5 py-4 mx-auto md:max-w-sm">
        <TypographyP className="text-center">
          Made (with love) by{" "}
          <Link
            href="https://jccdev.tech"
            rel="noopener noreferrer"
            className="flex items-center justify-center my-1 underline"
            target="_blank"
          >
            @jccdev
            <Heart className="ml-1 no-underline bg-gradient-to-br bg-clip-text from-red-500 to-red-800 fill-red-800" />
          </Link>
        </TypographyP>
        <span className="inline-flex justify-center gap-x-2">
          <Link
            className="large"
            href="https://www.github.com/jccdev45"
            target="_blank"
          >
            <Github />
          </Link>
          <Link
            className="large"
            href="https://www.linkedin.com/in/jordan-cruz-correa"
            target="_blank"
          >
            <Linkedin />
          </Link>
        </span>
      </div>
    </footer>
  );
}
