'use client'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SearchBar } from "@/components/search-bar"
import { ThemeToggle } from "@/components/theme-toggle";
import Notifications from "@/components/Notifications";
import { Menu } from "lucide-react"
import Image from "next/image"
import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LayoutGrid, LogOut, User as UserIcon, List, Inbox, Send, MessageCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { useState } from "react";
import PhoneVerificationModal from "./PhoneVerificationModal";

function UserNav() {
  const auth = useAppSelector(s => s.auth);

  if (auth.status !== 'authenticated' || !auth.user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 uppercase text-black/80">
            <AvatarImage src={auth.user.image ?? ""} alt={auth.user.name ?? ""} />
            <AvatarFallback>
              {auth.user.name?.[0] || auth.user.email?.[0]}
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
            <p className="text-sm font-medium leading-none">{auth.user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {auth.user.email}
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
        <DropdownMenuItem asChild>
          <Link href="/messages">
            <MessageCircle className="mr-2 h-4 w-4" />
            <span>Messages</span>
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
  const auth = useAppSelector(s => s.auth);
  const isAuthenticated = auth.status === "authenticated";
  const isLoading = auth.status === "loading";
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  const handleStartListing = () => {
    if (isAuthenticated && !auth.user?.phone) {
      setShowPhoneModal(true);
      return;
    }
    if (!isAuthenticated) {
      router.push('/api/auth/signin');
      return;
    }
    router.push('/listings/new');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 hover-elevate active-elevate-2 px-3 py-2 rounded-lg -ml-3" data-testid="link-home">
            <Image src="/assets/images/logo.png" alt="Logo" width={32} height={32} className="h-9 w-fit" />
          </Link>

          <div className="hidden md:block flex-1 max-w-2xl">
            <SearchBar />
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/circles">Circles</Link>
            </Button>
            {isAuthenticated && (
              <Button variant="default" size="sm" onClick={handleStartListing}>
                Start Listing
              </Button>
            )}
            <ThemeToggle />
            {isAuthenticated && <Notifications />}

            {isLoading ? null : (
              isAuthenticated ? (
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
                    <Link href="/signup">Sign up</Link>
                  </Button>
                </>
              )
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" data-testid="button-mobile-menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <div className="p-4 flex flex-col h-full mt-8">
                <div className="flex-1 space-y-4">
                  {isAuthenticated && (
                    <Button variant="default" size="sm" className="w-full" onClick={() => { handleStartListing(); setOpen(false); }}>
                      Start Listing
                    </Button>
                  )}

                  {isLoading ? null : isAuthenticated ? (
                    <div className="space-y-2">
                      <SheetClose asChild><Link href="/profile" className="block p-2 rounded-md hover:bg-muted">Profile</Link></SheetClose>
                      <SheetClose asChild><Link href="/dashboard" className="block p-2 rounded-md hover:bg-muted">Dashboard</Link></SheetClose>
                      <SheetClose asChild><Link href="/my-listings" className="block p-2 rounded-md hover:bg-muted">My Listings</Link></SheetClose>
                      <SheetClose asChild><Link href="/incoming-requests" className="block p-2 rounded-md hover:bg-muted">Incoming Requests</Link></SheetClose>
                      <SheetClose asChild><Link href="/my-requests" className="block p-2 rounded-md hover:bg-muted">My Requests</Link></SheetClose>
                      <SheetClose asChild><Link href="/messages" className="block p-2 rounded-md hover:bg-muted">Messages</Link></SheetClose>
                      <SheetClose asChild><Link href="/circles" className="block p-2 rounded-md hover:bg-muted">Circles</Link></SheetClose>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <SheetClose asChild><Link href="/api/auth/signin" className="block p-2 rounded-md hover:bg-muted">Log in</Link></SheetClose>
                      <SheetClose asChild><Link href="/api/auth/signin" className="block p-2 rounded-md hover:bg-muted">Sign up</Link></SheetClose>
                    </div>
                  )}
                </div>

                <div className="mt-auto space-y-2">
                  <ThemeToggle />
                  {isAuthenticated && (
                    <Button variant="ghost" className="w-full justify-start" onClick={() => { signOut(); setOpen(false); }}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="md:hidden pb-4">
          <SearchBar />
        </div>
        <PhoneVerificationModal open={showPhoneModal} onOpenChange={setShowPhoneModal} />
      </div>
    </header>
  )
}
