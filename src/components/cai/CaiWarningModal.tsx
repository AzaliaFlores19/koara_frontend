"use client";

import { X, AlertTriangle } from "lucide-react";

interface CaiWarningModalProps {
  isOpen: boolean;
  remainingInvoices: number;
  onClose: () => void;
  onConfirm: () => void;
}

export function CaiWarningModal({ isOpen, remainingInvoices, onClose, onConfirm }: CaiWarningModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="koara-modal-card relative z-[101] bg-white border-[3px] border-slate-200 rounded-[2rem] p-8 w-full max-w-lg animate-koara-modal shadow-2xl">
        <div className="flex items-center gap-4 mb-6 text-amber-600">
          <AlertTriangle size={40} />
          <h2 className="text-xl font-black text-slate-900">Advertencia de Riesgo Fiscal</h2>
        </div>

        <p className="text-slate-700 mb-4">
          Estás intentando activar un nuevo rango de facturación, pero el rango actual aún tiene facturas disponibles.
        </p>
        
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <p className="font-bold text-amber-800 text-sm">
            Facturas que quedarán inhabilitadas: <span className="text-lg">{remainingInvoices}</span>
          </p>
        </div>

        <p className="text-sm text-slate-500 mb-8">
          Por normativa de la SAR, estos folios quedarán inhabilitados y deberán ser reportados como "No Utilizados". Esta acción es irreversible.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-full font-black text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all"
          >
            No, cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-3 rounded-full font-black text-sm text-white bg-[#703A61] hover:bg-[#5a2e4e] transition-all"
          >
            Sí, continuar
          </button>
        </div>
      </div>
    </div>
  );
}
