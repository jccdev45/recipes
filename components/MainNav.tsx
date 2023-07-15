"use client";

import { ChefHat, Edit, Home, LogIn, PlusCircle, UserCircle2, UtensilsCrossed } from 'lucide-react';
import Link from 'next/link';

import {
    NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink,
    NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle, NavigationMenuViewport
} from '@/components/ui/navigation-menu';
import { User } from '@supabase/supabase-js';

import LogoutButton from './LogoutButton';
import { TypographyList } from './typography/TypographyList';
import { TypographyP } from './typography/TypographyP';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';

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
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-1">
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                  asChild
                >
                  <a
                    className="flex flex-col justify-end w-full h-full p-6 no-underline rounded-md outline-none select-none bg-gradient-to-b from-muted/50 to-muted focus:shadow-md"
                    href="/recipes"
                  >
                    <ChefHat className="w-6 h-6" />
                    <div className="mt-4 mb-2 text-lg font-medium">Recipes</div>
                    <TypographyP className="">
                      The complete collection
                    </TypographyP>
                  </a>
                </NavigationMenuLink>
              </li>
              <li className="row-span-1">
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                  asChild
                >
                  <a
                    className="flex flex-col justify-end w-full h-full p-6 no-underline rounded-md outline-none select-none bg-gradient-to-b from-muted/50 to-muted focus:shadow-md"
                    href="/recipes/add"
                  >
                    <PlusCircle className="w-6 h-6" />
                    <div className="mt-4 mb-2 text-lg font-medium">
                      New Recipe
                    </div>
                    <TypographyP className="">
                      Got a slick new recipe? Add it!
                    </TypographyP>
                  </a>
                </NavigationMenuLink>
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
                <span className="hidden md:block">
                  {user?.user_metadata.first_name}
                </span>
              </NavigationMenuTrigger>

              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] list-none">
                  <li className="row-span-1">
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                      asChild
                    >
                      <a
                        className="flex flex-col justify-end w-full h-full p-6 no-underline rounded-md outline-none select-none bg-gradient-to-b from-muted/50 to-muted focus:shadow-md"
                        href={`/profile/${user?.id}`}
                      >
                        <UserCircle2 className="w-6 h-6" />
                        <div className="mt-4 mb-2 text-lg font-medium">
                          Profile
                        </div>
                        <TypographyP className="">{user?.email}</TypographyP>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li className="row-span-1">
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                      asChild
                    >
                      <a
                        className="flex flex-col justify-end w-full h-full p-6 no-underline rounded-md outline-none select-none bg-gradient-to-b from-muted/50 to-muted focus:shadow-md"
                        href={`/profile/${user?.id}/edit`}
                      >
                        <Edit className="w-6 h-6" />
                        <div className="mt-4 mb-2 text-lg font-medium">
                          Edit Profile
                        </div>
                        <TypographyP className="">
                          Update your information
                        </TypographyP>
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
