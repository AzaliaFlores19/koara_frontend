import { apiClient } from "@/lib/api/axios";
import { AuditLog, AuditEntity, AuditAction } from "@/lib/types/models";

export interface AuditFilters {
  userId?: string;
  entity?: AuditEntity;
  action?: AuditAction;
  startDate?: string;
  endDate?: string;
}

export const auditApi = {
  async getAuditLogs(filters?: AuditFilters): Promise<AuditLog[]> {
    const { data } = await apiClient.get<AuditLog[]>("/audit-logs", {
      params: filters,
    });
    return data;
  },
};
