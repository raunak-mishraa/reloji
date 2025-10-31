"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const goToSearch = (name: string | undefined) => {
    const params = new URLSearchParams();
    if (name) params.set('search', name);
    router.push(`/search?${params.toString()}`);
  };
  return (
    <div className="w-full border-b bg-background/95">
      <div className="container mx-auto px-4 md:px-8 py-3 flex items-center gap-4 overflow-x-auto">
        <nav className="flex items-center gap-3 whitespace-nowrap">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-sm px-3 py-1.5 rounded-full border">All Categories</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => goToSearch(undefined)}>All Categories</DropdownMenuItem>
              {categories.map((c) => (
                <DropdownMenuItem key={c} onClick={() => goToSearch(c)}>{c}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {categories.slice(0, 4).map((c) => (
            <button
              key={c}
              onClick={() => goToSearch(c)}
              className="text-sm px-3 py-1.5 rounded-full border hidden md:block hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              {c}
            </button>
          ))}
        </nav>
        <div className="ml-auto text-xs text-muted-foreground">{todayLabel}</div>
      </div>
    </div>
  );
}
