import { useProduct } from "@/api/products/use-product"
import { useRelatedProducts } from "@/api/products/use-related-products"
import Container from "@/components/container"
import Image from "@/components/image"
import ProductForm from "@/components/product-form"
import ProductsCarousel from "@/components/products-carousel"
import { useParams, useSearchParams } from "react-router-dom"

export default function Product() {
  const { productSlug } = useParams() as {
    productSlug: string
  }

  const { product } = useProduct(productSlug)
  const { products: relatedProducts, isLoading: relatedProductsIsLoading } =
    useRelatedProducts(productSlug)

  const [searchParams] = useSearchParams()

  const variantIdFromUrl = searchParams.get("variant")

  const selectedVariant =
    product.variants.find((variant) => variant.id === variantIdFromUrl) ||
    product.variants[0]

  return (
    <>
      <section>
        <Container className="flex flex-col justify-center gap-4 pt-4 pb-8 md:flex-row md:gap-6 lg:gap-8">
          {/* IMAGE */}
          <div className="aspect-3/4 max-h-[calc(100svh-60px-32px)] bg-zinc-100">
            <Image
              src={`${import.meta.env.VITE_API_URL}${selectedVariant.image}`}
              alt={product.name}
            />
          </div>

          {/* INFO */}
          <div className="flex flex-col gap-2 md:max-w-xs">
            <h2 className="text-2xl font-semibold">{product.name}</h2>
            <p className="mt-2 text-sm text-zinc-500">{product.description}</p>
            <div className="mb-4 text-lg font-medium">${product.price}</div>

            {/* Form */}
            <ProductForm product={product} selectedVariant={selectedVariant} />
          </div>
        </Container>
      </section>

      <ProductsCarousel
        products={relatedProducts}
        isLoading={relatedProductsIsLoading}
        title="Related products"
      />
    </>
  )
}
