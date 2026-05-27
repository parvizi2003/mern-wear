import { Link } from "react-router-dom"

import { Logo } from "./logo"
import { Search, ShoppingBasket } from "lucide-react"
import NavUser from "./nav-user"
import { Sidebar } from "./sidebar"
import { Button } from "./ui/button"
import Container from "./container"
import { cn } from "@/lib/utils"

export default function Header() {
  return (
    <header
      className={cn(
        "fixed top-0 right-0 left-0 z-50 h-15 border-b bg-background/80 backdrop-blur-md"
      )}
    >
      <Container
        variant="header"
        className="flex h-full items-center justify-between"
      >
        <Sidebar />

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Search />
          </Button>

          <Button variant="ghost" size="icon">
            <ShoppingBasket />
          </Button>

          <NavUser />
        </div>

        <Link
          to="/"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <Logo size="lg" />
        </Link>
      </Container>
    </header>
  )
}
