import { useState, useEffect, useRef } from 'react'
import type { Branch, BranchInventory, MovementType } from '@/types/inventory'

interface StockMovementModalProps {
  branches: Branch[]
  inventoryRows: BranchInventory[]
  initialProductId?: string
  initialBranchId?: string
  initialMovementType?: MovementType
  onClose: () => void
  onSubmit: (payload: {
    branch_id: string
    product_id: string
    movement_type: MovementType
    quantity_change: number
    note: string
  }) => void
}

const MOVEMENT_TYPES: { value: MovementType; label: string; sub: string; color: string; bg: string; activeBg: string; activeText: string }[] = [
  { value: 'purchase', label: 'Nhập hàng', sub: 'purchase', color: 'text-[#00A550]', bg: 'bg-[#00A550]/8', activeBg: 'bg-[#00A550]', activeText: 'text-white' },
  { value: 'adjustment', label: 'Điều chỉnh', sub: 'adjustment', color: 'text-[#0072CE]', bg: 'bg-[#0072CE]/8', activeBg: 'bg-[#0072CE]', activeText: 'text-white' },
  { value: 'transfer', label: 'Chuyển hàng', sub: 'transfer', color: 'text-amber-600', bg: 'bg-amber-50', activeBg: 'bg-amber-500', activeText: 'text-white' },
]

export default function StockMovementModal({
  branches,
  inventoryRows,
  initialProductId,
  initialBranchId,
  initialMovementType = 'purchase',
  onClose,
  onSubmit,
}: StockMovementModalProps) {
  const [movementType, setMovementType] = useState<MovementType>(initialMovementType)
  const [branchId, setBranchId] = useState(initialBranchId ?? branches[0]?.id ?? '')
  const [productId, setProductId] = useState(initialProductId ?? '')
  const [quantity, setQuantity] = useState(1)
  const [note, setNote] = useState('')
  const [productSearch, setProductSearch] = useState('')
  const [productDropOpen, setProductDropOpen] = useState(false)
  const productDropRef = useRef<HTMLDivElement>(null)

  // Current stock for selected product+branch
  const currentRow = inventoryRows.find(
    (r) => r.product_id === productId && r.branch_id === branchId
  )
  const currentStock = currentRow?.current_stock ?? 0
  const projectedStock = currentStock + quantity

  // Seed product name in search when modal opens with a preset
  useEffect(() => {
    if (initialProductId) {
      const row = inventoryRows.find((r) => r.product_id === initialProductId)
      if (row) setProductSearch(row.product_name)
    }
  }, [initialProductId, inventoryRows])

  // Unique products list
  const uniqueProducts = Array.from(
    new Map(inventoryRows.map((r) => [r.product_id, r])).values()
  )
  const filteredProducts = uniqueProducts.filter(
    (p) =>
      p.product_name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearch.toLowerCase())
  )

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (productDropRef.current && !productDropRef.current.contains(e.target as Node)) {
        setProductDropOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSubmit = () => {
    if (!branchId || !productId) return
    onSubmit({ branch_id: branchId, product_id: productId, movement_type: movementType, quantity_change: quantity, note })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#1E293B]/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative bg-white rounded-3xl w-full max-w-lg overflow-hidden"
        style={{ boxShadow: '0 40px 80px rgba(0,114,206,0.18)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-[#1E293B]">Tạo Phiếu Biến Động Kho</h2>
            <p className="text-[11px] text-[#64748B] mt-0.5">Ghi nhận biến động tồn kho tại chi nhánh</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-5">

          {/* Movement type segmented control */}
          <div>
            <FieldLabel>Loại giao dịch</FieldLabel>
            <div className="flex gap-2 mt-2">
              {MOVEMENT_TYPES.map((mt) => {
                const active = movementType === mt.value
                return (
                  <button
                    key={mt.value}
                    onClick={() => setMovementType(mt.value)}
                    className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 px-3 rounded-xl border transition-all text-center ${
                      active
                        ? `${mt.activeBg} ${mt.activeText} border-transparent shadow-sm`
                        : `bg-white border-slate-200 ${mt.color} hover:border-current`
                    }`}
                  >
                    <span className="text-xs font-bold">{mt.label}</span>
                    <span className={`text-[9px] font-mono ${active ? 'opacity-70' : 'opacity-50'}`}>{mt.sub}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Branch selector */}
          <div>
            <FieldLabel>Chọn Chi nhánh</FieldLabel>
            <div className="relative mt-2">
              <select
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-[#1E293B] focus:outline-none focus:border-[#0072CE] transition-colors pr-8"
              >
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none">▾</span>
            </div>
          </div>

          {/* Product searchable dropdown */}
          <div>
            <FieldLabel>Chọn Sản phẩm</FieldLabel>
            <div className="relative mt-2" ref={productDropRef}>
              <div
                className={`flex items-center gap-2 bg-slate-50 border rounded-xl px-3.5 py-2.5 cursor-text transition-colors ${
                  productDropOpen ? 'border-[#0072CE]' : 'border-slate-200'
                }`}
                onClick={() => setProductDropOpen(true)}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-slate-400 flex-shrink-0">
                  <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3" />
                  <path d="M9.5 9.5l2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
                <input
                  value={productSearch}
                  onChange={(e) => { setProductSearch(e.target.value); setProductDropOpen(true) }}
                  placeholder="Tìm SKU hoặc tên sản phẩm…"
                  className="flex-1 bg-transparent text-sm text-[#1E293B] placeholder:text-slate-400 focus:outline-none"
                />
                {productId && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setProductId(''); setProductSearch('') }}
                    className="text-slate-400 hover:text-slate-600 text-xs"
                  >×</button>
                )}
              </div>

              {productDropOpen && filteredProducts.length > 0 && (
                <div
                  className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl border border-slate-100 py-1 z-10 max-h-48 overflow-y-auto"
                  style={{ boxShadow: '0 20px 40px rgba(0,114,206,0.12)' }}
                >
                  {filteredProducts.map((p) => (
                    <button
                      key={p.product_id}
                      onClick={() => {
                        setProductId(p.product_id)
                        setProductSearch(p.product_name)
                        setProductDropOpen(false)
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-50 transition-colors ${
                        productId === p.product_id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden">
                        <img src={p.product_image} alt={p.product_name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-[#1E293B] truncate">{p.product_name}</p>
                        <p className="text-[10px] font-mono text-[#64748B]">{p.sku}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quantity with +/- buttons */}
          <div>
            <FieldLabel>Số lượng biến động</FieldLabel>
            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={() => setQuantity((q) => q - 1)}
                className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-[#1E293B] text-lg font-bold hover:bg-slate-200 transition-colors flex-shrink-0"
              >
                −
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                className="flex-1 text-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-[#1E293B] focus:outline-none focus:border-[#0072CE] transition-colors tabular-nums"
              />
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-[#1E293B] text-lg font-bold hover:bg-slate-200 transition-colors flex-shrink-0"
              >
                +
              </button>
            </div>

            {/* Live preview */}
            {productId && (
              <div className="mt-2.5 flex items-center gap-2 text-xs text-[#64748B]">
                <span>Tồn mới dự kiến:</span>
                <span className="font-bold text-[#1E293B]">{currentStock}</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-slate-400">
                  <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span
                  className={`font-bold ${
                    projectedStock < 0 ? 'text-[#EF4444]' : projectedStock > currentStock ? 'text-[#00A550]' : 'text-amber-600'
                  }`}
                >
                  {projectedStock}
                </span>
                <span className={`ml-0.5 text-[10px] ${quantity >= 0 ? 'text-[#00A550]' : 'text-[#EF4444]'}`}>
                  ({quantity >= 0 ? '+' : ''}{quantity})
                </span>
              </div>
            )}
          </div>

          {/* Note */}
          <div>
            <FieldLabel>Ghi chú</FieldLabel>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ví dụ: Kiểm kê tháng 7, Hàng hư hỏng…"
              rows={2}
              className="w-full mt-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:border-[#0072CE] transition-colors resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-[#64748B] hover:bg-slate-100 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={!branchId || !productId}
            className="px-5 py-2.5 rounded-xl bg-[#0072CE] text-white text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ boxShadow: '0 4px 12px rgba(0,114,206,0.3)' }}
          >
            Xác nhận gửi phiếu
          </button>
        </div>
      </div>
    </div>
  )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[10px] font-semibold text-[#64748B] uppercase tracking-wider">
      {children}
    </label>
  )
}
