"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/layout";
import FrequentShoppersTab from "./FrequentShoppers";

const TABS = ["Sales Overview", "Best Sellers", "Sales", "Frequent Shoppers"];

const METRIC_CARDS = [
  { title: "Total de Facturas Emitidas",    value: "247",           bg: "bg-[#fde7da]", ring: "ring-[#f6c4a0]" },
  { title: "Ventas (Antes de Impuestos)",   value: "$ 1245.00",     bg: "bg-[#fbe3ee]", ring: "ring-[#f4b8d4]" },
  { title: "Ventas (Despues de impuestos)", value: "$ 14031.00",    bg: "bg-[#e8e8ec]", ring: "ring-[#cccccc]"  },
  { title: "Clientes Únicos",               value: "89",            bg: "bg-[#f0ebe2]", ring: "ring-[#d9c9b0]" },
];

const DETAILS = [
  { label: "Promedio por Factura:",  value: "$50.70"   },
  { label: "Promedio por Cliente:",  value: "$160.69"  },
  { label: "Impuestos Recaudados:",  value: "$1850.00" },
  { label: "Facturas por Cliente:",  value: "2.8"      },
];

function SalesOverviewTab() {
  return (
    <div className="flex flex-col gap-6 flex-1">
      {/* Date range + action buttons */}
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
        <button className="px-4 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors shrink-0">
          Exportar
        </button>
        <button className="px-4 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors shrink-0">
          Generar Reportes
        </button>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {METRIC_CARDS.map((card) => (
          <div
            key={card.title}
            className={`rounded-3xl ${card.bg} px-6 pt-6 pb-20 ring-1 ${card.ring} transition-transform duration-300 hover:-translate-y-1 flex flex-col items-center text-center`}
          >
            <p className="text-sm font-semibold text-black/70 leading-tight">{card.title}</p>
            <p className="text-3xl font-bold mt-8">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Detalles de Ventas */}
      <div className="bg-white rounded-3xl border border-black px-14 pt-6 pb-14 mt-7 flex flex-col">
        <h2 className="text-base font-bold mb-3 text-left">Detalles de Ventas:</h2>
        <div className="flex flex-col divide-y divide-gray-200">
          <div className="grid grid-cols-2 gap-x-8 py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">{DETAILS[0].label}</span>
              <span className="text-sm font-medium">{DETAILS[0].value}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">{DETAILS[1].label}</span>
              <span className="text-sm font-medium">{DETAILS[1].value}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-8 py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">{DETAILS[2].label}</span>
              <span className="text-sm font-medium">{DETAILS[2].value}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">{DETAILS[3].label}</span>
              <span className="text-sm font-medium">{DETAILS[3].value}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BestSellersTab() {
  return (
    <div className="flex items-center justify-center flex-1 text-gray-400 text-sm">
      Best Sellers — próximamente
    </div>
  );
}

function SalesTab() {
  return (
    <div className="flex items-center justify-center flex-1 text-gray-400 text-sm">
      Sales — próximamente
    </div>
  );
}


const TAB_CONTENT = [
  <SalesOverviewTab key="sales-overview" />,
  <BestSellersTab key="best-sellers" />,
  <SalesTab key="sales" />,
  <FrequentShoppersTab key="frequent-shoppers" />,
];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <DashboardLayout>
      <div className="w-full flex flex-col">
        <div className="max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 flex flex-col gap-6">

          <h1 className="text-xl font-semibold">Reports &amp; Statistics</h1>

          {/* Tab navigation */}
          <div className="flex gap-2 flex-wrap">
            {TABS.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeTab === i
                    ? "bg-black text-white"
                    : "bg-white text-black border border-black hover:bg-gray-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {TAB_CONTENT[activeTab]}

        </div>
      </div>
    </DashboardLayout>
  );
}
