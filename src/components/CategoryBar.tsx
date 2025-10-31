"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Car, Bike, Smartphone, Home, ChevronDown, Grid3x3 } from "lucide-react";

const categories = [
  { name: "Cars", icon: Car },
  { name: "Motorcycles", icon: Bike },
  { name: "Mobile Phones", icon: Smartphone },
  { name: "Houses & Apartments", icon: Home },
  { name: "Scooters", icon: Bike },
  { name: "Electronics", icon: Smartphone },
  { name: "Furniture", icon: Home },
];

export default function CategoryBar() {
  const router = useRouter();

  const goToSearch = (name: string | undefined) => {
    const params = new URLSearchParams();
    if (name) params.set('search', name);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="w-full border-b bg-background">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-2 py-2 overflow-x-auto scrollbar-hide">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1.5 shrink-0">
                <Grid3x3 className="h-4 w-4" />
                <span className="hidden sm:inline">Categories</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem onClick={() => goToSearch(undefined)}>
                <Grid3x3 className="mr-2 h-4 w-4" />
                All Categories
              </DropdownMenuItem>
              {categories.map((c) => {
                const Icon = c.icon;
                return (
                  <DropdownMenuItem key={c.name} onClick={() => goToSearch(c.name)}>
                    <Icon className="mr-2 h-4 w-4" />
                    {c.name}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="h-6 w-px bg-border hidden md:block" />

          {categories.slice(0, 5).map((c) => {
            const Icon = c.icon;
            return (
              <Button
                key={c.name}
                variant="ghost"
                size="sm"
                onClick={() => goToSearch(c.name)}
                className="gap-1.5 hidden md:flex shrink-0"
              >
                <Icon className="h-4 w-4" />
                {c.name}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
