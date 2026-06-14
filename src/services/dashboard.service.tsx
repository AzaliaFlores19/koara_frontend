import { apiClient } from "@/lib/api/axios";
import { dashboardApi } from "@/lib/api/dashboard"; 


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

export interface DashboardMetrics {
  totalProducts: number;
  totalClients: number;
  totalCategories: number;
  lowStockProducts: LowStockProduct[];
  bestSellingProducts: any[]; 
  todaySales: SalesSummary;
  invoices: InvoiceSummary;
}

interface PagedResponse {
  total: number;
}

interface InvoiceBackendResponse {
  status: string; 
}


export const dashboardService = {
  async getRealMetrics(): Promise<DashboardMetrics> {
    // 1. Fechas dinámicas automáticas en JavaScript (YYYY-MM-DD)
    const formatDate = (date: Date) => date.toISOString().split('T')[0];
    const now = new Date();
    
    const todayStr = formatDate(now);
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const yesterdayStr = formatDate(yesterday);
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayStr = formatDate(firstDayOfMonth);

    // 2. Traemos todo en paralelo con CAPTURA DE ERRORES INDIVIDUAL por si NestJS responde 500
    const [
      prodCount,
      clientCount,
      catCount,
      lowStockData,
      todaySalesData,
      yesterdaySalesData,
      monthSalesData,
      allInvoices,
      mockedApiData 
    ] = await Promise.all([
      // Métricas base (Si fallan devuelven 0 o un arreglo vacío)
      apiClient.get<PagedResponse>("/products?limit=1").then(res => res.data.total).catch(() => 0),
      apiClient.get<PagedResponse>("/clients?limit=1").then(res => res.data.total).catch(() => 0),
      apiClient.get<PagedResponse>("/categories?limit=1").then(res => res.data.total).catch(() => 0),
      apiClient.get<LowStockProduct[]>("/products/low-stock").then(res => res.data).catch(() => []),
      
      // Filtros de facturas propensos a romperse en días vacíos (Si fallan devuelven totalSales: 0)
      apiClient.get<{ totalSales: number }>(`/invoices/total-invoices?startDate=${todayStr}&endDate=${todayStr}`)
        .then(res => res.data)
        .catch(err => {
          console.warn("⚠️ Error en Ventas de hoy (Posiblemente vacío):", err.message);
          return { totalSales: 0 };
        }),
        
      apiClient.get<{ totalSales: number }>(`/invoices/total-invoices?startDate=${yesterdayStr}&endDate=${yesterdayStr}`)
        .then(res => res.data)
        .catch(err => {
          console.warn("⚠️ Error en Ventas de ayer (Posiblemente vacío):", err.message);
          return { totalSales: 0 };
        }),
        
      apiClient.get<{ totalSales: number }>(`/invoices/total-invoices?startDate=${firstDayStr}&endDate=${todayStr}`)
        .then(res => res.data)
        .catch(err => {
          console.warn("⚠️ Error en Ventas del mes:", err.message);
          return { totalSales: 0 };
        }),
        
      apiClient.get<InvoiceBackendResponse[]>("/invoices").then(res => res.data).catch(() => []),
      dashboardApi.getMetrics().catch(() => ({ bestSellingProducts: [] }))
    ]);

    // 3. Formateador de moneda de Honduras (Lempiras)
    const formatCurrency = (amount: number) => 
      `L. ${amount.toLocaleString('es-HN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // 4. Lógica para contar las facturas pagadas de NestJS
    const emitted = allInvoices ? allInvoices.length : 0;
    const paid = allInvoices ? allInvoices.filter((inv) => inv.status === 'PAID' || inv.status === 'PAGADA').length : 0;

    // 5. Construimos la respuesta unificada garantizando que las propiedades existan
    return {
      totalProducts: prodCount,
      totalClients: clientCount,
      totalCategories: catCount,
      lowStockProducts: lowStockData,
      bestSellingProducts: mockedApiData?.bestSellingProducts || [], 
      todaySales: {
        current: formatCurrency(todaySalesData?.totalSales || 0),
        yesterday: formatCurrency(yesterdaySalesData?.totalSales || 0),
        thisMonth: formatCurrency(monthSalesData?.totalSales || 0),
      },
      invoices: {
        emitted,
        paid
      }
    };
  }
};