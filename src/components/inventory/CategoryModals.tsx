"use client";

import { useState } from "react";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";

// ── Manage Categories ───────────────────────────────────────────────────────
interface ManageCategoriesModalProps {
  categories: string[];
  onClose: () => void;
  onAdd: () => void;
  onEdit: (category: string) => void;
  onDelete: (category: string) => void;
}

export function ManageCategoriesModal({
  categories,
  onClose,
  onAdd,
  onEdit,
  onDelete,
}: ManageCategoriesModalProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 sm:pt-16">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-koara-fade"
        onClick={onClose}
      />
      <div className="koara-modal-card animate-koara-modal">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-black">Manage Categories</h2>
          <button onClick={onAdd} className="koara-btn-black">
            <Plus size={15} />
            Add
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto mb-6 no-scrollbar">
          {categories.length === 0 && (
            <p className="col-span-2 text-sm text-gray-400 text-center py-6">No categories yet.</p>
          )}
          {categories.map((cat) => (
            <div
              key={cat}
              className="flex items-center justify-between px-3 py-2.5 bg-white rounded-xl border border-slate-900"
            >
              <span className="text-sm font-bold truncate mr-1">{cat}</span>
              <div className="flex gap-1 flex-shrink-0">
                <button onClick={() => onEdit(cat)} className="w-6 h-6 rounded-full border border-slate-900 flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-900 active:scale-[0.95]">
                  <Pencil size={11} />
                </button>
                <button onClick={() => onDelete(cat)} className="w-6 h-6 rounded-full border border-slate-900 flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-900 active:scale-[0.95]">
                  <Trash2 size={11} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 rounded-full font-black text-sm text-slate-700 bg-[#e3c5d1] border-2 border-transparent hover:border-slate-200 transition-all active:translate-y-0.5"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Add / Edit Category ─────────────────────────────────────────────────────
interface CategoryFormModalProps {
  mode: "add" | "edit";
  initialValue?: string;
  onClose: () => void;
  onConfirm: (value: string) => void;
}

export function CategoryFormModal({
  mode,
  initialValue = "",
  onClose,
  onConfirm,
}: CategoryFormModalProps) {
  const [value, setValue] = useState(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!value.trim()) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 400));
    onConfirm(value.trim());
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center p-4 sm:pt-16">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-koara-fade"
        onClick={onClose}
      />
      <div className="koara-modal-card animate-koara-modal">
        <h2 className="text-2xl font-bold mb-6 text-black">
          {mode === "add" ? "Add Category" : "Edit Category"}
        </h2>

        <div className="space-y-1.5 mb-6">
          <label className="text-xs font-bold text-black uppercase tracking-wider">
            Category Name
          </label>
          <input
            type="text"
            placeholder="e.g. Serum, Cream, Mist..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleConfirm(); }}
            className="w-full px-4 py-3 rounded-xl border border-slate-900 focus:outline-none bg-white text-sm transition-all"
            autoFocus
          />
        </div>

        <div className="flex gap-4">
          <button type="button" onClick={onClose} className="koara-btn-cancel">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isSubmitting || !value.trim()}
            className="koara-btn-pink"
          >
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Delete confirmation ─────────────────────────────────────────────────────
interface ConfirmDeleteModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmDeleteModal({ onClose, onConfirm }: ConfirmDeleteModalProps) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-koara-fade"
        onClick={onClose}
      />
      <div className="koara-modal-card animate-koara-modal mx-4">
        <p className="font-bold text-slate-700 mb-8">
          Are you sure you want to delete this category? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-full font-black text-sm text-slate-700 bg-[#e3c5d1] border-2 border-transparent hover:border-slate-200 transition-all active:translate-y-0.5"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-3 rounded-full font-black text-sm text-white bg-[#703A61] border-2 border-slate-200 hover:-translate-y-0.5 transition-all active:translate-y-0"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
