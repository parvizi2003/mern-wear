import { useLogout } from "@/api/auth/use-logout"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { LogOut } from "lucide-react"
import { SidebarMenu, SidebarMenuItem } from "./ui/sidebar"

export function NavUser() {
  const { handleLogout } = useLogout()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex w-full items-center gap-2 bg-foreground/10 p-2 text-sm font-medium text-foreground">
            <div className="size-8 bg-white"></div>
            <span>Parviz</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => {
                handleLogout()
              }}
              className="text-sm"
            >
              <LogOut />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
