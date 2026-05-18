import { cn } from "@/lib/utils"

type ContainerProps = {
  className?: string
  children: React.ReactNode
  variant?: "default" | "header"
}

export default function Container({
  className,
  children,
  variant = "default",
}: ContainerProps) {
  return (
    <div
      className={cn(
        variant === "default" && "mx-4",
        variant === "header" && "mx-2",
        className
      )}
    >
      {children}
    </div>
  )
}
