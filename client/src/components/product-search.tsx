import { useState } from "react"
import { Search, X } from "lucide-react"
import { Link } from "react-router-dom"

import { useSearchProducts } from "@/api/products/use-search-products"

import { Button } from "./ui/button"
import { Input } from "./ui/input"
import Image from "./image"

export default function ProductSearch() {
  const [search, setSearch] = useState("")
  const [open, setOpen] = useState(false)

  const { products, isLoading } = useSearchProducts(search)

  return (
    <>
      {/* MOBILE */}
      <div className="lg:hidden">
        <Button variant="ghost" size="icon" onClick={() => setOpen((v) => !v)}>
          <Search />
        </Button>

        {open && (
          <div className="absolute top-0 right-0 left-0 z-50 h-15 border bg-background">
            <div className="relative h-full">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-full w-full border-b px-4 py-2 text-sm"
                placeholder="Search for products"
                autoFocus
              />
              <Button
                className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground"
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
              >
                <X />
              </Button>
            </div>

            {search.trim() && (
              <div className="max-h-96 overflow-y-auto bg-background shadow-2xl">
                {isLoading ? (
                  <div className="p-3 text-sm text-muted-foreground">
                    Loading...
                  </div>
                ) : products?.length ? (
                  products.flatMap((product) =>
                    product.variants.map((variant) => (
                      <Link
                        key={variant.id}
                        to={`/products/${product.slug}?variant=${variant.id}`}
                        className="flex items-center gap-3 border-b p-3 last:border-b-0 hover:bg-muted/50"
                        onClick={() => setOpen(false)}
                      >
                        <div className="aspect-3/4 w-10">
                          <Image
                            src={variant.image}
                            alt={product.name + " " + variant.color.name}
                          />
                        </div>

                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {product.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {variant.color.name}
                          </span>
                        </div>
                      </Link>
                    ))
                  )
                ) : (
                  <div className="p-3 text-sm text-muted-foreground">
                    No products found
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* DESKTOP */}
      <div className="relative hidden lg:block">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64 pr-10"
          placeholder="Search for products"
        />

        <Search className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground" />

        {search.trim() && (
          <div className="absolute top-full right-0 left-0 z-50 mt-2 max-h-96 overflow-y-auto border bg-background shadow-md">
            {isLoading ? (
              <div className="p-3 text-sm text-muted-foreground">
                Loading...
              </div>
            ) : products?.length ? (
              products.flatMap((product) =>
                product.variants.map((variant) => (
                  <Link
                    key={variant.id}
                    to={`/products/${product.slug}?variant=${variant.id}`}
                    className="flex items-center gap-3 border-b p-3 last:border-b-0 hover:bg-muted/50"
                  >
                    <div className="aspect-3/4 w-10">
                      <Image
                        src={variant.image}
                        alt={product.name + " " + variant.color.name}
                      />
                    </div>

                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {product.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {variant.color.name}
                      </span>
                    </div>
                  </Link>
                ))
              )
            ) : (
              <div className="p-3 text-sm text-muted-foreground">
                No products found
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
