"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { AvatarProps } from "@radix-ui/react-avatar"
import {
  ChefHat,
  Edit,
  Home,
  LogIn,
  LogOut,
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
import { Typography } from "@/components/ui/typography"
import { logout } from "@/app/(auth)/actions"

import type { User } from "@supabase/supabase-js"

interface MainNavProps extends AvatarProps {
  className: string
  user: User | null
}

export function MainNav({ user, className, ...props }: MainNavProps) {
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

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
                <Typography
                  variant="p"
                  className="line-clamp-2 block text-sm text-muted-foreground"
                >
                  The complete collection
                </Typography>
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
                <Typography
                  variant="p"
                  className="line-clamp-2 block text-sm text-muted-foreground"
                >
                  Got a slick new recipe? Add it!
                </Typography>
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
                    <Typography
                      variant="p"
                      className="line-clamp-2 block truncate text-sm text-muted-foreground"
                    >
                      {user.email}
                    </Typography>
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
                    <Typography
                      variant="p"
                      className="line-clamp-2 block text-sm text-muted-foreground"
                    >
                      Update your information
                    </Typography>
                  </li>

                  <Separator className="my-1 h-2 w-full rounded-lg bg-foreground" />

                  <li className="row-span-1 ml-auto">
                    <Button variant="destructive" onClick={handleLogout}>
                      <LogOut className="mr-2 size-4" />
                      <span>Sign out</span>
                    </Button>
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
