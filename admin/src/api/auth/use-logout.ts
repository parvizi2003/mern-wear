import { useMutation } from "@tanstack/react-query"
import { authApi } from "."

import { useNavigate } from "react-router-dom"
import { queryClient } from "../query-client"

export function useLogout() {
  const navigate = useNavigate()

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,

    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["auth", "me"] })

      navigate("/login", { replace: true })
    },
  })

  return {
    handleLogout: logoutMutation.mutate,
    logoutIsPending: logoutMutation.isPending,
    logoutError: logoutMutation.error,
  }
}
