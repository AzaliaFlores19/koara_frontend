"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface DropdownProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  className?: string;
}

export function Dropdown({
  value,
  options,
  onChange,
  className = "",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 bg-white border-2 border-slate-900 rounded-full px-6 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all active:scale-[0.98]"
      >
        <span>{value}</span>
        <ChevronDown
          className={`text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          size={16}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-[70] animate-koara-modal">
          <div className="bg-gradient-to-br from-white to-[#F6DEEB] border-2 border-slate-900 rounded-2xl shadow-xl overflow-hidden py-2">
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-6 py-2.5 text-sm font-bold transition-colors ${
                  value === opt
                    ? "bg-[#f7cde1]/60 text-black"
                    : "text-slate-600 hover:bg-white/60 hover:text-black"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
