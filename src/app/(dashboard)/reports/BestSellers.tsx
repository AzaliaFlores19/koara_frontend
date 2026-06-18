"use client";

import { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { Table } from "@/components/Table";
import { reportsApi, type TopProduct } from "@/services/reports.service";

function today() { return new Date().toISOString().split("T")[0]; }
function firstOfMonth() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split("T")[0];
}

const formatLempiras = (value: number) =>
  new Intl.NumberFormat("es-HN", { style: "currency", currency: "HNL", minimumFractionDigits: 2 }).format(value);

type RowItem = TopProduct & { id: string };

export default function BestSellersTab() {
  const [startDate, setStartDate] = useState(firstOfMonth());
  const [endDate, setEndDate]     = useState(today());
  const [data, setData]           = useState<RowItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast]         = useState(false);

  const showToast = () => { setToast(true); setTimeout(() => setToast(false), 2500); };

  const fetchData = async (start: string, end: string, showFeedback = false) => {
    if (!start || !end) return;
    setIsLoading(true);
    try {
      const result = await reportsApi.getTopProducts(start, end);
      setData(result.map((item, i) => ({ ...item, id: item.product?.id ?? String(i) })));
      if (showFeedback) showToast();
    } catch {
      // silent
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(startDate, endDate); }, []);

  const columns = [
    {
      header: "Producto",
      render: (item: RowItem) => (
        <span className="font-bold text-slate-900 text-sm">{item.product?.name ?? "—"}</span>
      ),
    },
    {
      header: "Categoría",
      render: (item: RowItem) => (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#f0e6ff] text-[#7c3aed] border border-[#d8b4fe]">
          {item.product?.category?.name ?? "—"}
        </span>
      ),
    },
    {
      header: "Unidades Vendidas",
      render: (item: RowItem) => (
        <span className="text-sm text-gray-500">{item.total_quantity_sold}</span>
      ),
    },
    {
      header: "Total en Ventas",
      render: (item: RowItem) => (
        <span className="text-sm text-gray-500">{formatLempiras(item.revenue)}</span>
      ),
    },
  ];

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
          onClick={() => reportsApi.exportReport("top-products", startDate, endDate, "pdf")}
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

      {isLoading && data.length === 0 ? (
        <div className="flex justify-center py-16">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#8C5E78] border-t-transparent" />
        </div>
      ) : (
        <Table data={data} columns={columns} itemsPerPage={6} enableMutationToast={false} />
      )}
    </div>
  );
}
