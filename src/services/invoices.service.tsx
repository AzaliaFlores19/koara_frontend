import { Invoice, PaymentMethod } from "@/lib/types/models";
import { api } from "@/lib/api/axios";

// ====================
// TYPES
// ====================

export interface InvoiceFilters {
  customerId?: string;
  startDate?: string;
  endDate?: string;
  minTotal?: number;
  maxTotal?: number;
}

export interface CreateInvoiceItemDto {
  productId: string;
  quantity: number;
}

export interface CreateInvoiceDto {
  customerId: string;
  userId: string;
  payment_method: PaymentMethod;
  taxRate?: number;
  items: CreateInvoiceItemDto[];
}

export interface TotalSales {
  total_sales_before_taxes: number | null;
  total_taxes: number | null;
  total_sales_after_taxes: number | null;
  total_invoices: number;
}

// ====================
// HELPERS
// ====================

// Prisma serializes Decimal columns to strings over JSON, so numeric
// invoice fields arrive as strings and need to be coerced before display.
const toNum = (value: unknown): number => {
  const n = typeof value === "number" ? value : parseFloat(String(value ?? 0));
  return Number.isFinite(n) ? n : 0;
};

function normalizeInvoice(raw: any): Invoice {
  return {
    ...raw,
    subtotal: toNum(raw.subtotal),
    taxes: toNum(raw.taxes),
    total: toNum(raw.total),
    // The backend has no status column (cancelled invoices are deleted) nor a
    // vendor name, so we provide sensible display defaults.
    status: raw.status ?? "ISSUED",
    vendor_name: raw.vendor_name ?? raw.user?.name ?? "",
    invoice_items: (raw.invoice_items ?? []).map((item: any) => ({
      ...item,
      quantity: toNum(item.quantity),
      unit_price:
        item.unit_price != null
          ? toNum(item.unit_price)
          : item.product?.price != null
            ? toNum(item.product.price)
            : undefined,
      item_subtotal:
        item.item_subtotal != null ? toNum(item.item_subtotal) : undefined,
      product: item.product
        ? { ...item.product, price: toNum(item.product.price) }
        : item.product,
    })),
  };
}

function buildQuery(filters: InvoiceFilters = {}): string {
  const params = new URLSearchParams();
  if (filters.customerId) params.append("customerId", filters.customerId);
  if (filters.startDate) params.append("startDate", filters.startDate);
  if (filters.endDate) params.append("endDate", filters.endDate);
  if (filters.minTotal != null) params.append("minTotal", String(filters.minTotal));
  if (filters.maxTotal != null) params.append("maxTotal", String(filters.maxTotal));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

// ====================
// API
// ====================

export const invoicesApi = {
  async getAll(filters: InvoiceFilters = {}): Promise<Invoice[]> {
    const { data } = await api.get(`/invoices${buildQuery(filters)}`);
    return (Array.isArray(data) ? data : []).map(normalizeInvoice);
  },

  async getById(id: string): Promise<Invoice> {
    const { data } = await api.get(`/invoices/${id}`);
    return normalizeInvoice(data);
  },

  async create(dto: CreateInvoiceDto): Promise<Invoice> {
    const { data } = await api.post("/invoices", dto);
    return normalizeInvoice(data);
  },

  // Generates the preview PDF (unsaved invoice) as a Blob.
  async preview(dto: CreateInvoiceDto): Promise<Blob> {
    const { data } = await api.post("/invoices/preview", dto, {
      responseType: "blob",
    });
    return data as Blob;
  },

  // Generates the printable PDF of an already-issued invoice.
  async getPdf(id: string): Promise<Blob> {
    const { data } = await api.get(`/invoices/${id}/pdf`, {
      responseType: "blob",
    });
    return data as Blob;
  },

  async getTotalSales(startDate: string, endDate: string): Promise<TotalSales> {
    const { data } = await api.get(
      `/invoices/total-invoices?startDate=${startDate}&endDate=${endDate}`,
    );
    return data;
  },
};
