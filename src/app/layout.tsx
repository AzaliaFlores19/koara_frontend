
import "@/styles/index.css";
import AuthGuard from "@/components/auth/auth-guard";
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
      <body className="no-scrollbar antialiased bg-koara-bg" suppressHydrationWarning>
        <AuthGuard>
          {children}
        </AuthGuard>
      </body>
    </html>
  );
}




// <html lang="es">
//       <body className="antialiased">
//         {/* El Guard vigilará de forma global toda la navegación */}
//         <AuthGuard>
//           {children}
//         </AuthGuard>
//       </body>
//     </html>
//   );