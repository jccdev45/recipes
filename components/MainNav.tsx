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
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { User } from "@supabase/supabase-js";

import LogoutButton from "./LogoutButton";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

type MainNavProps = { className: string; user: User | null };

export function MainNav({ user, className }: MainNavProps) {
  return (
    <NavigationMenu className={className}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <Home />
              Home
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <ChefHat />
            Recipes
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-1">
                <NavigationMenuLink asChild>
                  <a
                    className="flex flex-col justify-end w-full h-full p-6 no-underline rounded-md outline-none select-none bg-gradient-to-b from-muted/50 to-muted focus:shadow-md"
                    href="/recipes"
                  >
                    <Home className="w-6 h-6" />
                    <div className="mt-4 mb-2 text-lg font-medium">Recipes</div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      The complete collection
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <li className="row-span-1">
                <NavigationMenuLink asChild>
                  <a
                    className="flex flex-col justify-end w-full h-full p-6 no-underline rounded-md outline-none select-none bg-gradient-to-b from-muted/50 to-muted focus:shadow-md"
                    href="/recipes/add"
                  >
                    <PlusCircle className="w-6 h-6" />
                    <div className="mt-4 mb-2 text-lg font-medium">
                      New Recipe
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Got a slick new recipe? Add it!
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        {/* <NavigationMenuItem>
          <Link href="/recipes" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <UtensilsCrossed />
              Recipes
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem> */}

        <NavigationMenuItem>
          {!user ? (
            <Button asChild>
              <Link href="/login" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <LogIn />
                  Login
                </NavigationMenuLink>
              </Link>
            </Button>
          ) : (
            // <Link href={`/profile/${user?.id}`} legacyBehavior passHref>
            //   <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            //     <Avatar>
            //       <AvatarImage src={user?.user_metadata.avatar_url} />
            //       <AvatarFallback>OK</AvatarFallback>
            //     </Avatar>
            //     <span>Profile</span>
            //   </NavigationMenuLink>
            // </Link>
            <>
              <NavigationMenuTrigger>
                <Avatar>
                  <AvatarImage src={user?.user_metadata.avatar_url} />
                  <AvatarFallback>
                    <UserCircle2 />
                  </AvatarFallback>
                </Avatar>
                <span>{user?.user_metadata.first_name}</span>
              </NavigationMenuTrigger>

              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-1">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex flex-col justify-end w-full h-full p-6 no-underline rounded-md outline-none select-none bg-gradient-to-b from-muted/50 to-muted focus:shadow-md"
                        href={`/profile/${user?.id}`}
                      >
                        <UserCircle2 className="w-6 h-6" />
                        <div className="mt-4 mb-2 text-lg font-medium">
                          Profile
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          {user?.email}
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li className="row-span-1">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex flex-col justify-end w-full h-full p-6 no-underline rounded-md outline-none select-none bg-gradient-to-b from-muted/50 to-muted focus:shadow-md"
                        href={`/profile/${user?.id}/edit`}
                      >
                        <Edit className="w-6 h-6" />
                        <div className="mt-4 mb-2 text-lg font-medium">
                          Edit Profile
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Update your information
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li className="row-span-1">
                    <LogoutButton />
                  </li>
                </ul>
              </NavigationMenuContent>
            </>
          )}
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
