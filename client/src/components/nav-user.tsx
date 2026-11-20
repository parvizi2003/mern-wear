import { CircleUser, LogIn, LogOut, ReceiptText, UserPlus } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link } from "react-router"
import { useMe } from "@/api/auth/get-me"
import { useLogOut } from "@/api/auth/log-out"
import { Spinner } from "./ui/spinner"

export const NavUser = () => {
  const user = useMe()
  const logOutMutation = useLogOut()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<button type="button" />}>
        <CircleUser />
      </DropdownMenuTrigger>
      <DropdownMenuContent sideOffset={10}>
        {user.data ? (
          <DropdownMenuGroup>
            <DropdownMenuItem render={<Link to={"/orders"} />}>
              <ReceiptText /> Orders
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => logOutMutation.mutate()}
              disabled={logOutMutation.isPending}
            >
              {logOutMutation.isPending ? <Spinner /> : <LogOut />}
              Log Out
            </DropdownMenuItem>
          </DropdownMenuGroup>
        ) : (
          <DropdownMenuGroup>
            <DropdownMenuItem render={<Link to={"/auth/login"} />}>
              <LogIn /> Login
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link to={"/auth/register"} />}>
              <UserPlus /> Register
            </DropdownMenuItem>
          </DropdownMenuGroup>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
