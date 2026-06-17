"use client";

import { useState } from "react";

const MOCK_DATA = [
  { name: "Serum Vitamina C",    unitsSold: 42, category: "Serum",    total: 840.0  },
  { name: "Crema Hidratante",    unitsSold: 38, category: "Crema",    total: 760.0  },
  { name: "Tónico Facial",       unitsSold: 31, category: "Tónico",   total: 620.0  },
  { name: "Mascarilla Arcilla",  unitsSold: 27, category: "Mascarilla", total: 540.0 },
  { name: "Aceite Rosa Mosqueta",unitsSold: 24, category: "Aceite",   total: 480.0  },
  { name: "SPF 50 Diario",       unitsSold: 20, category: "Protector",total: 400.0  },
  { name: "Sérum Retinol",       unitsSold: 18, category: "Serum",    total: 360.0  },
  { name: "Gel Limpiador",       unitsSold: 15, category: "Limpiador",total: 300.0  },
  { name: "Contorno de Ojos",    unitsSold: 12, category: "Crema",    total: 240.0  },
  { name: "Exfoliante Facial",   unitsSold: 10, category: "Exfoliante",total: 200.0 },
];

const ROWS_PER_PAGE = 6;

export default function BestSellersTab() {
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
            placeholder="DD - MM - YYYY"
            className="flex-1 min-w-0 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-koara-primary"
          />
          <span className="text-gray-500 font-bold shrink-0">→</span>
          <input
            type="date"
            placeholder="DD - MM - YYYY"
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
              <th className="px-6 py-4 text-center font-semibold">Units Sold</th>
              <th className="px-6 py-4 text-center font-semibold">Category</th>
              <th className="px-6 py-4 text-right font-semibold">Total in Sales</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((r) => (
              <tr key={r.name} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium">{r.name}</td>
                <td className="px-6 py-4 text-center">{r.unitsSold}</td>
                <td className="px-6 py-4 text-center">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#f0e6ff] text-[#7c3aed] border border-[#d8b4fe]">
                    {r.category}
                  </span>
                </td>
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
