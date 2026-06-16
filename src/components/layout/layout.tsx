"use client"; 

import { useState, useEffect, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation"; 
import { Menu, X, Home, Package, Users, FileText, UserCog, BarChart, Bot, ClipboardList } from "lucide-react";
import koaraLogo from "@/imports/logo_insta_2.jpg"; 
import titleIcon from "@/imports/image-removebg-preview_1-2.png";
import { getAuth, isAdmin as checkIsAdmin } from "@/lib/auth"; 

interface LayoutProps {
  children: ReactNode;
}

const allNavItems = [
  { name: "Inicio", path: "/dashboard", icon: Home, adminOnly: false },
  { name: "Inventario", path: "/products", icon: Package, adminOnly: false },
  { name: "Usuarios", path: "/users", icon: UserCog, adminOnly: true },
  { name: "Clientes", path: "/clients", icon: Users, adminOnly: false },
  { name: "Facturas", path: "/invoices", icon: FileText, adminOnly: false },
  { name: "Gestión de CAI", path: "/cai-management", icon: Bot, adminOnly: true },
  { name: "Reportes", path: "/reports", icon: BarChart, adminOnly: true },      
  { name: "Registros de Auditoría", path: "/audit-logs", icon: ClipboardList, adminOnly: true },
  { name: "Registro de Marca", path: "/branding", icon: Package, adminOnly: true },
];

export default function DashboardLayout({ children }: LayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userData, setUserData] = useState<{ name?: string; email?: string; role?: string } | null>(null);
  
  const router = useRouter(); 
  const pathname = usePathname(); 

  useEffect(() => {
    const auth = getAuth();
    if (auth) {
      setUserData(auth);
    }
  }, [pathname]); 

  const isAdmin = checkIsAdmin();
  const navItems = allNavItems.filter((item) => !item.adminOnly || isAdmin);

  const currentItem = allNavItems.find(item => item.path === pathname);
  const title = currentItem ? currentItem.name : " Mi Perfil";

  return (
    <div className="min-h-screen flex flex-col relative bg-koara-bg">
      {/* Decorative blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute top-20 right-10 w-96 h-96 rounded-full opacity-30 bg-koara-primary blur-3xl" />
        <div className="absolute bottom-20 left-10 w-80 h-80 rounded-full opacity-20 bg-koara-dark blur-3xl" />
      </div>

      <div className="relative flex flex-col min-h-screen" style={{ zIndex: 1 }}>
        {/* Header */}
        <header className="p-4 flex items-center gap-4 sticky top-0 z-50 bg-koara-primary">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="flex items-center gap-2">
            <img src={titleIcon.src} alt="" className="h-7 w-7 object-contain" />
            <span className="text-black" style={{ fontSize: "1.1rem", fontWeight: "600" }}>{title}</span>
          </div>
        </header>

        {/* Sidebar */}
        <div
          className={`fixed top-0 left-0 h-full w-64 transition-transform duration-300 ease-in-out z-40 shadow-2xl ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
          style={{ backgroundColor: "#D99EBD" }}
        >
          <div className="flex flex-col h-full px-4 pt-20 pb-6">
            {/* Profile row */}
            <button
              onClick={() => { router.push("/profile"); setMenuOpen(false); }}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-white/30 transition-all duration-150 mb-5 text-left"
            >
              <div className="w-9 h-9 rounded-full bg-white/40 flex items-center justify-center shrink-0 text-xs shadow" style={{ fontWeight: "700" }}>
                {userData?.name?.slice(0, 2).toUpperCase() ?? "AU"}
              </div>
              <div className="min-w-0">
                <p className="text-black text-sm leading-tight truncate" style={{ fontWeight: "600" }}>{userData?.name ?? "User"}</p>
                <p className="text-black/60 text-xs truncate">{userData?.email ?? ""}</p>
              </div>
            </button>

            {/* Circular logo */}
            <div className="flex justify-center mb-5">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/60 shadow-md bg-white flex items-center justify-center">
                <img src={koaraLogo.src} alt="Koara" className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="h-px bg-white/30 mx-2 mb-4" />

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
              <style>{`nav::-webkit-scrollbar { display: none; }`}</style>
              <ul className="space-y-1">
                {navItems.map(({ name, path, icon: Icon }) => {
                  const active = pathname === path; 
                  return (
                    <li key={path}>
                      <button
                        onClick={() => { router.push(path); setMenuOpen(false); }} 
                        className={`w-full text-left px-4 py-2.5 rounded-xl transition-all duration-150 flex items-center gap-3 ${
                          active ? "bg-white/50 shadow-sm" : "hover:bg-white/25"
                        }`}
                        style={{ color: "#000", fontWeight: active ? "700" : "500", fontSize: "0.875rem" }}
                      >
                        <Icon size={16} className={active ? "opacity-100" : "opacity-70"} />
                        <span>{name}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>

        {/* Overlay */}
        {menuOpen && (
          <div className="fixed inset-0 bg-black/40 z-30" onClick={() => setMenuOpen(false)} />
        )}

        {/* Page content */}
        <main className="flex-1 w-full">
          {children}
        </main>
      </div>
    </div>
  );
}