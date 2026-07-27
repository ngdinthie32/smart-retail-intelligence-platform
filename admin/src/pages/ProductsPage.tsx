import { useState, useMemo } from 'react'
import ProductTable from '@/components/products/ProductTable'
import EditPriceModal from '@/components/products/EditPriceModal'
import PriceHistoryDrawer from '@/components/products/PriceHistoryDrawer'
import type { Product, PriceHistoryItem, EditPriceFormData, ProductCategory } from '@/types/product'

// ─── Seed data ────────────────────────────────────────────────────────────────
const SEED_PRODUCTS: Product[] = [
  { id:'p1',  sku:'SKU-001', name:'Green Tea Latte 250ml',    category:'Beverages',     brand:'FamilyMart',  reference_cost_price:1.20, selling_price:2.50,  stock:42,  branch:'Makati',   last_updated:'2024-07-10T09:15:00Z' },
  { id:'p2',  sku:'SKU-002', name:'Onigiri Tuna Mayo',        category:'Ready Meals',   brand:'FM Deli',     reference_cost_price:0.85, selling_price:1.80,  stock:28,  branch:'BGC Fort', last_updated:'2024-07-09T14:20:00Z' },
  { id:'p3',  sku:'SKU-003', name:'Mocha Frappe 500ml',       category:'Beverages',     brand:'FamilyMart',  reference_cost_price:1.60, selling_price:3.20,  stock:15,  branch:'Ortigas',  last_updated:'2024-07-11T08:00:00Z' },
  { id:'p4',  sku:'SKU-004', name:'Yakisoba Noodle Cup',      category:'Ready Meals',   brand:'Nissin',      reference_cost_price:0.60, selling_price:1.40,  stock:67,  branch:'QC North', last_updated:'2024-07-08T16:45:00Z' },
  { id:'p5',  sku:'SKU-005', name:'Egg Salad Sandwich',       category:'Bakery',        brand:'FM Deli',     reference_cost_price:1.10, selling_price:2.20,  stock:9,   branch:'Makati',   last_updated:'2024-07-11T07:30:00Z' },
  { id:'p6',  sku:'SKU-006', name:'Chilled Milk 300ml',       category:'Dairy',         brand:'Magnolia',    reference_cost_price:0.90, selling_price:1.75,  stock:55,  branch:'BGC Fort', last_updated:'2024-07-10T11:00:00Z' },
  { id:'p7',  sku:'SKU-007', name:'Choco Chip Cookies 150g',  category:'Snacks',        brand:'Rebisco',     reference_cost_price:0.75, selling_price:1.50,  stock:120, branch:'Makati',   last_updated:'2024-07-07T13:00:00Z' },
  { id:'p8',  sku:'SKU-008', name:'Hand Sanitizer 50ml',      category:'Personal Care', brand:'Safeguard',   reference_cost_price:1.40, selling_price:2.80,  stock:33,  branch:'Ortigas',  last_updated:'2024-07-09T10:20:00Z' },
  { id:'p9',  sku:'SKU-009', name:'Frozen Gyoza 200g',        category:'Frozen',        brand:'Ajinomoto',   reference_cost_price:2.10, selling_price:4.20,  stock:22,  branch:'QC North', last_updated:'2024-07-08T09:00:00Z' },
  { id:'p10', sku:'SKU-010', name:'Dish Soap 500ml',          category:'Household',     brand:'Joy',         reference_cost_price:1.80, selling_price:3.10,  stock:48,  branch:'BGC Fort', last_updated:'2024-07-06T15:30:00Z' },
  { id:'p11', sku:'SKU-011', name:'Iced Coffee Can 240ml',    category:'Beverages',     brand:'UCC',         reference_cost_price:1.30, selling_price:2.80,  stock:76,  branch:'Makati',   last_updated:'2024-07-11T06:50:00Z' },
  { id:'p12', sku:'SKU-012', name:'Steamed Bao Pork 80g',     category:'Bakery',        brand:'FM Deli',     reference_cost_price:0.95, selling_price:1.90,  stock:14,  branch:'Ortigas',  last_updated:'2024-07-10T07:15:00Z' },
]

const SEED_HISTORY: Record<string, PriceHistoryItem[]> = {
  p1: [
    { id:'h1', product_id:'p1', changed_at:'2024-07-10T09:15:00Z', old_price:2.20, new_price:2.50, changed_by:'admin_01', staff:{ full_name:'Maria Reyes', role:'HQ Admin', avatar:'MR' } },
    { id:'h2', product_id:'p1', changed_at:'2024-06-28T14:00:00Z', old_price:2.00, new_price:2.20, changed_by:'admin_01', staff:{ full_name:'James Lim',   role:'Manager',  avatar:'JL' } },
    { id:'h3', product_id:'p1', changed_at:'2024-06-01T10:30:00Z', old_price:2.10, new_price:2.00, changed_by:'admin_02', staff:{ full_name:'Sofia Cruz',  role:'HQ Admin', avatar:'SC' } },
  ],
  p2: [
    { id:'h4', product_id:'p2', changed_at:'2024-07-09T14:20:00Z', old_price:1.60, new_price:1.80, changed_by:'admin_02', staff:{ full_name:'Kevin Tan', role:'Manager', avatar:'KT' } },
    { id:'h5', product_id:'p2', changed_at:'2024-07-01T09:00:00Z', old_price:1.75, new_price:1.60, changed_by:'admin_01', staff:{ full_name:'Ana Lopez', role:'HQ Admin', avatar:'AL' } },
  ],
  p3: [
    { id:'h6', product_id:'p3', changed_at:'2024-07-11T08:00:00Z', old_price:3.00, new_price:3.20, changed_by:'admin_01', staff:{ full_name:'Bryan Go',   role:'Manager',  avatar:'BG' } },
  ],
  p5: [
    { id:'h7', product_id:'p5', changed_at:'2024-07-11T07:30:00Z', old_price:2.00, new_price:2.20, changed_by:'admin_02', staff:{ full_name:'Maria Reyes', role:'HQ Admin', avatar:'MR' } },
    { id:'h8', product_id:'p5', changed_at:'2024-07-03T11:00:00Z', old_price:2.15, new_price:2.00, changed_by:'admin_01', staff:{ full_name:'Sofia Cruz',  role:'HQ Admin', avatar:'SC' } },
  ],
}

const CATEGORIES: ProductCategory[] = [
  'Beverages','Snacks','Ready Meals','Dairy','Bakery','Frozen','Personal Care','Household',
]

const BRANCHES = ['All Branches', 'Makati', 'BGC Fort', 'Ortigas', 'QC North']

// ─── Toolbar ──────────────────────────────────────────────────────────────────
interface ToolbarProps {
  query: string
  onQuery: (v: string) => void
  category: string
  onCategory: (v: string) => void
  branch: string
  onBranch: (v: string) => void
  total: number
  filtered: number
}

function Toolbar({ query, onQuery, category, onCategory, branch, onBranch, total, filtered }: ToolbarProps) {
  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: 18,
        padding: '14px 18px',
        boxShadow: '0 4px 16px rgba(0,114,206,0.07), 0 1px 4px rgba(0,0,0,0.03)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexWrap: 'wrap',
      }}
    >
      {/* Search */}
      <div style={{ position: 'relative', flex: '1 1 220px', minWidth: 180 }}>
        <svg
          width="15" height="15" viewBox="0 0 24 24" fill="none"
          stroke="#9AAFCB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
        >
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="search"
          placeholder="Search by name, SKU, or brand…"
          value={query}
          onChange={e => onQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '9px 12px 9px 36px',
            borderRadius: 12,
            border: '1.5px solid #E6EDF6',
            background: '#FAFBFD',
            fontSize: 13,
            color: '#0B1E35',
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'border-color 0.15s, box-shadow 0.15s',
          }}
          onFocus={e => {
            e.currentTarget.style.borderColor = '#0072CE'
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,114,206,0.10)'
          }}
          onBlur={e => {
            e.currentTarget.style.borderColor = '#E6EDF6'
            e.currentTarget.style.boxShadow = 'none'
          }}
        />
      </div>

      {/* Category filter */}
      <select
        value={category}
        onChange={e => onCategory(e.target.value)}
        style={{
          padding: '9px 32px 9px 13px',
          borderRadius: 12,
          border: '1.5px solid #E6EDF6',
          background: '#FAFBFD',
          fontSize: 13,
          color: category === 'All Categories' ? '#9AAFCB' : '#0B1E35',
          fontWeight: 500,
          outline: 'none',
          cursor: 'pointer',
          appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolyline points='6 9 12 15 18 9' stroke='%239AAFCB' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 10px center',
          minWidth: 150,
        }}
      >
        <option>All Categories</option>
        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
      </select>

      {/* Branch filter */}
      <select
        value={branch}
        onChange={e => onBranch(e.target.value)}
        style={{
          padding: '9px 32px 9px 13px',
          borderRadius: 12,
          border: '1.5px solid #E6EDF6',
          background: '#FAFBFD',
          fontSize: 13,
          color: branch === 'All Branches' ? '#9AAFCB' : '#0B1E35',
          fontWeight: 500,
          outline: 'none',
          cursor: 'pointer',
          appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolyline points='6 9 12 15 18 9' stroke='%239AAFCB' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 10px center',
          minWidth: 140,
        }}
      >
        {BRANCHES.map(b => <option key={b}>{b}</option>)}
      </select>

      {/* Result count */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        <span style={{ fontSize: 12.5, color: '#9AAFCB', fontWeight: 500 }}>
          Showing{' '}
          <span style={{ fontWeight: 700, color: filtered < total ? '#0072CE' : '#0B1E35' }}>{filtered}</span>
          {' '}of{' '}
          <span style={{ fontWeight: 700, color: '#0B1E35' }}>{total}</span>
          {' '}products
        </span>
        {filtered < total && (
          <span style={{ fontSize: 11, fontWeight: 700, color: '#0072CE', background: 'rgba(0,114,206,0.08)', borderRadius: 999, padding: '2px 8px' }}>
            Filtered
          </span>
        )}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export function ProductsPage() {
  // Table data
  const [products, setProducts] = useState<Product[]>(SEED_PRODUCTS)
  const [history] = useState<Record<string, PriceHistoryItem[]>>(SEED_HISTORY)

  // Toolbar state
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All Categories')
  const [branch, setBranch] = useState('All Branches')

  // Modal / drawer state
  const [editData, setEditData] = useState<EditPriceFormData | null>(null)
  const [historyProduct, setHistoryProduct] = useState<Product | null>(null)

  // Filtered products
  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return products.filter(p => {
      const matchesQuery = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
      const matchesCategory = category === 'All Categories' || p.category === category
      const matchesBranch = branch === 'All Branches' || p.branch === branch
      return matchesQuery && matchesCategory && matchesBranch
    })
  }, [products, query, category, branch])

  function handleEditPrice(product: Product) {
    setEditData({
      product_id: product.id,
      sku: product.sku,
      name: product.name,
      current_price: product.selling_price,
      new_price: product.selling_price,
    })
  }

  function handleSavePrice(productId: string, newPrice: number) {
    setProducts(prev =>
      prev.map(p =>
        p.id === productId
          ? { ...p, selling_price: newPrice, last_updated: new Date().toISOString() }
          : p
      )
    )
    setEditData(null)
  }

  function handleViewHistory(product: Product) {
    setHistoryProduct(product)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%' }}>
      <Toolbar
        query={query}
        onQuery={setQuery}
        category={category}
        onCategory={setCategory}
        branch={branch}
        onBranch={setBranch}
        total={products.length}
        filtered={filtered.length}
      />

      <ProductTable
        products={filtered}
        onEditPrice={handleEditPrice}
        onViewHistory={handleViewHistory}
      />

      {/* Modals & drawers */}
      <EditPriceModal
        data={editData}
        onSave={handleSavePrice}
        onCancel={() => setEditData(null)}
      />

      <PriceHistoryDrawer
        product={historyProduct}
        history={historyProduct ? (history[historyProduct.id] ?? []) : []}
        onClose={() => setHistoryProduct(null)}
      />
    </div>
  )
}