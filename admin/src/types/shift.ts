export type ShiftStatus = "open" | "closed";
export type StaffRole = "cashier" | "manager" | "admin";
export type ShiftCapsuleType =
  | "active"
  | "scheduled"
  | "unassigned"
  | "discrepancy"
  | "closed";

export interface Branch {
  id: number;
  name: string;
  address: string;
}

export interface Staff {
  id: number;
  full_name: string;
  role: StaffRole;
  branch_id: number;
  avatar_url?: string;
  initials: string;
  avatarColor: string;
}

export interface CashierShift {
  id: number;
  staff_id: number | null;
  branch_id: number;
  opened_at: string;
  closed_at: string | null;
  opening_float_cash: number;
  expected_cash: number;
  actual_cash_counted: number | null;
  cash_discrepancy: number | null;
  status: ShiftStatus;
  notes: string;
  capsuleType: ShiftCapsuleType;
  label: string;
  dayIndex: number;
  startHour: number;
  endHour: number;
  weekIndex: number;
}

export interface ShiftGridCell {
  weekIndex: number;
  dayIndex: number;
  hour: number;
  shifts: CashierShift[];
}

export interface ActiveCashier {
  staff: Staff;
  shift: CashierShift;
  progressPercent: number;
}
