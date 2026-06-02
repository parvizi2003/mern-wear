import AppLayout from "@/layouts/app-layout"
import Category from "@/pages/Category"
import Home from "@/pages/Home"
import Login from "@/pages/Login"
import NotFound from "@/pages/Not-Found"
import Register from "@/pages/Register"
import { createBrowserRouter } from "react-router-dom"
import PublicOnlyRoute from "./public-only-route"
import Product from "@/pages/Product"
import ErrorPage from "@/pages/Error-Page"
import Cart from "@/pages/Cart"
import Orders from "@/pages/Orders"
import AuthRoute from "./auth-route"

const Router = createBrowserRouter([
  {
    path: "/auth",
    element: <PublicOnlyRoute />,
    errorElement: <ErrorPage />,
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
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "cart", element: <Cart /> },
      { path: "categories/:categorySlug", element: <Category /> },
      { path: "products/:productSlug", element: <Product /> },
      {
        path: "orders",
        element: <AuthRoute />,
        children: [{ index: true, element: <Orders /> }],
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
])

export default Router
