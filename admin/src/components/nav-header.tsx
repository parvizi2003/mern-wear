import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link } from "react-router-dom"
import { Logo } from "./logo"

export function NavHeader() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" asChild>
          <Link to={"/"}>
            <div className="flex items-center gap-4">
              <Logo size="lg" />
              <div className="flex h-full flex-col justify-evenly">
                <h1 className="text-sm font-bold">MERN-WEAR</h1>
                <p className="text-xs">Admin panel</p>
              </div>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
