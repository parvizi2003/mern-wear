import { useQuery } from "@tanstack/react-query"
import { authApi } from "."

export function useUser() {
  const { data: user, isLoading } = useQuery({
    ...authApi.getMe(),
    retry: false,
    refetchOnWindowFocus: false,
  })

  return { user, isLoading }
}
