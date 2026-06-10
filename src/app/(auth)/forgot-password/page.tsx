"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import koaraLogo from "@/imports/logo_insta_2.jpg";
import { authApi } from "@/lib/api/auth"; 
import { ArrowLeft, AlertCircle } from "lucide-react";

const C = {
  bg: "#F6DEEB",
  primary: "#F4B8D4",
  dark: "#D99EBD",
};

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Ejecuta la petición POST mediante Axios al backend de Nest.js
      await authApi.forgotPassword(email);
      
      // 2. Si la respuesta es exitosa, alterna al estado de confirmación
      setEmailSent(true);
    } catch (err: any) {
      console.error("Forgot password API error:", err);
      
      setError(
        err?.response?.data?.message || 
        "Failed to send recovery link. Please verify your connection or try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none transition-all bg-gray-50/50 text-gray-800 text-sm";

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-6"
      style={{ backgroundColor: C.bg }}
    >
      <div className="w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row" style={{ minHeight: "620px" }}>
          
          {/* ── LEFT: Gradient panel ── */}
          <div
            className="hidden md:flex md:w-1/2 flex-col items-center justify-center p-12 relative text-white text-center overflow-hidden md:order-1"
            style={{ background: `linear-gradient(135deg, ${C.dark}, ${C.primary}, ${C.bg})` }}
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
                />
              </div>
              <h1 className="text-4xl mb-2 drop-shadow-sm" style={{ fontWeight: 800 }}>
                Welcome to
              </h1>
              <h2 className="text-5xl mb-5 drop-shadow-sm" style={{ fontWeight: 800 }}>
                Koara
              </h2>
              <p className="text-sm text-white/90 leading-relaxed" style={{ fontWeight: 500 }}>
                Your premium skincare management solution. Streamline your business with elegant tools designed for success.
              </p>
            </div>
          </div>

          {/* ── RIGHT: Form Container ── */}
          <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center bg-white md:order-2">
            
            {/* Mobile logo */}
            <div className="md:hidden flex justify-center mb-6">
              <div
                className="w-20 h-20 rounded-full overflow-hidden shadow-lg"
                style={{ border: `3px solid ${C.primary}` }}
              >
                <Image src={koaraLogo} alt="Koara" width={80} height={80} className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Back to Login Anchor */}
            <div className="mb-4">
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="inline-flex items-center gap-2 text-xs hover:opacity-70 transition-colors font-semibold"
                style={{ color: C.dark }}
                disabled={loading}
              >
                <ArrowLeft size={14} />
                Back to Log In
              </button>
            </div>

            {/* Bloque Alerta de Errores de API */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {!emailSent ? (
              <>
                <div className="mb-7">
                  <h2 className="text-3xl mb-1.5 text-gray-800" style={{ fontWeight: 800 }}>
                    Forgot Password?
                  </h2>
                  <p className="text-gray-400 text-sm" style={{ fontWeight: 500 }}>
                    Enter your email address to receive a recovery reset link.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>
                      E-mail Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputCls}
                      placeholder="name@example.com"
                      disabled={loading}
                      required
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 px-4 rounded-xl text-white text-sm transition-all hover:shadow-md hover:opacity-95 active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 font-semibold"
                      style={{ background: `linear-gradient(to right, ${C.primary}, ${C.dark})` }}
                    >
                      {loading ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        "Send Reset Link"
                      )}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="mb-6 flex justify-center">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white shadow-sm"
                    style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.dark})` }}
                  >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                
                <h2 className="text-3xl mb-2 text-gray-800" style={{ fontWeight: 800 }}>
                  Check Your Email
                </h2>
                <p className="text-gray-400 text-sm max-w-xs mx-auto mb-6" style={{ fontWeight: 500 }}>
                  We have sent a confirmation recovery link to <span className="text-gray-700 font-semibold break-all">{email}</span>.
                </p>

                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="w-full py-3 px-4 rounded-xl text-white text-sm transition-all hover:shadow-md hover:opacity-95 active:scale-[0.99] font-semibold"
                  style={{ background: `linear-gradient(to right, ${C.primary}, ${C.dark})` }}
                >
                  Return to Log In
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
