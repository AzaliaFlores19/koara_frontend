"use client";

import { useState, useEffect } from "react";
import { Search, Download, Loader2 } from "lucide-react";
import DashboardLayout from "@/components/layout/layout";
import { AuditTable } from "@/components/audit-logs/AuditTable";
import { auditLogsApi, AuditLog } from "@/lib/api/audit-logs";
import { Dropdown } from "@/components/Dropdown";
import { DateRangePicker } from "@/components/audit-logs/DateRangePicker";

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

    const matchesDate = (() => {
      if (!dateRange.start && !dateRange.end) return true;
      
      // Handle the mock data format "DD/MM" or standard formats
      let logDate: Date;
      if (log.date.includes("/") && log.date.split("/").length === 2) {
        const [day, month] = log.date.split("/").map(Number);
        logDate = new Date(2026, month - 1, day);
      } else {
        logDate = new Date(log.date);
      }

      if (isNaN(logDate.getTime())) return true;

      if (dateRange.start) {
        const start = new Date(dateRange.start);
        start.setHours(0, 0, 0, 0);
        if (logDate < start) return false;
      }
      if (dateRange.end) {
        const end = new Date(dateRange.end);
        end.setHours(23, 59, 59, 999);
        if (logDate > end) return false;
      }
      return true;
    })();

    return matchesSearch && matchesUser && matchesEntity && matchesAction && matchesDate;
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
        <div className="flex w-full justify-between items-center gap-4 sm:gap-6">
        <div className="relative w-full flex-1 max-w-2xl">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search logs..."
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
