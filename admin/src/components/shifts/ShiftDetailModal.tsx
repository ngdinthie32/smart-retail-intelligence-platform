import { useEffect, useState } from "react";
import { X, MapPin, Clock, FileText, UserCog, AlertCircle, Download } from "lucide-react";
import type { CashierShift, Staff, Branch } from "@/types/shift";
import { StaffAvatar } from "./ShiftCapsule";

interface ShiftDetailModalProps {
  shift: CashierShift | null;
  staff?: Staff;
  branch?: Branch;
  onClose: () => void;
}

function fmt(n: number | null) {
  if (n === null) return "—";
  const abs = Math.abs(n).toFixed(2);
  return n < 0 ? `-$${abs}` : `$${abs}`;
}

function fmtPos(n: number) {
  return `$${n.toFixed(2)}`;
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

export default function ShiftDetailModal({
  shift,
  staff,
  branch,
  onClose,
}: ShiftDetailModalProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (shift) {
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [shift]);

  if (!shift) return null;

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 250); // Chờ animation kết thúc rồi gỡ khỏi DOM
  };

  const isOpen = shift.status === "open";
  const discrepancy = shift.cash_discrepancy ?? 0;
  const hasDiscrepancy = discrepancy !== 0;
  const shiftId = `#SH-2024-${String(shift.id).padStart(2, "0")}`;

  return (
    <>
      {/* Backdrop mờ nền */}
      <div
        className="fixed inset-0 z-40 transition-opacity duration-300 ease-in-out"
        style={{
          background: "rgba(15,23,42,0.45)",
          backdropFilter: "blur(3px)",
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? "auto" : "none",
        }}
        onClick={handleClose}
      />

      {/* Drawer trượt từ bên phải */}
      <div
        className="fixed right-0 top-0 bottom-0 z-50 overflow-y-auto transition-transform duration-300 ease-out flex flex-col justify-between"
        style={{
          width: 460,
          background: "#fff",
          boxShadow: "-8px 0 40px rgba(0,0,0,0.14)",
          transform: visible ? "translateX(0)" : "translateX(100%)",
          scrollbarWidth: "none",
        }}
      >
        <div>
          {/* Header */}
          <div
            className="sticky top-0 z-10 px-6 py-5 border-b"
            style={{ background: "#fff", borderColor: "#E2E8F0" }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {staff ? (
                  <StaffAvatar staff={staff} size={44} />
                ) : (
                  <div
                    className="rounded-full flex items-center justify-center"
                    style={{ width: 44, height: 44, background: "#E2E8F0" }}
                  >
                    <UserCog size={20} style={{ color: "#94A3B8" }} />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-base" style={{ color: "#1E293B" }}>
                      {staff?.full_name ?? "Unassigned"}
                    </h2>
                    <span
                      className="text-xs font-medium rounded-full px-2 py-0.5"
                      style={{ background: "#EEF2FF", color: "#6366F1" }}
                    >
                      {staff?.role ?? "—"}
                    </span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>
                    {shiftId}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-semibold rounded-full px-3 py-1 flex items-center gap-1"
                  style={
                    isOpen
                      ? { background: "rgba(0,165,80,0.12)", color: "#00783A" }
                      : { background: "#F1F5F9", color: "#475569" }
                  }
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: isOpen ? "#00A550" : "#94A3B8" }}
                  />
                  {isOpen ? "Open" : "Closed"}
                </span>
                <button
                  onClick={handleClose}
                  className="rounded-full p-1.5 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <X size={18} style={{ color: "#64748B" }} />
                </button>
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="px-6 py-5 space-y-5">
            {/* Location & Time */}
            <div
              className="rounded-2xl p-4 space-y-2.5"
              style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}
            >
              <div className="flex items-center gap-2.5">
                <MapPin size={15} style={{ color: "#0072CE" }} />
                <span className="text-sm font-medium" style={{ color: "#1E293B" }}>
                  {branch?.name ?? "—"}
                </span>
                <span className="text-xs" style={{ color: "#94A3B8" }}>
                  {branch?.address}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock size={15} style={{ color: "#0072CE" }} />
                <span className="text-sm" style={{ color: "#475569" }}>
                  {formatTime(shift.opened_at)}
                  {shift.closed_at ? ` — ${formatTime(shift.closed_at)}` : " — Ongoing"}
                </span>
                <span className="text-xs ml-auto" style={{ color: "#94A3B8" }}>
                  {formatDateTime(shift.opened_at)}
                </span>
              </div>
            </div>

            {/* Cash Drawer Audit */}
            <div>
              <h3
                className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: "#94A3B8", letterSpacing: "0.12em" }}
              >
                Cash Drawer Audit
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    label: "Opening Float",
                    sublabel: "Tiền đầu ca",
                    value: fmtPos(shift.opening_float_cash),
                    accent: "#0072CE",
                    bg: "rgba(0,114,206,0.06)",
                  },
                  {
                    label: "Expected Cash",
                    sublabel: "Lý thuyết",
                    value: fmtPos(shift.expected_cash),
                    accent: "#6366F1",
                    bg: "rgba(99,102,241,0.06)",
                  },
                  {
                    label: "Actual Counted",
                    sublabel: "Đếm thực tế",
                    value: fmt(shift.actual_cash_counted),
                    accent: "#00A550",
                    bg: "rgba(0,165,80,0.06)",
                  },
                  {
                    label: "Discrepancy",
                    sublabel: "Chênh lệch",
                    value: fmt(shift.cash_discrepancy),
                    accent: hasDiscrepancy ? "#EF4444" : "#00A550",
                    bg: hasDiscrepancy ? "rgba(239,68,68,0.07)" : "rgba(0,165,80,0.06)",
                    highlight: true,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl p-3.5"
                    style={{ background: item.bg, border: `1px solid ${item.accent}22` }}
                  >
                    <p className="text-xs font-medium mb-0.5" style={{ color: item.accent }}>
                      {item.label}
                    </p>
                    <p className="text-xs mb-1.5" style={{ color: "#94A3B8" }}>
                      {item.sublabel}
                    </p>
                    <p
                      className="text-lg font-bold"
                      style={{ color: item.highlight ? item.accent : "#1E293B" }}
                    >
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
              {hasDiscrepancy && (
                <div
                  className="mt-3 flex items-start gap-2 rounded-xl px-3.5 py-3"
                  style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.20)" }}
                >
                  <AlertCircle size={15} style={{ color: "#EF4444", flexShrink: 0, marginTop: 1 }} />
                  <p className="text-xs leading-relaxed" style={{ color: "#991B1B" }}>
                    Cash discrepancy detected: <strong>{fmt(shift.cash_discrepancy)}</strong>. Requires manager review before closing.
                  </p>
                </div>
              )}
            </div>

            {/* Shift Notes */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <FileText size={14} style={{ color: "#64748B" }} />
                <h3 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#94A3B8", letterSpacing: "0.1em" }}>
                  Shift Notes
                </h3>
              </div>
              <textarea
                className="w-full rounded-xl px-3.5 py-3 text-sm resize-none outline-none transition-all"
                style={{
                  background: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  color: "#1E293B",
                  minHeight: 80,
                }}
                defaultValue={shift.notes}
                placeholder="Add shift notes..."
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div
          className="sticky bottom-0 px-6 py-4 border-t flex gap-2.5"
          style={{ background: "#fff", borderColor: "#E2E8F0" }}
        >
          <button
            className="flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all hover:opacity-90 cursor-pointer"
            style={{ background: "rgba(239,68,68,0.10)", color: "#991B1B", border: "1px solid rgba(239,68,68,0.22)" }}
          >
            Force Close
          </button>
          <button
            className="flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all hover:opacity-90 cursor-pointer"
            style={{ background: "#EEF2FF", color: "#5B21B6", border: "1px solid rgba(139,92,246,0.22)" }}
          >
            Re-assign
          </button>
          <button
            className="rounded-xl px-4 py-2.5 text-sm font-semibold transition-all hover:opacity-90 flex items-center gap-1.5 cursor-pointer"
            style={{ background: "#0072CE", color: "#fff", boxShadow: "0 4px 12px rgba(0,114,206,0.30)" }}
          >
            <Download size={14} />
            PDF
          </button>
        </div>
      </div>
    </>
  );
}