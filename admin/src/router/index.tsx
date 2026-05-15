import { createBrowserRouter } from "react-router-dom"
import Login from "../pages/Login"

import { NotFound } from "../pages/Not-Found"
import { Dashboard } from "../pages/Dashboard"
import SidebarLayout from "../layouts/sidebar-layout"
import { PublicOnlyRoute } from "./public-only-route"
import { ProtectedRoute } from "./protected-route"

const Router = createBrowserRouter([
  {
    element: <PublicOnlyRoute />,
    children: [{ path: "/login", element: <Login /> }],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <SidebarLayout />,
        children: [
          {
            path: "/",
            element: <Dashboard />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
])

export default Router
