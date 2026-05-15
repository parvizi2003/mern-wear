import { useQuery } from "@tanstack/react-query"
import { authApi } from "."

export function useUser() {
  const { data, isLoading } = useQuery({
    ...authApi.getMe(),
    retry: false,
  })

  return { user: data?.user, isLoading }
}
