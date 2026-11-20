import { Header } from "@/components/header"
import { Outlet } from "react-router"

export default function AppLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  )
}
