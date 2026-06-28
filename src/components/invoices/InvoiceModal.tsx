"use client";

import { useState, useMemo, useEffect } from "react";
import { X, Loader2, Download, ArrowLeft, ChevronDown } from "lucide-react";
import { Invoice, InvoiceItem, PaymentMethod } from "@/lib/types/models";
import { getAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart-context";

interface ProductOption {
  id: string;
  name: string;
  price: number;
}

interface ClientOption {
  id: string;
  name: string;
}

export interface CreateInvoicePayload {
  customerId: string;
  payment_method: PaymentMethod;
  invoice_items: InvoiceItem[];
}

const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "CASH", label: "Efectivo" },
  { value: "TRANSFER", label: "Transferencia" },
  { value: "CARD", label: "Tarjeta" },
];

interface InvoiceModalProps {
  isOpen: boolean;
  mode: "create" | "view" | "preview";
  invoice?: Invoice | null;
  onClose: () => void;
  onConfirm: (data: CreateInvoicePayload) => void;
  onBack?: () => void;
  onDownload?: () => void;
  onDownloadPreview?: (data: CreateInvoicePayload) => void;
  isSubmitting?: boolean;
  productOptions?: ProductOption[];
  clientOptions?: ClientOption[];
}

export function InvoiceModal({
  isOpen,
  mode,
  invoice,
  onClose,
  onConfirm,
  onBack,
  onDownload,
  onDownloadPreview,
  isSubmitting = false,
  clientOptions = [],
}: InvoiceModalProps) {
  const { cart } = useCart();
  const isCartEmpty = (cart?.items?.length ?? 0) === 0;
  const [items, setItems] = useState<Partial<InvoiceItem>[]>(invoice?.invoice_items || []);
  const [customerId, setCustomerId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");
  const [localMode, setLocalMode] = useState<"create" | "view" | "preview">(mode);

  // Reset the modal whenever it (re)opens or the target invoice changes.
  useEffect(() => {
    if (!isOpen) return;
    setItems(invoice?.invoice_items || []);
    setCustomerId(invoice ? "" : clientOptions[0]?.id ?? "");
    setPaymentMethod("CASH");
    setLocalMode(mode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, invoice, mode]);

  // Create flow: the invoice items mirror the shopping cart.
  useEffect(() => {
    if (!isOpen || invoice) return;
    setItems(
      (cart?.items ?? []).map((ci) => ({
        product_id: ci.productId,
        quantity: ci.quantity,
        unit_price: ci.unit_price,
        item_subtotal: ci.item_subtotal,
        product: { name: ci.product.name } as any,
      })),
    );
  }, [isOpen, invoice, cart]);

  // Auto-select the first client once the list loads (create flow).
  useEffect(() => {
    if (clientOptions.length && !customerId) {
      setCustomerId(clientOptions[0].id);
    }
  }, [clientOptions, customerId]);

  // Lock body scroll while open
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);
  
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      setLocalMode("create");
    }
  };

  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + (item.unit_price || 0) * (item.quantity || 0), 0);
  }, [items]);

  const isv = subtotal * 0.15;
  const total = subtotal + isv;

  if (!isOpen) return null;

  const renderContent = () => {
    if (localMode === "view" && invoice) {
      const date = new Date(invoice.created_at);
      return (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-black">Ver Factura</h2>
            <button onClick={onClose} className="p-2 -mr-2 rounded-full hover:bg-slate-200 transition-colors">
              <X size={20} className="text-black" />
            </button>
          </div>
          
          <div className="bg-[#F4B8D4] rounded-2xl p-6 border-2 border-slate-900 mb-6 space-y-4">
            <div className="flex justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-700">Factura #</p>
                <p className="font-bold text-slate-900">Factura # {invoice.invoice_number}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-700">Fecha y Hora</p>
                <p className="font-bold text-slate-900">
                  {date.getFullYear()} - {date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", hour12: true })}
                </p>
              </div>
            </div>
            <div className="flex justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-700">Cliente</p>
                <p className="font-bold text-slate-900">{invoice.client_name}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-700">Vendedor</p>
                <p className="font-bold text-slate-900">{invoice.vendor_name}</p>
              </div>
            </div>
          </div>

          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-4">Productos</h3>
          
          <div className="space-y-3 mb-6">
            {invoice.invoice_items?.map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl border-2 border-slate-900 p-4 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-900">{item.product?.name}</p>
                  <p className="text-xs font-bold text-slate-500">Cantidad: {item.quantity}</p>
                </div>
                <p className="font-bold text-slate-900">L {item.item_subtotal?.toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="space-y-1 text-right mb-6 px-4">
            <div className="flex justify-between text-xs font-bold text-slate-900">
              <span className="uppercase tracking-widest">SUBTOTAL</span>
              <span>L {invoice.subtotal?.toFixed(2) ?? "0.00"}</span>
            </div>
            <div className="flex justify-between text-xs font-bold text-slate-900">
              <span className="uppercase tracking-widest">ISV (15%)</span>
              <span>L {invoice.taxes?.toFixed(2) ?? "0.00"}</span>
            </div>
            <div className="flex justify-between text-lg font-black text-slate-900 pt-2 border-t border-slate-900/10">
              <span className="uppercase tracking-widest">TOTAL</span>
              <span>L {invoice.total?.toFixed(2) ?? "0.00"}</span>
            </div>
          </div>

          <button onClick={onDownload} className="koara-btn-pink w-full py-4 text-slate-700 flex items-center justify-center gap-2">
            <Download size={18} />
            Descargar
          </button>
        </>
      );
    }

    if (localMode === "preview") {
      const date = new Date();
      const previewClientName =
        clientOptions.find((c) => c.id === customerId)?.name || "—";
      const previewVendorName = getAuth()?.name || "—";
      const paymentLabel =
        PAYMENT_METHODS.find((m) => m.value === paymentMethod)?.label ?? "";
      return (
        <>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <button
                onClick={handleBack}
                className="p-2 -ml-2 rounded-full hover:bg-slate-200 transition-colors"
              >
                <ArrowLeft size={18} className="text-black" />
              </button>
              <h2 className="text-2xl font-bold text-black">Vista Previa de Factura</h2>
            </div>
            <button onClick={onClose} className="p-2 -mr-2 rounded-full hover:bg-slate-200 transition-colors">
              <X size={20} className="text-black" />
            </button>
          </div>

          <div className="bg-[#F4B8D4] rounded-2xl p-6 border-2 border-slate-900 mb-6 space-y-4">
            <div className="flex justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-700">Factura #</p>
                <p className="font-bold text-slate-900">Factura # --</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-700">Fecha y Hora</p>
                <p className="font-bold text-slate-900">
                  {date.getFullYear()} - {date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", hour12: true })}
                </p>
              </div>
            </div>
            <div className="flex justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-700">Cliente</p>
                <p className="font-bold text-slate-900">{previewClientName}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-700">Vendedor</p>
                <p className="font-bold text-slate-900">{previewVendorName}</p>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-700">Método de Pago</p>
              <p className="font-bold text-slate-900">{paymentLabel}</p>
            </div>
          </div>

          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-4">Productos</h3>

          <div className="space-y-3 mb-6">
            {items.map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl border-2 border-slate-900 p-4 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-900">{item.product?.name}</p>
                  <p className="text-xs font-bold text-slate-500">Cantidad: {item.quantity}</p>
                </div>
                <p className="font-bold text-slate-900">L {item.item_subtotal?.toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="space-y-1 text-right mb-6 px-4">
            <div className="flex justify-between text-xs font-bold text-slate-900">
              <span className="uppercase tracking-widest">SUBTOTAL</span>
              <span>L {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs font-bold text-slate-900">
              <span className="uppercase tracking-widest">ISV (15%)</span>
              <span>L {isv.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-black text-slate-900 pt-2 border-t border-slate-900/10">
              <span className="uppercase tracking-widest">TOTAL</span>
              <span>L {total.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-4 pb-2">
            <button
              onClick={() =>
                onDownloadPreview?.({
                  customerId,
                  payment_method: paymentMethod,
                  invoice_items: items as InvoiceItem[],
                })
              }
              className="koara-btn-pink py-4 flex items-center justify-center gap-2 flex-1"
            >
              <Download size={18} />
              Descargar
            </button>
            <button
              onClick={() => onConfirm({ customerId, payment_method: paymentMethod, invoice_items: items as InvoiceItem[] })}
              disabled={isSubmitting}
              className="koara-btn-pink py-4"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Confirmar"}
            </button>
          </div>
        </>
      );
    }

    return (
      <>
        <h2 className="text-2xl font-bold mb-2 text-black">Crear Factura</h2>
        <p className="text-xs font-bold text-slate-400 mb-6">
          Selecciona el cliente y el método de pago. Los productos provienen del carrito.
        </p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-700">
              Cliente
            </label>
            <div className="relative">
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="w-full bg-white border-2 border-slate-900 rounded-xl px-4 py-2 font-bold text-sm outline-none appearance-none pr-10"
              >
                {clientOptions.length === 0 && (
                  <option value="">No hay clientes</option>
                )}
                {clientOptions.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
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
                className="w-full bg-white border-2 border-slate-900 rounded-xl px-4 py-2 font-bold text-sm outline-none appearance-none pr-10"
              >
                {PAYMENT_METHODS.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
            </div>
          </div>
        </div>

        {/* Cart Products List */}
        <div className="bg-white rounded-2xl border-2 border-slate-900 p-4 mb-6">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Productos del Carrito</p>
          {items.length > 0 ? (
            <div className="space-y-2">
              {items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm font-bold text-slate-700 bg-slate-50 p-2 rounded-xl">
                  <span>{item.product?.name} x {item.quantity}</span>
                  <span>L {item.item_subtotal?.toFixed(2)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm font-bold text-slate-400 text-center py-4">
              El carrito está vacío. Agrega productos desde el carrito.
            </p>
          )}
        </div>

        <div className="bg-[#F4B8D4]/40 rounded-2xl p-6 border-2 border-slate-900 mb-6 space-y-2">
          <div className="flex justify-between text-xs font-bold text-slate-900">
            <span>Subtotal</span>
            <span>L {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs font-bold text-slate-900">
            <span>ISV (15%)</span>
            <span>L {isv.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xl font-black text-slate-900 pt-2">
            <span>TOTAL</span>
            <span>L {total.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex gap-4 pb-2">
          <button onClick={onClose} className="koara-btn-cancel py-4">
            Cancelar
          </button>
          <button
            onClick={() => setLocalMode("preview")}
            disabled={isSubmitting || isCartEmpty || !customerId}
            className="koara-btn-pink py-4"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Siguiente"}
          </button>
        </div>
      </>
    );
  };

  return (
    <>
      {/* Fixed backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm animate-koara-fade"
        onClick={onClose}
      />

      {/* Scroll container */}
      <div className="fixed inset-0 z-[61] overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="koara-modal-card max-w-lg animate-koara-modal w-full">
            {renderContent()}
          </div>
        </div>
      </div>
    </>
  );
}
