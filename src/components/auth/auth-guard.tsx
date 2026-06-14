"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // 1. Define aquí las rutas de tu sistema Koara que requieren token JWT
    const protectedRoutes = ["/profile", "/dashboard", "/inventory", "/users", "/clients", "/invoices", "/cai-management", "/reports", "/audit-logs", "/branding"];
    
    // Comprobar si la ruta actual es una de las protegidas
    const isProtected = protectedRoutes.some(route => pathname.startsWith(route));
    
    // 2. Intentar leer el JWT desde el localStorage
    // (Asegúrate de que 'token' coincida con el nombre que usas al iniciar sesión)
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null; 

    if (isProtected && !token) {
      // Si la ruta es privada y no hay JWT, bloqueamos el acceso y expulsamos al Login
      setAuthorized(false);
      router.push("/"); 
    } else {
      // Si la ruta es pública (como el login) o si hay un JWT válido, permitimos la entrada
      setAuthorized(true);
    }
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