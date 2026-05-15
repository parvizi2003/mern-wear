import { useMutation } from "@tanstack/react-query"
import { authApi } from "."

import { useNavigate } from "react-router-dom"
import { ApiError } from "../api-instance"

export function useLogin() {
  const navigate = useNavigate()
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: async () => {
      navigate("/")
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
