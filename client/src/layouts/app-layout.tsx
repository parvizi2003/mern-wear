import Footer from "@/components/footer"
import Header from "@/components/header"
import { useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"

export default function AppLayout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
