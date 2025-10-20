import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SearchBar } from "@/components/search-bar"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserAvatar } from "@/components/user-avatar"
import { Menu, Package } from "lucide-react"
import Image from "next/image"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface HeaderProps {
  isAuthenticated?: boolean
}

export function Header({ isAuthenticated = false }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 hover-elevate active-elevate-2 px-3 py-2 rounded-lg -ml-3" data-testid="link-home">
            {/* <Package className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">BorrowHub</span> */}
            <Image src="/assets/images/logo.png" alt="Logo" width={32} height={32} className="h-9 w-fit" />
          </Link>

          <div className="hidden md:block flex-1 max-w-2xl">
            <SearchBar />
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            
            {isAuthenticated ? (
              <>
                <Button variant="default" size="sm" data-testid="button-list-item">
                  List an Item
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full" data-testid="button-user-menu">
                      <UserAvatar name="Current User" size="sm" verified />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem data-testid="menu-my-listings">My Listings</DropdownMenuItem>
                    <DropdownMenuItem data-testid="menu-my-bookings">My Bookings</DropdownMenuItem>
                    <DropdownMenuItem data-testid="menu-messages">Messages</DropdownMenuItem>
                    <DropdownMenuItem data-testid="menu-profile">Profile Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem data-testid="menu-logout">Log out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" data-testid="button-login">
                  Log in
                </Button>
                <Button variant="default" size="sm" data-testid="button-signup">
                  Sign up
                </Button>
              </>
            )}

            <Button variant="ghost" size="icon" className="md:hidden" data-testid="button-mobile-menu">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="md:hidden pb-4">
          <SearchBar />
        </div>
      </div>
    </header>
  )
}
