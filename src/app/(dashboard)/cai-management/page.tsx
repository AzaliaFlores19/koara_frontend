"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Power, Code, CheckCircle2, AlertTriangle } from "lucide-react";
import DashboardLayout from "@/components/layout/layout";
import { Table } from "@/components/Table";
import { CaiRangeModal } from "@/components/cai/CaiRangeModal";
import { CaiCodesModal } from "@/components/cai/CaiCodesModal";
import { caiApi } from "@/services/cai.service";
import { CAICode, CAIRange } from "@/lib/types/models";

interface LocalConfirmProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function LocalConfirmModal({ isOpen, message, onConfirm, onCancel }: LocalConfirmProps) {
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="koara-modal-card relative z-[101] bg-white border-[3px] border-slate-200 rounded-[2rem] p-8 w-full max-w-md animate-koara-modal shadow-2xl">
        <p className="font-bold text-slate-700 mb-8 text-sm sm:text-base">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-6 py-3 rounded-full font-black text-sm text-slate-700 bg-[#e3c5d1] border-2 border-transparent hover:border-slate-200 transition-all active:translate-y-0.5"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-3 rounded-full font-black text-sm text-white bg-[#703A61] border-2 border-slate-200 hover:-translate-y-0.5 transition-all active:translate-y-0"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CaiManagementPage() {
  const [codes, setCodes] = useState<CAICode[]>([]);
  const [ranges, setRanges] = useState<CAIRange[]>([]);
  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState<{ message: string; visible: boolean; type: "success" | "error" }>({
    message: "",
    visible: false,
    type: "success"
  });

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState<{ type: "code" | "range"; id: string } | null>(null);

  const [isRangeModalOpen, setIsRangeModalOpen] = useState(false);
  const [isCodesModalOpen, setIsCodesModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedRangeId, setSelectedRangeId] = useState<string | null>(null);

  const [rangeFormData, setRangeFormData] = useState({
    cai_id: "",
    base_code: "",
    range_start: 1,
    range_end: 100000,
    expiration_date: "",
    is_active: true,
  });

  const showSuccessNotification = (message: string) => {
    setToast({ message, visible: true, type: "success" });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 3500);
  };

  const showErrorNotification = (message: string) => {
    setToast({ message, visible: true, type: "error" });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 4500); 
  };

  const handleAxiosError = (error: any, fallbackMessage: string) => {
    console.dir(error); 

    const apiMessage = error.response?.data?.message;

    if (apiMessage) {
      if (Array.isArray(apiMessage)) {
        showErrorNotification(apiMessage.join(", "));
      } else {
        showErrorNotification(apiMessage);
      }
    } else if (error.message) {
      showErrorNotification(`Error de red no se pudo conectar con el servidor`);
    } else {
      showErrorNotification(fallbackMessage);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const fetchedCodes = await caiApi.getCodes();
      const fetchedRanges = await caiApi.getRanges();
      setCodes(fetchedCodes);
      setRanges(fetchedRanges);
      
      if (fetchedCodes.length > 0) {
        setRangeFormData((prev) => ({ ...prev, cai_id: fetchedCodes[0].id }));
      }
    } catch (error) {
      handleAxiosError(error, "Error cargando los datos de facturación desde el servidor.");
    } finally {
      loading && setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAddRange = () => {
    const hasActiveCode = codes.some(c => c.is_active);
    if (!hasActiveCode) {
      showErrorNotification("No se puede crear un rango si no hay una código CAI activa.");
      return;
    }

    setModalMode("add");
    setRangeFormData({
      cai_id: codes.find(c => c.is_active)?.id || codes[0]?.id || "",
      base_code: "",
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
      cai_id: range.cai_id || "",
      base_code: range.base_code,
      range_start: range.range_start,
      range_end: range.range_end,
      expiration_date: range.expiration_date,
      is_active: range.is_active,
    });
    setSelectedRangeId(range.id);
    setIsRangeModalOpen(true);
  };

  const handleRangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const rawDate = rangeFormData.expiration_date 
        ? rangeFormData.expiration_date.split('T')[0] 
        : "";

      const isoExpirationDate = rawDate 
        ? new Date(`${rawDate}T23:59:59`).toISOString()
        : "";

      if (modalMode === "add") {
        const createPayload = {
          cai_id: rangeFormData.cai_id,
          base_code: rangeFormData.base_code,
          range_start: Number(rangeFormData.range_start),
          range_end: Number(rangeFormData.range_end),
          expiration_date: isoExpirationDate
        };

        const updatedRanges = await caiApi.createRange(createPayload);
        setRanges(updatedRanges);
        showSuccessNotification("¡Rango de facturación creado exitosamente!");

      } else if (selectedRangeId) {
        const updatePayload = {
          base_code: rangeFormData.base_code,
          range_start: Number(rangeFormData.range_start),
          range_end: Number(rangeFormData.range_end),
          expiration_date: isoExpirationDate,
          is_active: rangeFormData.is_active 
        };

        const updatedRanges = await caiApi.updateRange(selectedRangeId, updatePayload);
        setRanges(updatedRanges);
        showSuccessNotification("¡Rango de facturación modificado con éxito!");
      }
      
      setIsRangeModalOpen(false);

    } catch (error) {
      handleAxiosError(error, "Ocurrió un problema al procesar el rango de facturación.");
    }
  };

  const handleToggleRangeRequest = (range: CAIRange) => {
    setConfirmMessage(`¿Seguro que deseas ${range.is_active ? "desactivar" : "activar"} este rango de facturación (${range.base_code})?`);
    setConfirmAction({ type: "range", id: range.id });
    setIsConfirmOpen(true);
  };

  const handleSaveCode = async (codeForm: { id?: string; cai_code: string }) => {
    const hasActiveCode = codes.some(c => c.is_active && c.id !== codeForm.id);

    if (hasActiveCode && !codeForm.id) {
      showErrorNotification("Ya existe un código CAI activo. Desactívalo para registrar uno nuevo.");
      return;
    }

    try {
      if (codeForm.id) {
        const updatedCodes = await caiApi.updateCode(codeForm.id, { cai_code: codeForm.cai_code });
        setCodes(updatedCodes);
        showSuccessNotification("¡Código CAI actualizado exitosamente!");
      } else {
        const updatedCodes = await caiApi.createCode({ cai_code: codeForm.cai_code });
        setCodes(updatedCodes);
        showSuccessNotification("¡Nuevo código CAI registrado de manera exitosa!");
      }
    } catch (error) {
      handleAxiosError(error, "Error al intentar procesar el código CAI.");
    }
  };

  const handleToggleCodeRequest = (id: string, isActive: boolean) => {
    if (isActive) {
      setConfirmMessage("¿Estás seguro de desactivar este código CAI? Los rangos vinculados se pausarán inmediatamente.");
      setConfirmAction({ type: "code", id });
      setIsConfirmOpen(true);
    } else {
      const hasActiveCode = codes.some(c => c.is_active);
      if (hasActiveCode) {
        showErrorNotification("No puedes activar este código CAI porque ya existe otro activo actualmente.");
        return;
      }
      executeToggleCode(id, "Código CAI activado correctamente.");
    }
  };

  const handleGlobalConfirm = async () => {
    if (!confirmAction) return;

    try {
      if (confirmAction.type === "code") {
        const updatedCodes = await caiApi.toggleCodeStatus(confirmAction.id);
        setCodes(updatedCodes);
        showSuccessNotification("El código CAI ha sido modificado con éxito.");
      } else if (confirmAction.type === "range") {
        const updatedRanges = await caiApi.toggleRangeStatus(confirmAction.id);
        setRanges(updatedRanges);
        showSuccessNotification("El estado del rango de facturación ha sido modificado.");
      }
    } catch (error) {
      handleAxiosError(error, "Error al procesar el cambio de estado solicitado.");
    } finally {
      setIsConfirmOpen(false);
      setConfirmAction(null);
    }
  };

  const executeToggleCode = async (id: string, message: string) => {
    try {
      const updatedCodes = await caiApi.toggleCodeStatus(id);
      setCodes(updatedCodes);
      showSuccessNotification(message);
    } catch (error) {
      handleAxiosError(error, "No se pudo cambiar el estado del código CAI.");
    }
  };

  const columns = [
    {
      header: "Código CAI",
      render: (range: CAIRange) => {
        const code = codes.find((c) => c.id === range.cai_id);
        return (
          <div className="flex items-center gap-2 max-w-xs sm:max-w-xs lg:max-w-md">
            <Code size={15} className="text-slate-400 flex-shrink-0" />
            <span className="font-mono text-xs text-slate-700 truncate">{code?.cai_code ?? "—"}</span>
          </div>
        );
      },
    },
    {
      header: "Código Base",
      render: (range: CAIRange) => <span className="font-mono text-xs text-slate-900 font-bold whitespace-nowrap">{range.base_code}</span>,
    },
    {
      header: "Rango Inicial",
      render: (range: CAIRange) => <span className="text-sm text-slate-600">{range.range_start.toLocaleString()}</span>,
    },
    {
      header: "Rango Final",
      render: (range: CAIRange) => <span className="text-sm text-slate-600">{range.range_end.toLocaleString()}</span>,
    },
    {
      header: "Fecha Expiración",
      render: (range: CAIRange) => {
        // Formatear fecha limpia si viene con estampa de tiempo completa
        const cleanDate = range.expiration_date ? range.expiration_date.split('T')[0] : "—";
        return <span className="text-sm text-slate-500 font-medium">{cleanDate}</span>;
      },
    },
    {
      header: "Estado",
      render: (range: CAIRange) => (
        <span className={range.is_active ? "k-badge-admin" : "k-badge-employee"}>
          {range.is_active ? "Activo" : "Inactivo"}
        </span>
      ),
    },
    {
      header: "Acciones",
      render: (range: CAIRange) => (
        <div className="flex items-center justify-end gap-2">
          <button onClick={() => handleOpenEditRange(range)} className="koara-icon-btn" aria-label="Editar rango">
            <Pencil size={14} />
          </button>
          <button
            onClick={() => handleToggleRangeRequest(range)} 
            className={`koara-icon-btn ${range.is_active ? "hover:bg-red-50 hover:text-red-600" : "hover:bg-green-50 hover:text-green-600"}`}
            aria-label="Cambiar estado"
          >
            <Power size={14} className={range.is_active ? "text-slate-700" : "text-green-600"} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="py-4 sm:py-6 lg:py-8 px-2 sm:px-4 lg:px-4 max-w-6xl mx-auto space-y-6 relative">
        
        {toast.visible && (
          <div className="fixed inset-0 z-[200] flex items-start justify-center pt-6 pointer-events-none">
            <div className={`pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border transition-all duration-300 animate-koara-modal ${
              toast.type === "success" 
                ? "bg-gradient-to-br from-white to-[#F6DEEB] text-[#2b5936] border-[#bfe3c7]" 
                : "bg-gradient-to-br from-white to-[#fcecf1] text-[#702d43] border-[#f9ccd9]" 
            }`}>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                toast.type === "success"
                  ? "bg-[#DCFCE7] border-[#16A34A]/20 text-[#16A34A]"
                  : "bg-[#FCE7F3] border-[#DB2777]/20 text-[#DB2777]"
              }`}>
                {toast.type === "success" ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <AlertTriangle size={18} />
                )}
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-black">{toast.message}</span>
            </div>
          </div>
        )}

        <div>
          <h1 className="text-slate-900 font-black" style={{ fontSize: "1.75rem" }}>Gestión de CAI</h1>
          <p className="text-slate-500 text-sm font-medium">Administra los códigos CAI autorizados por la SAR y las secuencias de facturación de Koara</p>
        </div>

        <div className="flex flex-col sm:flex-row justify-end items-center gap-4 mb-4">
          <div className="flex gap-2 w-full sm:w-auto">
            <button onClick={handleOpenAddRange} className="koara-btn-black flex-1 sm:flex-none">
              <Plus size={18} /> Agregar Rango CAI
            </button>
            <button 
              onClick={() => setIsCodesModalOpen(true)} 
              className="flex-1 sm:flex-none px-5 py-2.5 border-2 border-slate-900 bg-white text-slate-900 rounded-full text-sm font-bold hover:bg-slate-50 transition-all active:scale-95"
            >
              Códigos CAI
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-sm font-bold text-slate-400 py-12 uppercase tracking-widest animate-pulse">Cargando registros...</p>
        ) : (
          <Table data={ranges} columns={columns} itemsPerPage={7} enableMutationToast={false} />
        )}

        <CaiRangeModal
          isOpen={isRangeModalOpen}
          mode={modalMode}
          formData={rangeFormData}
          setFormData={setRangeFormData}
          codes={codes}
          onClose={() => setIsRangeModalOpen(false)}
          onSubmit={handleRangeSubmit}
        />

        <CaiCodesModal
          isOpen={isCodesModalOpen}
          codes={codes}
          onClose={() => setIsCodesModalOpen(false)}
          onToggleCode={handleToggleCodeRequest} 
          onSaveCode={handleSaveCode}
        />

        <LocalConfirmModal 
          isOpen={isConfirmOpen}
          message={confirmMessage}
          onConfirm={handleGlobalConfirm}
          onCancel={() => {
            setIsConfirmOpen(false);
            setConfirmAction(null);
          }}
        />
      </div>
    </DashboardLayout>
  );
}