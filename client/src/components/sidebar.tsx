import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetFooter,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet"

import { Menu, Sun, Moon } from "lucide-react"
import { useTheme } from "./theme-provider"
import { NavMenu } from "./nav-menu"
import { Logo } from "./logo"
import { Link } from "react-router"

export function Sidebar() {
  const { theme, setTheme } = useTheme()

  return (
    <Sheet>
      <SheetTrigger render={<button type="button" />}>
        <Menu className="h-6 w-6" />
      </SheetTrigger>

      <SheetContent side="left" className="bg-background/80 backdrop-blur-md">
        <SheetHeader>
          <SheetTitle>
            <Link to="/" className="flex items-center gap-4">
              <Logo />
              MERN-WEAR
            </Link>
          </SheetTitle>
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
