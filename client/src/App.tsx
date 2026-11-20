import { BrowserRouter, Routes, Route } from "react-router"
import { Home } from "./pages/Home"
import AppLayout from "./layouts/app-layout"
import { NotFound } from "./pages/Not-Found"
import { Login } from "./pages/Login"
import { Register } from "./pages/Register"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="/auth">
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
