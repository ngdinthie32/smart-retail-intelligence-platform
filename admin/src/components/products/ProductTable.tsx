import { useState } from 'react'
import type { Product } from '@/types/product'
import PriceHistoryDrawer from './PriceHistoryDrawer'
import ExpandedRowDetail from './ExpandedRowDetail'
import CategoryPopover from './CategoryPopover'

interface ProductTableProps {
  products?: Product[]
  items?: Product[]
  priceHistoryData?: Record<string, any[]>
  onUpdateProduct?: (product: Product) => void
  onItemChange?: (product: Product) => void
  onViewHistory?: (product: Product) => void
}

const GROUP_COLORS: Record<string, string> = {
  A: 'bg-[#0072CE]/10 text-[#0072CE]',
  B: 'bg-amber-100 text-amber-700',
  C: 'bg-slate-100 text-slate-600',
}

export default function ProductTable({
  products,
  items,
  priceHistoryData = {},
  onUpdateProduct,
  onItemChange,
  onViewHistory,
}: ProductTableProps) {
  const productList = products || items || []

  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [expanded, setExpanded] = useState<string | null>(null)
  const [selectedHistoryProduct, setSelectedHistoryProduct] = useState<Product | null>(null)

  const [popover, setPopover] = useState<{
    itemId: string
    rect: DOMRect
  } | null>(null)

  const allSelected = selected.size === productList.length && productList.length > 0

  const toggleAll = () => {
    setSelected(allSelected ? new Set() : new Set(productList.map((p) => p.id)))
  }

  const toggleOne = (id: string) => {
    const next = new Set(selected)
    next.has(id) ? next.delete(id) : next.add(id)
    setSelected(next)
  }

  const toggleExpand = (id: string) => {
    setExpanded((prev) => (prev === id ? null : id))
    setPopover(null)
  }

  const openPopover = (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation()
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setPopover({ itemId, rect })
  }

  const popoverProduct = popover ? productList.find((p) => p.id === popover.itemId) : null
  const handleUpdate = onUpdateProduct || onItemChange

  return (
    <div className="relative">
      {/* Top Filter & Control Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 bg-[#0072CE] text-white text-xs font-bold px-4 py-2 rounded-full shadow-sm shadow-[#0072CE]/30">
            ALL PRODUCTS
            <span className="text-[10px] opacity-80">▾</span>
          </button>
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Hiển thị <b>{productList.length}</b> sản phẩm
        </span>
      </div>

      {/* Main Table Container */}
      <div
        className="bg-white rounded-3xl overflow-hidden border border-slate-100"
        style={{ boxShadow: '0px 20px 40px rgba(0, 114, 206, 0.08)' }}
      >
        {/* Header */}
        <div
          className="grid items-center px-5 py-3 border-b border-slate-100 text-[10px] font-semibold text-[#64748B] uppercase tracking-widest"
          style={{ gridTemplateColumns: '32px 36px 85px 1fr 55px 110px 80px 80px 85px 32px' }}
        >
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleAll}
            className="w-3.5 h-3.5 accent-[#0072CE] rounded cursor-pointer"
          />
          <span>#</span>
          <span>SKU</span>
          <span>Tên Sản Phẩm</span>
          <span>Nhóm</span>
          <span>Danh Mục</span>
          <span>Giá Bán</span>
          <span>Stock</span>
          <span className="text-center">Thao tác</span>
          <span />
        </div>

        {/* Rows */}
        <div className="flex flex-col">
          {productList.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 font-medium">
              Không tìm thấy sản phẩm nào.
            </div>
          ) : (
            productList.map((product, idx) => {
              const isExpanded = expanded === product.id
              const isSelected = selected.has(product.id)

              const displayImage = (product as any).images?.[0]
              const categories = (product as any).categories || []
              const price = product.selling_price ?? (product as any).price ?? 0
              const cost = product.reference_cost_price ?? (product as any).cost ?? 0

              const stockObj = (product as any).stock || {}
              const siteStock = stockObj.site ?? (product as any).stock_quantity ?? 0
              const totalStock = stockObj.total ?? siteStock

              return (
                <div key={product.id}>
                  {/* Product Main Row */}
                  <div
                    className={`grid items-center px-5 py-3.5 cursor-pointer transition-colors hover:bg-slate-50/80 ${
                      isExpanded ? 'bg-slate-50/90' : ''
                    } ${isSelected ? 'bg-blue-50/40' : ''} ${
                      idx !== productList.length - 1 ? 'border-b border-slate-100/70' : ''
                    }`}
                    style={{ gridTemplateColumns: '32px 36px 85px 1fr 55px 110px 80px 80px 85px 32px' }}
                    onClick={() => toggleExpand(product.id)}
                  >
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleOne(product.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-3.5 h-3.5 accent-[#0072CE] rounded cursor-pointer"
                    />

                    {/* STT */}
                    <span className="text-xs text-[#64748B] font-medium">{idx + 1}</span>

                    {/* SKU Badge */}
                    <div>
                      <span className="font-mono text-[11px] font-semibold text-[#0072CE] bg-[#0072CE]/10 px-2 py-0.5 rounded-md">
                        {product.sku}
                      </span>
                    </div>

                    {/* Name + Thumbnail */}
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden border border-slate-200/60 flex items-center justify-center">
                        {displayImage ? (
                          <img src={displayImage} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] text-slate-400 font-bold">
                            {product.name ? product.name.slice(0, 2).toUpperCase() : 'PR'}
                          </span>
                        )}
                      </div>
                      <div className="truncate">
                        <span className="text-xs font-medium text-[#1E293B] truncate block leading-snug">
                          {product.name}
                        </span>
                        {product.brand && (
                          <span className="text-[10px] text-slate-400 block font-normal">{product.brand}</span>
                        )}
                      </div>
                    </div>

                    {/* Group Badge */}
                    <div>
                      <span
                        className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          GROUP_COLORS[(product as any).group || 'A']
                        }`}
                      >
                        {(product as any).group || 'A'}
                      </span>
                    </div>

                    {/* Category Trigger */}
                    <button
                      onClick={(e) => openPopover(e, product.id)}
                      className="text-[11px] font-medium text-[#64748B] hover:text-[#0072CE] transition-colors text-left truncate"
                    >
                      {categories[0]?.path ? categories[0].path.split(' / ')[1] : (product as any).category || '—'}
                      {categories.length > 1 && (
                        <span className="ml-1 text-[9px] bg-slate-100 rounded-full px-1.5 py-0.5 text-slate-600">
                          +{categories.length - 1}
                        </span>
                      )}
                    </button>

                    {/* Price */}
                    <span className="text-xs font-mono font-bold text-[#0B1E35]">
                      ${typeof price === 'number' ? price.toFixed(2) : price}
                    </span>

                    {/* Stock */}
                    <div className="text-xs font-mono font-medium">
                      <span className="font-bold text-[#0B1E35]">{siteStock}</span>
                      <span className="text-slate-400 font-normal"> / {totalStock}</span>
                    </div>

                    {/* Nút "L.sử" xem lịch sử giá */}
                    <div className="flex items-center justify-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          e.preventDefault()
                          setSelectedHistoryProduct(product)
                          if (onViewHistory) onViewHistory(product)
                        }}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-[#0072CE]/10 hover:border-[#0072CE] hover:text-[#0072CE] text-[#5A7899] text-[11px] font-semibold transition-all shadow-2xs"
                        title="Xem lịch sử thay đổi giá"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/>
                          <polyline points="12 6 12 12 16 14"/>
                        </svg>
                        L.sử
                      </button>
                    </div>

                    {/* Expand Chevron */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleExpand(product.id)
                      }}
                      className={`text-slate-400 hover:text-[#0072CE] transition-all flex justify-end ${
                        isExpanded ? 'rotate-180 text-[#0072CE]' : ''
                      }`}
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>

                  {/* Expanded Row Detail */}
                  {isExpanded && (
                    <div className="px-2 pb-3 bg-slate-50/50">
                      <ExpandedRowDetail
                        item={{
                          id: product.id,
                          sku: product.sku,
                          name: product.name,
                          barcode: (product as any).barcode || '880123456789',
                          brand: product.brand || 'Elizavecca',
                          vendor: (product as any).vendor || 'Koreacosm.com',
                          stock: stockObj,
                          price: price,
                          cost: cost,
                          profitMargin: cost > 0 ? Math.round(((price - cost) / cost) * 100) : 0,
                          expDate: (product as any).expDate || '12/2026',
                          collection: (product as any).collection || 'Standard',
                          country: (product as any).country || 'South Korea',
                          tags: (product as any).tags || [],
                          images: (product as any).images || [],
                          group: (product as any).group || 'A',
                          categories: categories,
                        }}
                        onChange={(updatedItem) => {
                          if (handleUpdate) {
                            handleUpdate({
                              ...product,
                              name: updatedItem.name,
                              sku: updatedItem.sku,
                              selling_price: updatedItem.price,
                              reference_cost_price: updatedItem.cost,
                              brand: updatedItem.brand,
                              stock: updatedItem.stock,
                              barcode: updatedItem.barcode,
                              vendor: updatedItem.vendor,
                              expDate: updatedItem.expDate,
                              collection: updatedItem.collection,
                              country: updatedItem.country,
                              tags: updatedItem.tags,
                            } as Product)
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Popover danh mục */}
      {popover && popoverProduct && (
        <CategoryPopover
          categories={(popoverProduct as any).categories || []}
          anchorRect={popover.rect}
          onRemove={() => {}}
          onAdd={() => {}}
          onClose={() => setPopover(null)}
        />
      )}

      {/* Price History Drawer */}
      <PriceHistoryDrawer
        product={selectedHistoryProduct}
        history={selectedHistoryProduct ? priceHistoryData[selectedHistoryProduct.id] || [] : []}
        onClose={() => setSelectedHistoryProduct(null)}
      />
    </div>
  )
}