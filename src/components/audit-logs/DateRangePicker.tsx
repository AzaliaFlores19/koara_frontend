"use client";

interface DateRangePickerProps {
  start: string;
  end: string;
  onChange: (range: { start: string; end: string }) => void;
  className?: string;
}

export function DateRangePicker({ start, end, onChange, className = "" }: DateRangePickerProps) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <div className="relative group">
        <input
          type="date"
          value={start}
          onChange={(e) => onChange({ start: e.target.value, end })}
          className="bg-white border-2 border-slate-900 rounded-full pl-11 pr-6 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all focus:ring-2 focus:ring-[#f4b8d4]/20 focus:border-[#f4b8d4] outline-none active:scale-[0.98]"
        />
      </div>

      <span className="text-slate-400 font-black text-xs uppercase tracking-widest">to</span>

      <div className="relative group">
        <input
          type="date"
          value={end}
          onChange={(e) => onChange({ start, end: e.target.value })}
          className="bg-white border-2 border-slate-900 rounded-full pl-11 pr-6 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all focus:ring-2 focus:ring-[#f4b8d4]/20 focus:border-[#f4b8d4] outline-none active:scale-[0.98]"
        />
      </div>
    </div>
  );
}
