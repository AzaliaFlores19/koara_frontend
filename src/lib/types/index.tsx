export interface Product {
  id: number;
  name: string;
  description: string;
  stock: number;
  minStock: number;
  price: number;
  image: string;
  category: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface Invoice {
  id: number;
  clientId?: number;
  date: string;
  total: number;
  status: "Paid" | "Pending" | "Cancelled";
  items?: InvoiceItem[];
}

export interface InvoiceItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface TopProduct {
  name: string;
  quantity: number;
  total: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "Manager" | "Employee";
}

export interface DashboardStats {
  todaySales: number;
  yesterdaySales: number;
  monthSales: number;
  invoicesEmitted: number;
  invoicesPending: number;
  invoicesPaid: number;
  lowStockProducts: { name: string; stock: number }[];
}
