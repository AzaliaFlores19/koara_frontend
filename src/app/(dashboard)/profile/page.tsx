"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, LogOut, Loader2, Eye, EyeOff, Edit2, X } from "lucide-react";
import { authApi } from "@/lib/api/auth"; 
import ProfileLayout from "@/components/layout/layout";

export default function ProfilePage() {
  const router = useRouter();

  // Estados de datos de usuario
  const [name, setName] = useState("User");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("EMPLOYEE");
  
  // Estado para controlar el modo de edición de la información personal
  const [isEditing, setIsEditing] = useState(false);
  // Guardar copia de seguridad por si el usuario cancela la edición
  const [backupData, setBackupData] = useState({ name: "", email: "" });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });

  // Estados independientes para mostrar/ocultar cada contraseña
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Función auxiliar para desaparecer los mensajes después de 3 segundos
  const showTemporaryMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  // Cargar perfil usando el cliente Axios modular
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const user = await authApi.getProfile();
        setName(user.name);
        setEmail(user.email);
        setRole(user.role);
        setBackupData({ name: user.name, email: user.email });
      } catch (error) {
        console.error("Error loading profile via Axios:", error);
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
      setMessage(null);
      
      // Simulado por el interceptor Axios
      await new Promise((resolve) => setTimeout(resolve, 600)); 
      
      setBackupData({ name, email }); 
      setIsEditing(false); 
      showTemporaryMessage("success", "Profile information updated successfully!");
    } catch (err) {
      showTemporaryMessage("error", "Failed to update profile settings.");
    } finally {
      setUpdating(false);
    }
  };

  // Cancelar la edición y restaurar los valores anteriores
  const handleCancelEdit = () => {
    setName(backupData.name);
    setEmail(backupData.email);
    setIsEditing(false);
    setMessage(null);
  };

  // Actualizar contraseña con validaciones fuertes
  const handleUpdatePassword = async () => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d\W_]{8,}$/;

    if (!passwordRegex.test(passwords.newPass)) {
      showTemporaryMessage(
        "error", 
        "Password must be at least 8 characters long, include at least one uppercase letter, and one number."
      );
      return;
    }

    if (passwords.newPass !== passwords.confirm) {
      showTemporaryMessage("error", "New passwords do not match.");
      return;
    }

    try {
      setUpdating(true);
      setMessage(null);

      // Simula el cambio vía Axios
      await new Promise((resolve) => setTimeout(resolve, 800));

      showTemporaryMessage("success", "Password changed successfully!");
      setPasswords({ current: "", newPass: "", confirm: "" });
      setShowChangePassword(false);
      setShowCurrent(false);
      setShowNew(false);
      setShowConfirm(false);
    } catch (err) {
      showTemporaryMessage("error", "Error resetting account security password.");
    } finally {
      setUpdating(false);
    }
  };

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("koara_token");
    }
    router.push("/");
  };

  const inputCls = "w-full px-4 py-2.5 rounded-xl border-2 border-slate-900 focus:outline-none bg-white text-sm transition-all text-black disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-300 disabled:cursor-not-allowed";

  if (loading) {
    return (
      <ProfileLayout>
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="text-center flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 animate-spin" style={{ color: "#D99EBD" }} />
            <p className="text-sm font-medium text-gray-500">Loading profile configurations...</p>
          </div>
        </div>
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-10 min-h-full bg-slate-50/50">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Mensajes de feedback integrados en el flujo (ya no flotan en el header) */}
          {message && (
            <div className={`p-4 rounded-xl text-sm font-medium border shadow-sm transition-all animate-in fade-in duration-300 ${
              message.type === "success" ? "bg-green-50 text-green-800 border-green-200" : "bg-red-50 text-red-800 border-red-200"
            }`}>
              {message.text}
            </div>
          )}

          {/* Avatar circular mejorado (Más grande: w-32 h-32) */}
          <div className="flex flex-col items-center justify-center pt-2 space-y-3">
            <div 
              className="w-32 h-32 rounded-full border-4 border-slate-900 flex items-center justify-center shadow-[0_5px_0px_#000000] text-4xl font-black text-slate-900 select-none transition-transform duration-200" 
              style={{ backgroundColor: "#EFAFCB" }}
            >
              {getInitials(name)}
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Koara Account</p>
          </div>

          {/* ── CARD 1: PERSONAL INFORMATION ── */}
          <form onSubmit={handleUpdateProfile} className="rounded-2xl border-2 border-slate-900 bg-white p-8 space-y-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between">
              <h2 className="text-slate-900" style={{ fontWeight: "700", fontSize: "1.5rem" }}>
                Personal Information
              </h2>
              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-slate-900 text-xs font-bold transition-all text-slate-900 shadow-[0_3px_0px_#000000] active:translate-y-0.5 active:shadow-[0_1px_0px_#000000]"
                  style={{ backgroundColor: "#EFAFCB" }}
                >
                  <Edit2 size={14} />
                  Edit Profile
                </button>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-slate-900 font-semibold">Name</label>
              <input
                type="text"
                value={name}
                disabled={!isEditing} 
                onChange={(e) => setName(e.target.value)}
                className={inputCls}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-slate-900 font-semibold">Email</label>
              <input
                type="email"
                value={email}
                disabled={!isEditing} 
                onChange={(e) => setEmail(e.target.value)}
                className={inputCls}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-slate-900 font-semibold">Rol</label>
              <div>
                <span className="inline-block px-4 py-1.5 rounded-full text-xs text-slate-900 uppercase font-bold tracking-wide border-2 border-slate-900 shadow-sm" style={{ backgroundColor: "#EFAFCB" }}>
                  {role || "ADMIN/EMPLOYEE"}
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
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 py-3 rounded-full text-slate-900 text-sm font-bold hover:opacity-90 transition-all border-2 border-slate-900 shadow-sm flex items-center justify-center gap-2"
                  style={{ backgroundColor: "#EFAFCB" }}
                >
                  {updating && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Changes
                </button>
              </div>
            )}
          </form>

          {/* ── CARD 2: ACCOUNT CONFIGURATION ── */}
          <div className="rounded-2xl border-2 border-slate-900 bg-white p-8 space-y-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
            <h2 className="text-slate-900" style={{ fontWeight: "700", fontSize: "1.5rem" }}>
              Account Configuration
            </h2>
            
            {!showChangePassword ? (
              <div className="flex items-center justify-between border-2 border-slate-900 rounded-xl p-4 bg-white">
                <div className="flex items-center gap-3 text-base text-slate-900 font-bold">
                  <KeyRound size={20} className="text-slate-900" />
                  Security
                </div>
                <button
                  type="button"
                  onClick={() => setShowChangePassword(true)}
                  className="px-5 py-2.5 rounded-full text-xs text-slate-900 font-bold hover:opacity-90 transition-all border-2 border-slate-900 shadow-sm"
                  style={{ backgroundColor: "#EFAFCB" }}
                >
                  Change Password
                </button>
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                
                {/* Contraseña Actual */}
                <div className="relative w-full">
                  <input
                    type={showCurrent ? "text" : "password"}
                    placeholder="Current password"
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
                    placeholder="New password (Min 8 chars, 1 uppercase, 1 number)"
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
                    placeholder="Confirm new password"
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
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleUpdatePassword}
                    disabled={updating}
                    className="flex-1 py-3 rounded-full text-sm border-2 border-slate-900 text-slate-900 font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                    style={{ backgroundColor: "#EFAFCB" }}
                  >
                    {updating && <Loader2 className="w-4 h-4 animate-spin" />}
                    Update Password
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
              Sign Out
            </button>
          </div>

        </div>
      </div>
    </ProfileLayout>
  );
}