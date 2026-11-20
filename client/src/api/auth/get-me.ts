import { api } from "@/lib/axios"
import type { AuthResponse } from "@/types/auth"
import { useQuery } from "@tanstack/react-query"

const getMe = async () => {
  const { data } = await api.get<AuthResponse>("/auth/me")
  return data.user
}

export const useMe = () => {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: getMe,
    retry: false,
  })
}
