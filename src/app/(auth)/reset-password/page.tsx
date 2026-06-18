"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
} from "lucide-react";
import koaraLogo from "@/imports/logo_insta_2.jpg";
import { authApi } from "@/services/auth.service";

const C = {
  bg: "#F6DEEB",
  primary: "#F4B8D4",
  dark: "#D99EBD",
};

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    token ? null : "El enlace de recuperación no contiene un token válido.",
  );
  const [success, setSuccess] = useState(false);

  const inputCls =
    "w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-800 transition-all placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-[#F4B8D4]/35";

  const clearValidationMessage = (event: FormEvent<HTMLInputElement>) => {
    event.currentTarget.setCustomValidity("");
  };

  const validatePassword = () => {
    if (!token) {
      setError("El enlace de recuperación no contiene un token válido.");
      return false;
    }

    if (password.length < 8) {
      setError("La nueva contraseña debe tener al menos 8 caracteres.");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!validatePassword()) return;

    try {
      setLoading(true);
      await authApi.resetPassword(token, password);
      setSuccess(true);
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "No se pudo restablecer la contraseña. Verifica el enlace e intenta nuevamente.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center p-4 sm:p-6"
      style={{ backgroundColor: C.bg }}
    >
      <div className="w-full max-w-4xl overflow-hidden rounded-[2rem] bg-white shadow-2xl">
        <div className="flex min-h-[620px] flex-col md:flex-row">
          <aside
            className="relative hidden overflow-hidden p-12 text-center text-white md:flex md:w-1/2 md:flex-col md:items-center md:justify-center"
            style={{
              background: `linear-gradient(135deg, ${C.dark}, ${C.primary}, ${C.bg})`,
            }}
          >
            <svg
              className="pointer-events-none absolute right-0 top-0 h-full w-12"
              viewBox="0 0 100 800"
              preserveAspectRatio="none"
            >
              <path
                d="M100,0 L100,800 L0,800 Q20,780 15,760 Q10,740 25,720 Q40,700 20,680 Q0,660 15,640 Q30,620 10,600 Q-10,580 20,560 Q50,540 25,520 Q0,500 20,480 Q40,460 15,440 Q-10,420 25,400 Q60,380 30,360 Q0,340 25,320 Q50,300 20,280 Q-10,260 30,240 Q70,220 35,200 Q0,180 25,160 Q50,140 15,120 Q-20,100 30,80 Q80,60 40,40 Q0,20 20,0 Z"
                fill="white"
              />
            </svg>

            <div className="absolute left-10 top-10 h-28 w-28 rounded-full border-2 border-white/30" />
            <div className="absolute bottom-10 right-10 h-36 w-36 rounded-full border-2 border-white/20" />
            <div className="absolute left-1/3 top-1/3 h-16 w-16 rounded-full bg-white/10" />

            <div className="relative z-10 flex max-w-xs flex-col items-center">
              <div className="mb-6 h-28 w-28 flex-shrink-0 overflow-hidden rounded-full border-4 border-white/40 bg-white shadow-lg">
                <Image
                  src={koaraLogo}
                  alt="Koara"
                  width={112}
                  height={112}
                  className="h-full w-full object-cover"
                />
              </div>
              <h1 className="mb-2 text-4xl font-extrabold drop-shadow-sm">
                Bienvenido a
              </h1>
              <h2 className="mb-5 text-5xl font-extrabold drop-shadow-sm">
                Koara
              </h2>
              <p className="text-center text-sm font-medium leading-relaxed text-white/90">
                Protege tu cuenta y continúa gestionando tu negocio con una experiencia segura, elegante y sencilla.
              </p>
            </div>
          </aside>

          <main className="flex w-full flex-col justify-center bg-white p-8 sm:p-12 md:w-1/2">
            <div className="mb-6 flex justify-center md:hidden">
              <div
                className="h-20 w-20 overflow-hidden rounded-full shadow-lg"
                style={{ border: `3px solid ${C.primary}` }}
              >
                <Image
                  src={koaraLogo}
                  alt="Koara"
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.push("/login")}
              className="mb-5 inline-flex w-fit items-center gap-2 text-xs font-semibold transition-colors hover:opacity-70"
              style={{ color: C.dark }}
              disabled={loading}
            >
              <ArrowLeft size={14} />
              Regresar a inicio de sesión
            </button>

            <div className="mb-7">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F6DEEB] text-[#9A5D7C]">
                <LockKeyhole size={23} />
              </div>
              <h1 className="font-serif text-4xl font-semibold leading-tight text-gray-900">
                Restablecer contraseña
              </h1>
              <p className="mt-2 text-sm font-medium leading-relaxed text-gray-400">
                Ingresa tu nueva contraseña dos veces para confirmar que no haya errores de escritura.
              </p>
            </div>

            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-600">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success ? (
              <div className="py-3 text-center">
                <div
                  className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full text-white shadow-sm"
                  style={{
                    background: `linear-gradient(135deg, ${C.primary}, ${C.dark})`,
                  }}
                >
                  <CheckCircle2 size={32} />
                </div>
                <h2 className="mb-2 text-2xl font-extrabold text-gray-800">
                  Contraseña actualizada
                </h2>
                <p className="mx-auto mb-6 max-w-xs text-sm font-medium text-gray-400">
                  Tu contraseña fue restablecida correctamente. Ya puedes iniciar sesión con tus nuevas credenciales.
                </p>
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="w-full rounded-full px-4 py-3 text-sm font-semibold text-white transition-all hover:shadow-md hover:opacity-95 active:scale-[0.99]"
                  style={{
                    background: `linear-gradient(to right, ${C.primary}, ${C.dark})`,
                  }}
                >
                  Ir a inicio de sesión
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Nueva contraseña
                  </label>
                  <div className="relative">
                    <KeyRound
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      onInvalid={(event) =>
                        event.currentTarget.setCustomValidity(
                          "Por favor, ingresa tu nueva contraseña.",
                        )
                      }
                      onInput={clearValidationMessage}
                      className={`${inputCls} px-10 pr-11`}
                      placeholder="Ingresa tu nueva contraseña"
                      disabled={loading || !token}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                      disabled={loading || !token}
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Confirmar contraseña
                  </label>
                  <div className="relative">
                    <KeyRound
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
                    />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      onInvalid={(event) =>
                        event.currentTarget.setCustomValidity(
                          "Por favor, confirma tu nueva contraseña.",
                        )
                      }
                      onInput={clearValidationMessage}
                      className={`${inputCls} px-10 pr-11`}
                      placeholder="Repite tu nueva contraseña"
                      disabled={loading || !token}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((current) => !current)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                      disabled={loading || !token}
                      aria-label={
                        showConfirmPassword ? "Ocultar confirmación" : "Mostrar confirmación"
                      }
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="grid gap-3 pt-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => router.push("/login")}
                    className="rounded-full bg-[#F6DEEB] px-4 py-3 text-sm font-semibold text-[#A06B86] transition-all hover:bg-[#F4D1E4] active:scale-[0.99]"
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !token}
                    className="rounded-full px-4 py-3 text-sm font-semibold text-white transition-all hover:shadow-md hover:opacity-95 active:scale-[0.99] disabled:opacity-50"
                    style={{
                      background: `linear-gradient(to right, ${C.primary}, ${C.dark})`,
                    }}
                  >
                    {loading ? (
                      <span className="mx-auto block h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    ) : (
                      "Guardar"
                    )}
                  </button>
                </div>
              </form>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  );
}
