import { useUser } from "@/api/auth/use-user"
import { Navigate, Outlet, useLocation } from "react-router-dom"

export default function AuthRoute() {
  const { user, isLoading } = useUser()
  const location = useLocation()
  if (isLoading) {
    return null
  }

  if (!user) {
    return (
      <Navigate
        to="/auth/login"
        state={location.pathname != "/orders" ? location.pathname : "/"}
        replace
      />
    )
  }

  return <Outlet />
}
