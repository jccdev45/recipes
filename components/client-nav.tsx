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
import { logout } from "@/app/(auth)/actions"
import { Searchbar } from "@/app/recipes/search"

export function ClientNav({ user }: { user: User | null }) {
  return (
    <div className="relative flex items-center space-x-4">
      <div className="hidden md:block">
        <Searchbar />
      </div>
      <div className="hidden items-center space-x-4 md:flex">
        <UserDropdown user={user} />
        <ThemeToggle />
      </div>
      <MobileMenu user={user} />
    </div>
  )
}

function MobileMenu({ user }: { user: User | null }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="md:hidden" variant="ghost" size="icon">
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
            <UserDropdown user={user} />
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

function UserDropdown({ user }: { user: User | null }) {
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

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
              <Button variant="destructive" onClick={handleLogout}>
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
