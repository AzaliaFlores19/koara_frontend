"use client";

import type { ReactNode } from "react";
import { CartProvider } from "@/lib/cart-context";

export default function DashboardGroupLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <CartProvider>{children}</CartProvider>;
}
