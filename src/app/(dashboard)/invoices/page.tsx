"use client";

import { useState, useEffect } from "react";
import { Search, Plus, ChevronDown, Loader2, Eye, Download } from "lucide-react";
import DashboardLayout from "@/components/layout/layout";
import { Table } from "@/components/Table";
import { Invoice } from "@/lib/types/models";
import { invoicesApi } from "@/lib/api/invoices";
import {
  InvoiceModal,
  type CreateInvoicePayload,
} from "@/components/invoices/InvoiceModal";
import { DateRangePicker } from "@/components/audit-logs/DateRangePicker";
import { productsApi } from "@/services/products.service";
import { clientsApi } from "@/services/clients.service";
import { getAuth } from "@/lib/auth";

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
  const [productOptions, setProductOptions] = useState<
    { id: string; name: string; price: number }[]
  >([]);
  const [clients, setClients] = useState<{ id: string; name: string }[]>([]);

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

  useEffect(() => {
    productsApi
      .getAll(1, 100)
      .then((res) =>
        setProductOptions(
          res.data.map((p) => ({ id: p.id, name: p.name, price: p.price })),
        ),
      )
      .catch(() => setProductOptions([]));
  }, []);

  useEffect(() => {
    clientsApi
      .getAll(1, 100)
      .then((res) => {
        const list = (res?.data ?? res ?? []) as { id: string; name: string }[];
        setClients(list.map((c) => ({ id: c.id, name: c.name })));
      })
      .catch(() => setClients([]));
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

  const handleConfirmInvoice = async (data: CreateInvoicePayload) => {
    setIsSubmitting(true);
    try {
      // TODO: integrar con la API (POST /invoices). Por ahora se crea localmente.
      await new Promise((resolve) => setTimeout(resolve, 600));

      const items = data.invoice_items ?? [];
      const subtotal = items.reduce(
        (acc, item) => acc + (item.unit_price ?? 0) * (item.quantity ?? 0),
        0,
      );
      const taxes = subtotal * 0.15;
      const total = subtotal + taxes;
      const client = clients.find((c) => c.id === data.customerId);

      const newInvoice: Invoice = {
        id: Date.now().toString(),
        invoice_number: (invoices.length + 1).toString(),
        client_name: client?.name || "",
        vendor_name: getAuth()?.name || "",
        subtotal,
        taxes,
        total,
        status: "ISSUED",
        created_at: new Date().toISOString(),
        invoice_items: items,
        payment_method: data.payment_method,
        cai_range_id: "mock-range",
        client_id: data.customerId,
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
          <button
            className="koara-icon-btn"
            aria-label="Descargar factura"
          >
            <Download size={14} />
          </button>
        </div>
      ),
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
            <div className="w-full md:col-start-3">
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
          productOptions={productOptions}
          clientOptions={clients}
          onClose={handleCloseModal}
          onConfirm={handleConfirmInvoice}
          isSubmitting={isSubmitting}
        />

      </div>
    </DashboardLayout>
  );
}
