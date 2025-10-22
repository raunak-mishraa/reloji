'use client'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SearchBar } from "@/components/search-bar"
import { ThemeToggle } from "@/components/theme-toggle";
import Notifications from "@/components/Notifications";
import { Menu } from "lucide-react"
import Image from "next/image"
import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LayoutGrid, LogOut, User as UserIcon, List, Inbox, Send } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function UserNav() {
  const { data: session } = useSession();

  if (!session?.user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 uppercase text-black/80">
            <AvatarImage src={session.user.image ?? ""} alt={session.user.name ?? ""} />
            <AvatarFallback>
              {session.user.name?.[0] || session.user.email?.[0]}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{session.user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {session.user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard">
            <LayoutGrid className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/my-listings">
            <List className="mr-2 h-4 w-4" />
            <span>My Listings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/incoming-requests">
            <Inbox className="mr-2 h-4 w-4" />
            <span>Incoming Requests</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/my-requests">
            <Send className="mr-2 h-4 w-4" />
            <span>My Requests</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Header() {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 hover-elevate active-elevate-2 px-3 py-2 rounded-lg -ml-3" data-testid="link-home">
            <Image src="/assets/images/logo.png" alt="Logo" width={32} height={32} className="h-9 w-fit" />
          </Link>

          <div className="hidden md:block flex-1 max-w-2xl">
            <SearchBar />
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Notifications />

            {isAuthenticated ? (
                <UserNav />
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  data-testid="button-login"
                  asChild
                >
                  <Link href="/api/auth/signin">Log in</Link>
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  data-testid="button-signup"
                  asChild
                >
                  <Link href="/api/auth/signin">Sign up</Link>
                </Button>
              </>
            )}

            <Button variant="default" size="sm" asChild>
              <Link href="/listings/new">Start Listing</Link>
            </Button>

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
