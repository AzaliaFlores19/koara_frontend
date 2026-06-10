"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface TopProduct {
  src: string
  name: string
  category: string
  code: string
}

interface TopProductsProps {
  products: TopProduct[]
}

export function TopProducts({ products }: TopProductsProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)

  const scrollBy = (dir: number) => {
    scrollerRef.current?.scrollBy({ left: dir * 280, behavior: "smooth" })
  }

  return (
    <div>
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Top Products</h2>
          <p className="text-sm text-muted-foreground">Your best sellers this month</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => scrollBy(-1)}
            aria-label="Scroll left"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f4b8d4] text-foreground transition hover:bg-[#d99ebd]"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => scrollBy(1)}
            aria-label="Scroll right"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f4b8d4] text-foreground transition hover:bg-[#d99ebd]"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((product, index) => (
          <figure
            key={`${product.name}-${index}`}
            className="group w-56 shrink-0 snap-start"
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white ring-1 ring-[#f4b8d4]/40">
              <span className="absolute left-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-[#d99ebd] text-xs font-bold text-foreground shadow">
                {index + 1}
              </span>
              <img
                src={product.src || "/placeholder.svg"}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <figcaption className="mt-3">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#c06fa0]">
                {product.category}
              </p>
              <p className="truncate text-sm font-semibold text-foreground">{product.name}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{product.code} </p>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}
