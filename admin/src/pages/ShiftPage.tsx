import { useState } from "react"
import type { CashierShift, Staff, Branch, ActiveCashier } from "@/types/shift"
import ShiftHeader from "@/components/shifts/ShiftHeader"
import ShiftGrid from "@/components/shifts/ShiftGrid"
import ShiftDetailModal from "@/components/shifts/ShiftDetailModal"
import ShiftSidebar from "@/components/shifts/ShiftSidebar"
import ScheduleShiftModal from "@/components/shifts/ScheduleShiftModal"

// ─── Mock Data Dùng Trực Tiếp Của Bạn ─────────────────────────────────────────

const BRANCHES: Branch[] = [
  { id: 1, name: "Chi nhánh Quận 1", address: "15 Nguyễn Huệ, Quận 1, HCM" },
  { id: 2, name: "Chi nhánh Quận 3", address: "22 Võ Văn Tần, Quận 3, HCM" },
]

const STAFF: Staff[] = [
  {
    id: 1,
    full_name: "Nguyễn Văn An",
    role: "cashier",
    branch_id: 1,
    initials: "NA",
    avatarColor: "#6366F1",
  },
  {
    id: 2,
    full_name: "Trần Thị Bích",
    role: "cashier",
    branch_id: 1,
    initials: "TB",
    avatarColor: "#0072CE",
  },
  {
    id: 3,
    full_name: "Lê Minh Châu",
    role: "cashier",
    branch_id: 1,
    initials: "MC",
    avatarColor: "#00A550",
  },
  {
    id: 4,
    full_name: "Phạm Thị Dung",
    role: "manager",
    branch_id: 1,
    initials: "PD",
    avatarColor: "#F59E0B",
  },
  {
    id: 5,
    full_name: "Hoàng Văn Em",
    role: "cashier",
    branch_id: 2,
    initials: "HE",
    avatarColor: "#8B5CF6",
  },
]

const SHIFTS: CashierShift[] = [
  // Week 1 - various days
  {
    id: 1,
    staff_id: 1,
    branch_id: 1,
    weekIndex: 0,
    dayIndex: 0,
    startHour: 8,
    endHour: 12,
    opened_at: "2024-01-01T08:00:00",
    closed_at: null,
    opening_float_cash: 100,
    expected_cash: 1450,
    actual_cash_counted: 1450,
    cash_discrepancy: 0,
    status: "open",
    notes: "Smooth morning shift. Regular customers. No issues.",
    capsuleType: "active",
    label: "Morning Shift",
  },
  {
    id: 2,
    staff_id: 2,
    branch_id: 1,
    weekIndex: 0,
    dayIndex: 0,
    startHour: 13,
    endHour: 17,
    opened_at: "2024-01-01T13:00:00",
    closed_at: "2024-01-01T17:00:00",
    opening_float_cash: 100,
    expected_cash: 870,
    actual_cash_counted: 855,
    cash_discrepancy: -15,
    status: "closed",
    notes: "Minor discrepancy found. Recount done twice.",
    capsuleType: "discrepancy",
    label: "Afternoon Shift",
  },
  {
    id: 3,
    staff_id: 3,
    branch_id: 1,
    weekIndex: 0,
    dayIndex: 1,
    startHour: 9,
    endHour: 13,
    opened_at: "2024-01-02T09:00:00",
    closed_at: null,
    opening_float_cash: 100,
    expected_cash: 600,
    actual_cash_counted: null,
    cash_discrepancy: null,
    status: "open",
    notes: "",
    capsuleType: "active",
    label: "Mid Morning",
  },
  {
    id: 4,
    staff_id: null,
    branch_id: 1,
    weekIndex: 0,
    dayIndex: 2,
    startHour: 8,
    endHour: 12,
    opened_at: "2024-01-03T08:00:00",
    closed_at: null,
    opening_float_cash: 100,
    expected_cash: 0,
    actual_cash_counted: null,
    cash_discrepancy: null,
    status: "open",
    notes: "No cashier assigned — Morning Shift Branch 2 missing cashier!",
    capsuleType: "unassigned",
    label: "Morning Shift",
  },
  {
    id: 5,
    staff_id: 1,
    branch_id: 1,
    weekIndex: 0,
    dayIndex: 2,
    startHour: 14,
    endHour: 18,
    opened_at: "2024-01-03T14:00:00",
    closed_at: "2024-01-03T18:00:00",
    opening_float_cash: 100,
    expected_cash: 1100,
    actual_cash_counted: 1100,
    cash_discrepancy: 0,
    status: "closed",
    notes: "All reconciled. Clean close.",
    capsuleType: "closed",
    label: "Evening Shift",
  },
  {
    id: 6,
    staff_id: 2,
    branch_id: 1,
    weekIndex: 0,
    dayIndex: 3,
    startHour: 8,
    endHour: 12,
    opened_at: "2024-01-04T08:00:00",
    closed_at: null,
    opening_float_cash: 100,
    expected_cash: 750,
    actual_cash_counted: null,
    cash_discrepancy: null,
    status: "open",
    notes: "",
    capsuleType: "scheduled",
    label: "Morning Shift",
  },
  {
    id: 7,
    staff_id: 3,
    branch_id: 1,
    weekIndex: 0,
    dayIndex: 4,
    startHour: 9,
    endHour: 15,
    opened_at: "2024-01-05T09:00:00",
    closed_at: "2024-01-05T15:00:00",
    opening_float_cash: 100,
    expected_cash: 980,
    actual_cash_counted: 978,
    cash_discrepancy: -2,
    status: "closed",
    notes: "$2 short, rounding error suspected.",
    capsuleType: "discrepancy",
    label: "Full Day",
  },
  {
    id: 8,
    staff_id: 1,
    branch_id: 1,
    weekIndex: 1,
    dayIndex: 0,
    startHour: 8,
    endHour: 12,
    opened_at: "2024-01-08T08:00:00",
    closed_at: null,
    opening_float_cash: 100,
    expected_cash: 500,
    actual_cash_counted: null,
    cash_discrepancy: null,
    status: "open",
    notes: "",
    capsuleType: "scheduled",
    label: "Morning Shift",
  },
  {
    id: 9,
    staff_id: 4,
    branch_id: 1,
    weekIndex: 1,
    dayIndex: 1,
    startHour: 10,
    endHour: 16,
    opened_at: "2024-01-09T10:00:00",
    closed_at: "2024-01-09T16:00:00",
    opening_float_cash: 150,
    expected_cash: 2100,
    actual_cash_counted: 2100,
    cash_discrepancy: 0,
    status: "closed",
    notes: "Perfect reconciliation.",
    capsuleType: "closed",
    label: "Manager On Floor",
  },
  {
    id: 10,
    staff_id: 2,
    branch_id: 1,
    weekIndex: 1,
    dayIndex: 2,
    startHour: 8,
    endHour: 14,
    opened_at: "2024-01-10T08:00:00",
    closed_at: null,
    opening_float_cash: 100,
    expected_cash: 1300,
    actual_cash_counted: null,
    cash_discrepancy: null,
    status: "open",
    notes: "",
    capsuleType: "active",
    label: "Morning–Noon",
  },
  {
    id: 11,
    staff_id: 3,
    branch_id: 1,
    weekIndex: 1,
    dayIndex: 3,
    startHour: 12,
    endHour: 18,
    opened_at: "2024-01-11T12:00:00",
    closed_at: null,
    opening_float_cash: 100,
    expected_cash: 900,
    actual_cash_counted: null,
    cash_discrepancy: null,
    status: "open",
    notes: "",
    capsuleType: "scheduled",
    label: "Afternoon Shift",
  },
  {
    id: 12,
    staff_id: 1,
    branch_id: 1,
    weekIndex: 2,
    dayIndex: 0,
    startHour: 8,
    endHour: 16,
    opened_at: "2024-01-15T08:00:00",
    closed_at: "2024-01-15T16:00:00",
    opening_float_cash: 100,
    expected_cash: 2200,
    actual_cash_counted: 2190,
    cash_discrepancy: -10,
    status: "closed",
    notes: "Small discrepancy under investigation.",
    capsuleType: "discrepancy",
    label: "Full Day",
  },
  {
    id: 13,
    staff_id: null,
    branch_id: 2,
    weekIndex: 2,
    dayIndex: 1,
    startHour: 9,
    endHour: 13,
    opened_at: "2024-01-16T09:00:00",
    closed_at: null,
    opening_float_cash: 100,
    expected_cash: 0,
    actual_cash_counted: null,
    cash_discrepancy: null,
    status: "open",
    notes: "Morning Shift Branch 2 missing cashier!",
    capsuleType: "unassigned",
    label: "Morning Alert",
  },
  {
    id: 14,
    staff_id: 5,
    branch_id: 2,
    weekIndex: 2,
    dayIndex: 2,
    startHour: 10,
    endHour: 16,
    opened_at: "2024-01-17T10:00:00",
    closed_at: null,
    opening_float_cash: 100,
    expected_cash: 750,
    actual_cash_counted: null,
    cash_discrepancy: null,
    status: "open",
    notes: "",
    capsuleType: "active",
    label: "Mid Shift",
  },
  {
    id: 15,
    staff_id: 2,
    branch_id: 1,
    weekIndex: 3,
    dayIndex: 0,
    startHour: 8,
    endHour: 12,
    opened_at: "2024-01-22T08:00:00",
    closed_at: null,
    opening_float_cash: 100,
    expected_cash: 600,
    actual_cash_counted: null,
    cash_discrepancy: null,
    status: "open",
    notes: "",
    capsuleType: "scheduled",
    label: "Morning Shift",
  },
  {
    id: 16,
    staff_id: 3,
    branch_id: 1,
    weekIndex: 3,
    dayIndex: 2,
    startHour: 13,
    endHour: 17,
    opened_at: "2024-01-24T13:00:00",
    closed_at: "2024-01-24T17:00:00",
    opening_float_cash: 100,
    expected_cash: 850,
    actual_cash_counted: 850,
    cash_discrepancy: 0,
    status: "closed",
    notes: "",
    capsuleType: "closed",
    label: "Afternoon Shift",
  },
]

const ACTIVE_CASHIERS: ActiveCashier[] = [
  { staff: STAFF[0], shift: SHIFTS[0], progressPercent: 85 },
  { staff: STAFF[1], shift: SHIFTS[1], progressPercent: 100 },
  { staff: STAFF[2], shift: SHIFTS[2], progressPercent: 52 },
  { staff: STAFF[4], shift: SHIFTS[13], progressPercent: 37 },
]

const STAFF_MAP: Record<number, Staff> = Object.fromEntries(
  STAFF.map((s) => [s.id, s]),
)

const MONTHS = [
  "January 2024",
  "February 2024",
  "March 2024",
  "April 2024",
  "May 2024",
  "June 2024",
  "July 2024",
  "August 2024",
  "September 2024",
  "October 2024",
  "November 2024",
  "December 2024",
]

export function ShiftPage() {
  const [view, setView] = useState<"week" | "month">("week")
  const [monthOffset, setMonthOffset] = useState(0)
  const [selectedDay, setSelectedDay] = useState({ week: 1, day: 2 })
  const [selectedShift, setSelectedShift] = useState<CashierShift | null>(null)
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)

  const totalDiscrepancy = SHIFTS.reduce(
    (acc, s) => acc + (s.cash_discrepancy ?? 0),
    0,
  )

  const unassignedShift = SHIFTS.find((s) => s.capsuleType === "unassigned")

  return (
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{
        background: "#F3F5F9",
        fontFamily: "'Inter', 'DM Sans', sans-serif",
      }}
    >
      {/* Header Area */}
      <div className="px-6 pt-6 flex-shrink-0">
        <ShiftHeader
          view={view}
          onViewChange={setView}
          currentMonth={MONTHS[monthOffset % 12]}
          onPrev={() => setMonthOffset((m) => Math.max(0, m - 1))}
          onNext={() => setMonthOffset((m) => Math.min(11, m + 1))}
          selectedBranch="Quận 1"
          onSchedule={() => setIsScheduleModalOpen(true)}
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 gap-5 px-6 pb-6 min-h-0">
        {/* Grid area */}
        <div className="flex flex-col flex-1 min-w-0 min-h-0">
          <ShiftGrid
            view={view}
            shifts={SHIFTS}
            staffMap={STAFF_MAP}
            onShiftClick={setSelectedShift}
            selectedDay={selectedDay}
            onDaySelect={(week, day) => setSelectedDay({ week, day })}
            monthOffset={monthOffset}
          />
        </div>

        {/* Sidebar */}
        <div
          className="flex-shrink-0 overflow-y-auto"
          style={{ width: 280, scrollbarWidth: "none" }}
        >
          <ShiftSidebar
            activeCashiers={ACTIVE_CASHIERS}
            totalDiscrepancy={totalDiscrepancy}
            unassignedAlert={
              unassignedShift
                ? "Morning Shift — Branch 2 missing cashier"
                : null
            }
            onQuickAssign={() => setIsScheduleModalOpen(true)}
          />
        </div>
      </div>

      {/* Shift Detail Modal (Trượt từ phải sang) */}
      <ShiftDetailModal
        shift={selectedShift}
        staff={
          selectedShift?.staff_id != null
            ? STAFF_MAP[selectedShift.staff_id]
            : undefined
        }
        branch={
          selectedShift
            ? BRANCHES.find((b) => b.id === selectedShift.branch_id)
            : undefined
        }
        onClose={() => setSelectedShift(null)}
      />

      {/* Modal Lên Lịch Ca Làm Mới */}
      <ScheduleShiftModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        staffList={STAFF}
        branches={BRANCHES}
      />
    </div>
  )
}