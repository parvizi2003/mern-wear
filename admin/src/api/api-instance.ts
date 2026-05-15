const API_URL = import.meta.env.VITE_API_URL

export class ApiError extends Error {
  status: number
  data: unknown

  constructor(response: Response, data?: any) {
    super(
      data?.message || `ApiError: ${response.status} ${response.statusText}`
    )

    this.status = response.status
    this.data = data
  }
}

type JsonInit = RequestInit & {
  json?: unknown
}

export const jsonApiInstance = async <T>(
  url: string,
  init?: JsonInit
): Promise<T> => {
  const headers = new Headers(init?.headers ?? {})

  const method = init?.method ?? "GET"

  if (init?.json !== undefined && method === "GET") {
    throw new Error("GET request cannot have json body")
  }

  let body = init?.body

  if (init?.json !== undefined) {
    headers.set("Content-Type", "application/json")
    body = JSON.stringify(init.json)
  }

  const response = await fetch(`${API_URL}${url}`, {
    ...init,
    method,
    headers,
    body,
    credentials: "include",
  })

  let data: unknown = null

  const contentType = response.headers.get("content-type")

  if (contentType?.includes("application/json")) {
    data = await response.json()
  }

  if (!response.ok) {
    throw new ApiError(response, data)
  }

  return data as T
}
