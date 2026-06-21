"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AlertCircle } from "lucide-react";

interface AlertModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  onClose: () => void;
}

export function AlertModal({ isOpen, title, message, onClose }: AlertModalProps) {

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = isOpen ? "hidden" : "unset";
    }
    return () => {
      if (typeof document !== "undefined") {
        document.body.style.overflow = "unset";
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm animate-koara-fade" 
        onClick={onClose}
      />
      <div className="koara-modal-card border-[3px] border-[#F4B8D4]/50 animate-koara-modal w-full max-w-md relative z-10">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-50 border-2 border-red-100 flex items-center justify-center text-red-500 mb-2">
            <AlertCircle size={32} />
          </div>
          
          <h3 className="text-xl font-bold text-slate-800">
            {title || "¡Atención!"}
          </h3>
          
          <p className="text-slate-600 font-medium leading-relaxed">
            {message}
          </p>
          
          <button
            onClick={onClose}
            className="koara-btn-pink w-full mt-6 !py-4 text-base tracking-wide uppercase font-bold"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
