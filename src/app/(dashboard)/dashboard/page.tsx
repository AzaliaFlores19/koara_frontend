"use client";

import { useState, useEffect } from "react";
import { 
  Mail, 
  BookOpen, 
  TrendingUp, 
  FileText, 
  AlertTriangle, 
  Loader2, 
  Package, 
  Users, 
  Tags, 
  Target, 
  Eye 
} from "lucide-react";
import { TopProducts } from "@/components/dashboard/BestSellingCarousel";
import { BrandStrip } from "@/components/dashboard/brand-strip";
import { StatCard } from "@/components/dashboard/StatCard";
import DashboardLayout from "@/components/layout/layout";
import { isAdmin } from "@/lib/api/auth.api";

import { dashboardService, DashboardMetrics } from "@/services/dashboard.service";
import { formatNumber } from "@/lib/format";
import koaraLogo from "@/imports/logo_insta_2.jpg";
import tocoboLogo from "@/imports/Tocobo_logo.png";
import medicubeLogo from "@/imports/Medicube_logo.webp";
import celimaxLogo from "@/imports/Celimax_logo.png";

const brands = [
  { name: "Tocobo", logo: tocoboLogo.src },
  { name: "Medicube", logo: medicubeLogo.src },
  { name: "Celimax", logo: celimaxLogo.src },
];

export default function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userIsAdmin, setUserIsAdmin] = useState(false);

  useEffect(() => {
    setUserIsAdmin(isAdmin());
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await dashboardService.getRealMetrics();
        setMetrics(data);
      } catch (err: any) {
        console.error("Error retrieving aggregated metrics:", err);
        setError("No se pudieron obtener las métricas del negocio. Por favor, verifica el estado del servidor.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="text-center flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 animate-spin" style={{ color: "#D99EBD" }} />
            <p className="text-sm font-medium text-gray-500">Cargando métricas del negocio...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !metrics) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[70vh] items-center justify-center p-4">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 max-w-md text-center">
            <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-3" />
            <p className="text-sm font-semibold text-red-800">{error}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const formattedTopProducts = metrics.bestSellingProducts.map((p) => ({
    src: p.image || "/placeholder.svg", 
    name: p.name,
    category: p.category?.name || "Sin categoría", 
    code: p.code_bar,
    sales: p.total_quantity_sold
  }));

  return (
    <DashboardLayout>
      <div className="flex min-h-full flex-col relative w-full overflow-y-auto no-scrollbar">
        
        {/* ── BANDA 1: HERO / BRANDING ── */}
        <section className="w-full bg-white border-b border-black/5">
          <div className="mx-auto flex max-w-5xl flex-col items-center px-4 sm:px-6 lg:px-8 py-16 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-[#f4b8d4] bg-white shadow-lg">
                <img src={koaraLogo.src} alt="Koara logo" className="h-full w-full object-cover" />
              </div>
              <div className="max-w-2xl">
                <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground">
                  ¡Bienvenido de nuevo a Koara!
                </h1>
                <p className="mt-2 text-pretty text-base text-muted-foreground">
                  Tu panel premium para gestionar el cuidado de la piel
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── BANDA 2: KEY STATS CARDS ── */}
        <section className="w-full bg-[#f9e7f0]">
          <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="min-h-[140px] flex flex-col justify-between">
                <StatCard title="Productos" value={metrics.totalProducts} variant="pink" icon={<Package className="h-6 w-6" />} />
              </div>
              <div className="min-h-[140px] flex flex-col justify-between">
                <StatCard title="Clientes" value={metrics.totalClients} variant="sky" icon={<Users className="h-6 w-6" />} />
              </div>
              <div className="min-h-[140px] flex flex-col justify-between">
                <StatCard title="Categorías" value={metrics.totalCategories} variant="mint" icon={<Tags className="h-6 w-6" />} />
              </div>
            </div>
          </div>
        </section>

        {/* ── BANDA 3: BUSINESS OVERVIEW ── */}
        <section className="w-full bg-white">
          <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
            <h2 className="mb-6 text-2xl font-bold tracking-tight text-foreground">Resumen del negocio</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              
              <StatCard title="Stock bajo" value={metrics.lowStockProducts.length} variant="peach" icon={<AlertTriangle className="h-5 w-5" />}>
                <div className="mt-2 space-y-1">
                  {metrics.lowStockProducts.map((product) => (
                    <div key={product.name} className="flex justify-between items-center text-sm">
                      <span className="truncate text-foreground/80 max-w-[180px]">{product.name}</span>
                      <span className="rounded-full bg-[#f6c4a0] px-2 py-0.5 text-xs font-semibold text-foreground">
                        {formatNumber(product.stock)}
                      </span>
                    </div>
                  ))}
                </div>
              </StatCard>

              {userIsAdmin ? (
                <StatCard title="Ventas de hoy" value={metrics.todaySales.current} variant="pink" icon={<TrendingUp className="h-5 w-5" />}>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Ayer</span>
                      <span className="font-semibold text-foreground">{metrics.todaySales.yesterday}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Este mes</span>
                      <span className="font-semibold text-foreground">{metrics.todaySales.thisMonth}</span>
                    </div>
                  </div>
                </StatCard>
              ) : (
                <StatCard title="Panel Operativo" value="🌸" variant="pink" icon={<TrendingUp className="h-5 w-5" />}>
                  <div className="mt-2 text-sm text-muted-foreground">
                    Herramientas de gestión y métricas operativas para mejorar la eficiencia y el control del negocio.
                  </div>
                </StatCard>
              )}

              <StatCard title="Facturas emitidas" value={metrics.invoices.emitted} variant="sky" icon={<FileText className="h-5 w-5" />}>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pagadas</span>
                    <span className="font-semibold text-green-600">{metrics.invoices.emitted}</span>
                  </div>
                </div>
              </StatCard>

            </div>
          </div>
        </section>

        {/* ── BANDA 4: TOP PRODUCTS ── */}
        <section className="w-full bg-[#f9e7f0]">
          <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
            <TopProducts products={formattedTopProducts} />
          </div>
        </section>

        {/* ── BANDA 5: MISSION & VISION ── */}
        <section className="w-full bg-[#d99ebd]">
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-4 py-12 sm:px-6 md:grid-cols-2 lg:px-8">
            <div className="flex flex-col rounded-3xl bg-white/25 p-8">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/40">
                <Target className="h-6 w-6 text-foreground" />
              </span>
              <h2 className="mt-5 text-2xl font-bold text-foreground">Nuestra misión</h2>
              <p className="mt-3 text-pretty text-sm leading-relaxed text-foreground/80">
                Ofrecer productos de skincare coreano 100 % originales y de alta calidad, cuidadosamente seleccionados, brindando una experiencia de compra confiable, cercana y educativa. Koara busca acompañar a sus clientes en el cuidado consciente de la piel mediante asesoría personalizada, transparencia y un servicio enfocado en la satisfacción y confianza del consumidor.
              </p>
            </div>
            <div className="flex flex-col rounded-3xl bg-white p-8 shadow-sm">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f9e7f0]">
                <Eye className="h-6 w-6 text-[#c06fa0]" />
              </span>
              <h2 className="mt-5 text-2xl font-bold text-foreground">Nuestra visión</h2>
              <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
                Convertirse en la marca referente de skincare coreano en Honduras, reconocida por su autenticidad, innovación y compromiso con el bienestar de la piel, logrando una sólida presencia digital y física que permita acercar la calidad y los beneficios del cuidado coreano a un mayor número de personas en el país.
              </p>
            </div>
          </div>
        </section>

        {/* ── BANDA 6: BRANDS ── */}
        <section className="w-full bg-white">
          <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
            <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#c06fa0]">
              Marcas que ofrecemos
            </p>
            <BrandStrip brands={brands} />
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="mt-auto w-full bg-[#d99ebd]">
          <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 text-center sm:grid-cols-3 sm:text-left">
              <div>
                <h3 className="mb-3 font-semibold text-foreground">Contacto</h3>
                <div className="flex items-center justify-center gap-2 text-sm text-foreground sm:justify-start">
                  <Mail size={16} /> <span>info@koara.com</span>
                </div>
              </div>
              <div>
                <h3 className="mb-3 font-semibold text-foreground">Síguenos</h3>
                <a 
                  href="https://www.instagram.com/koara.kr" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-center gap-2 text-sm text-foreground hover:opacity-70 sm:justify-start"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg> @koara.kr
                </a>
              </div>
              <div>
                <h3 className="mb-3 font-semibold text-foreground">Catálogo</h3>
                <a 
                  href="https://heyzine.com/flip-book/2536f2e2a8.html" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-center gap-2 text-sm text-foreground hover:opacity-70 sm:justify-start"
                >
                  <BookOpen size={16} /> Ver nuestro catálogo
                </a>
              </div>
            </div>
            <div className="mt-6 border-t border-black/15 pt-6 text-center text-xs text-foreground/60">
              © 2026 Koara. Todos los derechos reservados.
            </div>
          </div>
        </footer>

      </div>
    </DashboardLayout>
  );
}
