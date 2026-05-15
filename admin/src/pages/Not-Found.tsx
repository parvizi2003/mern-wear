import { Button } from "@/components/ui/button"
import { Home, RotateCcw } from "lucide-react"
import { Link } from "react-router-dom"

export function NotFound() {
  return (
    <div className="flex h-svh items-center justify-center">
      <div>
        <h1 className="mb-4">
          <strong>Error 404</strong>: Page Not Found
        </h1>

        <div className="flex justify-between">
          <Link to="/">
            <Button>
              <Home /> Home
            </Button>
          </Link>

          <Button onClick={() => window.location.reload()}>
            <RotateCcw /> Reload
          </Button>
        </div>
      </div>
    </div>
  )
}
