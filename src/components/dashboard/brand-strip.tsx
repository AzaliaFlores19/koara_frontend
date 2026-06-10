interface Brand {
  name: string
  logo: string
}

interface BrandStripProps {
  brands: Brand[]
}

export function BrandStrip({ brands }: BrandStripProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-16">
      {brands.map((brand) => (
        <img
          key={brand.name}
          src={brand.logo || "/placeholder.svg"}
          alt={brand.name}
          style={{ height: 40, width: "auto" }}
          className="object-contain opacity-80 transition hover:opacity-100"
        />
      ))}
    </div>
  )
}
