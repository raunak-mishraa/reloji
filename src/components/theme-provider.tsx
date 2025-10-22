'use client'
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)

  // Hydrate theme from localStorage and subscribe to system changes
  useEffect(() => {
    const stored = (typeof window !== 'undefined' ? (localStorage.getItem(storageKey) as Theme) : undefined)
    if (stored) {
      setTheme(stored)
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const applyTheme = (t: Theme) => {
      const root = window.document.documentElement
      root.classList.remove("light", "dark")
      if (t === "system") {
        root.classList.add(media.matches ? "dark" : "light")
      } else {
        root.classList.add(t)
      }
    }

    applyTheme(stored ?? defaultTheme)

    const onChange = () => {
      if ((stored ?? defaultTheme) === "system") {
        applyTheme("system")
      }
    }
    media.addEventListener?.("change", onChange)

    return () => media.removeEventListener?.("change", onChange)
  }, [defaultTheme, storageKey])

  // Apply theme whenever it changes
  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    if (theme === "system") {
      const media = window.matchMedia("(prefers-color-scheme: dark)")
      root.classList.add(media.matches ? "dark" : "light")
    } else {
      root.classList.add(theme)
    }
  }, [theme])

  const value = {
    theme,
    setTheme: (t: Theme) => {
      localStorage.setItem(storageKey, t)
      setTheme(t)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
