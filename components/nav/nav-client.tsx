"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogIn, LogOut, Menu, UserIcon, UserPen } from "lucide-react"
import { useFormStatus } from "react-dom"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { CurrentUserAvatar } from "@/components/current-user-avatar"
import { logout } from "@/app/(auth)/actions"
import { Searchbar } from "@/app/recipes/search"

import type { User } from "@supabase/supabase-js"

type NavLink = {
  href: string
  label: string
  exact?: boolean
}

const secondaryLinks: NavLink[] = [
  { href: "/terms", label: "Terms of Service", exact: true },
  { href: "/privacy", label: "Privacy Policy", exact: true },
]

type NavClientProps = {
  navLinks: NavLink[]
  user: User | null
}

export function NavClient({ navLinks, user }: NavClientProps) {
  return (
    <div className="flex flex-1 items-center justify-end gap-3 lg:gap-4">
      <DesktopNav links={navLinks} />
      <div className="hidden md:w-64 lg:block xl:w-80">
        <Searchbar />
      </div>
      <div className="hidden items-center gap-3 lg:flex">
        <ThemeToggle />
        <AccountMenu user={user} />
      </div>
      <MobileMenu navLinks={navLinks} user={user} />
    </div>
  )
}

function DesktopNav({ links }: { links: NavLink[] }) {
  const pathname = usePathname()

  const isActive = (link: NavLink) => {
    if (link.exact || link.href === "/") {
      return pathname === link.href
    }

    return pathname === link.href || pathname.startsWith(`${link.href}/`)
  }

  if (links.length === 0) {
    return null
  }

  return (
    <NavigationMenu className="hidden flex-1 justify-center lg:flex">
      <NavigationMenuList>
        {links.map((link) => {
          const active = isActive(link)

          return (
            <NavigationMenuItem key={link.href}>
              <NavigationMenuLink asChild>
                <Link
                  href={link.href}
                  data-active={active}
                  aria-current={active ? "page" : undefined}
                  className="text-muted-foreground hover:text-foreground focus-visible:ring-ring data-[active=true]:text-primary rounded-md px-4 py-2 text-sm font-medium transition-colors duration-200 ease-in-out focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none data-[active=true]:font-semibold data-[active=true]:underline"
                >
                  {link.label}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          )
        })}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

function AccountMenu({ user }: { user: User | null }) {
  if (!user) {
    return (
      <Button asChild variant="secondary">
        <Link href="/login" className="flex items-center gap-2">
          <LogIn className="size-4" aria-hidden="true" />
          <span>Log in</span>
        </Link>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          aria-label="Open account menu"
        >
          <CurrentUserAvatar
            size="md"
            className="border-border/60 border"
            initialFirstName={user.user_metadata?.first_name}
            initialLastName={user.user_metadata?.last_name}
            initialEmail={user.email}
            initialAvatarPath={user.user_metadata?.avatar_url}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-56" forceMount>
        <div className="flex items-center gap-3 px-2 py-1.5">
          <CurrentUserAvatar
            size="xl"
            className="border-border/60 border"
            initialFirstName={user.user_metadata?.first_name}
            initialLastName={user.user_metadata?.last_name}
            initialEmail={user.email}
            initialAvatarPath={user.user_metadata?.avatar_url}
          />
          <div className="text-sm">
            {user.user_metadata?.first_name && user.user_metadata?.last_name ? (
              <p className="font-medium">{`${user.user_metadata.first_name} ${user.user_metadata.last_name}`}</p>
            ) : (
              <p className="font-medium">{user.email}</p>
            )}
            <p className="text-muted-foreground text-xs">{user.email}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/profile/${user.id}`} className="flex items-center">
            <UserIcon className="mr-2 size-4" aria-hidden="true" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/profile/${user.id}/edit`} className="flex items-center">
            <UserPen className="mr-2 size-4" aria-hidden="true" />
            <span>Edit profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <LogoutMenuItem />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function LogoutMenuItem() {
  return (
    <form action={logout} className="w-full">
      <LogoutButton />
    </form>
  )
}

function LogoutButton() {
  const { pending } = useFormStatus()

  return (
    <DropdownMenuItem asChild disabled={pending} className="cursor-pointer">
      <button
        type="submit"
        className={cn(
          "text-destructive flex w-full items-center",
          pending && "opacity-70"
        )}
      >
        <LogOut className="mr-2 size-4" aria-hidden="true" />
        <span>{pending ? "Signing out..." : "Sign out"}</span>
      </button>
    </DropdownMenuItem>
  )
}

function MobileMenu({ navLinks, user }: NavClientProps) {
  const pathname = usePathname()

  const isActive = (link: NavLink) => {
    if (link.exact || link.href === "/") {
      return pathname === link.href
    }

    return pathname === link.href || pathname.startsWith(`${link.href}/`)
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="size-5" aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="flex h-full w-[320px] flex-col gap-6 sm:w-[400px]"
      >
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>

        <Searchbar />

        <nav className="flex flex-col gap-3" aria-label="Mobile navigation">
          {[...navLinks, ...secondaryLinks].map((link) => {
            const active = isActive(link)

            return (
              <Link
                key={link.href}
                href={link.href}
                data-active={active}
                className="text-muted-foreground hover:text-foreground data-[active=true]:text-primary focus-visible:ring-ring text-left text-base font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <SheetFooter>
          <div className="flex w-full items-center justify-between gap-4">
            <ThemeToggle />
            <AccountMenu user={user} />
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
