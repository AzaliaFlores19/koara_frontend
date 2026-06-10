import { apiGet } from "./client";

export interface LowStockProduct {
  name: string;
  stock: number;
}

export interface BestSellingProduct {
  name: string;
  sales: number;
  price: string;
  image: string;
  code: string;
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
  bestSellingProducts: BestSellingProduct[];
  todaySales: SalesSummary;
  invoices: InvoiceSummary;
}

export const dashboardApi = {
  getMetrics: () => apiGet<DashboardMetrics>("dashboard/metrics"),
};