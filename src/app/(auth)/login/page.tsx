"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import koaraLogo from "@/imports/logo_insta_2.jpg";
import { setAuth } from "@/lib/api/auth.api";
import { authApi } from "@/services/auth.service";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

const C = {
  bg: "#F6DEEB",
  primary: "#F4B8D4",
  dark: "#D99EBD",
};

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = formData.email.trim();
    const password = formData.password.trim();

    if (!email) {
      setError("Por favor, ingresa tu correo electrónico.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Por favor, ingresa un correo electrónico válido.");
      return;
    }

    if (!password) {
      setError("Por favor, ingresa tu contraseña.");
      return;
    }

    setLoading(true);
    setError(null); // Reseteamos el error al intentar de nuevo, pero sin borrar inputs

    try {
      const response = await authApi.login(
        email,
        password
      );

      const { user, access_token } = response;

      setAuth({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: access_token,
      });

      router.push("/dashboard");
    } catch (err: any) {
      // Extrae exactamente el string "Credenciales invalidas" enviado desde NestJS
      const backendMessage = err?.response?.data?.message;
      
      setError(
        backendMessage ||
        "Credenciales de correo electrónico inválidas o pérdida de comunicación con el servidor del sistema."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const inputCls =
    "w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-pink-300 transition-all bg-gray-50/50 text-gray-800 text-sm disabled:opacity-60";

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-6"
      style={{ backgroundColor: C.bg }}
    >
      <div className="w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl overflow-hidden">
        <div
          className="flex flex-col md:flex-row"
          style={{ minHeight: "620px" }}
        >
          {/* ── LEFT: Gradient panel ── */}
          <div
            className="hidden md:flex md:w-1/2 flex-col items-center justify-center p-12 relative text-white text-center overflow-hidden md:order-1"
            style={{
              background: `linear-gradient(135deg, ${C.dark}, ${C.primary}, ${C.bg})`,
            }}
          >
            {/* Wavy edge */}
            <svg
              className="absolute top-0 h-full w-12 pointer-events-none right-0"
              viewBox="0 0 100 800"
              preserveAspectRatio="none"
            >
              <path
                d="M100,0 L100,800 L0,800 Q20,780 15,760 Q10,740 25,720 Q40,700 20,680 Q0,660 15,640 Q30,620 10,600 Q-10,580 20,560 Q50,540 25,520 Q0,500 20,480 Q40,460 15,440 Q-10,420 25,400 Q60,380 30,360 Q0,340 25,320 Q50,300 20,280 Q-10,260 30,240 Q70,220 35,200 Q0,180 25,160 Q50,140 15,120 Q-20,100 30,80 Q80,60 40,40 Q0,20 20,0 Z"
                fill="white"
              />
            </svg>

            {/* Decorative circles */}
            <div className="absolute top-10 left-10 w-28 h-28 rounded-full border-2 border-white/30" />
            <div className="absolute bottom-10 right-10 w-36 h-36 rounded-full border-2 border-white/20" />
            <div className="absolute top-1/3 left-1/3 w-16 h-16 rounded-full bg-white/10" />

            <div className="relative z-10 flex flex-col items-center max-w-xs">
              <div className="mb-6 w-28 h-28 rounded-full overflow-hidden border-4 border-white/40 shadow-lg bg-white flex-shrink-0">
                <Image
                  src={koaraLogo}
                  alt="Koara"
                  width={112}
                  height={112}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              <h1 className="text-4xl mb-2 drop-shadow-sm font-extrabold">
                Bienvenido a 
              </h1>
              <h2 className="text-5xl mb-5 drop-shadow-sm font-extrabold">
                Koara
              </h2>
              <p className="text-sm text-white/90 leading-relaxed font-medium">
                La solución premium para la gestión de tu negocio de cuidado de la piel. 
                Simplifica tu gestión con herramientas elegantes diseñadas para alcanzar el éxito.
              </p>
            </div>
          </div>

          {/* ── RIGHT: Form ── */}
          <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center bg-white md:order-2">
            {/* Mobile logo layout */}
            <div className="md:hidden flex justify-center mb-6">
              <div
                className="w-20 h-20 rounded-full overflow-hidden shadow-lg"
                style={{ border: `3px solid ${C.primary}` }}
              >
                <Image
                  src={koaraLogo}
                  alt="Koara"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="mb-7">
              <h2 className="text-3xl mb-1.5 text-gray-800 font-extrabold">
                Iniciar Sesión 
              </h2>
              <p className="text-gray-400 text-sm font-medium">
                ¡Bienvenido de vuelta! Por favor, ingresa tus datos.
              </p>
            </div>

            {/* Error Notification Block */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium flex items-center gap-2 animate-fadeIn transition-all">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="block text-xs text-gray-500 uppercase tracking-wider font-semibold">
                    Dirección de Correo Electrónico
                  </label>
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`${inputCls} ${error ? 'border-red-300 focus:border-red-400 bg-red-50/10' : ''}`}
                  placeholder="admin@koara.com"
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs text-gray-500 uppercase tracking-wider font-semibold">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`${inputCls} pr-11 ${error ? 'border-red-300 focus:border-red-400 bg-red-50/10' : ''}`}
                    placeholder="••••••••"
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => router.push("/forgot-password")}
                  className="text-xs hover:opacity-70 transition-colors font-semibold"
                  style={{ color: C.dark }}
                  disabled={loading}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              <div className="flex flex-col gap-2.5 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl text-white text-sm transition-all hover:shadow-md hover:opacity-95 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 font-semibold"
                  style={{
                    background: `linear-gradient(to right, ${C.primary}, ${C.dark})`,
                  }}
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Iniciar sesión"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
