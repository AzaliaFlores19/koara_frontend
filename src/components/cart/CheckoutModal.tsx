"use client";

import { useEffect, useState } from "react";
import { X, Loader2, ChevronDown } from "lucide-react";
import type { PaymentMethod } from "@/lib/types/models";
import { formatCurrency } from "@/lib/format";

export interface CheckoutClient {
  id: string;
  name: string;
}

const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "CASH", label: "Efectivo" },
  { value: "TRANSFER", label: "Transferencia" },
  { value: "CARD", label: "Tarjeta" },
];

interface CheckoutModalProps {
  isOpen: boolean;
  total: number;
  clients: CheckoutClient[];
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirm: (data: { customerId: string; payment_method: PaymentMethod }) => void;
}

export function CheckoutModal({
  isOpen,
  total,
  clients,
  isSubmitting = false,
  onClose,
  onConfirm,
}: CheckoutModalProps) {
  const [customerId, setCustomerId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");

  useEffect(() => {
    if (isOpen) {
      setCustomerId(clients[0]?.id ?? "");
      setPaymentMethod("CASH");
    }
  }, [isOpen, clients]);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm animate-koara-fade"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-[61] overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="koara-modal-card max-w-md animate-koara-modal w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-black">Finalizar Compra</h2>
              <button
                onClick={onClose}
                className="p-2 -mr-2 rounded-full hover:bg-slate-200 transition-colors"
              >
                <X size={20} className="text-black" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-700">
                  Cliente
                </label>
                <div className="relative">
                  <select
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    className="koara-input-field appearance-none pr-10"
                  >
                    {clients.length === 0 && (
                      <option value="">No hay clientes disponibles</option>
                    )}
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    size={16}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-700">
                  Método de Pago
                </label>
                <div className="relative">
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="koara-input-field appearance-none pr-10"
                  >
                    {PAYMENT_METHODS.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    size={16}
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#F4B8D4]/40 rounded-2xl p-6 border-2 border-slate-900 mb-6">
              <div className="flex justify-between text-xl font-black text-slate-900">
                <span>TOTAL</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <div className="flex gap-4 pb-2">
              <button onClick={onClose} className="koara-btn-cancel py-4">
                Cancelar
              </button>
              <button
                onClick={() => onConfirm({ customerId, payment_method: paymentMethod })}
                disabled={isSubmitting || !customerId}
                className="koara-btn-pink py-4"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  "Confirmar Compra"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
