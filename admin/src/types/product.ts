// src/types/product.ts

export interface CategoryTag {
  id: string
  path: string
}

export interface StockDetail {
  total: number
  site: number
  reserved: number
}

export interface Product {
  id: string
  sku: string
  barcode: string
  name: string
  group: 'A' | 'B' | 'C'
  categories: CategoryTag[]
  brand: string
  vendor: string
  selling_price: number
  reference_cost_price: number
  profitMargin: number
  stock: StockDetail
  expDate: string
  collection: string
  country: string
  tags: string[]
  images: string[]
}

export interface PriceHistoryItem {
  id: string
  product_id: string
  changed_at: string
  old_price: number
  new_price: number
  changed_by: string
  staff: {
    full_name: string
    role: string
    avatar: string
  }
}