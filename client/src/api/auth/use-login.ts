import { useMutation } from "@tanstack/react-query"
import { authApi } from "."

import { useLocation, useNavigate } from "react-router-dom"
import { ApiError } from "../api-instance"
import { queryClient } from "../query-client"
import { cartApi } from "../cart"

export function useLogin() {
  const navigate = useNavigate()
  const location = useLocation()

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      queryClient.setQueryData([authApi.baseKey, "me"], data.user)

      queryClient.invalidateQueries({ queryKey: [authApi.baseKey, "me"] })
      queryClient.invalidateQueries({ queryKey: [cartApi.baseKey] })

      navigate(location.state || "/")
    },

    onError: (err: any) => {
      if (err instanceof ApiError) {
        console.error(err.message || "Ошибка авторизации")
      } else {
        console.error(err)
      }
    },
  })

  const handleLogin = (formData: { email: string; password: string }) => {
    loginMutation.mutate(formData)
  }

  return {
    handleLogin,
    loginIsPending: loginMutation.isPending,
    loginError: loginMutation.error,
  }
}
