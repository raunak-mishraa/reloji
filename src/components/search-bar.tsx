
"use client"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"

interface SearchBarProps {
  placeholder?: string
  onSearch?: (query: string) => void
}

export function SearchBar({ placeholder = "Search for items...", onSearch }: { placeholder?: string, onSearch?: (query: string) => void }) {
  const [query, setQuery] = useState("")

  const handleSearch = (value: string) => {
    setQuery(value)
    onSearch?.(value)
    console.log("Search query:", value)
  }

  return (
    <form className="relative w-full" onSubmit={(e) => { e.preventDefault(); onSearch?.(e.currentTarget.search.value); }}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        name="search"
        placeholder={placeholder}
        className="w-full h-12 pl-12 pr-4 rounded-full bg-background shadow-none appearance-none"
        data-testid="input-search"
      />
    </form>
  )
}
