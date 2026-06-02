import { Link, NavLink } from "react-router-dom"
import { Logo } from "./logo"
import { Moon, Search, ShoppingBasket, Sun } from "lucide-react"
import NavUser from "./nav-user"
import { Sidebar } from "./sidebar"
import { Button } from "./ui/button"
import Container from "./container"
import { cn } from "@/lib/utils"
import { useCart } from "@/api/cart/use-cart"
import { useCategories } from "@/api/categories/use-categories"
import { useTheme } from "./theme-provider"
import { Input } from "./ui/input"
import ProductSearch from "./product-search"

export default function Header() {
  const { cart } = useCart()
  const { categories } = useCategories()
  const { theme, setTheme } = useTheme()

  return (
    <header className="fixed top-0 right-0 left-0 z-50 h-15 border-b bg-background/80 backdrop-blur-md">
      <Container variant="header" className="flex h-full items-center">
        {/* LEFT */}
        <div className="flex flex-1 items-center gap-2">
          {/* MOBILE: sidebar */}
          <div className="lg:hidden">
            <Sidebar />
          </div>

          <div className="flex items-center gap-4">
            {/* DESKTOP: logo left */}
            <Link to="/" className="hidden pl-2 lg:block">
              <Logo size="lg" />
            </Link>

            {/* CENTER (menu placeholder) */}
            <div className="hidden lg:flex">
              <nav className="flex items-center xl:gap-2">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    cn(
                      "p-2 text-base font-medium tracking-wide transition hover:opacity-70 xl:p-4",
                      isActive && "underline underline-offset-12"
                    )
                  }
                >
                  Home
                </NavLink>

                {categories?.map((item) => {
                  const href = "/categories/" + item.slug

                  return (
                    <NavLink
                      key={href}
                      to={href}
                      className={({ isActive }) =>
                        cn(
                          "p-2 text-base font-medium tracking-wide transition hover:opacity-70 xl:p-4",
                          isActive && "underline underline-offset-12"
                        )
                      }
                    >
                      {item.name}
                    </NavLink>
                  )
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* MOBILE CENTER LOGO */}
        <Link
          to="/"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:hidden"
        >
          <Logo size="lg" />
        </Link>

        {/* RIGHT */}
        <div className="flex flex-1 items-center justify-end gap-2">
          <ProductSearch />

          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:inline-flex"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun size={24} /> : <Moon />}
          </Button>

          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              {cart && cart.itemsCount > 0 && (
                <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {cart.itemsCount}
                </div>
              )}
              <ShoppingBasket />
            </Button>
          </Link>

          <NavUser />
        </div>
      </Container>
    </header>
  )
}
