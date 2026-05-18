import { useUser } from "@/api/auth/use-user"
import { Navigate, Outlet } from "react-router-dom"

export default function PublicOnlyRoute() {
  const { user, isLoading } = useUser()
  if (isLoading) {
    return null
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
