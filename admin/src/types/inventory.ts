export interface CategoryTag {
  id: string
  path: string
}

export interface StockDetail {
  total: number
  site: number
  reserved: number
}

export interface InventoryItem {
  id: string
  sku: string
  barcode: string
  name: string
  group: 'A' | 'B' | 'C'
  categories: CategoryTag[]
  brand: string
  vendor: string
  price: number
  cost: number
  profitMargin: number
  stock: StockDetail
  expDate: string
  collection: string
  country: string
  tags: string[]
  images: string[]
}

// ── Branch inventory ────────────────────────────────────────────────────────

export interface Branch {
  id: string
  name: string
}

export interface BranchInventory {
  id: string
  branch_id: string
  branch_name: string
  sku: string
  product_id: string
  product_name: string
  product_image: string
  current_stock: number
  reorder_level: number
}

// ── Stock movements ─────────────────────────────────────────────────────────

export type MovementType = 'purchase' | 'adjustment' | 'transfer'

export interface StockMovement {
  id: string
  branch_id: string
  product_id: string
  movement_type: MovementType
  quantity_change: number
  note: string
  created_at: string
}

// ── Reconciliation view ─────────────────────────────────────────────────────

export interface StockReconciliation {
  id: string
  branch_id: string
  branch_name: string
  sku: string
  product_id: string
  product_name: string
  product_image: string
  snapshot_stock: number
  computed_stock: number
  diff: number // computed_stock - snapshot_stock
}
