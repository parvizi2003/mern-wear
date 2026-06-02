import { useState } from "react"
import { Skeleton } from "./ui/skeleton"

export default function Image({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="relative h-full w-full overflow-hidden">
      {!loaded && <Skeleton className="absolute inset-0" />}

      <img
        src={import.meta.env.VITE_API_URL + src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`h-full w-full object-cover transition duration-300 group-hover:scale-105 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  )
}
