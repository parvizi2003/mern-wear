import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"

import { isRouteErrorResponse, useRouteError } from "react-router-dom"

export default function ErrorPage() {
  const error = useRouteError()

  let title = "Something went wrong"
  let message = "An unexpected error occurred."

  if (isRouteErrorResponse(error)) {
    title = `${error.status}`
    message = error.statusText
  } else if (error instanceof Error) {
    message = error.message
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <Logo size="xl" />
      <h1 className="my-2 text-2xl font-bold">{title}</h1>

      <p className="mb-6 text-muted-foreground">{message}</p>

      <Button onClick={() => window.location.reload()}>
        <RotateCcw size={16} /> Reload page
      </Button>
    </div>
  )
}
