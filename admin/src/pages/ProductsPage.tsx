import { useState } from 'react'
import type { Product, PriceHistoryItem } from '@/types/product'
import ProductTable from '@/components/products/ProductTable'
import InventorySidebar from '@/components/inventory/InventorySidebar'

// ── Seed Data Sản Phẩm ───────────────────────────────────────────────────
const SEED_PRODUCTS: Product[] = [
  {
    id: '1',
    sku: '101-elz',
    barcode: '8809418750101',
    name: 'Elizavecca Milky Piggy Collagen Jella Pack',
    group: 'A',
    categories: [
      { id: 'c1', path: 'Cosmetics / Masks / Collagen' },
      { id: 'c2', path: 'Cosmetics / Creams / Antiage' },
    ],
    brand: 'Elizavecca',
    vendor: 'Koreacosm.com',
    selling_price: 12.0,
    reference_cost_price: 5.2,
    profitMargin: 130,
    stock: { total: 45, site: 40, reserved: 5 },
    expDate: '06/2025',
    collection: 'Collagen Series',
    country: 'South Korea',
    tags: ['collagen', 'jella', 'pack'],
    images: [
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop&auto=format',
    ],
  },
  {
    id: '2',
    sku: '204-elz',
    barcode: '8809418750204',
    name: 'Elizavecca Milky Piggy Vitamin C 23% Serum',
    group: 'A',
    categories: [{ id: 'c3', path: 'Cosmetics / Serums / Vitamin C' }],
    brand: 'Elizavecca',
    vendor: 'Koreacosm.com',
    selling_price: 18.5,
    reference_cost_price: 7.8,
    profitMargin: 137,
    stock: { total: 30, site: 28, reserved: 2 },
    expDate: '11/2024',
    collection: 'Vitamin C Boosters',
    country: 'South Korea',
    tags: ['vitamin-c', 'serum', 'brightening'],
    images: [
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=200&h=200&fit=crop&auto=format',
    ],
  },
  {
    id: '3',
    sku: '399-elz',
    barcode: '8809418750673',
    name: 'Elizavecca Milky Piggy EGF Retinol Cream',
    group: 'B',
    categories: [
      { id: 'c4', path: 'Cosmetics / Creams / Antiage' },
      { id: 'c5', path: 'Cosmetics / Creams / Retinol' },
    ],
    brand: 'Elizavecca',
    vendor: 'Koreacosm.com',
    selling_price: 10.0,
    reference_cost_price: 4.29,
    profitMargin: 105,
    stock: { total: 23, site: 20, reserved: 3 },
    expDate: '02/2022',
    collection: 'Retinol Creams',
    country: 'South Korea',
    tags: ['egf', 'retinol', 'creams'],
    images: [
      'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=200&h=200&fit=crop&auto=format',
    ],
  },
]

// ── Seed Lịch sử Giá ──────────────────────────────────────────────────────
const SEED_HISTORY: Record<string, PriceHistoryItem[]> = {
  '1': [
    {
      id: 'h1',
      product_id: '1',
      changed_at: '2024-07-10T09:15:00Z',
      old_price: 10.5,
      new_price: 12.0,
      changed_by: 'admin_01',
      staff: { full_name: 'Maria Reyes', role: 'HQ Admin', avatar: 'MR' },
    },
  ],
  '2': [
    {
      id: 'h2',
      product_id: '2',
      changed_at: '2024-07-09T14:20:00Z',
      old_price: 17.0,
      new_price: 18.5,
      changed_by: 'admin_02',
      staff: { full_name: 'Kevin Tan', role: 'Manager', avatar: 'KT' },
    },
  ],
}

export function ProductsPage() {
  const [items, setItems] = useState<Product[]>(SEED_PRODUCTS)
  const [catalogSearch, setCatalogSearch] = useState('')
  const [categoryFilter] = useState('Cosmetics')
  const [brandFilter] = useState('Elizavecca')

  const filteredCatalog = items.filter((item) => {
    const q = catalogSearch.toLowerCase()
    return !q || item.name.toLowerCase().includes(q) || item.sku.toLowerCase().includes(q)
  })

  return (
    <div className="w-full flex gap-6 items-start p-8">
      {/* Cột trái (~75%): Bộ lọc + Bảng ProductTable */}
      <div className="flex-1 min-w-0 flex flex-col gap-4">
        {/* Thanh Bộ Lọc */}
        <div className="flex items-center gap-3 flex-wrap">
          <PillDropdown label="Category" value={categoryFilter} />
          <PillDropdown label="Brand" value={brandFilter} />
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-3.5 py-2 flex-1 max-w-72 shadow-sm">
            <SearchIcon size={14} />
            <input
              value={catalogSearch}
              onChange={(e) => setCatalogSearch(e.target.value)}
              placeholder="Tìm nhanh sản phẩm, SKU…"
              className="flex-1 bg-transparent text-xs text-[#1E293B] placeholder:text-slate-400 focus:outline-none"
            />
          </div>
          <button className="ml-auto text-sm font-semibold text-[#0072CE] hover:text-blue-700 transition-colors flex items-center gap-1">
            <span className="text-base leading-none">+</span> Thêm sản phẩm
          </button>
        </div>

        {/* Bảng Danh sách Sản phẩm - Tự quản lý Drawer với priceHistoryData */}
        <ProductTable
          items={filteredCatalog}
          priceHistoryData={SEED_HISTORY}
          onItemChange={(updated) =>
            setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)))
          }
        />
      </div>

      {/* Cột phải (~25%): Sidebar tổng quan */}
      <InventorySidebar />
    </div>
  )
}

function PillDropdown({ label, value }: { label: string; value: string }) {
  return (
    <button className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-full px-3.5 py-2 text-xs font-medium text-[#1E293B] shadow-sm hover:border-[#0072CE]">
      <span className="text-[#64748B]">{label}:</span>
      <span className="font-semibold">{value}</span>
      <span className="text-[10px] text-slate-400 ml-0.5">▾</span>
    </button>
  )
}

function SearchIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className="text-slate-400 flex-shrink-0">
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}