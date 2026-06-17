import { apiGet } from "./client";

export enum AuditEntity {
  CATEGORY = "CATEGORY",
  USERS = "USERS",
  PRODUCTS = "PRODUCTS",
  INVOICES = "INVOICES",
  INVOICE_PRODUCTS = "INVOICE_PRODUCTS",
  CLIENTS = "CLIENTS",
  CAI = "CAI",
  CAI_RANGE = "CAI_RANGE",
  COMPANY = "COMPANY",
}

export enum AuditAction {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DEACTIVATE = "DEACTIVATE",
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
}

export interface AuditLog {
  id: string;
  user_id: string;
  entity: AuditEntity;
  entity_id: string;
  action: AuditAction;
  created_at: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface AuditFilters {
  userId?: string;
  entity?: AuditEntity;
  action?: AuditAction;
  startDate?: string;
  endDate?: string;
}

export const auditLogsApi = {
  getAll: (filters?: AuditFilters) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    const query = params.toString();
    return apiGet<AuditLog[]>(`audit-logs${query ? `?${query}` : ""}`);
  },
};
