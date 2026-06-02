import { cn } from "@/lib/utils"
import { Button } from "./ui/button"

export default function ProductSizeSelector({
  sizes,
  value,
  onChange,
}: {
  sizes: { size: string; stock: number }[]
  value: string
  onChange: (size: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map((s) => {
        const isSelected = value === s.size

        return (
          <Button
            key={s.size}
            type="button"
            disabled={s.stock <= 0}
            onClick={() => onChange(s.size)}
            className={cn(
              "h-8 w-8 text-xs",
              isSelected &&
                "ring-2 ring-foreground ring-offset-1 ring-offset-primary-foreground"
            )}
          >
            {s.size}
          </Button>
        )
      })}
    </div>
  )
}
