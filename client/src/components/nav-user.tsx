import { CircleUser, LogIn, LogOut, UserPlus } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Link } from "react-router-dom"
import { useUser } from "@/api/auth/use-user"
import { useLogout } from "@/api/auth/use-logout"
import { Button } from "./ui/button"

export default function NavUser() {
  const { user } = useUser()
  const { handleLogout } = useLogout()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size={"icon"}>
          <CircleUser />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-background/80 backdrop-blur-md">
        {user ? (
          <DropdownMenuGroup>
            <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
            <DropdownMenuItem asChild></DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Button
                onClick={() => handleLogout()}
                className="m-0 flex h-fit w-full cursor-pointer items-center justify-start gap-2 border-0 p-2 text-destructive"
                variant={"ghost"}
              >
                <LogOut /> Logout
              </Button>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        ) : (
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link to={"/auth/login"} className="flex cursor-pointer gap-2">
                <LogIn /> Login
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={"/auth/register"} className="flex cursor-pointer gap-2">
                <UserPlus /> Register
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
