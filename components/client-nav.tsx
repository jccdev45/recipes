"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User } from "@supabase/supabase-js"
import { LogIn, LogOut, Menu, UserCircle2, UserIcon, X } from "lucide-react"

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
import { logout } from "@/app/(auth)/actions"
import { Searchbar } from "@/app/recipes/search"

export function ClientNav({ user }: { user: User | null }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  const renderUserDropdown = () => {
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
                <Link
                  href={`/profile/${user.id}`}
                  className="flex items-center"
                >
                  <UserIcon className="mr-2 size-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Button variant="destructive" onClick={handleLogout}>
                  <LogOut className="mr-2 size-4" />
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

  const renderMobileMenu = () => {
    if (!isMenuOpen) return null

    return (
      <div className="absolute left-0 right-0 top-full bg-white py-4 shadow-md md:hidden">
        <nav className="flex flex-col space-y-4 px-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-secondary-foreground hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    )
  }

  return (
    <div className="relative flex items-center space-x-4">
      <Searchbar className="relative" />
      {renderUserDropdown()}
      <Button
        className="md:hidden"
        variant="ghost"
        size="icon"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X /> : <Menu />}
      </Button>
      {renderMobileMenu()}
    </div>
  )
}
