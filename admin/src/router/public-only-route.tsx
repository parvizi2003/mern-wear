import { Navigate, Outlet } from "react-router-dom"
import { useUser } from "@/api/auth/use-user"

export function PublicOnlyRoute() {
  const { user, isLoading } = useUser()

  if (isLoading) return null

  if (user) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
