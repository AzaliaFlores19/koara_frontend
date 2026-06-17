"use client";

import { useState } from "react";

const MOCK_DATA = [
  { name: "Lia Fernanda Ramírez", purchases: 10, lastPurchase: "03-05-2025", total: 200.0 },
  { name: "María López",          purchases: 8,  lastPurchase: "04-05-2025", total: 320.0 },
  { name: "Ana Martínez",         purchases: 7,  lastPurchase: "05-05-2025", total: 280.0 },
  { name: "Laura Sánchez",        purchases: 6,  lastPurchase: "06-05-2025", total: 240.0 },
  { name: "Carlos Ruiz",          purchases: 5,  lastPurchase: "07-05-2025", total: 200.0 },
  { name: "Pedro García",         purchases: 5,  lastPurchase: "08-05-2025", total: 180.0 },
  { name: "Sofía Herrera",        purchases: 4,  lastPurchase: "09-05-2025", total: 160.0 },
  { name: "Jorge Torres",         purchases: 3,  lastPurchase: "10-05-2025", total: 120.0 },
];

const ROWS_PER_PAGE = 6;

export default function FrequentShoppersTab() {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(MOCK_DATA.length / ROWS_PER_PAGE);
  const rows = MOCK_DATA.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  return (
    <div className="flex flex-col gap-4 flex-1">
      {/* Date filter bar */}
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
          Generar Reportes
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-black overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#f9c8d9]">
              <th className="px-6 py-4 text-left font-semibold">Name</th>
              <th className="px-6 py-4 text-center font-semibold">Purchases Made</th>
              <th className="px-6 py-4 text-center font-semibold">Last Purchase</th>
              <th className="px-6 py-4 text-right font-semibold">Total in Purchases</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((r) => (
              <tr key={r.name} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium">{r.name}</td>
                <td className="px-6 py-4 text-center">{r.purchases}</td>
                <td className="px-6 py-4 text-center">{r.lastPurchase}</td>
                <td className="px-6 py-4 text-right">$ {r.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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
              p === page
                ? "bg-black text-white"
                : "border border-black hover:bg-gray-100"
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
