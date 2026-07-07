"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Code, CheckCircle2, AlertTriangle } from "lucide-react";
import DashboardLayout from "@/components/layout/layout";
import { Table } from "@/components/Table";
import { CaiRangeModal } from "@/components/cai/CaiRangeModal";
import { CaiWarningModal } from "@/components/cai/CaiWarningModal";
import { caiApi } from "@/services/cai.service";
import { CAICode, CAIRange } from "@/lib/types/models";
import { formatNumber } from "@/lib/format";

export default function CaiManagementPage() {
  const [codes, setCodes] = useState<CAICode[]>([]);
  const [ranges, setRanges] = useState<CAIRange[]>([]);
  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState<{ message: string; visible: boolean; type: "success" | "error" }>({
    message: "",
    visible: false,
    type: "success"
  });

  const [isRangeModalOpen, setIsRangeModalOpen] = useState(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [warningData, setWarningData] = useState({ remainingInvoices: 0 });
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedRangeId, setSelectedRangeId] = useState<string | null>(null);

  const [rangeFormData, setRangeFormData] = useState<{
    cai_code: string;
    cai_id: string;
    range_start: number;
    range_end: number;
    expiration_date: string;
    is_active: boolean;
  }>({
    cai_code: "",
    cai_id: "",
    range_start: 1,
    range_end: 100000,
    expiration_date: "",
    is_active: true,
  });

  const showNotification = (message: string, type: "success" | "error") => {
    setToast({ message, visible: true, type });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 4000);
  };

  const handleAxiosError = (error: any, fallbackMessage: string) => {
    const apiMessage = error.response?.data?.message;
    showNotification(apiMessage ? (Array.isArray(apiMessage) ? apiMessage.join(", ") : apiMessage) : fallbackMessage, "error");
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [fetchedRanges, fetchedCodes] = await Promise.all([caiApi.getRanges(), caiApi.getCodes()]);
      setRanges(fetchedRanges);
      setCodes(fetchedCodes);
    } catch (error) {
      handleAxiosError(error, "Error cargando los datos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAddRange = () => {
    setModalMode("add");
    setRangeFormData({
      cai_code: "",
      cai_id: "",
      range_start: 1,
      range_end: 100000,
      expiration_date: "",
      is_active: true,
    });
    setSelectedRangeId(null);
    setIsRangeModalOpen(true);
  };

  const handleOpenEditRange = (range: CAIRange) => {
    setModalMode("edit");
    setRangeFormData({
      cai_code: codes.find(c => c.id === range.cai_id)?.cai_code || "",
      cai_id: range.cai_id || "",
      range_start: range.range_start,
      range_end: range.range_end,
      expiration_date: range.expiration_date,
      is_active: range.is_active,
    });
    setSelectedRangeId(range.id);
    setIsRangeModalOpen(true);
  };

  const validateForm = (isoDate: string): boolean => {
    if (rangeFormData.range_start >= rangeFormData.range_end) {
      showNotification("El rango inicial debe ser menor al rango final.", "error");
      return false;
    }
    if (new Date(isoDate) <= new Date()) {
      showNotification("La fecha de expiración debe ser futura.", "error");
      return false;
    }
    return true;
  };

  const handleRangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const rawDate = rangeFormData.expiration_date ? rangeFormData.expiration_date.split('T')[0] : "";
    const isoExpirationDate = rawDate ? new Date(`${rawDate}T23:59:59`).toISOString() : "";

    // 1. Validar campos básicos
    if (!validateForm(isoExpirationDate)) return;

    // 2. Verificar riesgo fiscal (solo al agregar)
    if (modalMode === "add") {
      try {
        const activeRange = await caiApi.getActiveRange();
        
        if (activeRange) {
          const remaining = activeRange.range_end - (activeRange as any).current_invoice_number + 1;
          
          if (remaining > 0) {
            setWarningData({ remainingInvoices: remaining });
            setIsWarningModalOpen(true);
            return;
          }
        }
      } catch (error) {
        console.error("Error checking active range:", error);
      }
    }
    
    executeSubmit(isoExpirationDate);
  };

  const executeSubmit = async (isoExpirationDate: string) => {
    try {
      if (modalMode === "add") {
        await caiApi.createUnified({
          cai_code: String(rangeFormData.cai_code),
          range_start: Number(rangeFormData.range_start),
          range_end: Number(rangeFormData.range_end),
          expiration_date: isoExpirationDate
        });
        showNotification("¡Bloque registrado exitosamente!", "success");
      } else if (selectedRangeId) {
        const range = ranges.find(r => r.id === selectedRangeId);
        if (!range) throw new Error("Rango no encontrado");
        await caiApi.updateUnified(range.cai_id!, selectedRangeId, {
          cai_code: String(rangeFormData.cai_code),
          range_start: Number(rangeFormData.range_start),
          range_end: Number(rangeFormData.range_end),
          expiration_date: isoExpirationDate
        });
        showNotification("¡Bloque actualizado exitosamente!", "success");
      }
      await fetchData();
      setIsRangeModalOpen(false);
      setIsWarningModalOpen(false);
    } catch (error) {
      handleAxiosError(error, "Error al procesar.");
    }
  };

  const columns = [
    { header: "Código CAI", render: (range: CAIRange) => <div className="flex items-center gap-2"><Code size={15} /> <span className="font-mono text-xs">{codes.find((c) => c.id === range.cai_id)?.cai_code ?? "—"}</span></div> },
    { header: "Rango Inicial", render: (range: CAIRange) => formatNumber(range.range_start) },
    { header: "Rango Final", render: (range: CAIRange) => formatNumber(range.range_end) },
    { header: "Expiración", render: (range: CAIRange) => range.expiration_date?.split('T')[0] ?? "—" },
    { header: "Estado", render: (range: CAIRange) => <span className={range.is_active ? "k-badge-admin" : "k-badge-employee"}>{range.is_active ? "Activo" : "Inactivo"}</span> },
    { header: "Acciones", render: (range: CAIRange) => <div className="flex justify-center"><button onClick={() => handleOpenEditRange(range)} className="koara-icon-btn"><Pencil size={14} /></button></div> },
  ];

  return (
    <DashboardLayout>
      <div className="py-8 px-4 max-w-6xl mx-auto space-y-6">
        {toast.visible && (
          <div className="fixed inset-0 z-[200] flex items-start justify-center pt-6 pointer-events-none">
            <div className={`pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border ${
              toast.type === "success" 
                ? "bg-white text-green-700 border-green-200" 
                : "bg-white text-pink-700 border-pink-200"
            }`}>
              {toast.type === "success" ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
              <span className="text-sm font-bold">{toast.message}</span>
            </div>
          </div>
        )}
        
        <div><h1 className="text-2xl font-black">Gestión de CAI</h1><p className="text-slate-500 text-sm">Administra bloques y rangos de facturación.</p></div>
        
        <div className="flex justify-end gap-2">
          <button onClick={handleOpenAddRange} className="koara-btn-black"><Plus size={18} /> Agregar Rango CAI</button>
        </div>

        {loading ? <p className="text-center py-12 animate-pulse">Cargando...</p> : <Table data={ranges} columns={columns} itemsPerPage={7} enableMutationToast={false} />}

        <CaiRangeModal isOpen={isRangeModalOpen} mode={modalMode} formData={rangeFormData} setFormData={setRangeFormData} codes={codes} onClose={() => setIsRangeModalOpen(false)} onSubmit={handleRangeSubmit} />
        <CaiWarningModal 
          isOpen={isWarningModalOpen} 
          remainingInvoices={warningData.remainingInvoices}
          onClose={() => setIsWarningModalOpen(false)}
          onConfirm={() => executeSubmit(new Date(`${rangeFormData.expiration_date}T23:59:59`).toISOString())}
        />
      </div>
    </DashboardLayout>
  );
}
