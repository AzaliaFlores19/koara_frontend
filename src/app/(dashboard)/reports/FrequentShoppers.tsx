"use client";

import { useState } from "react";
import { ShoppingBag, Calendar, Wallet } from "lucide-react";

const MOCK_DATA = [
  { id: "1", name: "Lia Fernanda Ramírez", purchases: 10, lastPurchase: "03-05-2025", total: 200.0 },
  { id: "2", name: "María López",          purchases: 8,  lastPurchase: "04-05-2025", total: 320.0 },
  { id: "3", name: "Ana Martínez",         purchases: 7,  lastPurchase: "05-05-2025", total: 280.0 },
  { id: "4", name: "Laura Sánchez",        purchases: 6,  lastPurchase: "06-05-2025", total: 240.0 },
  { id: "5", name: "Carlos Ruiz",          purchases: 5,  lastPurchase: "07-05-2025", total: 200.0 },
  { id: "6", name: "Pedro García",         purchases: 5,  lastPurchase: "08-05-2025", total: 180.0 },
  { id: "7", name: "Sofía Herrera",        purchases: 4,  lastPurchase: "09-05-2025", total: 160.0 },
  { id: "8", name: "Jorge Torres",         purchases: 3,  lastPurchase: "10-05-2025", total: 120.0 },
];

const ROWS_PER_PAGE = 6;

function formatCurrency(n: number) {
  return new Intl.NumberFormat("es-HN", { style: "currency", currency: "HNL", minimumFractionDigits: 2 }).format(n);
}

export default function FrequentShoppersTab() {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(MOCK_DATA.length / ROWS_PER_PAGE);
  const rows = MOCK_DATA.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  return (
    <div className="flex flex-col gap-4 flex-1">
      {/* Barra de filtro */}
      <div className="flex items-center gap-3 bg-white rounded-2xl p-3 border border-black flex-wrap">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <input
            type="date"
            className="flex-1 min-w-0 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-koara-primary"
          />
          <span className="text-gray-500 font-bold shrink-0">→</span>
          <input
            type="date"
            className="flex-1 min-w-0 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-koara-primary"
          />
        </div>
        <button className="px-5 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors shrink-0">
          Exportar
        </button>
        <button className="px-5 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors shrink-0">
          Generar Reporte
        </button>
      </div>

      {/* Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((item) => (
          <article
            key={item.id}
            className="flex min-h-36 flex-col justify-between rounded-[1.15rem] border-2 border-black bg-gradient-to-br from-white via-white to-[#FFF3FA] p-4 shadow-[0_8px_18px_rgba(112,58,97,0.10)] transition hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(112,58,97,0.16)]"
          >
            <div className="min-w-0">
              <h2 className="break-words text-base font-black leading-tight text-black">
                {item.name}
              </h2>
              <div className="mt-3 space-y-1 text-sm text-slate-700">
                <p className="flex items-center gap-2">
                  <ShoppingBag size={15} className="shrink-0 text-[#8C5E78]" />
                  <span><span className="font-bold">{item.purchases}</span> compras realizadas</span>
                </p>
                <p className="flex items-center gap-2">
                  <Calendar size={15} className="shrink-0 text-[#8C5E78]" />
                  <span>Última compra: <span className="font-bold">{item.lastPurchase}</span></span>
                </p>
                <p className="flex items-center gap-2">
                  <Wallet size={15} className="shrink-0 text-[#8C5E78]" />
                  <span>Total: <span className="font-bold">{formatCurrency(item.total)}</span></span>
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Paginación */}
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
    </div>
  );
}
