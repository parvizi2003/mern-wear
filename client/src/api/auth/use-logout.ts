import { useMutation } from "@tanstack/react-query"
import { authApi } from "."
import { queryClient } from "../query-client"
import { cartApi } from "../cart"

export function useLogout() {
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,

    onSuccess: () => {
      queryClient.removeQueries({ queryKey: [authApi.baseKey, "me"] })
      queryClient.invalidateQueries({ queryKey: [cartApi.baseKey] })
    },
  })

  return {
    handleLogout: logoutMutation.mutate,
    logoutIsPending: logoutMutation.isPending,
    logoutError: logoutMutation.error,
  }
}
