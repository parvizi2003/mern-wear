import ProductCard from "./product-card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel"
import Container from "./container"
import type { Product } from "@/types"

export default function ProductsCarousel({
  products,
  isLoading,
  title,
}: {
  products?: Product[]
  isLoading: boolean
  title: string
}) {
  if (isLoading) return <div>Loading...</div>
  if (!products?.length) return null

  return (
    <section className="border-t py-8">
      <Carousel opts={{ align: "start" }} className="w-full">
        <Container>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold md:text-xl lg:text-2xl">
              {title}
            </h2>

            <div className="hidden items-center gap-2 md:flex">
              <CarouselPrevious className="static translate-y-0" />
              <CarouselNext className="static translate-y-0" />
            </div>
          </div>

          <CarouselContent>
            {products.map((product) =>
              product.variants.map((variant) => (
                <CarouselItem
                  key={variant.id}
                  className="basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <ProductCard
                    product={{
                      ...product,
                      name: `${product.name} ${variant.color.name}`,
                      variants: [variant],
                    }}
                  />
                </CarouselItem>
              ))
            )}
          </CarouselContent>
        </Container>
      </Carousel>
    </section>
  )
}
