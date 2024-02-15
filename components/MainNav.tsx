"use client"

import Link from "next/link"
import { AvatarProps } from "@radix-ui/react-avatar"
import { User } from "@supabase/supabase-js"
import {
  ChefHat,
  Edit,
  Home,
  LogIn,
  PlusCircle,
  UserCircle2,
  UtensilsCrossed,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { TypographyP } from "@/components/ui/typography"

import LogoutButton from "./LogoutButton"

interface MainNavProps extends AvatarProps {
  className: string
  user: User | null
}

export function MainNav({ user, className, ...props }: MainNavProps) {
  return (
    <NavigationMenu className={className}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} href="/">
            <Home />
            <span className="hidden md:block">Home</span>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <UtensilsCrossed />
            <span className="hidden md:block">Recipes</span>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-72 gap-3 p-4 md:grid-cols-1">
              <li className="col-span-1 row-span-1">
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                  asChild
                >
                  <a
                    className="space-4 block select-none rounded-md leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/recipes"
                  >
                    <ChefHat className="h-8 w-8" />
                    <div className="mx-2 text-sm font-medium leading-none">
                      Recipes
                    </div>
                  </a>
                </NavigationMenuLink>
                <TypographyP className="line-clamp-2 block text-sm text-muted-foreground">
                  The complete collection
                </TypographyP>
              </li>
              <li className="row-span-1">
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                  asChild
                >
                  <a
                    className="space-4 block select-none rounded-md leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/recipes/add"
                  >
                    <PlusCircle className="h-8 w-8" />
                    <div className="mx-2 text-sm font-medium leading-none">
                      New Recipe
                    </div>
                  </a>
                </NavigationMenuLink>
                <TypographyP className="line-clamp-2 block text-sm text-muted-foreground">
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
                <Avatar {...props}>
                  <AvatarImage
                    src={user.user_metadata.avatar_url}
                    className="object-cover"
                  />
                  <AvatarFallback>
                    <span className="sr-only">{user.email}</span>
                    <UserCircle2 />
                  </AvatarFallback>
                </Avatar>
                <span className="hidden truncate md:block">
                  {user.user_metadata.first_name}
                </span>
              </NavigationMenuTrigger>

              <NavigationMenuContent>
                <ul className="grid w-72 gap-3 p-4 md:grid-cols-1">
                  <li className="row-span-1">
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                      asChild
                    >
                      <a
                        className="space-4 block select-none rounded-md leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        href={`/profile/${user.id}`}
                      >
                        <UserCircle2 className="h-8 w-8" />
                        <div className="mx-2 text-sm font-medium leading-none">
                          Profile
                        </div>
                      </a>
                    </NavigationMenuLink>
                    <TypographyP className="line-clamp-2 block truncate text-sm text-muted-foreground">
                      {user.email}
                    </TypographyP>
                  </li>
                  <li className="row-span-1">
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                      asChild
                    >
                      <a
                        className="space-4 block select-none rounded-md leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        href={`/profile/${user.id}/edit`}
                      >
                        <Edit className="h-8 w-8" />
                        <div className="mx-2 text-sm font-medium leading-none">
                          Edit Profile
                        </div>
                      </a>
                    </NavigationMenuLink>
                    <TypographyP className="line-clamp-2 block text-sm text-muted-foreground">
                      Update your information
                    </TypographyP>
                  </li>

                  <Separator className="my-1 h-2 w-full rounded-lg bg-foreground" />

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
  )
}
