"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { User } from "@supabase/supabase-js"
import {
  LogIn,
  LogOut,
  Menu,
  UserCircle2,
  UserIcon,
  UserPen,
} from "lucide-react"

import { NAV_LINKS } from "@/lib/constants"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { Searchbar } from "@/app/recipes/search"

export function ClientNav({
  user,
  logout,
}: {
  user: User | null
  logout: () => Promise<void>
}) {
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  return (
    <div className="flex items-end justify-end space-x-4 self-end">
      <div className="hidden md:w-64 lg:block lg:w-80">
        <Searchbar />
      </div>
      <div className="hidden items-center space-x-4 lg:flex">
        <UserDropdown user={user} logout={handleLogout} />
        <ThemeToggle />
      </div>
      <MobileMenu user={user} logout={handleLogout} />
    </div>
  )
}

function MobileMenu({
  user,
  logout,
}: {
  user: User | null
  logout: () => Promise<void>
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="lg:hidden" variant="ghost" size="icon">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-[300px] flex-col justify-between sm:w-[400px]">
        <div className="">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            <Searchbar />
            <Separator />
            <nav className="flex flex-col space-y-4 *:w-fit *:text-foreground *:hover:text-primary">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
              <Link href="/terms">Terms of Service</Link>
              <Link href="/privacy">Privacy Policy</Link>
            </nav>
          </div>
        </div>
        <SheetFooter>
          <div className="flex items-center justify-between">
            <ThemeToggle />
            <UserDropdown user={user} logout={logout} />
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

function UserDropdown({
  user,
  logout,
}: {
  user: User | null
  logout: () => Promise<void>
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage
            src={user?.user_metadata.avatar_url}
            className="object-cover"
          />
          <AvatarFallback>
            <UserCircle2 />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {user ? (
          <>
            <DropdownMenuItem>
              <Link href={`/profile/${user.id}`} className="flex items-center">
                <UserIcon className="mr-2 size-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                href={`/profile/${user.id}/edit`}
                className="flex items-center"
              >
                <UserPen className="mr-2 size-4" />
                <span>Edit Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Button variant="destructive" onClick={logout}>
                <LogOut className="mr-2 size-full" />
                <span>Sign out</span>
              </Button>
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem asChild>
            <Link href="/login" className="flex items-center">
              <LogIn className="mr-2 size-4" />
              <span>Log in</span>
            </Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
