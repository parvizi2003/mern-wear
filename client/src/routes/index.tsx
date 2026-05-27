import AppLayout from "@/layouts/app-layout"
import Category from "@/pages/Category"
import Home from "@/pages/Home"
import Login from "@/pages/Login"
import NotFound from "@/pages/Not-Found"
import Register from "@/pages/Register"
import { createBrowserRouter } from "react-router-dom"
import PublicOnlyRoute from "./public-only-route"
import Product from "@/pages/Product"

const Router = createBrowserRouter([
  {
    path: "/auth",
    element: <PublicOnlyRoute />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },

  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "categories/:categorySlug", element: <Category /> },
      { path: "products/:productSlug", element: <Product /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
])

export default Router
