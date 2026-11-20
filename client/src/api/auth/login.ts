import { useMutation } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import type { LoginFormData } from "@/lib/validations/auth"
import type { AuthResponse } from "@/types/auth"
import { queryClient } from "@/lib/query-client"

import { useNavigate } from "react-router"

const login = async (data: LoginFormData) => {
  const response = await api.post<AuthResponse>("/auth/login", data)
  return response.data.user
}

export const useLogin = () => {
  const navigate = useNavigate()
  return useMutation({
    mutationFn: login,
    onSuccess: (user) => {
      queryClient.setQueryData(["auth", "me"], user)
      navigate("/")
    },
  })
}
