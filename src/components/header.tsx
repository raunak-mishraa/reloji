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

  if (auth.status === 'loading') return (
    <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
  );

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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90 shadow-sm">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex h-14 md:h-16 items-center justify-between gap-3 md:gap-6">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0" data-testid="link-home">
            <Image src="/assets/images/logo.png" alt="Logo" width={32} height={32} className="h-7 md:h-9 w-fit" />
          </Link>

          <div className="hidden md:block flex-1 max-w-2xl lg:max-w-3xl">
            <SearchBar />
          </div>

          <div className="hidden md:flex items-center gap-2 lg:gap-3 shrink-0">
            <Button variant="ghost" size="sm" className="font-medium hidden lg:flex" asChild>
              <Link href="/circles">Circles</Link>
            </Button>
            {isAuthenticated && (
              <Button variant="default" size="sm" className="font-medium" onClick={handleStartListing}>
                <span className="hidden lg:inline">Start Listing</span>
                <span className="lg:hidden">List Item</span>
              </Button>
            )}
            <div className="flex items-center gap-1.5 lg:gap-2 ml-1 lg:ml-2">
              <ThemeToggle />
              {isAuthenticated && <Notifications />}
            </div>

            {isLoading ? null : (
              isAuthenticated ? (
                <UserNav />
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="font-medium"
                    data-testid="button-login"
                    asChild
                  >
                    <Link href="/api/auth/signin">Log in</Link>
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    className="font-medium"
                    data-testid="button-signup"
                    asChild
                  >
                    <Link href="/signup">Sign up</Link>
                  </Button>
                </div>
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
            <SheetContent side="right" className="w-[280px] p-0">
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto">
                  <div className="pt-16 px-6 pb-6 space-y-4">
                    {isAuthenticated && (
                      <Button variant="default" size="default" className="w-full" onClick={() => { handleStartListing(); setOpen(false); }}>
                        Start Listing
                      </Button>
                    )}

                    {isLoading ? null : isAuthenticated ? (
                      <div className="space-y-1">
                        <SheetClose asChild><Link href="/profile" className="block px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm">Profile</Link></SheetClose>
                        <SheetClose asChild><Link href="/dashboard" className="block px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm">Dashboard</Link></SheetClose>
                        <SheetClose asChild><Link href="/my-listings" className="block px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm">My Listings</Link></SheetClose>
                        <SheetClose asChild><Link href="/incoming-requests" className="block px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm">Incoming Requests</Link></SheetClose>
                        <SheetClose asChild><Link href="/my-requests" className="block px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm">My Requests</Link></SheetClose>
                        <SheetClose asChild><Link href="/messages" className="block px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm">Messages</Link></SheetClose>
                        <SheetClose asChild><Link href="/circles" className="block px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm">Circles</Link></SheetClose>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <SheetClose asChild>
                          <Button variant="outline" className="w-full" asChild>
                            <Link href="/api/auth/signin">Log in</Link>
                          </Button>
                        </SheetClose>
                        <SheetClose asChild>
                          <Button variant="default" className="w-full" asChild>
                            <Link href="/signup">Sign up</Link>
                          </Button>
                        </SheetClose>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 pt-4 border-t space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Theme</span>
                    <ThemeToggle />
                  </div>
                  {isAuthenticated && (
                    <Button variant="ghost" className="w-full justify-start text-sm" onClick={() => { signOut(); setOpen(false); }}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="md:hidden pb-3 pt-2">
          <SearchBar />
        </div>
        <PhoneVerificationModal open={showPhoneModal} onOpenChange={setShowPhoneModal} />
      </div>
    </header>
  )
}
