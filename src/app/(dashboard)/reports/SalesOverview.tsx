"use client";

import { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";
import DashboardLayout from "@/components/layout/layout";
import SalesTab from "./Sales";
import FrequentShoppersTab from "./FrequentShoppers";
import { reportsApi, type AnalyticsData } from "@/services/reports.service";
import BestSellersTab from "./BestSellers";

const TABS = ["Resumen de Ventas", "Más Vendidos", "Ventas", "Clientes Frecuentes"];

const CARD_META = [
  { key: "total_invoices",    title: "Total de Facturas Emitidas",    bg: "bg-[#fde7da]", ring: "ring-[#f6c4a0]" },
  { key: "total_before_tax",  title: "Ventas (Antes de Impuestos)",   bg: "bg-[#fbe3ee]", ring: "ring-[#f4b8d4]" },
  { key: "total_after_tax",   title: "Ventas (Despues de impuestos)", bg: "bg-[#e8e8ec]", ring: "ring-[#cccccc]"  },
  { key: "unique_clients",    title: "Clientes Únicos",               bg: "bg-[#f0ebe2]", ring: "ring-[#d9c9b0]" },
];

function today() { return new Date().toISOString().split("T")[0]; }
function firstOfMonth() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split("T")[0];
}

function fmt(n: number) {
  return `L ${n.toFixed(2)}`;
}

function SalesOverviewTab() {
  const [startDate, setStartDate] = useState(firstOfMonth());
  const [endDate, setEndDate]     = useState(today());
  const [data, setData]           = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast]         = useState(false);

  const showToast = () => {
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  };

  const fetchData = async (start: string, end: string, showFeedback = false) => {
    if (!start || !end) return;
    setIsLoading(true);
    try {
      const result = await reportsApi.getAnalytics(start, end);
      setData(result);
      if (showFeedback) showToast();
    } catch {
      // silent — keeps showing last data
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(startDate, endDate); }, []);

  const cardValues: Record<string, string> = data ? {
    total_invoices:   String(data.total_invoices),
    total_before_tax: fmt(data.total_before_tax),
    total_after_tax:  fmt(data.total_after_tax),
    unique_clients:   String(data.unique_clients),
  } : { total_invoices: "—", total_before_tax: "—", total_after_tax: "—", unique_clients: "—" };

  const details = [
    { label: "Promedio por Factura:",  value: data ? fmt(data.average_per_invoice)  : "—" },
    { label: "Promedio por Cliente:",  value: data ? fmt(data.average_per_client)   : "—" },
    { label: "Impuestos Recaudados:",  value: data ? fmt(data.taxes_collected)      : "—" },
    { label: "Facturas por Cliente:",  value: data ? data.invoices_per_client.toFixed(1) : "—" },
  ];

  return (
    <div className="flex flex-col gap-6 flex-1">
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
          onClick={() => reportsApi.exportAnalytics(startDate, endDate, "pdf")}
          className="px-4 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors shrink-0"
        >
          Exportar PDF
        </button>
        <button
          onClick={() => fetchData(startDate, endDate, true)}
          disabled={isLoading}
          className="px-4 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors shrink-0 disabled:opacity-50"
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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {CARD_META.map((card) => (
          <div
            key={card.key}
            className={`rounded-3xl ${card.bg} px-6 pt-6 pb-20 ring-1 ${card.ring} transition-transform duration-300 hover:-translate-y-1 flex flex-col items-center text-center`}
          >
            <p className="text-sm font-semibold text-black/70 leading-tight">{card.title}</p>
            <p className="text-3xl font-bold mt-8">{cardValues[card.key]}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-black px-14 pt-6 pb-14 mt-7 flex flex-col">
        <h2 className="text-base font-bold mb-3 text-left">Detalles de Ventas:</h2>
        <div className="flex flex-col divide-y divide-gray-200">
          <div className="grid grid-cols-2 gap-x-8 py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">{details[0].label}</span>
              <span className="text-sm font-medium">{details[0].value}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">{details[1].label}</span>
              <span className="text-sm font-medium">{details[1].value}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-8 py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">{details[2].label}</span>
              <span className="text-sm font-medium">{details[2].value}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">{details[3].label}</span>
              <span className="text-sm font-medium">{details[3].value}</span>
            </div>
          </div>
        </div>
      </div>
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

          <h1 className="text-xl font-semibold">Reportes y Estadísticas</h1>

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
