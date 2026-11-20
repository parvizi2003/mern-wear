import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Home } from "lucide-react"
import { Link } from "react-router"

export const NotFound = () => {
  return (
    <div className="flex h-svh flex-col items-center justify-center gap-4">
      <h1>
        <Logo size="lg" />
      </h1>
      <h2>
        <strong>Error 404</strong>: Page Not Found
      </h2>

      <div className="flex justify-between gap-4">
        <Button render={<Link to="/" />}>
          <Home /> Home
        </Button>

        <Button render={<Link to="../" />}>
          <ArrowLeft /> Go Back
        </Button>
      </div>
    </div>
  )
}
