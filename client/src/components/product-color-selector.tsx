import { cn } from "@/lib/utils"
import type { Product } from "@/types"
import { Button } from "./ui/button"

export default function ProductColorSelector({
  product,
  variantId,
  onChange,
}: {
  product: Product
  variantId: string
  onChange: (id: string) => void
}) {
  return (
    <div className="flex gap-2">
      {product.variants.map((v) => {
        const isActive = v.id === variantId

        return (
          <Button
            key={v.id}
            variant={"outline"}
            type="button"
            onClick={() => onChange(v.id)}
            className={cn(
              "h-8 w-8",
              isActive &&
                "ring-2 ring-foreground ring-offset-1 ring-offset-primary-foreground"
            )}
            style={{ backgroundColor: v.color.code }}
          />
        )
      })}
    </div>
  )
}
