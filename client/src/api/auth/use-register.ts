import { useMutation } from "@tanstack/react-query"
import { authApi } from "."

import { useNavigate } from "react-router-dom"
import { ApiError } from "../api-instance"

export function useRegister() {
  const navigate = useNavigate()
  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: async () => {
      navigate("/")
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
