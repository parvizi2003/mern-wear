import { useMutation } from "@tanstack/react-query"
import { api } from "@/lib/axios"

import { queryClient } from "@/lib/query-client"

const logOut = async () => {
  const response = await api.post("/auth/logout")
  return response.data
}

export const useLogOut = () => {
  return useMutation({
    mutationFn: logOut,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["auth", "me"] })
    },
  })
}
