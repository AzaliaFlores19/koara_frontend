import { apiClient } from "@/lib/api/axios";

export interface SalesOverviewData {
  total_invoices: number;
  total_before_tax: number;
  total_after_tax: number;
  unique_clients: number;
}

export interface AnalyticsData {
  total_invoices: number;
  total_before_tax: number;
  total_after_tax: number;
  unique_clients: number;
  average_per_invoice: number;
  average_per_client: number;
  taxes_collected: number;
  invoices_per_client: number;
}

export interface SalesListItem {
  id: string;
  invoice_number: string;
  client_name: string;
  total: string;
  created_at: string;
}

export interface TopProduct {
  product: { id: string; name: string; category: { name: string } | null } | undefined;
  total_quantity_sold: number;
  revenue: number;
}

export interface FrequentCustomer {
  client: { id: string; name: string } | undefined;
  invoice_count: number;
  total_spent: number;
  last_purchase: string | null;
}

export const reportsApi = {
  async getAnalytics(startDate: string, endDate: string): Promise<AnalyticsData> {
    const { data } = await apiClient.get(`/reports/analytics?startDate=${startDate}&endDate=${endDate}`);
    return data;
  },

  async exportAnalytics(startDate: string, endDate: string, format: "pdf" | "csv") {
    const { data, headers } = await apiClient.get(
      `/reports/analytics/export?format=${format}&startDate=${startDate}&endDate=${endDate}`,
      { responseType: "blob" }
    );
    const url = URL.createObjectURL(new Blob([data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = `reporte-ventas-${startDate}-${endDate}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  },

  async getSalesOverview(startDate: string, endDate: string): Promise<SalesOverviewData> {
    const { data } = await apiClient.get(`/reports/monthly-sales?startDate=${startDate}&endDate=${endDate}`);
    return data;
  },

  async getSalesList(startDate: string, endDate: string): Promise<SalesListItem[]> {
    const { data } = await apiClient.get(`/reports/sales?startDate=${startDate}&endDate=${endDate}`);
    return data;
  },

  async getTopProducts(startDate: string, endDate: string, limit = 10): Promise<TopProduct[]> {
    const { data } = await apiClient.get(`/reports/top-products?startDate=${startDate}&endDate=${endDate}&limit=${limit}`);
    return data;
  },

  async getFrequentCustomers(startDate?: string, endDate?: string, limit = 10): Promise<FrequentCustomer[]> {
    const params = new URLSearchParams({ limit: String(limit) });
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    const { data } = await apiClient.get(`/reports/frequent-customers?${params}`);
    return data;
  },
};
