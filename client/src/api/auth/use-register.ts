import { useMutation } from "@tanstack/react-query"
import { authApi } from "."

import { useLocation, useNavigate } from "react-router-dom"
import { ApiError } from "../api-instance"
import { queryClient } from "../query-client"
import { cartApi } from "../cart"

export function useRegister() {
  const navigate = useNavigate()
  const location = useLocation()

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      queryClient.setQueryData([authApi.baseKey, "me"], data.user)
      queryClient.invalidateQueries({ queryKey: [authApi.baseKey, "me"] })
      queryClient.invalidateQueries({ queryKey: [cartApi.baseKey] })

      navigate(location.state || "/")
    },

    onError: (err: any) => {
      if (err instanceof ApiError) {
        console.error(err.message || "Ошибка регистрации")
      } else {
        console.error(err)
      }
    },
  })

  const handleRegister = (formData: {
    name: string
    email: string
    password: string
  }) => {
    registerMutation.mutate(formData)
  }

  return {
    handleRegister,
    registerIsPending: registerMutation.isPending,
    registerError: registerMutation.error,
  }
}
