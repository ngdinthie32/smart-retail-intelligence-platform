import { Users, AlertTriangle, DollarSign, Plus, ArrowLeftRight, TrendingUp } from "lucide-react";
import type { ActiveCashier } from "@/types/shift";
import { StaffAvatar } from "./ShiftCapsule";

interface ShiftSidebarProps {
  activeCashiers: ActiveCashier[];
  totalDiscrepancy: number;
  unassignedAlert: string | null;
  onQuickAssign: () => void;
}

export default function ShiftSidebar({
  activeCashiers,
  totalDiscrepancy,
  unassignedAlert,
  onQuickAssign,
}: ShiftSidebarProps) {
  const onDutyCount = activeCashiers.filter((c) => c.shift.status === "open").length;
  const totalCount = activeCashiers.length;
  const hasDiscrep = totalDiscrepancy < 0;

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Header */}
      <div>
        <p
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: "#94A3B8", letterSpacing: "0.13em" }}
        >
          Today's Shift Summary
        </p>
      </div>

      {/* KPI Cards */}
      <div className="space-y-3">
        {/* Active Cashiers */}
        <div
          className="rounded-2xl p-4"
          style={{
            background: "#fff",
            boxShadow: "0px 20px 40px rgba(0,114,206,0.08)",
          }}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div
                className="rounded-xl p-1.5"
                style={{ background: "rgba(0,165,80,0.12)" }}
              >
                <Users size={14} style={{ color: "#00A550" }} />
              </div>
              <span className="text-xs font-medium" style={{ color: "#64748B" }}>
                Active Cashiers
              </span>
            </div>
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: "#00A550" }}
            />
          </div>
          <p className="text-xl font-bold mt-1" style={{ color: "#1E293B" }}>
            {onDutyCount} / {totalCount}
            <span className="text-sm font-medium ml-1.5" style={{ color: "#00A550" }}>
              On Duty
            </span>
          </p>
          <div
            className="mt-2.5 h-1.5 rounded-full overflow-hidden"
            style={{ background: "#EEF2FF" }}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${(onDutyCount / Math.max(totalCount, 1)) * 100}%`,
                background: "#00A550",
              }}
            />
          </div>
        </div>

        {/* Unassigned Alert */}
        {unassignedAlert && (
          <div
            className="rounded-2xl p-4"
            style={{
              background: "#fff",
              boxShadow: "0px 20px 40px rgba(0,114,206,0.08)",
              border: "1px solid rgba(245,158,11,0.25)",
            }}
          >
            <div className="flex items-start gap-2.5">
              <div
                className="rounded-xl p-1.5 flex-shrink-0 mt-0.5"
                style={{ background: "rgba(245,158,11,0.12)" }}
              >
                <AlertTriangle size={14} style={{ color: "#F59E0B" }} />
              </div>
              <div>
                <p className="text-xs font-semibold" style={{ color: "#92400E" }}>
                  1 Unassigned Shift
                </p>
                <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "#B45309" }}>
                  {unassignedAlert}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Discrepancy */}
        <div
          className="rounded-2xl p-4"
          style={{
            background: "#fff",
            boxShadow: "0px 20px 40px rgba(0,114,206,0.08)",
            border: hasDiscrep ? "1px solid rgba(239,68,68,0.20)" : undefined,
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <div
              className="rounded-xl p-1.5"
              style={{
                background: hasDiscrep
                  ? "rgba(239,68,68,0.10)"
                  : "rgba(0,165,80,0.10)",
              }}
            >
              <DollarSign
                size={14}
                style={{ color: hasDiscrep ? "#EF4444" : "#00A550" }}
              />
            </div>
            <span className="text-xs font-medium" style={{ color: "#64748B" }}>
              Total Discrepancy Today
            </span>
          </div>
          <p
            className="text-xl font-bold mt-1"
            style={{ color: hasDiscrep ? "#EF4444" : "#00A550" }}
          >
            {totalDiscrepancy < 0 ? "-" : "+"}$
            {Math.abs(totalDiscrepancy).toFixed(2)}
          </p>
          {hasDiscrep && (
            <p className="text-xs mt-1" style={{ color: "#EF4444", opacity: 0.8 }}>
              Requires reconciliation
            </p>
          )}
        </div>
      </div>

      {/* Cashier Live Status */}
      <div
        className="rounded-2xl p-4 flex-1"
        style={{
          background: "#fff",
          boxShadow: "0px 20px 40px rgba(0,114,206,0.08)",
          minHeight: 0,
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#94A3B8", letterSpacing: "0.11em" }}>
            Cashier Status
          </p>
          <div className="flex items-center gap-1">
            <TrendingUp size={12} style={{ color: "#0072CE" }} />
            <span className="text-xs font-semibold" style={{ color: "#0072CE" }}>
              Live
            </span>
          </div>
        </div>

        <div className="space-y-3 overflow-y-auto" style={{ maxHeight: 280, scrollbarWidth: "none" }}>
          {activeCashiers.map(({ staff, shift, progressPercent }) => (
            <div key={staff.id} className="group">
              <div className="flex items-center gap-2.5 mb-1.5">
                <StaffAvatar staff={staff} size={32} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p
                      className="text-sm font-semibold truncate"
                      style={{ color: "#1E293B" }}
                    >
                      {staff.full_name}
                    </p>
                    <span
                      className="text-xs font-mono flex-shrink-0 ml-1"
                      style={{ color: "#64748B" }}
                    >
                      {progressPercent}%
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: "#94A3B8" }}>
                    {shift.status === "open" ? "On shift" : "Completed"} ·{" "}
                    {new Date(shift.opened_at).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
              <div
                className="h-1.5 rounded-full overflow-hidden"
                style={{ background: "#EEF2FF" }}
              >
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${progressPercent}%`,
                    background:
                      shift.status === "open"
                        ? shift.cash_discrepancy && shift.cash_discrepancy < 0
                          ? "#EF4444"
                          : "#0072CE"
                        : "#94A3B8",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Widgets */}
      <div className="space-y-2.5">
        <button
          onClick={onQuickAssign}
          className="w-full rounded-2xl py-3 text-sm font-semibold transition-all hover:opacity-90 active:scale-98 flex items-center justify-center gap-2"
          style={{
            background: "#0072CE",
            color: "#fff",
            boxShadow: "0 6px 18px rgba(0,114,206,0.30)",
          }}
        >
          <Plus size={16} />
          Quick Assign Cashier
        </button>
        <button
          className="w-full rounded-2xl py-2.5 text-sm font-semibold transition-all hover:opacity-90 flex items-center justify-center gap-2"
          style={{
            background: "rgba(245,158,11,0.10)",
            color: "#92400E",
            border: "1px solid rgba(245,158,11,0.25)",
          }}
        >
          <ArrowLeftRight size={15} />
          Shift Swap Requests
          <span
            className="rounded-full px-2 py-0.5 text-xs font-bold ml-0.5"
            style={{ background: "#F59E0B", color: "#fff" }}
          >
            2
          </span>
        </button>
      </div>
    </div>
  );
}
