
"use client"
import { MapPin, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/store/hooks"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface SearchBarProps {
  placeholder?: string
  onSearch?: (query: string) => void
}

export function SearchBar({ placeholder = "Search for items...", onSearch }: { placeholder?: string, onSearch?: (query: string) => void }) {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter()
  const activeCategory = useAppSelector(s => s.search.category)

  const handleSearch = (value: string) => {
    setQuery(value)
    onSearch?.(value)
  }

  const goSearch = () => {
    const q = query?.trim();
    const loc = location?.trim();
    if (!q && !loc) return;
    const params = new URLSearchParams()
    if (q) params.set('search', q);
    if (activeCategory) params.set('category', activeCategory);
    if (loc) params.set('location', loc);
    router.push(`/search?${params.toString()}`)
    setOpen(false);
  }

  return (
    <form 
      className="relative w-full flex items-center bg-background border rounded-full shadow-sm hover:shadow-md transition-all focus-within:shadow-md" 
      onSubmit={(e) => { 
        e.preventDefault(); 
        goSearch();
      }}
    >
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          name="search"
          placeholder={placeholder}
          className="w-full h-12 pl-11 pr-4 border-0 rounded-full bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
          data-testid="input-search"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      
      <div className="flex items-center gap-1 pr-1.5">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button 
              type="button"
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground gap-1.5 h-9"
            >
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline text-xs">{location || "Location"}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Filter by location</h4>
              <Input
                type="text"
                placeholder="Enter city, state, or zip code"
                className="w-full"
                data-testid="input-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    goSearch();
                  }
                }}
              />
              {location && (
                <Button 
                  type="button"
                  variant="ghost" 
                  size="sm" 
                  className="w-full"
                  onClick={() => setLocation("")}
                >
                  Clear location
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>
        
        <Button 
          type="submit" 
          size="sm"
          className="rounded-full h-9 px-4 font-medium"
        >
          Search
        </Button>
      </div>
    </form>
  )
}
