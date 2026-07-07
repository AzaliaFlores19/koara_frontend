import { apiClient } from "@/lib/api/axios";
import { formatCurrency } from "@/lib/format";

export interface LowStockProduct {
  name: string;
  stock: number;
}

export interface SalesSummary {
  current: string;    
  yesterday: string;   
  thisMonth: string;   
}

export interface InvoiceSummary {
  emitted: number;     
  paid: number;       
}

export interface BestSellingProduct {
  id: string;
  name: string;
  code_bar: string;
  image: string | null;
  category: {
    id: string;
    name: string;
  } | null;
  total_quantity_sold: number;
}

export interface DashboardMetrics {
  totalProducts: number;
  totalClients: number;
  totalCategories: number;
  lowStockProducts: LowStockProduct[];
  bestSellingProducts: BestSellingProduct[]; 
  todaySales: SalesSummary;
  invoices: InvoiceSummary;
}

interface PagedResponse {
  total: number;
}

interface InvoiceBackendResponse {
  status: string; 
}

interface SalesOverviewResponse {
  total_invoices: number;
  total_before_tax: number;
  total_after_tax: number;
  unique_clients: number;
}

export const dashboardService = {
  async getRealMetrics(): Promise<DashboardMetrics> {
    // Helper para formatear la fecha local a formato YYYY-MM-DD de forma limpia
    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const now = new Date();
    
    const todayStr = formatDate(now);
    
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const yesterdayStr = formatDate(yesterday);
    
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayStr = formatDate(firstDayOfMonth);

    const [
      prodCount,
      clientCount,
      catCount,
      lowStockData,
      todaySalesData,
      yesterdaySalesData,
      monthSalesData,
      allInvoices,
      topSellingData 
    ] = await Promise.all([
      apiClient.get<PagedResponse>("/products?limit=1").then(res => res.data.total).catch(() => 0),
      apiClient.get<PagedResponse>("/clients?limit=1").then(res => res.data.total).catch(() => 0),
      apiClient.get<PagedResponse>("/categories?limit=1").then(res => res.data.total).catch(() => 0),
      apiClient.get<LowStockProduct[]>("/products/low-stock").then(res => res.data).catch(() => []),
      
      // Ventas de hoy (Filtra inicio hoy, fin hoy)
      apiClient.get<SalesOverviewResponse>(`/reports/monthly-sales?startDate=${todayStr}&endDate=${todayStr}`)
        .then(res => res.data)
        .catch(err => {
          console.warn("⚠️ Error en Ventas de hoy:", err.message);
          return { total_after_tax: 0 };
        }),
    
      // Ventas de ayer (Filtra inicio ayer, fin ayer)
      apiClient.get<SalesOverviewResponse>(`/reports/monthly-sales?startDate=${yesterdayStr}&endDate=${yesterdayStr}`)
        .then(res => res.data)
        .catch(err => {
          console.warn("⚠️ Error en Ventas de ayer:", err.message);
          return { total_after_tax: 0 };
        }),
    
      // Ventas del mes (Filtra desde el día 1 del mes hasta hoy)
      apiClient.get<SalesOverviewResponse>(`/reports/monthly-sales?startDate=${firstDayStr}&endDate=${todayStr}`)
        .then(res => res.data)
        .catch(err => {
          console.warn("⚠️ Error en Ventas del mes:", err.message);
          return { total_after_tax: 0 };
        }),
        
      apiClient.get<InvoiceBackendResponse[]>("/invoices").then(res => res.data).catch(() => []),
      apiClient.get<BestSellingProduct[]>("/products/top-selling?limit=10").then(res => res.data).catch(() => [])
    ]);

    const emitted = allInvoices ? allInvoices.length : 0;
    const paid = allInvoices ? allInvoices.filter((inv) => inv.status === 'PAID' || inv.status === 'PAGADA').length : 0;

    return {
      totalProducts: prodCount,
      totalClients: clientCount,
      totalCategories: catCount,
      lowStockProducts: lowStockData,
      bestSellingProducts: topSellingData || [], 
      todaySales: {
        current: formatCurrency(todaySalesData?.total_after_tax || 0),
        yesterday: formatCurrency(yesterdaySalesData?.total_after_tax || 0),
        thisMonth: formatCurrency(monthSalesData?.total_after_tax || 0),
      },
      invoices: {
        emitted,
        paid
      }
    };
  }
};