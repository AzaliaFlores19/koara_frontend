"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export interface ProductFormData {
  name: string;
  code: string;
  description: string;
  price: string;
  stock: string;
  minStock: string;
  category: string;
}

interface ProductModalProps {
  isOpen: boolean;
  mode: "add" | "edit";
  formData: ProductFormData;
  categories: string[];
  setFormData: (data: ProductFormData) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

export function ProductModal({
  isOpen,
  mode,
  formData,
  categories,
  setFormData,
  onClose,
  onSubmit,
  isSubmitting,
}: ProductModalProps) {
  // Lock body scroll while open
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Fixed backdrop — always covers full screen */}
      <div
        className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm animate-koara-fade"
        onClick={onClose}
      />

      {/* Scroll container — sits above backdrop */}
      <div className="fixed inset-0 z-[61] overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="koara-modal-card animate-koara-modal w-full">
            <h2 className="text-2xl font-bold mb-6 text-black">
              {mode === "add" ? "Add Product" : "Edit Product"}
            </h2>

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-black uppercase tracking-wider">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="koara-input-field"
                  placeholder="Product name"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-black uppercase tracking-wider">Code</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="koara-input-field"
                  placeholder="e.g. CM001"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-black uppercase tracking-wider">Description</label>
                <input
                  type="text"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="koara-input-field"
                  placeholder="Short product description"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-black uppercase tracking-wider">Price</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="koara-input-field"
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-black uppercase tracking-wider">Stock</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="koara-input-field"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-black uppercase tracking-wider">Min Stock</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.minStock}
                  onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                  className="koara-input-field"
                  placeholder="0"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-black uppercase tracking-wider">Category</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="koara-input-field"
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4 pt-2">
                <button type="button" onClick={onClose} className="koara-btn-cancel">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="koara-btn-pink">
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : "Confirm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
