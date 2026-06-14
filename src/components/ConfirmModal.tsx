"use client";

import { useEffect } from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({ isOpen, message, onConfirm, onCancel }: ConfirmModalProps) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="koara-modal-card border-[3px] border-slate-200 rounded-[2rem] p-8 w-full max-w-md animate-koara-modal mx-4">
        <p className="font-bold text-slate-700 mb-8">{message}</p>
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
