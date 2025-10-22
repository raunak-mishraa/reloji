"use client";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const categories = [
  "Cars",
  "Motorcycles",
  "Mobile Phones",
  "For Sale: Houses & Apartments",
  "Scooters",
  "Commercial & Other Vehicles",
  "For Rent: Houses & Apartments",
];

export default function CategoryBar() {
  const todayLabel = "21 Oct, 2025";
  return (
    <div className="w-full border-b bg-background/95">
      <div className="container mx-auto px-8 py-3 flex items-center gap-4 overflow-x-auto">
        <nav className="flex items-center gap-3 whitespace-nowrap">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-sm px-3 py-1.5 rounded-full border">All Categories</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link href="/search">All Categories</Link>
              </DropdownMenuItem>
              {categories.map((c) => (
                <DropdownMenuItem key={c} asChild>
                  <Link href={`/search?category=${encodeURIComponent(c)}`}>{c}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {categories.slice(0, 4).map((c) => (
            <Link
              key={c}
              href={`/search?category=${encodeURIComponent(c)}`}
              className="text-sm px-3 py-1.5 rounded-full border hover:bg-accent hover:text-accent-foreground transition-colors hidden md:block"
            >
              {c}
            </Link>
          ))}
        </nav>
        <div className="ml-auto text-xs text-muted-foreground">{todayLabel}</div>
      </div>
    </div>
  );
}
