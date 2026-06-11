"use client";

import { Loader2 } from "lucide-react";
import { User } from "@/lib/api/auth";

interface UserModalProps {
  isOpen: boolean;
  mode: "add" | "edit";
  formData: { name: string; email: string; role: User["role"] };
  setFormData: (data: { name: string; email: string; role: User["role"] }) => void;
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
            <label className="text-xs font-bold text-black uppercase tracking-wider">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as User["role"] })}
              className="koara-input-field appearance-none"
            >
              <option value="Employee">Employee</option>
              <option value="Admin">Admin</option>
            </select>
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
