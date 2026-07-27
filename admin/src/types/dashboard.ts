export interface LowStockItem {
  sku: string
  name: string
  stock: number
  reorder: number
  branch: string
}

export interface ActivityItem {
  id: number
  av: string
  name: string
  branch: string
  action: string
  time: string
  status: 'Resolved' | 'Pending Review' | string
}

export interface NavItem {
  key: string
  label: string
  path: string
}