"use client";

import { useState, useMemo, useEffect } from "react";
import { Plus, X, Loader2, Download, ArrowLeft } from "lucide-react";
import { Invoice, InvoiceItem } from "@/lib/types/models";

interface ProductMock {
  id: string;
  name: string;
  price: number;
}

const MOCK_PRODUCTS: ProductMock[] = [
  { id: "p1", name: "Skin Mask", price: 97.8 },
  { id: "p2", name: "Centella Ampoule", price: 540 },
  { id: "p3", name: "Glow Serum", price: 420 },
  { id: "p4", name: "Sun Shield", price: 320 },
];

const MOCK_CLIENTS = [
  { id: "c1", name: "Juan Pérez" },
  { id: "c2", name: "María Rodríguez" },
  { id: "c3", name: "Carlos López" },
  { id: "c4", name: "Ana Martínez" },
];

const MOCK_VENDORS = [
  { id: "v1", name: "Admin User" },
  { id: "v2", name: "Store Manager" },
  { id: "v3", name: "Sales Rep" },
];

interface InvoiceModalProps {
  isOpen: boolean;
  mode: "create" | "view" | "preview";
  invoice?: Invoice | null;
  onClose: () => void;
  onConfirm: (data: Partial<Invoice>) => void;
  onNext?: (data: Partial<Invoice>) => void;
  onBack?: () => void;
  isSubmitting?: boolean;
}

export function InvoiceModal({
  isOpen,
  mode,
  invoice,
  onClose,
  onConfirm,
  onNext,
  onBack,
  isSubmitting = false,
}: InvoiceModalProps) {
  const [clientName, setClientName] = useState(invoice?.client_name || "");
  const [vendorName, setVendorName] = useState(invoice?.vendor_name || "");
  const [items, setItems] = useState<Partial<InvoiceItem>[]>(invoice?.invoice_items || []);

  useEffect(() => {
    if (isOpen) {
      setClientName(invoice?.client_name || MOCK_CLIENTS[0].name);
      setVendorName(invoice?.vendor_name || MOCK_VENDORS[0].name);
      setItems(invoice?.invoice_items || []);
    }
  }, [isOpen, invoice]);

  // Lock body scroll while open
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);
  
  // Create mode state
  const [selectedProductId, setSelectedProductId] = useState(MOCK_PRODUCTS[0].id);
  const [quantity, setQuantity] = useState(1);
  const [localMode, setLocalMode] = useState<"create" | "view" | "preview">(mode);

  useEffect(() => {
    setLocalMode(mode);
  }, [mode]);

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

  const handleAddItem = () => {
    const product = MOCK_PRODUCTS.find((p) => p.id === selectedProductId);
    if (!product) return;

    const existingItemIndex = items.findIndex((item) => item.product_id === product.id);
    if (existingItemIndex > -1) {
      const newItems = [...items];
      newItems[existingItemIndex].quantity = (newItems[existingItemIndex].quantity || 0) + quantity;
      newItems[existingItemIndex].item_subtotal = (newItems[existingItemIndex].quantity || 0) * (newItems[existingItemIndex].unit_price || 0);
      setItems(newItems);
    } else {
      setItems([
        ...items,
        {
          product_id: product.id,
          quantity: quantity,
          unit_price: product.price,
          item_subtotal: product.price * quantity,
          product: { name: product.name } as any,
        },
      ]);
    }
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

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

          <button onClick={onClose} className="koara-btn-pink w-full py-4 text-slate-700 flex items-center justify-center gap-2">
            <Download size={18} />
            Descargar
          </button>
        </>
      );
    }

    if(localMode === "preview" && invoice) {
      const date = new Date(invoice.created_at);
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

          <div className="flex gap-4 pb-2">
            <button className="koara-btn-pink py-4 flex items-center justify-center gap-2 flex-1">
              <Download size={18} />
              Descargar
            </button>
            <button
              onClick={() => onConfirm({ client_name: clientName, vendor_name: vendorName, subtotal, taxes: isv, total, invoice_items: items as InvoiceItem[] })}
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
        <h2 className="text-2xl font-bold mb-6 text-black">Crear Factura</h2>
        
        <div className="space-y-4 mb-6">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-700">Nombre de Cliente</label>
            <select
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="koara-input-field"
            >
              {MOCK_CLIENTS.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-700">Vendedor</label>
            <select
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              className="koara-input-field"
            >
              {MOCK_VENDORS.map((v) => (
                <option key={v.id} value={v.name}>{v.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-2xl border-2 border-slate-900 p-4 mb-6">
          <div className="flex gap-3 mb-2">
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="flex-1 bg-white border-2 border-slate-900 rounded-xl px-4 py-2 font-bold text-sm outline-none"
            >
              {MOCK_PRODUCTS.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="w-20 bg-white border-2 border-slate-900 rounded-xl px-4 py-2 font-bold text-sm outline-none text-center"
            />
            <button
              onClick={handleAddItem}
              className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center hover:opacity-90 active:scale-95 transition-all"
            >
              <Plus size={24} />
            </button>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Añadir Productos a Factura</p>
        </div>

        {/* Added Products List */}
        {items.length > 0 && (
          <div className="space-y-2 mb-6 pr-2">
            {items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm font-bold text-slate-700 bg-slate-50 p-2 rounded-xl">
                <span>{item.product?.name} x {item.quantity}</span>
                <div className="flex items-center gap-3">
                  <span>L {item.item_subtotal?.toFixed(2)}</span>
                  <button onClick={() => removeItem(idx)} className="text-red-500 hover:scale-110 transition-transform">
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

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
            onClick={() => onNext?.({ client_name: clientName, vendor_name: vendorName, subtotal, taxes: isv, total, invoice_items: items as InvoiceItem[], created_at: new Date().toISOString() })}
            disabled={isSubmitting || items.length === 0 || !clientName}
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
