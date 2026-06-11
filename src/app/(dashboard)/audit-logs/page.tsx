"use client";

import { useState, useEffect } from "react";
import { Search, Download, Loader2 } from "lucide-react";
import DashboardLayout from "@/components/layout/layout";
import { AuditTable } from "@/components/audit-logs/AuditTable";
import { auditLogsApi, AuditLog } from "@/lib/api/audit-logs";
import { Dropdown } from "@/components/Dropdown";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter states
  const [filterUser, setFilterUser] = useState("All Users");
  const [filterEntity, setFilterEntity] = useState("All Entities");
  const [filterAction, setFilterAction] = useState("All Actions");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const data = await auditLogsApi.getAll();
        setLogs(data);
      } catch (err) {
        console.error("Error fetching audit logs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.reference.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesUser = filterUser === "All Users" || log.user === filterUser;
    const matchesEntity =
      filterEntity === "All Entities" || log.entity === filterEntity;
    const matchesAction =
      filterAction === "All Actions" || log.action === filterAction;

    // Temporal date filtering placeholder logic
    // In a real app, we'd parse log.date and compare with dateRange.start/end

    return matchesSearch && matchesUser && matchesEntity && matchesAction;
  });

  if (loading) {
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Audit Logs
          </h1>
          <button className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full font-black text-sm hover:opacity-90 transition-all shadow-lg active:scale-95">
            <Download size={18} />
            Export Logs
          </button>
        </div>

        {/* Filters Bar */}
        <div className="space-y-4">
          <div className="relative w-full max-w-md">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="koara-input !pl-12 !py-3 !text-base shadow-sm"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Dropdown
              value={filterUser}
              onChange={setFilterUser}
              options={["All Users", "Admin", "Ana", "Carlos", "Maria"]}
              className="min-w-[160px]"
            />
            <Dropdown
              value={filterEntity}
              onChange={setFilterEntity}
              options={[
                "All Entities",
                "PRODUCTS",
                "CLIENTS",
                "CAI_RANGE",
                "USERS",
                "INVOICES",
              ]}
              className="min-w-[180px]"
            />
            <Dropdown
              value={filterAction}
              onChange={setFilterAction}
              options={[
                "All Actions",
                "CREATE",
                "UPDATE",
                "DELETE",
                "DEACTIVATE",
              ]}
              className="min-w-[160px]"
            />
          </div>
        </div>

        {/* Audit Logs Table */}
        <AuditTable data={filteredLogs} itemsPerPage={10} />
      </div>
    </DashboardLayout>
  );
}
