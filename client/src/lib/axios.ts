import axios from "axios"
import { ApiError } from "./api-error"

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || "Something went wrong"

      return Promise.reject(
        new ApiError({
          message,
          statusCode: error.response?.status,
        })
      )
    }

    return Promise.reject(error)
  }
)
