"use client";

import { useState, useEffect } from "react";
import { AuditLog } from "@/lib/types/models";
import Pagination from "../inventory/Pagination";

interface AuditTableProps {
  data: AuditLog[];
  itemsPerPage?: number;
}

export function AuditTable({ data, itemsPerPage = 10 }: AuditTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [data.length]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getEntityStyles = (entity: AuditLog["entity"]) => {
    switch (entity) {
      case "PRODUCTS": return "bg-[#F3E8FF] text-[#7E22CE] border-[#7E22CE]/10";
      case "CLIENTS": return "bg-[#CFFAFE] text-[#0E7490] border-[#0E7490]/10";
      case "CAI_RANGE": return "bg-[#FFE4E6] text-[#BE123C] border-[#BE123C]/10";
      case "USERS": return "bg-[#E0E7FF] text-[#4338CA] border-[#4338CA]/10";
      case "INVOICES": return "bg-[#FEF9C3] text-[#A16207] border-[#A16207]/10";
      case "CATEGORY": return "bg-[#F0FDFA] text-[#0D9488] border-[#0D9488]/10";
      case "CAI": return "bg-[#FFF1F2] text-[#E11D48] border-[#E11D48]/10";
      case "COMPANY": return "bg-[#F8FAFC] text-[#475569] border-[#475569]/10";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const translateEntity = (entity: AuditLog["entity"]) => {
    const translations: Record<string, string> = {
      CATEGORY: "CATEGORÍA",
      USERS: "USUARIOS",
      PRODUCTS: "PRODUCTOS",
      INVOICES: "FACTURAS",
      INVOICE_PRODUCTS: "PRODUCTOS DE FACTURA",
      CLIENTS: "CLIENTES",
      CAI: "CAI",
      CAI_RANGE: "RANGO CAI",
      COMPANY: "EMPRESA",
    };
    return translations[entity] || entity;
  };

  const getActionStyles = (action: AuditLog["action"]) => {
    switch (action) {
      case "UPDATE": return "bg-[#DBEAFE] text-[#1D4ED8] border-[#1D4ED8]/10";
      case "CREATE": return "bg-[#DCFCE7] text-[#15803D] border-[#15803D]/10";
      case "DEACTIVATE": return "bg-[#FFEDD5] text-[#C2410C] border-[#C2410C]/10";
      case "LOGIN": return "bg-[#E0F2FE] text-[#0369A1] border-[#0369A1]/10";
      case "LOGOUT": return "bg-[#F1F5F9] text-[#334155] border-[#334155]/10";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const translateAction = (action: AuditLog["action"]) => {
    const translations: Record<string, string> = {
      CREATE: "CREAR",
      UPDATE: "ACTUALIZAR",
      DEACTIVATE: "DESACTIVAR",
      LOGIN: "INICIO SESIÓN",
      LOGOUT: "CIERRE SESIÓN",
    };
    return translations[action] || action;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-HN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-10 animate-koara-fade">
      <div className="bg-white rounded-[1.5rem] overflow-hidden shadow-xl transition-all duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f4b8d4]">
                <th className="px-8 py-5 text-sm font-bold text-black border-r border-black/10">Usuario</th>
                <th className="px-8 py-5 text-sm font-bold text-black border-r border-black/10">Entidad</th>
                <th className="px-8 py-5 text-sm font-bold text-black border-r border-black/10">Objeto</th>
                <th className="px-8 py-5 text-sm font-bold text-black border-r border-black/10">Acción</th>
                <th className="px-8 py-5 text-sm font-bold text-black">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedData.length > 0 ? (
                paginatedData.map((log) => (
                  <tr key={log.id} className="group hover:bg-[#F6DEEB]/30 transition-all duration-200">
                    <td className="px-8 py-5 border-r border-slate-100">
                      <span className="font-bold text-slate-900 text-sm">{log.user?.name || 'Desconocido'}</span>
                    </td>
                    <td className="px-8 py-5 border-r border-slate-100 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest border-2 ${getEntityStyles(log.entity)}`}>
                        {translateEntity(log.entity)}
                      </span>
                    </td>
                    <td className="px-8 py-5 border-r border-slate-100">
                      <span
                        className="text-sm font-semibold text-slate-700"
                        title={log.detail ?? undefined}
                      >
                        {log.detail || <span className="text-slate-300">—</span>}
                      </span>
                    </td>
                    <td className="px-8 py-5 border-r border-slate-100 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest border-2 ${getActionStyles(log.action)}`}>
                        {translateAction(log.action)}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm text-slate-400 font-bold">{formatDate(log.created_at)}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest opacity-40">No se encontraron registros</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
        />
      )}
    </div>
  );
}
