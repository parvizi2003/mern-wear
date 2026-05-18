import Container from "@/components/container"
import intro from "@/assets/images/intro.jpg"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export default function Home() {
  return (
    <section
      className="relative h-svh bg-cover"
      style={{
        backgroundImage: `url(${intro})`,
        backgroundPosition: "40% 30%",
      }}
    >
      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/40" />

      {/* CONTENT */}
      <Container className="relative z-10 h-full">
        <div className="flex h-full flex-col justify-center">
          <div className="max-w-xl space-y-6 text-white">
            <h1 className="text-4xl font-semibold md:text-6xl">
              Minimal Menswear
            </h1>

            <p className="text-sm text-white/80 md:text-base">
              Clean silhouettes, premium materials and modern essentials.
            </p>

            <div className="flex gap-3">
              <Button asChild className="bg-white text-black">
                <Link to="/category/shirts">Shop now</Link>
              </Button>

              <Button
                variant="outline"
                className="border-white/70 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10 hover:text-white"
              >
                View collection
              </Button>
            </div>
          </div>
        </div>
      </Container>
      <div className="h-100"></div>
    </section>
  )
}
