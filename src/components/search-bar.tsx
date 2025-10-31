
"use client"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/store/hooks"

interface SearchBarProps {
  placeholder?: string
  onSearch?: (query: string) => void
}

export function SearchBar({ placeholder = "Search for items...", onSearch }: { placeholder?: string, onSearch?: (query: string) => void }) {
  const [query, setQuery] = useState("")
  const router = useRouter()
  const activeCategory = useAppSelector(s => s.search.category)

  const handleSearch = (value: string) => {
    setQuery(value)
    onSearch?.(value)
    console.log("Search query:", value)
  }

  const goSearch = (value: string) => {
    const q = value?.trim()
    if (!q) return
    const params = new URLSearchParams()
    params.set('search', q)
    if (activeCategory) params.set('category', activeCategory)
    router.push(`/search?${params.toString()}`)
  }

  return (
    <form className="relative w-full" onSubmit={(e) => { e.preventDefault(); const v = e.currentTarget.search.value; onSearch?.(v); goSearch(v); }}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        name="search"
        placeholder={placeholder}
        className="w-full h-12 pl-12 pr-4 rounded-full bg-background shadow-none appearance-none"
        data-testid="input-search"
        defaultValue={query}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </form>
  )
}
