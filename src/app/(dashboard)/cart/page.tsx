"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  Package,
  CheckCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import DashboardLayout from "@/components/layout/layout";
import { ConfirmModal } from "@/components/ConfirmModal";
import { useCart } from "@/lib/cart-context";
import { productsApi } from "@/services/products.service";
import type { Product } from "@/components/inventory/ProductCard";

export default function CartPage() {
  const {
    cart,
    loading: isLoading,
    addItem,
    updateItem,
    removeItem,
    clear,
  } = useCart();

  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProducts = useCallback(async () => {
    setIsSearching(true);
    try {
      const result = await productsApi.getAll(1, 12, search || undefined);
      setProducts(result.data);
    } catch {
      showToast("Error al buscar productos.", false);
    } finally {
      setIsSearching(false);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(fetchProducts, 300);
    return () => clearTimeout(t);
  }, [fetchProducts]);

  const handleAdd = async (product: Product) => {
    setBusyId(product.id);
    try {
      await addItem(product.id, 1);
      showToast(`"${product.name}" agregado al carrito.`);
    } catch (err: any) {
      showToast(
        err?.response?.data?.message ?? "No se pudo agregar el producto.",
        false,
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleUpdateQty = async (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setBusyId(productId);
    try {
      await updateItem(productId, quantity);
    } catch (err: any) {
      showToast(
        err?.response?.data?.message ?? "No se pudo actualizar la cantidad.",
        false,
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleRemove = async (productId: string) => {
    setBusyId(productId);
    try {
      await removeItem(productId);
    } catch {
      showToast("No se pudo eliminar el producto.", false);
    } finally {
      setBusyId(null);
    }
  };

  const handleClear = async () => {
    setConfirmClear(false);
    try {
      await clear();
      showToast("Carrito vaciado.");
    } catch {
      showToast("No se pudo vaciar el carrito.", false);
    }
  };

  const items = cart?.items ?? [];
  const summary = cart?.summary;

  return (
    <DashboardLayout>
      <div className="min-h-screen w-full">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Carrito de Compras</h1>
            {items.length > 0 && (
              <button
                onClick={() => setConfirmClear(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-white text-black text-sm font-medium rounded-full border border-black hover:bg-gray-50 transition-colors"
              >
                <Trash2 size={15} />
                Vaciar carrito
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Product picker */}
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Search
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Buscar producto para agregar"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white rounded-full text-sm border border-black focus:outline-none focus:ring-2 focus:ring-koara-primary placeholder:text-gray-400"
                />
              </div>

              <div className="bg-white rounded-2xl border border-black/10 p-3 flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
                {isSearching ? (
                  <p className="text-center text-gray-400 py-8 text-sm">
                    Buscando...
                  </p>
                ) : products.length === 0 ? (
                  <p className="text-center text-gray-500 py-8 text-sm">
                    No se encontraron productos.
                  </p>
                ) : (
                  products.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden shrink-0"
                        style={{ backgroundColor: p.imageColor }}
                      >
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package size={18} className="text-black/20" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-black truncate">
                          {p.name}
                        </p>
                        <p className="text-[11px] text-gray-500">
                          L {p.price.toFixed(2)} · Stock: {p.stock}
                        </p>
                      </div>
                      <button
                        onClick={() => handleAdd(p)}
                        disabled={busyId === p.id || p.stock < 1}
                        className="w-9 h-9 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 active:scale-95 transition-all disabled:opacity-40 shrink-0"
                        aria-label={`Agregar ${p.name}`}
                      >
                        {busyId === p.id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Plus size={18} />
                        )}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Cart */}
            <div className="flex flex-col gap-4">
              {isLoading ? (
                <p className="text-center text-gray-400 py-16">
                  Cargando carrito...
                </p>
              ) : items.length === 0 ? (
                <div className="bg-white rounded-2xl border border-black/10 flex flex-col items-center justify-center py-16 gap-3 text-center">
                  <ShoppingCart size={40} className="text-black/20" />
                  <p className="text-gray-500 text-sm">Tu carrito está vacío.</p>
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-2">
                    {items.map((item) => (
                      <div
                        key={item.productId}
                        className="bg-white rounded-2xl border border-black/10 p-3 flex items-center gap-3"
                      >
                        <div
                          className="w-14 h-14 rounded-lg flex items-center justify-center overflow-hidden shrink-0"
                          style={{ backgroundColor: "#F5EDE8" }}
                        >
                          {item.product.image ? (
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package size={20} className="text-black/20" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-black truncate">
                            {item.product.name}
                          </p>
                          <p className="text-[11px] text-gray-500">
                            L {item.unit_price.toFixed(2)} c/u
                          </p>
                          {!item.has_stock && (
                            <p className="text-[11px] text-red-500 font-medium flex items-center gap-1 mt-0.5">
                              <AlertTriangle size={11} />
                              Stock insuficiente ({item.available_stock} disp.)
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() =>
                              item.quantity <= 1
                                ? handleRemove(item.productId)
                                : handleUpdateQty(item.productId, item.quantity - 1)
                            }
                            disabled={busyId === item.productId}
                            className="w-7 h-7 rounded-full border border-black/20 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 transition-colors"
                            aria-label="Disminuir"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-7 text-center text-sm font-semibold">
                            {busyId === item.productId ? (
                              <Loader2 size={14} className="animate-spin mx-auto" />
                            ) : (
                              item.quantity
                            )}
                          </span>
                          <button
                            onClick={() =>
                              handleUpdateQty(item.productId, item.quantity + 1)
                            }
                            disabled={
                              busyId === item.productId ||
                              item.quantity >= item.available_stock
                            }
                            className="w-7 h-7 rounded-full border border-black/20 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 transition-colors"
                            aria-label="Aumentar"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <div className="flex flex-col items-end gap-1 shrink-0 w-20">
                          <p className="font-semibold text-sm text-black">
                            L {item.item_subtotal.toFixed(2)}
                          </p>
                          <button
                            onClick={() => handleRemove(item.productId)}
                            disabled={busyId === item.productId}
                            className="text-red-500 hover:scale-110 transition-transform disabled:opacity-40"
                            aria-label="Eliminar"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary */}
                  {summary && (
                    <div className="bg-[#F4B8D4]/40 rounded-2xl p-6 border-2 border-slate-900 space-y-2">
                      <div className="flex justify-between text-xs font-bold text-slate-900">
                        <span>Productos</span>
                        <span>{summary.total_items}</span>
                      </div>
                      <div className="flex justify-between text-xs font-bold text-slate-900">
                        <span>Subtotal</span>
                        <span>L {summary.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-xs font-bold text-slate-900">
                        <span>ISV ({(summary.tax_rate * 100).toFixed(0)}%)</span>
                        <span>L {summary.taxes.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-xl font-black text-slate-900 pt-2 border-t border-slate-900/10">
                        <span>TOTAL</span>
                        <span>L {summary.total.toFixed(2)}</span>
                      </div>
                    </div>
                  )}

                  <Link
                    href="/invoices"
                    className="w-full py-4 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={18} />
                    Crear factura
                  </Link>
                  <p className="text-center text-[11px] text-gray-500">
                    Las facturas se generan desde la página de Facturas.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmClear}
        message="¿Estás seguro de que deseas vaciar el carrito?"
        onConfirm={handleClear}
        onCancel={() => setConfirmClear(false)}
      />

      {toast && (
        <div
          className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[70] flex items-center gap-3 text-white rounded-2xl px-7 py-4 shadow-xl text-base font-medium ${
            toast.ok ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.ok ? (
            <CheckCircle size={22} className="text-white shrink-0" />
          ) : (
            <AlertTriangle size={22} className="text-white shrink-0" />
          )}
          {toast.msg}
        </div>
      )}
    </DashboardLayout>
  );
}
