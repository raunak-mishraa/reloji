import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle2 } from "lucide-react"

interface UserAvatarProps {
  name: string
  image?: string
  verified?: boolean
  size?: "sm" | "md" | "lg"
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-16 w-16",
}

export function UserAvatar({ name, image, verified = false, size = "md" }: UserAvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="relative inline-block">
      <Avatar className={sizeClasses[size]} data-testid="avatar-user">
        {image && <AvatarImage src={image} alt={name} />}
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      {verified && (
        <CheckCircle2 className="absolute -bottom-0.5 -right-0.5 h-4 w-4 fill-primary text-primary-foreground rounded-full bg-background" />
      )}
    </div>
  )
}
