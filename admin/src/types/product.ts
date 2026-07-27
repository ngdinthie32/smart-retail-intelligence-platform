export type ProductCategory =
  | 'Beverages'
  | 'Snacks'
  | 'Ready Meals'
  | 'Dairy'
  | 'Bakery'
  | 'Frozen'
  | 'Personal Care'
  | 'Household'

export interface Product {
  id: string
  sku: string
  name: string
  category: ProductCategory
  brand: string
  reference_cost_price: number
  selling_price: number
  stock: number
  branch: string
  last_updated: string
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

export interface EditPriceFormData {
  product_id: string
  sku: string
  name: string
  current_price: number
  new_price: number
}
