import { useCategoryProducts } from "@/api/categories/use-category-products"
import Container from "@/components/container"
import ProductCard from "@/components/product-card"
import { useParams } from "react-router-dom"

export default function CategoryPage() {
  const { categorySlug } = useParams() as { categorySlug: string }
  const { products, isLoading, cursorRef } = useCategoryProducts(categorySlug)

  return (
    <section className="pt-15 pb-8">
      <Container className="grid min-h-[calc(100vh-60px)] grid-cols-2 gap-2 pt-4 md:grid-cols-3 md:gap-3 lg:grid-cols-4">
        {isLoading || !products
          ? Array.from({ length: 4 }).map((_, i) => (
              <ProductCard key={i} isLoading />
            ))
          : products.flatMap((product) =>
              product.variants.map((variant) => (
                <ProductCard
                  key={variant.id}
                  product={{
                    ...product,
                    name: `${product.name} ${variant.color.name}`,
                    variants: [variant],
                  }}
                />
              ))
            )}

        {!isLoading && <div ref={cursorRef} />}
      </Container>
    </section>
  )
}
