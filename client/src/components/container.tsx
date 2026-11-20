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
        "w-full",
        variant === "default" && "mx-auto max-w-[1640px] px-4 sm:px-6 lg:px-8",
        variant === "header" && "mx-auto max-w-[1640px] px-3 sm:px-4 lg:px-6",
        className
      )}
    >
      {children}
    </div>
  )
}
