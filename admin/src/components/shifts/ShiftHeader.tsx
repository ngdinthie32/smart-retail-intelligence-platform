import { ChevronLeft, ChevronRight, Plus, ChevronDown } from "lucide-react";

interface ShiftHeaderProps {
  view: "week" | "month";
  onViewChange: (v: "week" | "month") => void;
  currentMonth: string;
  onPrev: () => void;
  onNext: () => void;
  selectedBranch: string;
  onSchedule: () => void;
}

export default function ShiftHeader({
  view,
  onViewChange,
  currentMonth,
  onPrev,
  onNext,
  selectedBranch,
  onSchedule,
}: ShiftHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
      {/* Title */}
      <div>
        <h1
          className="font-bold tracking-tight"
          style={{ fontSize: 26, color: "#1E293B", fontFamily: "'Inter', sans-serif" }}
        >
          Shift & Cashier Schedule
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>
          Retail POS — Branch Workforce Management
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {/* View Switcher */}
        <div
          className="flex items-center rounded-full p-1"
          style={{ background: "#EEF2FF", border: "1px solid #E0E7FF" }}
        >
          {(["week", "month"] as const).map((v) => (
            <button
              key={v}
              onClick={() => onViewChange(v)}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
              style={
                view === v
                  ? {
                      background: "#0072CE",
                      color: "#fff",
                      boxShadow: "0 2px 8px rgba(0,114,206,0.30)",
                    }
                  : { color: "#64748B" }
              }
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>

        {/* Date Navigator */}
        <div
          className="flex items-center gap-2 rounded-full px-3 py-1.5"
          style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}
        >
          <button
            onClick={onPrev}
            className="hover:opacity-70 transition-opacity"
            style={{ color: "#64748B" }}
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-semibold px-1" style={{ color: "#1E293B", minWidth: 110, textAlign: "center" }}>
            {currentMonth}
          </span>
          <button
            onClick={onNext}
            className="hover:opacity-70 transition-opacity"
            style={{ color: "#64748B" }}
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Branch Selector */}
        <button
          className="flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all"
          style={{
            background: "#F8FAFC",
            border: "1px solid #E2E8F0",
            color: "#1E293B",
          }}
        >
          <span className="text-xs" style={{ color: "#64748B" }}>Branch:</span>
          <span>{selectedBranch}</span>
          <ChevronDown size={14} style={{ color: "#64748B" }} />
        </button>

        {/* Role Filter */}
        <button
          className="flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium"
          style={{
            background: "#F8FAFC",
            border: "1px solid #E2E8F0",
            color: "#64748B",
          }}
        >
          Role: Cashier <ChevronDown size={13} />
        </button>

        {/* Status Filter */}
        <button
          className="flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium"
          style={{
            background: "#F8FAFC",
            border: "1px solid #E2E8F0",
            color: "#64748B",
          }}
        >
          Status: All <ChevronDown size={13} />
        </button>

        {/* Schedule Button */}
        <button
          onClick={onSchedule}
          className="flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
          style={{
            background: "#0072CE",
            color: "#fff",
            boxShadow: "0 4px 14px rgba(0,114,206,0.35)",
          }}
        >
          <Plus size={16} />
          Schedule Shift
        </button>
      </div>
    </div>
  );
}
