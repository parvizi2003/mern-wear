import Container from "@/components/container"
import intro from "@/assets/images/intro.webp"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { useCategories } from "@/api/categories/use-categories"
import { useNewProducts } from "@/api/products/use-new-products"
import ProductsCarousel from "@/components/products-carousel"

export default function Home() {
  const { categories } = useCategories()
  const { products, isLoading } = useNewProducts()

  return (
    <>
      <section
        className="relative mt-15 h-[calc(100vh-60px)] bg-cover"
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
                  <Link to={`/categories/${categories[0].slug}`}>Shop now</Link>
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
      </section>
      <ProductsCarousel
        products={products}
        isLoading={isLoading}
        title="New Arrivals"
      />
    </>
  )
}
