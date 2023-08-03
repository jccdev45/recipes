"use client";

import {
  ChefHat,
  Edit,
  Home,
  LogIn,
  PlusCircle,
  UserCircle2,
  UtensilsCrossed,
} from "lucide-react";
import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { User } from "@supabase/supabase-js";

import LogoutButton from "./LogoutButton";
import { TypographyP } from "./typography";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { ThemeToggle } from "./ui/theme-toggle";

type MainNavProps = { className: string; user: User | null };

export function MainNav({ user, className }: MainNavProps) {
  return (
    <NavigationMenu className={className}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <Home />
              <span className="hidden md:block">Home</span>
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <UtensilsCrossed />
            <span className="hidden md:block">Recipes</span>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:grid-cols-1 w-72">
              <li className="col-span-1 row-span-1">
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                  asChild
                >
                  <a
                    className="block leading-none no-underline transition-colors rounded-md outline-none select-none space-4 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/recipes"
                  >
                    <ChefHat className="w-8 h-8" />
                    <div className="mx-2 text-sm font-medium leading-none">
                      Recipes
                    </div>
                  </a>
                </NavigationMenuLink>
                <TypographyP className="block text-sm line-clamp-2 text-muted-foreground">
                  The complete collection
                </TypographyP>
              </li>
              <li className="row-span-1">
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                  asChild
                >
                  <a
                    className="block leading-none no-underline transition-colors rounded-md outline-none select-none space-4 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/recipes/add"
                  >
                    <PlusCircle className="w-8 h-8" />
                    <div className="mx-2 text-sm font-medium leading-none">
                      New Recipe
                    </div>
                  </a>
                </NavigationMenuLink>
                <TypographyP className="block text-sm line-clamp-2 text-muted-foreground">
                  Got a slick new recipe? Add it!
                </TypographyP>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          {!user ? (
            <Button asChild>
              <Link href="/login" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <LogIn />
                  <span className="hidden md:block">Login</span>
                </NavigationMenuLink>
              </Link>
            </Button>
          ) : (
            <>
              <NavigationMenuTrigger>
                <Avatar>
                  <AvatarImage src={user?.user_metadata.avatar_url} />
                  <AvatarFallback>
                    <UserCircle2 />
                  </AvatarFallback>
                </Avatar>
                <span className="hidden truncate md:block">
                  {user?.user_metadata.first_name}
                </span>
              </NavigationMenuTrigger>

              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:grid-cols-1 w-72">
                  <li className="row-span-1">
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                      asChild
                    >
                      <a
                        className="block leading-none no-underline transition-colors rounded-md outline-none select-none space-4 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        href={`/profile/${user?.id}`}
                      >
                        <UserCircle2 className="w-8 h-8" />
                        <div className="mx-2 text-sm font-medium leading-none">
                          Profile
                        </div>
                      </a>
                    </NavigationMenuLink>
                    <TypographyP className="block text-sm truncate line-clamp-2 text-muted-foreground">
                      {user?.email}
                    </TypographyP>
                  </li>
                  <li className="row-span-1">
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                      asChild
                    >
                      <a
                        className="block leading-none no-underline transition-colors rounded-md outline-none select-none space-4 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        href={`/profile/${user?.id}/edit`}
                      >
                        <Edit className="w-8 h-8" />
                        <div className="mx-2 text-sm font-medium leading-none">
                          Edit Profile
                        </div>
                      </a>
                    </NavigationMenuLink>
                    <TypographyP className="block text-sm line-clamp-2 text-muted-foreground">
                      Update your information
                    </TypographyP>
                  </li>

                  <Separator className="w-full h-2 my-1 rounded-lg bg-foreground" />

                  <li className="row-span-1 ml-auto">
                    <LogoutButton />
                  </li>
                </ul>
              </NavigationMenuContent>
            </>
          )}
        </NavigationMenuItem>
        <NavigationMenuItem>
          <ThemeToggle />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
