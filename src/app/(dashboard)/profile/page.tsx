"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, LogOut, Loader2 } from "lucide-react";
import { authApi } from "@/lib/api/auth"; 
import ProfileLayout from "@/components/layout/layout";

export default function ProfilePage() {
  const router = useRouter();

  const [name, setName] = useState("User");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("EMPLOYEE");
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });

  // Cargar perfil usando el cliente Axios modular
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const user = await authApi.getProfile();
        setName(user.name);
        setEmail(user.email);
        setRole(user.role);
      } catch (error) {
        console.error("Error loading profile via Axios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // Guardar datos generales del perfil
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUpdating(true);
      setMessage(null);
      
      // Simulado por el interceptor Axios que armamos
      // Reemplazar por authApi.updateProfile({ name, email }) cuando el backend exista
      await new Promise((resolve) => setTimeout(resolve, 600)); 
      
      setMessage({ type: "success", text: "Profile information updated successfully!" });
    } catch (err) {
      setMessage({ type: "error", text: "Failed to update profile settings." });
    } finally {
      setUpdating(false);
    }
  };

  // Actualizar contraseña
  const handleUpdatePassword = async () => {
    if (passwords.newPass !== passwords.confirm) {
      setMessage({ type: "error", text: "New passwords do not match." });
      return;
    }
    try {
      setUpdating(true);
      setMessage(null);

      // Simula el cambio vía Axios
      await new Promise((resolve) => setTimeout(resolve, 800));

      setMessage({ type: "success", text: "Password changed successfully!" });
      setPasswords({ current: "", newPass: "", confirm: "" });
      setShowChangePassword(false);
    } catch (err) {
      setMessage({ type: "error", text: "Error resetting account security password." });
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

  const inputCls = "w-full px-4 py-2.5 rounded-xl border-2 border-slate-900 focus:outline-none bg-white text-sm transition-colors text-black";

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
          
          {/* Mensajes de feedback */}
          {message && (
            <div className={`p-4 rounded-xl text-sm font-medium border ${
              message.type === "success" ? "bg-green-50 text-green-800 border-green-200" : "bg-red-50 text-red-800 border-red-200"
            }`}>
              {message.text}
            </div>
          )}

          {/* ── CARD 1: PERSONAL INFORMATION ── */}
          <form onSubmit={handleUpdateProfile} className="rounded-2xl border-2 border-slate-900 bg-white p-8 space-y-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
            <h2 className="text-slate-900" style={{ fontWeight: "700", fontSize: "1.5rem" }}>
              Personal Information
            </h2>
            
            <div className="space-y-2">
              <label className="text-sm text-slate-900 font-semibold">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputCls}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-slate-900 font-semibold">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputCls}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-slate-900 font-semibold">Rol</label>
              <div>
                <span className="inline-block px-4 py-1.5 rounded-full text-xs text-white uppercase font-bold tracking-wide" style={{ backgroundColor: "#EFAFCB" }}>
                  {role || "ADMIN/EMPLOYEE"}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={updating}
              className="w-full py-3 rounded-full text-slate-900 text-sm font-bold hover:opacity-90 transition-all border-2 border-slate-900 shadow-sm flex items-center justify-center gap-2"
              style={{ backgroundColor: "#EFAFCB" }}
            >
              {updating && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Changes
            </button>
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
                  className="px-5 py-2.5 rounded-full text-xs text-white font-bold hover:opacity-90 transition-all border-2 border-slate-900 shadow-sm"
                  style={{ backgroundColor: "#EFAFCB" }}
                >
                  Change Password
                </button>
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                <input
                  type="password"
                  placeholder="Current password"
                  value={passwords.current}
                  onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                  className={inputCls}
                />
                <input
                  type="password"
                  placeholder="New password"
                  value={passwords.newPass}
                  onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                  className={inputCls}
                />
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  className={inputCls}
                />
                <div className="flex gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowChangePassword(false)}
                    className="flex-1 py-3 rounded-full text-sm border-2 border-slate-900 text-slate-900 font-bold bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleUpdatePassword}
                    disabled={updating}
                    className="flex-1 py-3 rounded-full text-sm border-2 border-slate-900 text-white font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                    style={{ backgroundColor: "#EFAFCB" }}
                  >
                    {updating && <Loader2 className="w-4 h-4 animate-spin" />}
                    Update Password
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── BOTÓN 3: SIGN OUT DESPLEGADO COMO LA IMAGEN ── */}
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
