import { T } from './theme'
import { LowStockItem, ActivityItem } from '../types/dashboard'
import type { Staff, Branch, CashierShift, ActiveCashier } from '../types/shift'

// ==========================================
// 1. DASHBOARD DATA (Dữ liệu cũ của bạn)
// ==========================================

export const revBars = [55, 72, 48, 91, 68, 83, 76, 62, 88, 95, 70, 84, 90, 78, 85]
export const profBars = [36, 54, 41, 67, 50, 61, 57, 45, 63, 72, 53, 65, 68, 59, 64]
export const discBars = [24, 17, 33, 12, 29, 21, 27, 19, 25, 15, 22, 18, 30, 20, 26]

export const ordersWave = [
  { v: 820 }, { v: 950 }, { v: 880 }, { v: 1100 }, { v: 1060 },
  { v: 1240 }, { v: 1190 }, { v: 1330 }, { v: 1290 }, { v: 1420 },
  { v: 1380 }, { v: 1500 }, { v: 1450 }, { v: 1570 },
]

export const branchSales = [
  { day: 'Mon', Makati: 4200, BGC: 3100, Ortigas: 2800, 'QC North': 1900 },
  { day: 'Tue', Makati: 5100, BGC: 3600, Ortigas: 3200, 'QC North': 2300 },
  { day: 'Wed', Makati: 4700, BGC: 4100, Ortigas: 2900, 'QC North': 2100 },
  { day: 'Thu', Makati: 5800, BGC: 3900, Ortigas: 3600, 'QC North': 2700 },
  { day: 'Fri', Makati: 6200, BGC: 4400, Ortigas: 4100, 'QC North': 3100 },
  { day: 'Sat', Makati: 7100, BGC: 5200, Ortigas: 4800, 'QC North': 3600 },
  { day: 'Sun', Makati: 6800, BGC: 4900, Ortigas: 4400, 'QC North': 3200 },
]

export const lowStock: LowStockItem[] = [
  { sku: 'SKU-041', name: 'Green Tea Latte 250ml', stock: 3, reorder: 20, branch: 'Makati' },
  { sku: 'SKU-087', name: 'Onigiri Tuna Mayo', stock: 7, reorder: 30, branch: 'BGC Fort' },
  { sku: 'SKU-112', name: 'Mocha Frappe 500ml', stock: 1, reorder: 15, branch: 'Ortigas' },
  { sku: 'SKU-203', name: 'Yakisoba Noodle Cup', stock: 5, reorder: 25, branch: 'QC North' },
  { sku: 'SKU-319', name: 'Egg Salad Sandwich', stock: 2, reorder: 18, branch: 'Makati' },
]

export const activity: ActivityItem[] = [
  { id: 1, av: 'MR', name: 'Maria Reyes', branch: 'Makati', action: 'Shift #102 closed — register balanced', time: '2m ago', status: 'Resolved' },
  { id: 2, av: 'JL', name: 'James Lim', branch: 'BGC Fort', action: 'Price updated for SKU-098 (Latte 250ml)', time: '14m ago', status: 'Pending Review' },
  { id: 3, av: 'SC', name: 'Sofia Cruz', branch: 'Ortigas', action: 'Cash variance flagged — ₱380 discrepancy', time: '41m ago', status: 'Pending Review' },
  { id: 4, av: 'KT', name: 'Kevin Tan', branch: 'QC North', action: 'Inventory restocked — 48 items logged', time: '1h ago', status: 'Resolved' },
  { id: 5, av: 'AL', name: 'Ana Lopez', branch: 'Makati', action: 'Shift #99 opened — cashier logged in', time: '2h ago', status: 'Resolved' },
  { id: 6, av: 'BG', name: 'Bryan Go', branch: 'BGC Fort', action: 'Discount code SUMMER10 applied — 22 txns', time: '3h ago', status: 'Pending Review' },
]

export const avColor: Record<string, string> = {
  MR: T.blue, JL: T.green, SC: T.coral, KT: '#7C4DFF', AL: T.amber, BG: T.cyan,
}

export const BRANCH_KEYS = ['Makati', 'BGC', 'Ortigas', 'QC North']
export const BRANCH_COLORS = [T.blue, T.green, T.amber, T.cyan]
export const BRANCH_OPTS = ['Toàn chuỗi / All Branches', 'District 1 Branch', 'District 3 Branch']
export const SORT_OPTS = ['This week', 'This month', 'This quarter', 'This year']


// ==========================================
// 2. SHIFTS & CASHIER DATA (Thêm mới để sửa lỗi)
// ==========================================

export const mockStaff: Staff[] = [
  { id: 1, full_name: 'Maria Reyes', role: 'Senior Cashier', initials: 'MR', avatarColor: T.blue },
  { id: 2, full_name: 'James Lim', role: 'Cashier', initials: 'JL', avatarColor: T.green },
  { id: 3, full_name: 'Sofia Cruz', role: 'Cashier', initials: 'SC', avatarColor: T.coral },
  { id: 4, full_name: 'Kevin Tan', role: 'Store Supervisor', initials: 'KT', avatarColor: '#7C4DFF' },
  { id: 5, full_name: 'Ana Lopez', role: 'Cashier', initials: 'AL', avatarColor: T.amber },
  { id: 6, full_name: 'Bryan Go', role: 'Cashier', initials: 'BG', avatarColor: T.cyan },
]

export const mockBranches: Branch[] = [
  { id: 1, name: 'Makati Branch', address: 'Ayala Ave, Makati, Metro Manila' },
  { id: 2, name: 'BGC Fort Branch', address: 'High Street, BGC, Taguig' },
  { id: 3, name: 'Ortigas Branch', address: 'ADB Ave, Pasig, Metro Manila' },
  { id: 4, name: 'QC North Branch', address: 'North Ave, Quezon City' },
]

export const mockShifts: CashierShift[] = [
  {
    id: 101,
    staff_id: 1,
    branch_id: 1,
    weekIndex: 1,
    dayIndex: 2, // Wed
    startHour: 8,
    endHour: 12,
    label: 'Morning Shift',
    capsuleType: 'active',
    status: 'open',
    opened_at: '2024-01-10T08:00:00Z',
    closed_at: null,
    opening_float_cash: 100,
    expected_cash: 350.5,
    actual_cash_counted: 323.5,
    cash_discrepancy: -27.0,
    notes: 'Khách trả nhầm tiền thừa lúc 10h',
  },
  {
    id: 102,
    staff_id: 2,
    branch_id: 2,
    weekIndex: 1,
    dayIndex: 2,
    startHour: 13,
    endHour: 17,
    label: 'Afternoon Shift',
    capsuleType: 'closed',
    status: 'closed',
    opened_at: '2024-01-10T13:00:00Z',
    closed_at: '2024-01-10T17:00:00Z',
    opening_float_cash: 100,
    expected_cash: 420.0,
    actual_cash_counted: 420.0,
    cash_discrepancy: 0,
    notes: 'Ca làm việc cân bằng tuyệt đối',
  },
  {
    id: 103,
    staff_id: null,
    branch_id: 4,
    weekIndex: 1,
    dayIndex: 3,
    startHour: 8,
    endHour: 12,
    label: 'Unassigned Shift',
    capsuleType: 'unassigned',
    status: 'closed',
    opened_at: '2024-01-11T08:00:00Z',
    closed_at: null,
    opening_float_cash: 0,
    expected_cash: 0,
    actual_cash_counted: null,
    cash_discrepancy: null,
    notes: 'Thiếu nhân sự chưa gán ca',
  },
  {
    id: 104,
    staff_id: 3,
    branch_id: 3,
    weekIndex: 1,
    dayIndex: 2,
    startHour: 9,
    endHour: 13,
    label: 'Morning Shift',
    capsuleType: 'discrepancy',
    status: 'open',
    opened_at: '2024-01-10T09:00:00Z',
    closed_at: null,
    opening_float_cash: 150,
    expected_cash: 530.0,
    actual_cash_counted: 150.0,
    cash_discrepancy: -380.0,
    notes: 'Lệch tiền két chưa rõ nguyên nhân',
  },
]

export const mockActiveCashiers: ActiveCashier[] = [
  {
    staff: mockStaff[0],
    shift: mockShifts[0],
    progressPercent: 85,
  },
  {
    staff: mockStaff[1],
    shift: mockShifts[1],
    progressPercent: 100,
  },
  {
    staff: mockStaff[2],
    shift: mockShifts[3],
    progressPercent: 52,
  },
  {
    staff: mockStaff[4],
    shift: { ...mockShifts[0], id: 105, opened_at: '2024-01-10T10:00:00Z' },
    progressPercent: 37,
  },
]