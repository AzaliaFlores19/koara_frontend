"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, Calendar, Wallet, CheckCircle } from "lucide-react";
import { reportsApi, type FrequentCustomer } from "@/services/reports.service";

const ROWS_PER_PAGE = 6;

function today() { return new Date().toISOString().split("T")[0]; }
function firstOfMonth() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split("T")[0];
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat("es-HN", { style: "currency", currency: "HNL", minimumFractionDigits: 2 }).format(n);
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-HN");
}

export default function FrequentShoppersTab() {
  const [startDate, setStartDate] = useState(firstOfMonth());
  const [endDate, setEndDate]     = useState(today());
  const [data, setData]           = useState<FrequentCustomer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast]         = useState(false);
  const [page, setPage]           = useState(1);

  const showToast = () => { setToast(true); setTimeout(() => setToast(false), 2500); };

  const fetchData = async (start: string, end: string, showFeedback = false) => {
    setIsLoading(true);
    try {
      const result = await reportsApi.getFrequentCustomers(start, end);
      setData(result);
      setPage(1);
      if (showFeedback) showToast();
    } catch {
      // silent
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(startDate, endDate); }, []);

  const totalPages = Math.ceil(data.length / ROWS_PER_PAGE);
  const rows = data.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  return (
    <div className="flex flex-col gap-4 flex-1">
      {/* Barra de filtro */}
      <div className="flex items-center gap-3 bg-white rounded-2xl p-3 border border-black flex-wrap">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="flex-1 min-w-0 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-koara-primary"
          />
          <span className="text-gray-500 font-bold shrink-0">→</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="flex-1 min-w-0 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-koara-primary"
          />
        </div>
        <button
          onClick={() => reportsApi.exportReport("frequent-customers", startDate, endDate, "pdf")}
          className="px-5 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors shrink-0"
        >
          Exportar PDF
        </button>
        <button
          onClick={() => fetchData(startDate, endDate, true)}
          disabled={isLoading}
          className="px-5 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors shrink-0 disabled:opacity-50"
        >
          {isLoading ? "Cargando..." : "Generar Reporte"}
        </button>
      </div>

      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-green-600 text-white rounded-2xl px-7 py-4 shadow-xl text-sm font-medium">
          <CheckCircle size={20} className="shrink-0" />
          Reporte generado correctamente
        </div>
      )}

      {/* Cards */}
      {isLoading && data.length === 0 ? (
        <div className="flex justify-center py-16">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#8C5E78] border-t-transparent" />
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-20 opacity-40">
          <div className="w-12 h-12 rounded-full border-2 border-slate-400 flex items-center justify-center">
            <span className="text-xl">?</span>
          </div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Sin resultados</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((item, i) => (
              <article
                key={item.client?.id ?? i}
                className="flex min-h-36 flex-col justify-between rounded-[1.15rem] border-2 border-black bg-gradient-to-br from-white via-white to-[#FFF3FA] p-4 shadow-[0_8px_18px_rgba(112,58,97,0.10)] transition hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(112,58,97,0.16)]"
              >
                <div className="min-w-0">
                  <h2 className="break-words text-base font-black leading-tight text-black">
                    {item.client?.name ?? "—"}
                  </h2>
                  <div className="mt-3 space-y-1 text-sm text-slate-700">
                    <p className="flex items-center gap-2">
                      <ShoppingBag size={15} className="shrink-0 text-[#8C5E78]" />
                      <span><span className="font-bold">{item.invoice_count}</span> compras realizadas</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Calendar size={15} className="shrink-0 text-[#8C5E78]" />
                      <span>Última compra: <span className="font-bold">{formatDate(item.last_purchase)}</span></span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Wallet size={15} className="shrink-0 text-[#8C5E78]" />
                      <span>Total: <span className="font-bold">{formatCurrency(item.total_spent)}</span></span>
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 rounded-full border border-black flex items-center justify-center text-sm hover:bg-gray-100 disabled:opacity-30"
              >
                ‹
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                    p === page ? "bg-black text-white" : "border border-black hover:bg-gray-100"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-8 h-8 rounded-full border border-black flex items-center justify-center text-sm hover:bg-gray-100 disabled:opacity-30"
              >
                ›
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
