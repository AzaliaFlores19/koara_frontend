"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Loader2, ChevronDown, Eye, EyeOff } from "lucide-react";
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
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 sm:pt-16 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm animate-koara-fade" 
        onClick={onClose}
      />
      <div className="koara-modal-card animate-koara-modal relative z-10">
        <h2 className="text-2xl font-bold mb-6 text-black">
          {mode === "add" ? "Agregar Usuario" : "Editar Usuario"}
        </h2>
        
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-black uppercase tracking-wider">Nombre</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="koara-input-field"
              placeholder="Ingrese el nombre completo"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-black uppercase tracking-wider">Correo electrónico</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="koara-input-field"
                placeholder="nombre@ejemplo.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-black uppercase tracking-wider">Teléfono (Opcional)</label>
              <input
                type="text"
                value={formData.phone || ""}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="koara-input-field"
                placeholder="ej. 9999-9999"
              />
            </div>
          </div>

          {mode === "add" && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-black uppercase tracking-wider">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required={mode === "add"}
                  value={formData.password || ""}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="koara-input-field"
                  placeholder="Mín. 8 caracteres, 1 mayúsc., 1 minúsc., 1 número"
                />
                <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-black uppercase tracking-wider">Rol</label>
            <div className="relative">
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as User["role"] })}
                className="koara-input-field appearance-none pr-10"
              >
                <option value="EMPLOYEE">Empleado</option>
                <option value="ADMIN">Administrador</option>
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
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="koara-btn-pink"
            >
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}