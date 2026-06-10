"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F6DEEB] flex items-center justify-center">
      <p className="text-sm text-gray-500 animate-pulse">Loading Koara System...</p>
    </div>
  );
}