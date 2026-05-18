import { useProductsByCategory } from "@/api/products/use-products"
import Container from "@/components/container"
import { useParams } from "react-router-dom"

export default function CategoryPage() {
  const { slug } = useParams()
  const category = slug?.replace(/-/g, "")
  const { products, isLoading } = useProductsByCategory(category)
  return (
    <section className="mt-15 min-h-svh">
      <Container>
        <h1 className="text-xl font-bold capitalize">{slug}</h1>
      </Container>
    </section>
  )
}
