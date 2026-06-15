"use client";

import { useState, useEffect } from "react";
import { Search, Plus, ChevronDown, Loader2, Eye } from "lucide-react";
import DashboardLayout from "@/components/layout/layout";
import { Table } from "@/components/Table";
import { Invoice } from "@/lib/types/models";
import { invoicesApi } from "@/lib/api/invoices";
import { InvoiceModal } from "@/components/invoices/InvoiceModal";
import { DateRangePicker } from "@/components/audit-logs/DateRangePicker";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "view" | "preview">("create");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const data = await invoicesApi.getAll();
      setInvoices(data);
    } catch (err) {
      console.error("Error fetching invoices:", err);
      setError("Error al cargar las facturas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleOpenCreateModal = () => {
    setModalMode("create");
    setSelectedInvoice(null);
    setIsModalOpen(true);
  };

  const handleOpenViewModal = (invoice: Invoice) => {
    setModalMode("view");
    setSelectedInvoice(invoice);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedInvoice(null);
  };

  const handleNextToPreview = (data: Partial<Invoice>) => {
    setSelectedInvoice(data as Invoice);
    setModalMode("preview");
  };

  const handleConfirmInvoice = async (data: Partial<Invoice>) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      const newInvoice: Invoice = {
        id: (Date.now()).toString(),
        invoice_number: (invoices.length + 1).toString(),
        client_name: data.client_name || "",
        vendor_name: data.vendor_name || "",
        subtotal: data.subtotal || 0,
        taxes: data.taxes || 0,
        total: data.total || 0,
        status: "ISSUED",
        created_at: data.created_at || new Date().toISOString(),
        invoice_items: data.invoice_items || [],
        payment_method: "CASH", // Default
        cai_range_id: "mock-range",
        client_id: "mock-client",
        user_id: "mock-user",
      };

      setInvoices((prev) => [newInvoice, ...prev]);
      
      // Show final view after creation
      setSelectedInvoice(newInvoice);
      setModalMode("view");
    } catch (err) {
      console.error("Error saving invoice:", err);
      alert("Error al guardar la factura.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch = invoice.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         invoice.invoice_number.includes(searchQuery);
    const matchesStatus = statusFilter === "ALL" || invoice.status === statusFilter;

    // Date Filtering Logic
    const invoiceDate = new Date(invoice.created_at).setHours(0, 0, 0, 0);
    const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
    const end = endDate ? new Date(endDate).setHours(0, 0, 0, 0) : null;

    let matchesDate = true;
    if (start && end) {
      matchesDate = invoiceDate >= start && invoiceDate <= end;
    } else if (start) {
      matchesDate = invoiceDate >= start;
    } else if (end) {
      matchesDate = invoiceDate <= end;
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const columns = [
    {
      header: "ID de Factura",
      render: (invoice: Invoice) => (
        <span className="font-bold text-slate-500 text-sm">Factura # {invoice.invoice_number}</span>
      ),
    },
    {
      header: "Hora y Fecha",
      render: (invoice: Invoice) => {
        const date = new Date(invoice.created_at);
        return (
          <span className="text-sm text-slate-900 font-medium">
            {date.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "2-digit" })} - {date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", hour12: false })}
          </span>
        );
      },
    },
    {
      header: "Cliente",
      render: (invoice: Invoice) => (
        <span className="font-bold text-slate-900 text-sm">{invoice.client_name}</span>
      ),
    },
    {
      header: "Vendedor",
      render: (invoice: Invoice) => (
        <span className="font-bold text-slate-900 text-sm">{invoice.vendor_name}</span>
      ),
    },
    {
      header: "Total en Ventas",
      render: (invoice: Invoice) => (
        <span className="font-bold text-slate-900 text-sm">L {invoice.total?.toFixed(2) ?? "0.00"}</span>
      ),
    },
    {
      header: "Estado",
      render: (invoice: Invoice) => (
        <span
          className={`inline-block px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            invoice.status === "ISSUED" 
              ? "bg-[#DCFCE7] text-[#16A34A]" 
              : "bg-[#FEE2E2] text-[#EF4444]"
          }`}
        >
          {invoice.status === "ISSUED" ? "EMITIDA" : "CANCELADA"}
        </span>
      ),
    },
    {
      header: "Acciones",
      render: (invoice: Invoice, { openConfirm }: any) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => handleOpenViewModal(invoice)}
            className="koara-icon-btn"
            aria-label="Ver factura"
          >
            <Eye size={14} />
          </button>
        </div>
      ),
      align: "right" as const,
    },
  ];

  if (loading && invoices.length === 0) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[70vh] items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-koara-dark" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Filter Bar */}
        <div className="bg-white rounded-[2rem] border-2 border-slate-900 p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Search Client */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Buscar Cliente"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-900 focus:outline-none bg-white text-sm font-bold placeholder:text-slate-400"
              />
            </div>

            {/* Date Picker */}
            <div className="w-full">
              <DateRangePicker
                start={startDate}
                end={endDate}
                onChange={(range) => {
                  setStartDate(range.start);
                  setEndDate(range.end);
                }}
                className="w-full"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-900 pointer-events-none" size={18} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-4 pr-12 py-3 rounded-xl border-2 border-slate-900 focus:outline-none bg-white text-sm font-bold appearance-none"
              >
                <option value="ALL">TODOS ...</option>
                <option value="ISSUED">EMITIDAS</option>
                <option value="CANCELLED">CANCELADAS</option>
              </select>
            </div>
          </div>
        </div>

        {/* Create Button */}
        <div className="flex justify-end">
          <button onClick={handleOpenCreateModal} className="koara-btn-black !px-8 !py-3 !rounded-2xl flex items-center gap-2">
            <Plus size={20} />
            CREAR FACTURA
          </button>
        </div>

        {/* Invoices Table */}
        <Table data={filteredInvoices} columns={columns} itemsPerPage={6} />

        <InvoiceModal
          isOpen={isModalOpen}
          mode={modalMode}
          invoice={selectedInvoice}
          onClose={handleCloseModal}
          onConfirm={handleConfirmInvoice}
          onNext={handleNextToPreview}
          isSubmitting={isSubmitting}
        />

      </div>
    </DashboardLayout>
  );
}
