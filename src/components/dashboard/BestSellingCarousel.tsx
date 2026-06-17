"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface TopProduct {
  src: string
  name: string
  category: string
  code: string
  sales: number
}

interface TopProductsProps {
  products: TopProduct[]
}

export function TopProducts({ products }: TopProductsProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)

  const scrollBy = (dir: number) => {
    scrollerRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" })
  }

  return (
    <div className="relative">
      <div className="mb-8 flex items-end justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-8 w-1 bg-[#d99ebd] rounded-full" />
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Productos Más Vendidos</h2>
          </div>
          <p className="text-sm text-gray-500 font-medium ml-3">El top de favoritos este mes en Koara</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => scrollBy(-1)}
            aria-label="Scroll left"
            className="group flex h-10 w-10 items-center justify-center rounded-xl bg-[#d99ebd] text-black shadow-sm transition-all hover:bg-[#c06fa0] hover:shadow-md active:scale-95"
          >
            <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
          </button>
          <button
            onClick={() => scrollBy(1)}
            aria-label="Scroll right"
            className="group flex h-10 w-10 items-center justify-center rounded-xl bg-[#d99ebd] text-black shadow-sm transition-all hover:bg-[#c06fa0] hover:shadow-md active:scale-95"
          >
            <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-8 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((product, index) => (
          <figure
            key={`${product.name}-${index}`}
            className="group w-64 shrink-0 snap-start transition-all duration-300 hover:-translate-y-2"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-black/[0.03] transition-all duration-500 group-hover:shadow-[0_20px_40px_rgba(217,158,189,0.15)] group-hover:ring-[#f4b8d4]/30">
              {/* Ranking Badge */}
              <div className="absolute left-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-2xl bg-[#d99ebd] text-sm font-black text-white shadow-lg shadow-[#d99ebd]/20 ring-4 ring-white">
                {index + 1}
              </div>
              
              {/* Sales Badge with Glassmorphism */}
              <div className="absolute bottom-4 left-4 right-4 z-20 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <div className="rounded-2xl bg-white/90 px-4 py-2 text-center text-[11px] font-bold text-[#c06fa0] shadow-sm backdrop-blur-md ring-1 ring-white/50">
                  {product.sales} unidades vendidas
                </div>
              </div>

              {/* Simple persistent sales badge for non-hover mobile/desktop */}
              <div className="absolute bottom-4 right-4 z-10 rounded-xl bg-[#f9e7f0] px-2.5 py-1 text-[10px] font-bold text-[#c06fa0] group-hover:opacity-0 transition-opacity duration-200 shadow-sm">
                {product.sales} vendidos
              </div>

              <img
                src={product.src || "/placeholder.svg"}
                alt={product.name}
                className="absolute inset-0 h-full w-full object-cover object-center scale-[1.1] transition-transform duration-700 ease-out group-hover:scale-[1.2]"
                style={{ willChange: 'transform' }}
              />
              
              {/* Subtle Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>

            <figcaption className="mt-5 px-2">
              <div className="mb-1 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#f4b8d4]" />
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#c06fa0]">
                  {product.category}
                </p>
              </div>
              <p className="line-clamp-2 min-h-[2.5rem] text-[15px] font-bold leading-tight text-gray-800 transition-colors group-hover:text-[#c06fa0]">
                {product.name}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-[11px] font-medium text-gray-400 font-mono tracking-tighter">
                  REF: {product.code}
                </p>
                <div className="h-px flex-1 mx-3 bg-gray-100 group-hover:bg-[#f4b8d4]/20 transition-colors" />
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}
