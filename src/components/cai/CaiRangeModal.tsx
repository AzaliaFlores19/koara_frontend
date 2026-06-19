"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { CAICode } from "@/lib/types/models";

interface CaiRangeModalProps {
  isOpen: boolean;
  mode: "add" | "edit";
  formData: {
    cai_code?: string;
    cai_id: string;
    range_start: number;
    range_end: number;
    expiration_date: string;
  };
  setFormData: (data: any) => void;
  codes: CAICode[];
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function CaiRangeModal({
  isOpen,
  mode,
  formData,
  setFormData,
  codes,
  onClose,
  onSubmit,
}: CaiRangeModalProps) {
  
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Función para formatear el CAI automáticamente: XXXXXX-XXXXXX-XXXXXX-XXXXXX-XXXXXX-XX
  const handleCaiCodeChange = (value: string) => {
    let rawValue = value.replace(/-/g, "");
    if (rawValue.length > 32) rawValue = rawValue.slice(0, 32);
    
    let formatted = "";
    for (let i = 0; i < rawValue.length; i++) {
      if (i > 0 && i % 6 === 0 && i < 30) formatted += "-";
      else if (i === 30) formatted += "-";
      formatted += rawValue[i];
    }
    setFormData({ ...formData, cai_code: formatted.toUpperCase() });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 min-h-screen h-full w-full z-[60] bg-black/20 backdrop-blur-sm animate-koara-fade" 
        onClick={onClose} 
      />

      {/* Contenedor de Scroll */}
      <div className="fixed inset-0 min-h-screen h-full w-full z-[61] overflow-y-auto">
        
        {/* Centrador */}
        <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
          
          {/* Tarjeta del Modal */}
          <div className="koara-modal-card animate-koara-modal relative w-full max-w-md bg-white p-6 shadow-xl rounded-2xl">
            {/* Encabezado */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-black">
                {mode === "add" ? "Agregar Rango CAI" : "Editar Rango CAI"}
              </h2>
              <button 
                type="button"
                onClick={onClose} 
                className="p-1.5 rounded-full hover:bg-black/5 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={onSubmit} className="space-y-5">
              
              {/* Código CAI */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-black uppercase tracking-wider block">Código CAI *</label>
                <input 
                  type="text" 
                  value={formData.cai_code || ""} 
                  onChange={(e) => handleCaiCodeChange(e.target.value)} 
                  className="koara-input-field font-mono text-xs w-full"
                  placeholder="Ej: A1B2C3-D4E5F6-G7H8I9-J0K1L2-M3N4O5-P6"
                  pattern="^[A-Z0-9]{6}-[A-Z0-9]{6}-[A-Z0-9]{6}-[A-Z0-9]{6}-[A-Z0-9]{6}-[A-Z0-9]{2}$"
                  required
                  onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity("Formato requerido: XXXXXX-XXXXXX-XXXXXX-XXXXXX-XXXXXX-XX (6-6-6-6-6-2 caracteres alfanuméricos)")}
                  onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")}
                />
              </div>

              {/* Campos Numéricos del Rango Autorizado */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-black uppercase tracking-wider block">Rango Inicial *</label>
                  <input 
                    type="number" 
                    value={formData.range_start || ""} 
                    onChange={(e) => setFormData({ ...formData, range_start: Number(e.target.value) || 0 })} 
                    className="koara-input-field text-black w-full"
                    min="1"
                    required
                    onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity("El rango inicial debe ser un número entero mayor o igual a 1.")}
                    onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-black uppercase tracking-wider block">Rango Final *</label>
                  <input 
                    type="number" 
                    value={formData.range_end || ""} 
                    onChange={(e) => setFormData({ ...formData, range_end: Number(e.target.value) || 0 })} 
                    className="koara-input-field text-black w-full"
                    min={formData.range_start ? formData.range_start + 1 : "1"}
                    required
                    onInvalid={(e) => {
                      const target = e.target as HTMLInputElement;
                      if (target.validity.rangeUnderflow) {
                        target.setCustomValidity(`El rango final debe ser estrictamente mayor al rango inicial (${formData.range_start}).`);
                      } else {
                        target.setCustomValidity("Por favor, introduce un número de rango final válido.");
                      }
                    }}
                    onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")}
                  />
                </div>
              </div>

              {/* Fecha Límite de Emisión */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-black uppercase tracking-wider block">Fecha de Expiración *</label>
                <input 
                  type="date" 
                  value={formData.expiration_date ? formData.expiration_date.split('T')[0] : ""} 
                  onChange={(e) => setFormData({ ...formData, expiration_date: e.target.value })} 
                  className="koara-input-field text-xs text-black w-full"
                  required
                  onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity("Por favor, selecciona una fecha límite de emisión válida.")}
                  onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")}
                />
              </div>

              {/* Botones de Acción */}
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={onClose} className="koara-btn-cancel flex-1">Cancelar</button>
                <button type="submit" className="koara-btn-pink flex-1">Confirmar</button>
              </div>
            </form>

          </div>
        </div>
      </div>
    </>
  );
}