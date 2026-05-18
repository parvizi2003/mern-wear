import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetFooter,
  SheetTitle,
  SheetHeader,
  SheetDescription,
} from "@/components/ui/sheet"

import { Menu, Sun, Moon } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { useTheme } from "./theme-provider"
import { cn } from "@/lib/utils"
import { Logo } from "./logo"

export const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Headwear", href: "/category/headwear" },
  { label: "Shirts", href: "/category/shirts" },
  { label: "Blazers", href: "/category/blazers" },
  { label: "Trousers", href: "/category/trousers" },
  { label: "Shoes", href: "/category/shoes" },
] as const

export function Sidebar() {
  const { theme, setTheme } = useTheme()
  const { pathname } = useLocation()
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="bg-background/80 backdrop-blur-md">
        <SheetHeader>
          <SheetTitle>MERN-WEAR</SheetTitle>
          <SheetDescription>Menu</SheetDescription>
        </SheetHeader>
        <div className="flex h-full flex-col justify-between">
          <nav className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href

              return (
                <SheetClose asChild key={item.href}>
                  <Link
                    to={item.href}
                    className={cn(
                      "block px-4 py-2 text-base font-medium tracking-wide transition",
                      "hover:opacity-60",
                      isActive && "bg-muted text-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                </SheetClose>
              )
            })}
          </nav>
        </div>
        <SheetFooter>
          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full justify-center gap-2"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <>
                  <Sun className="h-4 w-4" />
                  Light mode
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4" />
                  Dark mode
                </>
              )}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
