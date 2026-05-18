import { Link } from "react-router-dom"

import Container from "./container"
import { Logo } from "./logo"
import { NAV_ITEMS } from "./sidebar"

export default function Footer() {
  return (
    <footer className="border-t bg-muted/20">
      <Container className="py-10">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between md:gap-0">
          <div className="max-w-sm space-y-4">
            <Logo size="lg" />

            <p className="text-sm leading-relaxed text-muted-foreground">
              Minimal menswear focused on timeless silhouettes, premium fabrics
              and modern essentials.
            </p>
          </div>

          <div className="grid grid-cols-2 text-sm">
            <div className="space-y-3">
              <h3 className="font-semibold">Navigation</h3>

              <nav className="flex flex-col gap-2">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="text-muted-foreground transition hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Contact</h3>

              <div className="space-y-3 text-muted-foreground">
                <span className="block text-nowrap">support@mernwear.com</span>
                <span className="block text-nowrap">+0 (000) 000-000</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t pt-6 text-muted-foreground md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p>
              Designed & developed by{" "}
              <a
                href="https://github.com/parvizi2003"
                target="_blank"
                rel="noreferrer"
                className="text-nowrap text-white underline transition hover:text-foreground"
              >
                Parviz Haydarov
              </a>
            </p>

            <p className="text-sm">
              © {new Date().getFullYear()} MERN Wear. All rights reserved.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  )
}
