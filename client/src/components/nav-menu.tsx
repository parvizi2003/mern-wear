import { cn } from "@/lib/utils"
import { NavLink } from "react-router"
import { SheetClose } from "./ui/sheet"

const categories = [
  {
    slug: "suits",
    name: "Suits",
  },
]

export const NavMenu = () => {
  return (
    <div className="flex h-full flex-col justify-between">
      <nav className="flex flex-col">
        <SheetClose>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              cn(
                "block px-4 py-2 text-base font-medium tracking-wide transition",
                "hover:opacity-60",
                isActive && "border-y bg-muted text-foreground"
              )
            }
          >
            Home
          </NavLink>
        </SheetClose>

        {categories.map((item) => (
          <SheetClose key={item.slug}>
            <NavLink
              to={`/categories/${item.slug}`}
              className={({ isActive }) =>
                cn(
                  "block px-4 py-2 text-base font-medium tracking-wide transition",
                  "hover:opacity-60",
                  isActive && "border-y bg-muted text-foreground"
                )
              }
            >
              {item.name}
            </NavLink>
          </SheetClose>
        ))}
      </nav>
    </div>
  )
}
