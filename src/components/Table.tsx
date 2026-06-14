"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2 } from "lucide-react";
import { ConfirmModal } from "./ConfirmModal";
import Pagination from "./inventory/Pagination";

interface TableActionOptions {
  openConfirm: (config: {
    title: string;
    message: string;
    onConfirm: () => void;
  }) => void;
}

interface Column<T> {
  header: string;
  render: (item: T, actions: TableActionOptions) => React.ReactNode;
  align?: "left" | "right";
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  itemsPerPage?: number;
  enableMutationToast?: boolean;
}

export function Table<T extends { id: string | number }>({
  data,
  columns,
  itemsPerPage = 7,
  enableMutationToast = true,
}: TableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [confirmData, setConfirmData] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  const prevLengthRef = useRef(data.length);
  const hasJustDeleted = useRef(false);
  const prevDataMapRef = useRef<Map<string | number, T>>(new Map());
  const seenIdsRef = useRef<Set<string | number>>(new Set());
  const isInitialMount = useRef(true);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  useEffect(() => {
    if (!enableMutationToast) {
      return;
    }

    if (hasJustDeleted.current && data.length < prevLengthRef.current) {
      setToastMessage("Se ha eliminado de manera exitosa!");
    }
    hasJustDeleted.current = false;
    prevLengthRef.current = data.length;

    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [data.length, totalPages, currentPage]);

  useEffect(() => {
    if (isInitialMount.current) {
      data.forEach((item) => seenIdsRef.current.add(item.id));
      const initialMap = new Map<string | number, T>();
      data.forEach((item) => initialMap.set(item.id, item));
      prevDataMapRef.current = initialMap;
      isInitialMount.current = false;
      return;
    }

    let hasAddition = false;
    let hasEdit = false;

    data.forEach((item) => {
      if (!seenIdsRef.current.has(item.id)) {
        hasAddition = true;
        seenIdsRef.current.add(item.id);
      }

      const prevItem = prevDataMapRef.current.get(item.id);
      if (prevItem && prevItem !== item) {
        hasEdit = true;
      }
    });

    if (hasAddition) {
      setToastMessage("Se ha añadido de manera exitosa!");
    } else if (hasEdit) {
      setToastMessage("Se ha editado de manera exitosa!");
    }

    const newMap = new Map<string | number, T>();
    data.forEach((item) => {
      newMap.set(item.id, item);
    });
    prevDataMapRef.current = newMap;
  }, [data, enableMutationToast]);

  useEffect(() => {
    if (!enableMutationToast) {
      return;
    }

    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage, enableMutationToast]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const openConfirm = (data: {
    title: string;
    message: string;
    onConfirm: () => void;
  }) => {
    setConfirmData(data);
  };

  return (
    <div className="space-y-10 animate-koara-fade relative">
      {enableMutationToast && toastMessage &&
        createPortal(
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] animate-koara-modal">
            <div className="bg-gradient-to-br from-white to-[#F6DEEB] border-2 border-slate-200 rounded-2xl px-6 py-3 shadow-xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#DCFCE7] border-2 border-[#16A34A]/20 flex items-center justify-center text-[#16A34A]">
                <CheckCircle2 size={18} />
              </div>
              <span className="font-bold text-xs text-black tracking-tight uppercase">
                {toastMessage}
              </span>
            </div>
          </div>,
          document.body,
        )}

      <ConfirmModal
        isOpen={!!confirmData}
        message={confirmData?.message || ""}
        onConfirm={() => {
          hasJustDeleted.current = true;
          confirmData?.onConfirm();
          setConfirmData(null);
        }}
        onCancel={() => setConfirmData(null)}
      />

      <div className="bg-white rounded-[1.5rem] overflow-hidden shadow-xl transition-all duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f4b8d4]">
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    className={`px-8 py-5 text-sm font-bold text-black border-r border-black/10 last:border-r-0 ${
                      col.align === "right" ? "text-right" : ""
                    }`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedData.length > 0 ? (
                paginatedData.map((item) => (
                  <tr
                    key={item.id}
                    className="group hover:bg-[#F6DEEB]/30 transition-all duration-200"
                  >
                    {columns.map((col, idx) => (
                      <td
                        key={idx}
                        className={`px-8 py-5 border-r border-slate-100 last:border-r-0 transition-transform duration-200 group-hover:translate-x-1 ${
                          col.align === "right" ? "text-right" : ""
                        }`}
                      >
                        <div className="flex items-center">
                          {col.render(item, { openConfirm })}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-20 text-center"
                  >
                    <div className="flex flex-col items-center gap-2 opacity-40">
                      <div className="w-12 h-12 rounded-full border-2 border-slate-400 flex items-center justify-center">
                        <span className="text-xl">?</span>
                      </div>
                      <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                        No results found
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
      )}
    </div>
  );
}
