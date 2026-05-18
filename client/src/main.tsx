import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"

import { ThemeProvider } from "@/components/theme-provider.tsx"
import { RouterProvider } from "react-router-dom"
import Router from "@/routes"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "./api/query-client"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RouterProvider router={Router} />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
)

const loader = document.getElementById("startup-loader")

requestAnimationFrame(() => {
  if (loader) {
    loader.style.opacity = "0"

    setTimeout(() => {
      loader.remove()
    }, 200)
  }
})
