import { cn } from "@/lib/utils"

const sizes = {
  sm: "size-6 text-[8px]",
  md: "size-8 text-[10px]",
  lg: "size-10 text-xs",
  xl: "size-12 text-sm",
}

type LogoProps = {
  size?: keyof typeof sizes
}

export function Logo({ size = "md" }: LogoProps) {
  return (
    <div
      className={cn(
        sizes[size],
        "inline-flex items-center justify-center bg-foreground font-bold text-background uppercase select-none"
      )}
    >
      logo
    </div>
  )
}
