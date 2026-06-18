"use client";

import { Table } from "@/components/Table";

const MOCK_DATA = [
  {
    id: 1,
    name: "Serum Vitamina C",
    unitsSold: 42,
    category: "Serum",
    total: 840.0,
  },
  {
    id: 2,
    name: "Crema Hidratante",
    unitsSold: 38,
    category: "Crema",
    total: 760.0,
  },
  {
    id: 3,
    name: "Tónico Facial",
    unitsSold: 31,
    category: "Tónico",
    total: 620.0,
  },
  {
    id: 4,
    name: "Mascarilla Arcilla",
    unitsSold: 27,
    category: "Mascarilla",
    total: 540.0,
  },
  {
    id: 5,
    name: "Aceite Rosa Mosqueta",
    unitsSold: 24,
    category: "Aceite",
    total: 480.0,
  },
  {
    id: 6,
    name: "SPF 50 Diario",
    unitsSold: 20,
    category: "Protector",
    total: 400.0,
  },
  {
    id: 7,
    name: "Sérum Retinol",
    unitsSold: 18,
    category: "Serum",
    total: 360.0,
  },
  {
    id: 8,
    name: "Gel Limpiador",
    unitsSold: 15,
    category: "Limpiador",
    total: 300.0,
  },
  {
    id: 9,
    name: "Contorno de Ojos",
    unitsSold: 12,
    category: "Crema",
    total: 240.0,
  },
  {
    id: 10,
    name: "Exfoliante Facial",
    unitsSold: 10,
    category: "Exfoliante",
    total: 200.0,
  },
];

type BestSeller = (typeof MOCK_DATA)[number];

const columns = [
  {
    header: "Nombre",
    align: "center" as const,
    render: (item: BestSeller) => (
      <span className="font-bold text-slate-900 text-sm">{item.name}</span>
    ),
  },
  {
    header: "Unidades Vendidas",
    align: "center" as const,
    render: (item: BestSeller) => (
      <span className="text-sm text-gray-500">{item.unitsSold}</span>
    ),
  },
  {
    header: "Categoría",
    align: "center" as const,
    render: (item: BestSeller) => (
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#f0e6ff] text-[#7c3aed] border border-[#d8b4fe]">
        {item.category}
      </span>
    ),
  },
  {
    header: "Total en Ventas",
    align: "center" as const,
    render: (item: BestSeller) => (
      <span className="text-sm text-gray-500">L. {item.total.toFixed(2)}</span>
    ),
  },
];

export default function BestSellersTab() {
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

      <Table
        data={MOCK_DATA}
        columns={columns}
        itemsPerPage={6}
        enableMutationToast={false}
      />
    </div>
  );
}
