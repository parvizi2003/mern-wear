import { Navigate, Outlet } from "react-router-dom"
import { useUser } from "@/api/auth/use-user"

export function ProtectedRoute() {
  const { user, isLoading } = useUser()

  if (isLoading) return null

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
