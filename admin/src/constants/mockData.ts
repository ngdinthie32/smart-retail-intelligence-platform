import { T } from './theme'
import { LowStockItem, ActivityItem } from '../types/dashboard'

export const revBars = [55, 72, 48, 91, 68, 83, 76]
export const profBars = [36, 54, 41, 67, 50, 61, 57]
export const discBars = [24, 17, 33, 12, 29, 21, 27]

export const ordersWave = [
  {v:820},{v:950},{v:880},{v:1100},{v:1060},
  {v:1240},{v:1190},{v:1330},{v:1290},{v:1420},
  {v:1380},{v:1500},{v:1450},{v:1570},
]

export const branchSales = [
  { day:'Mon', Makati:4200, BGC:3100, Ortigas:2800, 'QC North':1900 },
  { day:'Tue', Makati:5100, BGC:3600, Ortigas:3200, 'QC North':2300 },
  { day:'Wed', Makati:4700, BGC:4100, Ortigas:2900, 'QC North':2100 },
  { day:'Thu', Makati:5800, BGC:3900, Ortigas:3600, 'QC North':2700 },
  { day:'Fri', Makati:6200, BGC:4400, Ortigas:4100, 'QC North':3100 },
  { day:'Sat', Makati:7100, BGC:5200, Ortigas:4800, 'QC North':3600 },
  { day:'Sun', Makati:6800, BGC:4900, Ortigas:4400, 'QC North':3200 },
]

export const lowStock: LowStockItem[] = [
  { sku:'SKU-041', name:'Green Tea Latte 250ml',  stock:3,  reorder:20, branch:'Makati'   },
  { sku:'SKU-087', name:'Onigiri Tuna Mayo',       stock:7,  reorder:30, branch:'BGC Fort' },
  { sku:'SKU-112', name:'Mocha Frappe 500ml',      stock:1,  reorder:15, branch:'Ortigas'  },
  { sku:'SKU-203', name:'Yakisoba Noodle Cup',     stock:5,  reorder:25, branch:'QC North' },
  { sku:'SKU-319', name:'Egg Salad Sandwich',      stock:2,  reorder:18, branch:'Makati'   },
]

export const activity: ActivityItem[] = [
  { id:1, av:'MR', name:'Maria Reyes',  branch:'Makati',   action:'Shift #102 closed — register balanced',     time:'2m ago',  status:'Resolved'      },
  { id:2, av:'JL', name:'James Lim',    branch:'BGC Fort', action:'Price updated for SKU-098 (Latte 250ml)',   time:'14m ago', status:'Pending Review' },
  { id:3, av:'SC', name:'Sofia Cruz',   branch:'Ortigas',  action:'Cash variance flagged — ₱380 discrepancy', time:'41m ago', status:'Pending Review' },
  { id:4, av:'KT', name:'Kevin Tan',    branch:'QC North', action:'Inventory restocked — 48 items logged',     time:'1h ago',  status:'Resolved'       },
  { id:5, av:'AL', name:'Ana Lopez',    branch:'Makati',   action:'Shift #99 opened — cashier logged in',      time:'2h ago',  status:'Resolved'       },
  { id:6, av:'BG', name:'Bryan Go',     branch:'BGC Fort', action:'Discount code SUMMER10 applied — 22 txns', time:'3h ago',  status:'Pending Review' },
]

export const avColor: Record<string,string> = {
  MR: T.blue, JL: T.green, SC: T.coral, KT:'#7C4DFF', AL: T.amber, BG: T.cyan,
}

export const BRANCH_KEYS   = ['Makati','BGC','Ortigas','QC North']
export const BRANCH_COLORS = [T.blue, T.green, T.amber, T.cyan]
export const BRANCH_OPTS   = ['Toàn chuỗi / All Branches','District 1 Branch','District 3 Branch']
export const SORT_OPTS     = ['This week','This month','This quarter','This year']