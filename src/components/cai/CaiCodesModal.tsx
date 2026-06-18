"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Plus, Power, Pencil } from "lucide-react";
import { CAICode } from "@/lib/types/index";

interface CaiCodesModalProps {
  isOpen: boolean;
  codes: CAICode[];
  onClose: () => void;
  onToggleCode: (id: string, is_active: boolean) => void; 
  onSaveCode: (codeForm: { id?: string; cai_code: string }) => void;
}

export function CaiCodesModal({
  isOpen,
  codes,
  onClose,
  onToggleCode,
  onSaveCode,
}: CaiCodesModalProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingCode, setEditingCode] = useState<CAICode | null>(null);
  const [codeForm, setCodeForm] = useState({ cai_code: "" });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  // Función para formatear el CAI automáticamente
  const formatCaiCode = (value: string) => {
    // 1. Remover todo lo que no sea alfanumérico y pasar a mayúsculas
    const clean = value.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
    
    // 2. Cortar al tamaño máximo real (32 caracteres de código + 5 guiones = 37)
    const chunks = [];
    
    // Bloques intermedios de 6 caracteres
    let i = 0;
    while (i < clean.length && chunks.length < 5) {
      chunks.push(clean.slice(i, i + 6));
      i += 6;
    }
    // Último bloque de máximo 2 caracteres
    if (i < clean.length) {
      chunks.push(clean.slice(i, i + 2));
    }

    // Unir los bloques con guiones
    return chunks.join("-");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCaiCode(e.target.value);
    setCodeForm({ cai_code: formatted });
  };

  const handleOpenAdd = () => {
    setEditingCode(null);
    setCodeForm({ cai_code: "" });
    setShowForm(true);
  };

  const handleOpenEdit = (code: CAICode) => {
    setEditingCode(code);
    setCodeForm({ cai_code: code.cai_code });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveCode({
      id: editingCode?.id,
      ...codeForm,
    });
    setShowForm(false);
    setEditingCode(null);
  };

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 sm:pt-16 overflow-y-auto">
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm animate-koara-fade" onClick={onClose} />

      <div className="koara-modal-card animate-koara-modal relative z-10 w-full max-w-md my-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-black">
            {showForm ? (editingCode ? "Editar Código CAI" : "Nuevo Código CAI") : "Registro de Códigos CAI"}
          </h2>
          <button 
            onClick={() => { if (showForm) setShowForm(false); else onClose(); }}
            className="p-1.5 rounded-full hover:bg-black/5 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {!showForm ? (
          <div className="space-y-5">
            <div className="flex justify-end">
              <button 
                onClick={handleOpenAdd} 
                className="px-4 py-2 rounded-full font-black text-xs text-white bg-slate-900 hover:opacity-90 transition-all flex items-center gap-1"
              >
                <Plus size={14} /> Nuevo Código CAI
              </button>
            </div>

            <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
              <style>{`div::-webkit-scrollbar { display: none; }`}</style>
              {codes.map((code) => (
                <div key={code.id} className="flex items-center justify-between p-4 rounded-2xl border-2 border-slate-100 bg-white hover:border-[#f4b8d4]/40 transition-all duration-200 shadow-sm">
                  <div className="min-w-0 flex-1 mr-3">
                    <p className="font-mono text-xs text-slate-700 truncate font-bold tracking-tight">{code.cai_code}</p>
                    <span className={`inline-block text-[10px] font-bold mt-1 px-2 py-0.5 rounded-full ${code.is_active ? "bg-green-50 text-green-600" : "bg-slate-100 text-slate-400"}`}>
                      {code.is_active ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button onClick={() => handleOpenEdit(code)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors">
                      <Pencil size={12} />
                    </button>
                    <button onClick={() => onToggleCode(code.id, code.is_active)} className={`w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 transition-colors ${code.is_active ? "hover:bg-red-50 hover:text-red-600" : "hover:bg-green-50 hover:text-green-600"}`}>
                      <Power size={12} className={code.is_active ? "text-slate-600" : "text-green-600"} />
                    </button>
                  </div>
                </div>
              ))}
              {codes.length === 0 && (
                <p className="text-center text-xs text-slate-400 py-6 font-bold uppercase tracking-wider">No hay códigos registrados</p>
              )}
            </div>

            <button onClick={onClose} className="koara-btn-cancel w-full">Cerrar</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-black uppercase tracking-wider block">Código Completo CAI *</label>
              <input 
                type="text" 
                value={codeForm.cai_code} 
                onChange={handleInputChange} 
                maxLength={37} 
                placeholder="123456-ABCDEF-123456-ABCDEF-123456-KT" 
                onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity("Debe cumplir exactamente la estructura de 6 bloques. Ej: 123456-ABCDEF-123456-ABCDEF-123456-KT")}
                onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")}
                className="koara-input-field font-mono text-xs tracking-wider text-black"
                required
                pattern="^[A-Z0-9]{6}-[A-Z0-9]{6}-[A-Z0-9]{6}-[A-Z0-9]{6}-[A-Z0-9]{6}-[A-Z0-9]{2}$"
                title="Debe cumplir exactamente la estructura de 6 bloques. Ej: 123456-ABCDEF-123456-ABCDEF-123456-KT"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button type="button" onClick={() => setShowForm(false)} className="koara-btn-cancel flex-1">Volver</button>
              <button type="submit" className="koara-btn-pink flex-1">Guardar Código</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}