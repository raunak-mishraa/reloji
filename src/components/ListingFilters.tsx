"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { CalendarIcon, Star } from "lucide-react";
import { format } from "date-fns";
import { ItemCondition } from "@prisma/client";

type Category = { id: string; name: string };

export type FiltersState = {
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  startDate?: string;
  endDate?: string;
  condition?: ItemCondition;
  minRating?: number;
};

export default function ListingFilters({
  onChange,
}: {
  onChange: (f: FiltersState) => void;
}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState<FiltersState>({});
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  // Fetch categories
  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  // Apply filters whenever state changes
  useEffect(() => {
    const newFilters: FiltersState = {
      ...filters,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      startDate: dateRange?.from?.toISOString(),
      endDate: dateRange?.to?.toISOString(),
    };
    onChange(newFilters);
  }, [filters, priceRange, dateRange, onChange]);

  const handleClear = () => {
    setFilters({});
    setPriceRange([0, 1000]);
    setDateRange(undefined);
  };

  return (
    <div className="bg-card p-4 rounded-xl border shadow-sm space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-center">
        {/* Search */}
        <Input
          placeholder="Search for anything..."
          className="lg:col-span-2 h-12"
          value={filters.search || ""}
          onChange={(e) =>
            setFilters((f) => ({ ...f, search: e.target.value }))
          }
        />

        {/* Category */}
        <Select
          onValueChange={(value) =>
            setFilters((f) => ({
              ...f,
              categoryId: value === "all" ? "" : value,
            }))
          }
          value={filters.categoryId || "all"}
        >
          <SelectTrigger className="h-12">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date range */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-12 w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange?.to ? (
                  <>
                    {format(dateRange.from, "LLL dd, y")} -{" "}
                    {format(dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Price range */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-12 w-full justify-start text-left font-normal"
            >
              <span>
                ${priceRange[0]} - $
                {priceRange[1] === 1000 ? "1000+" : priceRange[1]}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4">
            <p className="mb-4 font-medium">Price range</p>
            <Slider
              value={priceRange}
              onValueChange={(value) =>
                setPriceRange(value as [number, number])
              }
              min={0}
              max={1000}
              step={10}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-center">
        {/* Condition */}
        <Select
          onValueChange={(value) =>
            setFilters((f) => ({
              ...f,
              condition:
                value === "ANY" ? undefined : (value as ItemCondition),
            }))
          }
          value={filters.condition ?? "ANY"}
        >
          <SelectTrigger className="h-12">
            <SelectValue placeholder="Condition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ANY">Any Condition</SelectItem>
            {Object.values(ItemCondition).map((c) => (
              <SelectItem key={c} value={c}>
                {c.replace("_", " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Rating */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-12 w-full justify-start text-left font-normal"
            >
              <Star className="mr-2 h-4 w-4" />
              <span>
                {filters.minRating
                  ? `Rated ${filters.minRating}+`
                  : "Any Rating"}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2">
            <div className="flex flex-col space-y-1">
              {[4, 3, 2, 1].map((rating) => (
                <Button
                  key={rating}
                  variant="ghost"
                  onClick={() =>
                    setFilters((f) => ({ ...f, minRating: rating }))
                  }
                >
                  {rating}+
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Clear filters */}
        <div className="flex justify-end md:col-span-1 lg:col-span-3">
          <Button variant="ghost" onClick={handleClear}>
            Clear Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
