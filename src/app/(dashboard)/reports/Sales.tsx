"use client";

import { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";
import Pagination from "@/components/inventory/Pagination";
import { reportsApi, type SalesListItem } from "@/services/reports.service";
import { formatCurrency as formatLempiras } from "@/lib/format";

const ROWS_PER_PAGE = 6;

function today() { return new Date().toISOString().split("T")[0]; }
function firstOfMonth() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split("T")[0];
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("es-HN");

export default function SalesTab() {
  const [startDate, setStartDate] = useState(firstOfMonth());
  const [endDate, setEndDate]     = useState(today());
  const [data, setData]           = useState<SalesListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast]         = useState(false);
  const [page, setPage]           = useState(1);

  const showToast = () => { setToast(true); setTimeout(() => setToast(false), 2500); };

  const fetchData = async (start: string, end: string, showFeedback = false) => {
    if (!start || !end) return;
    setIsLoading(true);
    try {
      const result = await reportsApi.getSalesList(start, end);
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
          onClick={() => reportsApi.exportReport("sales", startDate, endDate, "pdf")}
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

      {/* Tabla */}
      <div className="space-y-10 animate-koara-fade relative">
        <div className="bg-white rounded-[1.5rem] overflow-hidden shadow-xl transition-all duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f4b8d4]">
                  <th className="px-8 py-5 text-sm font-bold text-black border-r border-black/10">Cliente</th>
                  <th className="px-8 py-5 text-sm font-bold text-black border-r border-black/10">N° Factura</th>
                  <th className="px-8 py-5 text-sm font-bold text-black border-r border-black/10">Fecha</th>
                  <th className="px-8 py-5 text-sm font-bold text-black">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-16 text-center">
                      <div className="flex justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#8C5E78] border-t-transparent" />
                      </div>
                    </td>
                  </tr>
                ) : rows.length > 0 ? (
                  rows.map((r) => (
                    <tr key={r.id} className="group hover:bg-[#F6DEEB]/30 transition-all duration-200">
                      <td className="px-8 py-5 border-r border-slate-100 transition-transform duration-200 group-hover:translate-x-1">
                        <span className="font-bold text-slate-900 text-sm">{r.client_name || "—"}</span>
                      </td>
                      <td className="px-8 py-5 border-r border-slate-100 transition-transform duration-200 group-hover:translate-x-1">
                        <span className="text-sm text-gray-500">{r.invoice_number}</span>
                      </td>
                      <td className="px-8 py-5 border-r border-slate-100 transition-transform duration-200 group-hover:translate-x-1">
                        <span className="text-sm text-gray-500">{formatDate(r.created_at)}</span>
                      </td>
                      <td className="px-8 py-5 transition-transform duration-200 group-hover:translate-x-1">
                        <span className="text-sm text-gray-500">{formatLempiras(parseFloat(r.total))}</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-2 opacity-40">
                        <div className="w-12 h-12 rounded-full border-2 border-slate-400 flex items-center justify-center">
                          <span className="text-xl">?</span>
                        </div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Sin resultados</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {totalPages > 1 && (
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        )}
      </div>
    </div>
  );
}
