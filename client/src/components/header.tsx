import Container from "./container"
import { Logo } from "./logo"
import { NavUser } from "./nav-user"
import { Sidebar } from "./sidebar"

export const Header = () => {
  return (
    <header className="sticky top-0 right-0 left-0 z-50 h-15 border-b bg-background/80 backdrop-blur-md">
      <Container variant="header" className="h-full">
        <div className="flex h-full items-center">
          <div className="flex flex-1 justify-start">
            <Sidebar />
          </div>
          <Logo />
          <div className="flex flex-1 justify-end gap-4">
            <NavUser />
          </div>
        </div>
      </Container>
    </header>
  )
}
