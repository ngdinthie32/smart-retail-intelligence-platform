import {
  UserCheck,
  UserX,
  AlertTriangle,
  Lock,
  DollarSign,
  User,
} from "lucide-react";
import type { CashierShift, Staff, ShiftCapsuleType } from "@/types/shift";

interface ShiftCapsuleProps {
  shift: CashierShift;
  staff?: Staff;
  onClick: (shift: CashierShift) => void;
  compact?: boolean;
}

const CAPSULE_STYLES: Record<
  ShiftCapsuleType,
  { bg: string; border: string; text: string; iconColor: string; label: string }
> = {
  active: {
    bg: "rgba(0,165,80,0.10)",
    border: "rgba(0,165,80,0.28)",
    text: "#00783A",
    iconColor: "#00A550",
    label: "Open",
  },
  scheduled: {
    bg: "rgba(139,92,246,0.10)",
    border: "rgba(139,92,246,0.28)",
    text: "#5B21B6",
    iconColor: "#8B5CF6",
    label: "Scheduled",
  },
  unassigned: {
    bg: "rgba(245,158,11,0.10)",
    border: "rgba(245,158,11,0.30)",
    text: "#92400E",
    iconColor: "#F59E0B",
    label: "Unassigned",
  },
  discrepancy: {
    bg: "rgba(239,68,68,0.10)",
    border: "rgba(239,68,68,0.28)",
    text: "#991B1B",
    iconColor: "#EF4444",
    label: "Discrepancy",
  },
  closed: {
    bg: "rgba(100,116,139,0.09)",
    border: "rgba(100,116,139,0.22)",
    text: "#475569",
    iconColor: "#94A3B8",
    label: "Closed",
  },
};

function CapsuleIcon({ type }: { type: ShiftCapsuleType }) {
  const size = 13;
  switch (type) {
    case "active":
      return <UserCheck size={size} />;
    case "scheduled":
      return <User size={size} />;
    case "unassigned":
      return <UserX size={size} />;
    case "discrepancy":
      return <DollarSign size={size} />;
    case "closed":
      return <Lock size={size} />;
    default:
      return <AlertTriangle size={size} />;
  }
}

function StaffAvatar({ staff, size = 20 }: { staff: Staff; size?: number }) {
  return (
    <div
      className="rounded-full flex items-center justify-center flex-shrink-0 font-bold"
      style={{
        width: size,
        height: size,
        background: staff.avatarColor,
        color: "#fff",
        fontSize: size * 0.38,
        letterSpacing: "0.02em",
      }}
    >
      {staff.initials}
    </div>
  );
}

export default function ShiftCapsule({
  shift,
  staff,
  onClick,
  compact = false,
}: ShiftCapsuleProps) {
  const style = CAPSULE_STYLES[shift.capsuleType];

  const formatHour = (h: number) => {
    if (h === 12) return "12 PM";
    if (h === 0) return "12 AM";
    return h > 12 ? `${h - 12} PM` : `${h} AM`;
  };

  return (
    <button
      onClick={() => onClick(shift)}
      title={`${staff?.full_name ?? "Unassigned"} · ${formatHour(shift.startHour)}–${formatHour(shift.endHour)}`}
      className="w-full text-left rounded-xl px-2 py-1.5 transition-all duration-150 hover:brightness-95 hover:scale-[1.02] active:scale-95 group"
      style={{
        background: style.bg,
        border: `1px solid ${style.border}`,
        color: style.text,
      }}
    >
      <div className="flex items-center gap-1.5">
        <span style={{ color: style.iconColor }}>
          <CapsuleIcon type={shift.capsuleType} />
        </span>
        {staff && !compact && <StaffAvatar staff={staff} size={18} />}
        <div className="flex-1 min-w-0">
          <p
            className="text-xs font-semibold leading-tight truncate"
            style={{ color: style.text }}
          >
            {shift.label}
          </p>
          {!compact && (
            <p className="text-xs leading-tight truncate" style={{ color: style.text, opacity: 0.7 }}>
              {staff?.full_name ?? "No cashier"}
            </p>
          )}
        </div>
        {shift.capsuleType === "active" && (
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse"
            style={{ background: "#00A550" }}
          />
        )}
      </div>
    </button>
  );
}

export { StaffAvatar };
