"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getAuth, isAdmin } from "@/lib/api/auth.api";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    setAuthorized(false);

    const publicRoutes = ["/", "/login", "/forgot-password", "/reset-password"];
    const protectedRoutes = ["/profile", "/dashboard", "/products", "/users", "/clients", "/invoices", "/cai-management", "/reports", "/audit-logs", "/branding"];
    const adminRoutes = ["/users", "/cai-management", "/reports", "/audit-logs", "/branding"];

    const isPublic = publicRoutes.some(route => pathname === route);
    const isProtected = protectedRoutes.some(route => pathname.startsWith(route));
    const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

    const auth = getAuth();
    const token = auth?.token;

    if (!token) {
      if (isPublic) {
        setAuthorized(true);
      } else {
        setAuthorized(false);
        router.push("/login");
      }
      return;
    }

    if (isAdminRoute && !isAdmin()) {
      setAuthorized(false);
      router.push("/login");
      return;
    }

    if (!isProtected && !isPublic) {
      setAuthorized(false);
      router.push("/login");
      return;
    }

    setAuthorized(true);
  }, [pathname, router]);

  // Mientras el sistema verifica el JWT, mostramos una pantalla de carga limpia
  // Esto evita el molesto "parpadeo" donde la página protegida se ve por un segundo antes de redirigir
  if (!authorized) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-slate-900" style={{ color: "#D99EBD" }} />
        <p className="mt-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Verificando credenciales...</p>
      </div>
    );
  }

  return <>{children}</>;
}