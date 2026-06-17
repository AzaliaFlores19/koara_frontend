"use client";

import { Loader2, ChevronDown } from "lucide-react";
import { User } from "@/lib/api/auth";

interface UserModalProps {
  isOpen: boolean;
  mode: "add" | "edit";
  formData: { name: string; email: string; role: User["role"]; password?: string; phone?: string };
  setFormData: (data: { name: string; email: string; role: User["role"]; password?: string; phone?: string }) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

export function UserModal({
  isOpen,
  mode,
  formData,
  setFormData,
  onClose,
  onSubmit,
  isSubmitting,
}: UserModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 sm:pt-16">
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-koara-fade" 
        onClick={onClose}
      />
      <div className="koara-modal-card animate-koara-modal">
        <h2 className="text-2xl font-bold mb-6 text-black">
          {mode === "add" ? "Add User" : "Edit User"}
        </h2>
        
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-black uppercase tracking-wider">Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="koara-input-field"
              placeholder="Enter full name"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-black uppercase tracking-wider">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="koara-input-field"
                placeholder="name@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-black uppercase tracking-wider">Phone (Optional)</label>
              <input
                type="text"
                value={formData.phone || ""}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="koara-input-field"
                placeholder="e.g. 9999-9999"
              />
            </div>
          </div>

          {mode === "add" && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-black uppercase tracking-wider">Password</label>
              <input
                type="password"
                required={mode === "add"}
                value={formData.password || ""}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="koara-input-field"
                placeholder="Min 8 chars, 1 upper, 1 lower, 1 number"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-black uppercase tracking-wider">Role</label>
            <div className="relative">
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as User["role"] })}
                className="koara-input-field appearance-none pr-10"
              >
                <option value="EMPLOYEE">Employee</option>
                <option value="ADMIN">Admin</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-900 pointer-events-none" size={18} />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="koara-btn-cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="koara-btn-pink"
            >
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
