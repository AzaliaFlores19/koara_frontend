"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login");
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50">
      <Loader2 className="w-10 h-10 animate-spin" style={{ color: "#D99EBD" }} />
      <p className="mt-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Verificando credenciales...</p>
    </div>
  );
}
