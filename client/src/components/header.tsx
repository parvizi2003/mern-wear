import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { Logo } from "./logo"
import { Heart, ShoppingBasket } from "lucide-react"
import NavUser from "./nav-user"
import { Sidebar } from "./sidebar"
import { Button } from "./ui/button"
import Container from "./container"
import { cn } from "@/lib/utils"

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 right-0 left-0 z-50 h-15 transition-all duration-300",
        scrolled ? "bg-background/80 backdrop-blur-md" : "bg-transparent"
      )}
    >
      <Container
        variant="header"
        className="flex h-full items-center justify-between"
      >
        <Sidebar />

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <ShoppingBasket />
          </Button>

          <Button variant="ghost" size="icon">
            <Heart />
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
