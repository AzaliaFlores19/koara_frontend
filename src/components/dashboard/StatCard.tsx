import type { ReactNode } from "react"

interface StatCardProps {
  title: string
  value: string | number
  icon: ReactNode
  iconBg?: string
  variant?: "pink" | "mint" | "peach" | "sky"
  children?: ReactNode
}

const tints: Record<NonNullable<StatCardProps["variant"]>, { bg: string; ring: string; iconBg: string }> = {
  pink: { bg: "bg-[#fbe3ee]", ring: "ring-[#f4b8d4]", iconBg: "bg-[#f4b8d4]" },
  mint: { bg: "bg-[#dff3ec]", ring: "ring-[#a9ddca]", iconBg: "bg-[#a9ddca]" },
  peach: { bg: "bg-[#fde7da]", ring: "ring-[#f6c4a0]", iconBg: "bg-[#f6c4a0]" },
  sky: { bg: "bg-[#deeefb]", ring: "ring-[#a6cdf0]", iconBg: "bg-[#a6cdf0]" },
}

export function StatCard({ title, value, icon, iconBg, variant = "pink", children }: StatCardProps) {
  const t = tints[variant]
  return (
    <div className={`rounded-3xl ${t.bg} p-6 ring-1 ${t.ring} transition-transform duration-300 hover:-translate-y-1`}>
      <div className="flex items-center justify-between">
        <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${iconBg || t.iconBg} text-foreground`}>
          {icon}
        </span>
        <span className="text-4xl font-bold tracking-tight text-foreground">{value}</span>
      </div>
      <p className="mt-4 text-sm font-semibold text-foreground">{title}</p>
      {children && <div className="mt-3 space-y-1.5 border-t border-black/10 pt-3">{children}</div>}
    </div>
  )
}