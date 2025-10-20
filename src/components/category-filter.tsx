import { Button } from "@/components/ui/button"
import { Camera, Hammer, Music, Bike, Tent, Box } from "lucide-react"
import { useState } from "react"

const categories = [
  { id: "all", label: "All Items", icon: Box },
  { id: "photography", label: "Photography", icon: Camera },
  { id: "tools", label: "Tools & DIY", icon: Hammer },
  { id: "music", label: "Music", icon: Music },
  { id: "sports", label: "Sports", icon: Bike },
  { id: "outdoor", label: "Outdoor", icon: Tent },
]

interface CategoryFilterProps {
  onCategoryChange?: (category: string) => void
}

export function CategoryFilter({ onCategoryChange }: CategoryFilterProps) {
  const [selected, setSelected] = useState("all")

  const handleSelect = (id: string) => {
    setSelected(id)
    onCategoryChange?.(id)
    console.log("Selected category:", id)
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => {
        const Icon = category.icon
        const isSelected = selected === category.id
        
        return (
          <Button
            key={category.id}
            variant={isSelected ? "default" : "outline"}
            size="sm"
            onClick={() => handleSelect(category.id)}
            className="flex items-center gap-2 whitespace-nowrap"
            data-testid={`button-category-${category.id}`}
          >
            <Icon className="h-4 w-4" />
            {category.label}
          </Button>
        )
      })}
    </div>
  )
}
