"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * Devuelve la lista de páginas a mostrar, insertando "..." cuando hay
 * demasiadas páginas. Siempre incluye la primera y la última página, y
 * un rango alrededor de la página actual.
 */
function getPageItems(currentPage: number, totalPages: number): (number | "...")[] {
  const siblings = 1; // páginas a cada lado de la actual
  const totalNumbers = siblings * 2 + 5; // primera + última + actual + 2 vecinos + 2 puntos

  if (totalPages <= totalNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(currentPage - siblings, 1);
  const rightSibling = Math.min(currentPage + siblings, totalPages);

  const showLeftDots = leftSibling > 2;
  const showRightDots = rightSibling < totalPages - 1;

  const items: (number | "...")[] = [];

  if (!showLeftDots && showRightDots) {
    const leftRange = 3 + siblings * 2;
    for (let i = 1; i <= leftRange; i++) items.push(i);
    items.push("...", totalPages);
  } else if (showLeftDots && !showRightDots) {
    items.push(1, "...");
    const rightRange = 3 + siblings * 2;
    for (let i = totalPages - rightRange + 1; i <= totalPages; i++) items.push(i);
  } else {
    items.push(1, "...");
    for (let i = leftSibling; i <= rightSibling; i++) items.push(i);
    items.push("...", totalPages);
  }

  return items;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pageItems = getPageItems(currentPage, totalPages);

  return (
    <div className="flex items-center justify-center gap-2 py-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-30 hover:bg-gray-100 transition-colors"
      >
        <ChevronLeft size={16} />
      </button>

      {pageItems.map((page, index) =>
        page === "..." ? (
          <span
            key={`dots-${index}`}
            className="w-9 h-9 flex items-center justify-center text-sm text-gray-400 select-none"
          >
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              page === currentPage
                ? "bg-koara-primary text-black"
                : "border border-black text-black hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-9 h-9 rounded-full border border-black flex items-center justify-center disabled:opacity-30 hover:bg-gray-100 transition-colors"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
