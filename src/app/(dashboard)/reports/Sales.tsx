"use client";

import { useState } from "react";
import Pagination from "@/components/inventory/Pagination";

const MOCK_DATA = [
  { id: 1, client: "Lia Fernanda Ramírez", receipt: 1001, date: "03-05-2025", total: 200.0 },
  { id: 2, client: "María López",          receipt: 1002, date: "03-05-2025", total: 150.0 },
  { id: 3, client: "Carlos Ruiz",          receipt: 1003, date: "04-05-2025", total: 320.0 },
  { id: 4, client: "Ana Martínez",         receipt: 1004, date: "05-05-2025", total: 90.0  },
  { id: 5, client: "Pedro García",         receipt: 1005, date: "06-05-2025", total: 210.0 },
  { id: 6, client: "Laura Sánchez",        receipt: 1006, date: "07-05-2025", total: 175.0 },
  { id: 7, client: "Jorge Torres",         receipt: 1007, date: "08-05-2025", total: 130.0 },
  { id: 8, client: "Sofía Herrera",        receipt: 1008, date: "09-05-2025", total: 260.0 },
];

const ROWS_PER_PAGE = 6;

const formatLempiras = (value: number) =>
  new Intl.NumberFormat("es-HN", {
    style: "currency",
    currency: "HNL",
    minimumFractionDigits: 2,
  }).format(value);

export default function SalesTab() {
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
                {rows.length > 0 ? (
                  rows.map((r) => (
                    <tr key={r.id} className="group hover:bg-[#F6DEEB]/30 transition-all duration-200">
                      <td className="px-8 py-5 border-r border-slate-100 transition-transform duration-200 group-hover:translate-x-1">
                        <span className="font-bold text-slate-900 text-sm">{r.client}</span>
                      </td>
                      <td className="px-8 py-5 border-r border-slate-100 transition-transform duration-200 group-hover:translate-x-1">
                        <span className="text-sm text-gray-500">{r.receipt}</span>
                      </td>
                      <td className="px-8 py-5 border-r border-slate-100 transition-transform duration-200 group-hover:translate-x-1">
                        <span className="text-sm text-gray-500">{r.date}</span>
                      </td>
                      <td className="px-8 py-5 transition-transform duration-200 group-hover:translate-x-1">
                        <span className="text-sm text-gray-500">{formatLempiras(r.total)}</span>
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
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                          Sin resultados
                        </p>
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
