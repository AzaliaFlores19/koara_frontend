
import "@/styles/index.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Koara Management System",
  description: "Internal back-office solution",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      {/* Le agregamos la clase 'bg-koara-bg' directamente al body 
        para que toda la aplicación use tu rosa pastel de fondo por defecto 
      */}
      <body className="no-scrollbar antialiased bg-koara-bg">
        {children}
      </body>
    </html>
  );
}