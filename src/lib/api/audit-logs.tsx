import { apiGet } from "./client";

export interface AuditLog {
  id: string;
  user: string;
  entity: "PRODUCTS" | "CLIENTS" | "CAI_RANGE" | "USERS" | "INVOICES";
  action: "CREATE" | "UPDATE" | "DELETE" | "DEACTIVATE";
  reference: string;
  date: string;
}

export const auditLogsApi = {
  getAll: () => apiGet<AuditLog[]>("audit-logs"),
};
