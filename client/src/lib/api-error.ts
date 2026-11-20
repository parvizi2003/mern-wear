import type { ApiError as ApiErrorType } from "@/types/api"

export class ApiError extends Error {
  statusCode?: number

  constructor({ message, statusCode }: ApiErrorType) {
    super(message)

    this.name = "ApiError"
    this.statusCode = statusCode
  }
}
