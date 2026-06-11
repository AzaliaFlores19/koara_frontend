"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Column<T> {
  header: string;
  render: (item: T) => React.ReactNode;
  align?: "left" | "right";
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  itemsPerPage?: number;
}

export function Table<T extends { id: string | number }>({ 
  data, 
  columns, 
  itemsPerPage = 7 
}: TableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [data.length]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="space-y-10 animate-koara-fade">
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
                          {col.render(item)}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-40">
                      <div className="w-12 h-12 rounded-full border-2 border-slate-400 flex items-center justify-center">
                         <span className="text-xl">?</span>
                      </div>
                      <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">No results found</p>
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
        <div className="flex justify-center items-center gap-4">
          <button 
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="koara-pagination-btn !w-12 !h-12 hover:-translate-y-1 transition-transform"
            aria-label="Previous page"
          >
            <ChevronLeft size={22} />
          </button>
          
          <div className="flex items-center gap-2 bg-white/40 p-1.5 rounded-full border-2 border-slate-900">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`w-10 h-10 rounded-full font-black text-sm transition-all ${
                  currentPage === page 
                    ? "bg-[#f4b8d4] text-black border-2 border-slate-900 shadow-[2px_2px_0px_#000] -translate-y-0.5" 
                    : "hover:bg-white text-slate-500"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button 
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="koara-pagination-btn !w-12 !h-12 hover:-translate-y-1 transition-transform"
            aria-label="Next page"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      )}
    </div>
  );
}
