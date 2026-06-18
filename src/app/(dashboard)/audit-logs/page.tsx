"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import DashboardLayout from "@/components/layout/layout";
import { AuditTable } from "@/components/audit-logs/AuditTable";
import { auditApi } from "@/services/audit.service";
import { usersApi } from "@/services/users.service";
import { AuditLog, AuditEntity, AuditAction, User } from "@/lib/types/models";
import { Dropdown } from "@/components/Dropdown";
import { DateRangePicker } from "@/components/audit-logs/DateRangePicker";
import { isAdmin } from "@/lib/auth";

export default function AuditLogsPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter states
  const [filterUser, setFilterUser] = useState("Todos los Usuarios");
  const [filterEntity, setFilterEntity] = useState("Todas las Entidades");
  const [filterAction, setFilterAction] = useState("Todas las Acciones");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  useEffect(() => {
    const isUserAdmin = isAdmin();
    if (!isUserAdmin) {
      router.replace("/dashboard");
      setAuthorized(false);
    } else {
      setAuthorized(true);
    }
  }, [router]);

  const entityMapping: Record<string, AuditEntity> = {
    "CATEGORÍA": "CATEGORY",
    "USUARIOS": "USERS",
    "PRODUCTOS": "PRODUCTS",
    "FACTURAS": "INVOICES",
    "PRODUCTOS DE FACTURA": "INVOICE_PRODUCTS",
    "CLIENTES": "CLIENTS",
    "CAI": "CAI",
    "RANGO CAI": "CAI_RANGE",
    "EMPRESA": "COMPANY",
  };

  const actionMapping: Record<string, AuditAction> = {
    "CREAR": "CREATE",
    "ACTUALIZAR": "UPDATE",
    "DESACTIVAR": "DEACTIVATE",
    "INICIO SESIÓN": "LOGIN",
    "CIERRE SESIÓN": "LOGOUT",
  };

  const fetchLogs = useCallback(async () => {
    if (!authorized) return;
    try {
      setLoading(true);
      const selectedUser = users.find(u => u.name === filterUser);
      const filters = {
        userId: selectedUser?.id,
        entity: entityMapping[filterEntity],
        action: actionMapping[filterAction],
        startDate: dateRange.start || undefined,
        endDate: dateRange.end || undefined,
      };
      const data = await auditApi.getAuditLogs(filters);
      setLogs(data);
    } catch (err) {
      console.error("Error fetching audit logs:", err);
    } finally {
      setLoading(false);
    }
  }, [filterUser, filterEntity, filterAction, dateRange, users, authorized]);

  useEffect(() => {
    if (!authorized) return;
    const init = async () => {
      try {
        const usersData = await usersApi.getAll();
        setUsers(usersData);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    init();
  }, [authorized]);

  useEffect(() => {
    if (authorized) {
      fetchLogs();
    }
  }, [fetchLogs, authorized]);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entity_id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const userOptions = ["Todos los Usuarios", ...users.map(u => u.name)];
  const entityOptions = ["Todas las Entidades", ...Object.keys(entityMapping)];
  const actionOptions = ["Todas las Acciones", ...Object.keys(actionMapping)];

  if (authorized === false) return null;

  if (authorized === null || (loading && logs.length === 0)) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[70vh] items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-koara-dark" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-10">
        {/* Header Section */}
        <div className="flex w-full justify-between items-center gap-4 sm:gap-6">
        <div className="relative w-full flex-1 max-w-2xl">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Buscar registros por usuario o ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="koara-input !pl-12 !py-3 !text-base shadow-sm w-full"
          />
        </div>
      </div>

        {/* Filters Bar */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Dropdown
              value={filterUser}
              onChange={setFilterUser}
              options={userOptions}
              className="min-w-[160px]"
            />
            <Dropdown
              value={filterEntity}
              onChange={setFilterEntity}
              options={entityOptions}
              className="min-w-[180px]"
            />
            <Dropdown
              value={filterAction}
              onChange={setFilterAction}
              options={actionOptions}
              className="min-w-[160px]"
            />
            <DateRangePicker
              start={dateRange.start}
              end={dateRange.end}
              onChange={setDateRange}
            />
          </div>
        </div>

        {/* Audit Logs Table */}
        <AuditTable data={filteredLogs} itemsPerPage={10} />
      </div>
    </DashboardLayout>
  );
}

