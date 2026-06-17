"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, LogOut, Loader2, Eye, EyeOff, Edit2, X, CheckCircle2, AlertTriangle } from "lucide-react";
import { AxiosError } from "axios";
import { usersApi } from "@/services/users";
import ProfileLayout from "@/components/layout/layout";
import { clearAuth } from "@/lib/api/auth.api";

export default function ProfilePage() {
  const router = useRouter();

  // Estados de datos de usuario
  const [name, setName] = useState("User");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(""); 
  const [role, setRole] = useState("EMPLOYEE");
  
  const [isEditing, setIsEditing] = useState(false);
  // Guardar copia de seguridad por si el usuario cancela la edición
  const [backupData, setBackupData] = useState({ name: "", email: "", phone: "" }); 

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [topToast, setTopToast] = useState<{ message: string; visible: boolean; type: "success" | "error" }>({ message: "", visible: false, type: "success" });
  const [bottomToast, setBottomToast] = useState<{ message: string; visible: boolean; type: "success" | "error" }>({ message: "", visible: false, type: "success" });

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });

  // Estados independientes para mostrar/ocultar cada contraseña
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Función auxiliar para mostrar el toast centrado debajo de 'Información personal'
  const showTemporaryMessage = (type: "success" | "error", text: string, position: "top" | "bottom" = "bottom") => {
    if (position === "top") {
      setTopToast({ message: text, visible: true, type });
      setTimeout(() => setTopToast((prev) => ({ ...prev, visible: false })), 3500);
    } else {
      setBottomToast({ message: text, visible: true, type });
      setTimeout(() => setBottomToast((prev) => ({ ...prev, visible: false })), 3500);
    }
  };

  // Cargar perfil usando el cliente Axios modular
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);

        const user = await usersApi.getProfile();

        setName(user.name);
        setEmail(user.email);
        setPhone(user.phone || ""); // <-- Cargar teléfono de la respuesta
        setRole(user.role);
        setBackupData({ name: user.name, email: user.email, phone: user.phone || "" });

      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) return;
          const msg = error.response?.data?.message || "Error al cargar la configuración del perfil.";
          showTemporaryMessage("error", msg, "top");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // Obtener las iniciales del nombre para el avatar circular
  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 0 || !parts[0]) return "U";
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  // Guardar datos generales del perfil
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUpdating(true);
      setTopToast((t) => ({ ...t, visible: false }));
      setBottomToast((t) => ({ ...t, visible: false }));
      
      // <-- Se envía el 'phone' hacia el microservicio
      const updatedUser = await usersApi.updateProfile({ name, email, phone });

      setName(updatedUser.name);
      setEmail(updatedUser.email);
      setPhone(updatedUser.phone || "");
      
      setBackupData({ name: updatedUser.name, email: updatedUser.email, phone: updatedUser.phone || "" }); 
      setIsEditing(false); 
      showTemporaryMessage("success", "¡Información de perfil actualizada con éxito!", "top");
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) return;
        const msg = err.response?.data?.message || "Error al actualizar la configuración del perfil.";
        showTemporaryMessage("error", msg, "top");
      } else {
        showTemporaryMessage("error", "Error al actualizar la configuración del perfil.", "top");
      }
    } finally {
      setUpdating(false);
    }
  };

  // Cancelar la edición y restaurar los valores anteriores
  const handleCancelEdit = () => {
    setName(backupData.name);
    setEmail(backupData.email);
    setPhone(backupData.phone); // <-- Restaurar teléfono del backup
    setIsEditing(false);
    setTopToast((t) => ({ ...t, visible: false }));
    setBottomToast((t) => ({ ...t, visible: false }));
  };

  // Actualizar contraseña con validaciones fuertes
  const handleUpdatePassword = async () => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d\W_]{8,}$/;

    if (!passwordRegex.test(passwords.newPass)) {
      showTemporaryMessage(
        "error",
        "La contraseña debe tener al menos 8 caracteres, incluir una letra mayúscula y un número."
      );
      return;
    }

    if (passwords.newPass !== passwords.confirm) {
      showTemporaryMessage("error", "Las nuevas contraseñas no coinciden.");
      return;
    }

    try {
      setUpdating(true);
      setTopToast((t) => ({ ...t, visible: false }));
      setBottomToast((t) => ({ ...t, visible: false }));

      await usersApi.changePassword({ currentPassword: passwords.current, newPassword: passwords.newPass });

      showTemporaryMessage("success", "¡Contraseña cambiada con éxito!");
      setPasswords({ current: "", newPass: "", confirm: "" });
      setShowChangePassword(false);
      setShowCurrent(false);
      setShowNew(false);
      setShowConfirm(false);
    } catch (err) {
        if (err instanceof AxiosError) {
          if (err.response?.status === 401) return;
          const msg = err.response?.data?.message || "Error al restablecer la contraseña de seguridad.";
          showTemporaryMessage("error", msg);
        } else {
          showTemporaryMessage("error", "Error al restablecer la contraseña de seguridad.");
        }
    } finally {
      setUpdating(false);
    }
  };

  const handleSignOut = () => {
    clearAuth();
    router.push("/");
  };

  const inputCls = "w-full px-4 py-2.5 rounded-xl border-2 border-slate-900 focus:outline-none bg-white text-sm transition-all text-black disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-300 disabled:cursor-not-allowed";

  if (loading) {
    return (
      <ProfileLayout>
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="text-center flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 animate-spin" style={{ color: "#D99EBD" }} />
            <p className="text-sm font-medium text-gray-500">Cargando la configuración del perfil...</p>
          </div>
        </div>
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-10 min-h-full bg-slate-50/50">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Toast superior: para mensajes de 'Información personal' */}
          {topToast.visible && (
            <div className="flex justify-center">
              <div className={`pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border transition-all duration-300 animate-koara-modal ${
                topToast.type === "success"
                  ? "bg-gradient-to-br from-white to-[#F6DEEB] text-[#2b5936] border-[#bfe3c7]"
                  : "bg-gradient-to-br from-white to-[#fcecf1] text-[#702d43] border-[#f9ccd9]"
              }`}>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                  topToast.type === "success"
                    ? "bg-[#DCFCE7] border-[#16A34A]/20 text-[#16A34A]"
                    : "bg-[#FCE7F3] border-[#DB2777]/20 text-[#DB2777]"
                }`}>
                  {topToast.type === "success" ? (
                    <CheckCircle2 size={18} />
                  ) : (
                    <AlertTriangle size={18} />
                  )}
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-black">{topToast.message}</span>
              </div>
            </div>
          )}

          {/* Avatar circular mejorado */}
          <div className="flex flex-col items-center justify-center pt-2 space-y-3">
            <div 
              className="w-32 h-32 rounded-full border-4 border-slate-900 flex items-center justify-center shadow-[0_5px_0px_#000000] text-4xl font-black text-slate-900 select-none transition-transform duration-200" 
              style={{ backgroundColor: "#EFAFCB" }}
            >
              {getInitials(name)}
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Cuenta de {name}</p>
          </div>

          {/* ── CARD 1: PERSONAL INFORMATION ── */}
          <form onSubmit={handleUpdateProfile} className="rounded-2xl border-2 border-slate-900 bg-white p-8 space-y-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between">
              <h2 className="text-slate-900" style={{ fontWeight: "700", fontSize: "1.5rem" }}>
                Información personal
              </h2>
              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-slate-900 text-xs font-bold transition-all text-slate-900 shadow-[0_3px_0px_#000000] active:translate-y-0.5 active:shadow-[0_1px_0px_#000000]"
                  style={{ backgroundColor: "#EFAFCB" }}
                >
                  <Edit2 size={14} />
                  Editar perfil
                </button>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-slate-900 font-semibold">Nombre</label>
              <input
                type="text"
                value={name}
                disabled={!isEditing} 
                onChange={(e) => setName(e.target.value)}
                className={inputCls}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-slate-900 font-semibold">Correo electrónico</label>
              <input
                type="email"
                value={email}
                disabled={!isEditing} 
                onChange={(e) => setEmail(e.target.value)}
                className={inputCls}
              />
            </div>

            {/* Field agregado: Teléfono */}
            <div className="space-y-2">
              <label className="text-sm text-slate-900 font-semibold">Teléfono</label>
              <input
                type="text"
                value={phone}
                disabled={!isEditing} 
                onChange={(e) => setPhone(e.target.value)}
                placeholder="No asignado"
                className={inputCls}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-slate-900 font-semibold">Rol</label>
              <div>
                <span className="inline-block px-4 py-1.5 rounded-full text-xs text-slate-900 uppercase font-bold tracking-wide border-2 border-slate-900 shadow-sm" style={{ backgroundColor: "#EFAFCB" }}>
                  {role || "ADMIN/EMPLEADO"}
                </span>
              </div>
            </div>

            {isEditing && (
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex-1 py-3 rounded-full text-sm border-2 border-slate-900 text-slate-900 font-bold bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  <X size={16} />
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 py-3 rounded-full text-slate-900 text-sm font-bold hover:opacity-90 transition-all border-2 border-slate-900 shadow-sm flex items-center justify-center gap-2"
                  style={{ backgroundColor: "#EFAFCB" }}
                >
                  {updating && <Loader2 className="w-4 h-4 animate-spin" />}
                  Guardar cambios
                </button>
              </div>
            )}
          </form>

          {/* Toast inferior: para mensajes de contraseña */}
          {bottomToast.visible && (
            <div className="flex justify-center">
              <div className={`pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border transition-all duration-300 animate-koara-modal ${
                bottomToast.type === "success"
                  ? "bg-gradient-to-br from-white to-[#F6DEEB] text-[#2b5936] border-[#bfe3c7]"
                  : "bg-gradient-to-br from-white to-[#fcecf1] text-[#702d43] border-[#f9ccd9]"
              }`}>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                  bottomToast.type === "success"
                    ? "bg-[#DCFCE7] border-[#16A34A]/20 text-[#16A34A]"
                    : "bg-[#FCE7F3] border-[#DB2777]/20 text-[#DB2777]"
                }`}>
                  {bottomToast.type === "success" ? (
                    <CheckCircle2 size={18} />
                  ) : (
                    <AlertTriangle size={18} />
                  )}
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-black">{bottomToast.message}</span>
              </div>
            </div>
          )}

          {/* ── CARD 2: ACCOUNT CONFIGURATION ── */}
          <div className="rounded-2xl border-2 border-slate-900 bg-white p-8 space-y-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
            <h2 className="text-slate-900" style={{ fontWeight: "700", fontSize: "1.5rem" }}>
              Configuración de la cuenta
            </h2>
            
            {!showChangePassword ? (
              <div className="flex items-center justify-between border-2 border-slate-900 rounded-xl p-4 bg-white">
                <div className="flex items-center gap-3 text-base text-slate-900 font-bold">
                  <KeyRound size={20} className="text-slate-900" />
                  Seguridad
                </div>
                <button
                  type="button"
                  onClick={() => setShowChangePassword(true)}
                  className="px-5 py-2.5 rounded-full text-xs text-slate-900 font-bold hover:opacity-90 transition-all border-2 border-slate-900 shadow-sm"
                  style={{ backgroundColor: "#EFAFCB" }}
                >
                  Cambiar contraseña
                </button>
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                
                {/* Contraseña Actual */}
                <div className="relative w-full">
                  <input
                    type={showCurrent ? "text" : "password"}
                    placeholder="Contraseña actual"
                    value={passwords.current}
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                    className={inputCls}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-700 hover:text-black transition-colors focus:outline-none"
                  >
                    {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Nueva Contraseña */}
                <div className="relative w-full">
                  <input
                    type={showNew ? "text" : "password"}
                    placeholder="Nueva contraseña (mín. 8 caracteres, 1 mayúscula, 1 número)"
                    value={passwords.newPass}
                    onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                    className={inputCls}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-700 hover:text-black transition-colors focus:outline-none"
                  >
                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Confirmar Nueva Contraseña */}
                <div className="relative w-full">
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirmar nueva contraseña"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    className={inputCls}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-700 hover:text-black transition-colors focus:outline-none"
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="flex gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowChangePassword(false);
                      setPasswords({ current: "", newPass: "", confirm: "" });
                    }}
                    className="flex-1 py-3 rounded-full text-sm border-2 border-slate-900 text-slate-900 font-bold bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleUpdatePassword}
                    disabled={updating}
                    className="flex-1 py-3 rounded-full text-sm border-2 border-slate-900 text-slate-900 font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                    style={{ backgroundColor: "#EFAFCB" }}
                  >
                    {updating && <Loader2 className="w-4 h-4 animate-spin" />}
                    Actualizar contraseña
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── BOTÓN 3: SIGN OUT ── */}
          <div className="flex justify-center pt-4">
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full sm:w-80 py-4 rounded-2xl text-slate-900 flex items-center justify-center gap-2 text-base font-bold transition-all border-2 border-slate-900 shadow-[0_6px_0px_#000000] active:translate-y-1 active:shadow-[0_2px_0px_#000000]"
              style={{ backgroundColor: "#EFAFCB" }}
            >
              <LogOut size={18} />
              Cerrar sesión
            </button>
          </div>

        </div>
      </div>
    </ProfileLayout>
  );
}