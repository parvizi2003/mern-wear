import { useMutation } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import type { RegisterFormData } from "@/lib/validations/auth"
import type { AuthResponse } from "@/types/auth"
import { queryClient } from "@/lib/query-client"

import { useNavigate } from "react-router"

const register = async (data: RegisterFormData) => {
  const response = await api.post<AuthResponse>("/auth/register", data)
  return response.data.user
}

export const useRegister = () => {
  const navigate = useNavigate()
  return useMutation({
    mutationFn: register,
    onSuccess: (user) => {
      queryClient.setQueryData(["auth", "me"], user)
      navigate("/")
    },
  })
}
