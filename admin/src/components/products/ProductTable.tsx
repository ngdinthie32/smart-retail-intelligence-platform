import type { Product, ProductCategory } from '../../types/product'

interface ProductTableProps {
  products: Product[]
  onEditPrice: (product: Product) => void
  onViewHistory: (product: Product) => void
}

const CATEGORY_STYLES: Record<ProductCategory, { bg: string; text: string }> = {
  Beverages:       { bg: 'rgba(0,114,206,0.09)',   text: '#005BA5' },
  Snacks:          { bg: 'rgba(245,166,35,0.11)',   text: '#A06000' },
  'Ready Meals':   { bg: 'rgba(0,165,80,0.09)',     text: '#006B30' },
  Dairy:           { bg: 'rgba(56,191,255,0.10)',   text: '#0080A0' },
  Bakery:          { bg: 'rgba(244,95,62,0.09)',    text: '#B83A1E' },
  Frozen:          { bg: 'rgba(124,77,255,0.09)',   text: '#5730B8' },
  'Personal Care': { bg: 'rgba(236,72,153,0.09)',   text: '#9D1A6A' },
  Household:       { bg: 'rgba(107,135,165,0.10)', text: '#3A567A' },
}

function CategoryBadge({ category }: { category: ProductCategory }) {
  const s = CATEGORY_STYLES[category]
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        color: s.text,
        background: s.bg,
        borderRadius: 999,
        padding: '3px 10px',
        whiteSpace: 'nowrap',
        letterSpacing: '0.01em',
      }}
    >
      {category}
    </span>
  )
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

function Margin({ cost, sell }: { cost: number; sell: number }) {
  const pct = Math.round(((sell - cost) / cost) * 100)
  const positive = pct >= 0
  return (
    <span
      style={{
        fontSize: 10.5,
        fontWeight: 600,
        color: positive ? '#006B30' : '#B83A1E',
        background: positive ? 'rgba(0,165,80,0.08)' : 'rgba(244,95,62,0.08)',
        borderRadius: 999,
        padding: '2px 7px',
        marginLeft: 4,
      }}
    >
      {positive ? '+' : ''}{pct}%
    </span>
  )
}

const COLUMNS = [
  { label: 'SKU',             width: 110 },
  { label: 'Product Name',    width: undefined },
  { label: 'Category',        width: 130 },
  { label: 'Brand',           width: 120 },
  { label: 'Cost Price',      width: 110 },
  { label: 'Selling Price',   width: 130 },
  { label: 'Actions',         width: 200 },
]

export default function ProductTable({ products, onEditPrice, onViewHistory }: ProductTableProps) {
  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: 24,
        boxShadow: '0 20px 40px rgba(0,114,206,0.08), 0 4px 16px rgba(0,0,0,0.04)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Inner glass highlight */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 24,
          background: 'linear-gradient(145deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 40%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div style={{ overflowX: 'auto', position: 'relative', zIndex: 1 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 860 }}>
          {/* Column group for widths */}
          <colgroup>
            {COLUMNS.map((col, i) => (
              <col key={i} style={col.width ? { width: col.width } : {}} />
            ))}
          </colgroup>

          {/* Head */}
          <thead>
            <tr
              style={{
                borderBottom: '1.5px solid #E6EDF6',
                background: 'rgba(243,245,249,0.60)',
              }}
            >
              {COLUMNS.map(col => (
                <th
                  key={col.label}
                  style={{
                    padding: '14px 16px',
                    textAlign: 'left',
                    fontSize: 10.5,
                    fontWeight: 700,
                    color: '#9AAFCB',
                    letterSpacing: '0.09em',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {products.map((p, idx) => (
              <tr
                key={p.id}
                style={{
                  borderBottom: idx < products.length - 1 ? '1px solid #F0F4FA' : 'none',
                  transition: 'background 0.13s',
                  cursor: 'default',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = '#F6FAFF' }}
                onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = 'transparent' }}
              >
                {/* SKU */}
                <td style={{ padding: '14px 16px' }}>
                  <span
                    style={{
                      fontFamily: "'DM Mono','Courier New',monospace",
                      fontSize: 12,
                      fontWeight: 600,
                      color: '#0072CE',
                      background: 'rgba(0,114,206,0.07)',
                      borderRadius: 8,
                      padding: '3px 8px',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {p.sku}
                  </span>
                </td>

                {/* Name */}
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: '#0B1E35', lineHeight: 1.3 }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: '#9AAFCB', marginTop: 2 }}>{p.branch}</div>
                </td>

                {/* Category */}
                <td style={{ padding: '14px 16px' }}>
                  <CategoryBadge category={p.category} />
                </td>

                {/* Brand */}
                <td style={{ padding: '14px 16px', fontSize: 13, color: '#3A567A', fontWeight: 500 }}>
                  {p.brand}
                </td>

                {/* Cost Price */}
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ fontSize: 13, color: '#5A7899', fontFamily: "'DM Mono','Courier New',monospace" }}>
                    {formatCurrency(p.reference_cost_price)}
                  </span>
                </td>

                {/* Selling Price */}
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#0B1E35', fontFamily: "'DM Mono','Courier New',monospace" }}>
                      {formatCurrency(p.selling_price)}
                    </span>
                    <Margin cost={p.reference_cost_price} sell={p.selling_price} />
                  </div>
                </td>

                {/* Actions */}
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => onEditPrice(p)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '7px 13px',
                        borderRadius: 10,
                        border: '1.5px solid #0072CE',
                        background: 'rgba(0,114,206,0.06)',
                        color: '#0072CE',
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        whiteSpace: 'nowrap',
                      }}
                      onMouseEnter={e => {
                        const el = e.currentTarget as HTMLButtonElement
                        el.style.background = '#0072CE'
                        el.style.color = '#fff'
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget as HTMLButtonElement
                        el.style.background = 'rgba(0,114,206,0.06)'
                        el.style.color = '#0072CE'
                      }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                      Edit Price
                    </button>
                    <button
                      onClick={() => onViewHistory(p)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '7px 13px',
                        borderRadius: 10,
                        border: '1.5px solid #E6EDF6',
                        background: 'rgba(243,245,249,0.8)',
                        color: '#5A7899',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        whiteSpace: 'nowrap',
                      }}
                      onMouseEnter={e => {
                        const el = e.currentTarget as HTMLButtonElement
                        el.style.borderColor = '#9AAFCB'
                        el.style.color = '#0B1E35'
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget as HTMLButtonElement
                        el.style.borderColor = '#E6EDF6'
                        el.style.color = '#5A7899'
                      }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                      Price History
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: '56px 16px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9AAFCB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <p style={{ color: '#9AAFCB', fontSize: 14, fontWeight: 500, margin: 0 }}>No products match your search.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
