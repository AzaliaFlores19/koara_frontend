"use client";

interface DateRangePickerProps {
  start: string;
  end: string;
  onChange: (range: { start: string; end: string }) => void;
  className?: string;
}

export function DateRangePicker({ start, end, onChange, className = "" }: DateRangePickerProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex-1">
        <input
          type="date"
          value={start}
          onChange={(e) => onChange({ start: e.target.value, end })}
          className="w-full bg-white border-2 border-slate-900 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all focus:outline-none"
        />
      </div>

      <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest shrink-0">to</span>

      <div className="relative flex-1">
        <input
          type="date"
          value={end}
          onChange={(e) => onChange({ start, end: e.target.value })}
          className="w-full bg-white border-2 border-slate-900 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all focus:outline-none"
        />
      </div>
    </div>
  );
}
