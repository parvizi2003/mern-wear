import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetFooter,
  SheetTitle,
  SheetHeader,
  SheetDescription,
} from "@/components/ui/sheet"

import { Menu, Sun, Moon } from "lucide-react"
import { useTheme } from "./theme-provider"
import NavMenu from "./nav-menu"

export function Sidebar() {
  const { theme, setTheme } = useTheme()

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

        <NavMenu />

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
