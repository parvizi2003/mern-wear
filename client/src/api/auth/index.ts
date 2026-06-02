import type { User } from "@/types"
import { jsonApiInstance } from "../api-instance"
import { queryOptions } from "@tanstack/react-query"

const RESOURCE = "auth"

export const authApi = {
  baseKey: RESOURCE,

  login: (formData?: { email: string; password: string }) => {
    return jsonApiInstance<{ user: User }>(`/${RESOURCE}/login`, {
      method: "POST",
      json: formData,
    })
  },

  register: (formData?: { name: string; email: string; password: string }) => {
    return jsonApiInstance<{ user: User }>(`/${RESOURCE}/register`, {
      method: "POST",
      json: formData,
    })
  },

  getMe: () => {
    return queryOptions({
      queryKey: [authApi.baseKey, "me"],
      queryFn: (meta) =>
        jsonApiInstance<User>(`/${RESOURCE}/me`, {
          signal: meta.signal,
        }),
    })
  },

  logout: () => {
    return jsonApiInstance<{ message: string }>(`/${RESOURCE}/logout`, {
      method: "POST",
    })
  },
}
