// src/types/index.ts

// ====================
// ENUMS
// ====================

export type UserRole = "ADMIN" | "EMPLOYEE";

export type PaymentMethod =
  | "CASH"
  | "TRANSFER"
  | "CARD";

export type AuditAction =
  | "CREATE"
  | "UPDATE"
  | "DEACTIVATE"
  | "LOGIN"
  | "LOGOUT";

// ====================
// AUTH
// ====================

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  token: string;
}

// ====================
// USERS
// ====================

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  is_active: boolean;
  creation_date: string;
}

// ====================
// PRODUCTS
// ====================

export interface Product {
  id: string;
  name: string;
  code_bar: string;
  description?: string;
  category_id?: string;
  stock: number;
  min_stock: number;
  price: number;
  image?: string;
  created_at: string;
  is_active: boolean;
}

// ====================
// CATEGORIES
// ====================

export interface Category {
  id: string;
  name: string;
  created_at: string;
  is_active: boolean;
}

// ====================
// CLIENTS
// ====================

export interface Client {
  id: string;
  name: string;
  rtn?: string;
  phone?: string;
  email?: string;
  created_at: string;
  is_active: boolean;
}

// ====================
// INVOICE ITEMS
// ====================

export interface InvoiceItem {
  id: string;
  invoice_id?: string;
  product_id?: string;

  quantity: number;

  unit_price?: number;
  item_subtotal?: number;

  product?: Product;
}

// ====================
// INVOICES
// ====================

export interface Invoice {
  id: string;

  invoice_number: string;

  cai_range_id: string;
  client_id: string;
  user_id: string;

  client_name: string;
  client_rtn?: string;
  client_phone?: string;
  client_email?: string;

  vendor_name?: string; // Added for display

  subtotal: number;
  taxes: number;
  total: number;

  payment_method: PaymentMethod;
  status: "ISSUED" | "CANCELLED"; // Added for status

  created_at: string;

  invoice_items?: InvoiceItem[];
}

// ====================
// CAI
// ====================

export interface CAICode {
  id: string;
  cai_code: string;
  is_active: boolean;
  created_at: string;
}

export interface CAIRange {
  id: string;

  cai_id?: string;

  base_code: string;

  range_start: number;
  range_end: number;

  current_invoice_number: number;

  expiration_date: string;

  is_active: boolean;

  created_at: string;
}

// ====================
// COMPANY
// ====================

export interface Company {
  id: string;
  name: string;
  rtn: string;
  address?: string;
  phone?: string;
  email?: string;
  logo?: string;
  created_at: string;
}