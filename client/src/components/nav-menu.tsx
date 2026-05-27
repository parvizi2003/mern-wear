import { cn } from "@/lib/utils"
import { Link, useLocation } from "react-router-dom"
import { SheetClose } from "./ui/sheet"
import { useCategories } from "@/api/categories/use-categories"

export default function NavMenu() {
  const { pathname } = useLocation()
  const { categories } = useCategories()

  return (
    <div className="flex h-full flex-col justify-between">
      <nav className="flex flex-col">
        <SheetClose asChild>
          <Link
            to={"/"}
            className={cn(
              "block px-4 py-2 text-base font-medium tracking-wide transition",
              "hover:opacity-60",
              pathname === "/" && "bg-muted text-foreground"
            )}
          >
            Home
          </Link>
        </SheetClose>

        {categories?.map((item) => {
          const href = "/categories/" + item.slug
          const isActive = pathname === href

          return (
            <SheetClose asChild key={href}>
              <Link
                to={href}
                className={cn(
                  "block px-4 py-2 text-base font-medium tracking-wide transition",
                  "hover:opacity-60",
                  isActive && "bg-muted text-foreground"
                )}
              >
                {item.name}
              </Link>
            </SheetClose>
          )
        })}
      </nav>
    </div>
  )
}
