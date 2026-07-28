import { useState, useEffect } from 'react'
import type { InventoryItem } from '@/types/inventory'

interface ExpandedRowDetailProps {
  item: InventoryItem
  onChange: (updated: InventoryItem) => void
}

export default function ExpandedRowDetail({ item, onChange }: ExpandedRowDetailProps) {
  const [imgIndex, setImgIndex] = useState(0)
  const [saved] = useState(true)

  // ✅ SỬA LOGIC: Dùng local state chuỗi cho Price & Cost để nhập mượt mà không bị lỗi .toFixed(2)
  const [priceInput, setPriceInput] = useState<string>(item.price?.toString() ?? '0')
  const [costInput, setCostInput] = useState<string>(item.cost?.toString() ?? '0')

  useEffect(() => {
    setPriceInput(item.price?.toString() ?? '0')
  }, [item.price])

  useEffect(() => {
    setCostInput(item.cost?.toString() ?? '0')
  }, [item.cost])

  const update = (patch: Partial<InventoryItem>) => onChange({ ...item, ...patch })

  const stockPatch = (patch: Partial<InventoryItem['stock']>) =>
    update({ stock: { ...item.stock, ...patch } })

  return (
    <div className="bg-[#F7F9FC] rounded-2xl mx-2 my-1 p-5 flex gap-6">
      {/* Left: image box */}
      <div className="flex-shrink-0 w-44 flex flex-col gap-2">
        <div className="w-44 h-44 rounded-2xl bg-white border border-slate-100 overflow-hidden shadow-sm flex items-center justify-center">
          {item.images[imgIndex] ? (
            <img
              src={item.images[imgIndex]}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-slate-300 text-xs text-center px-4">No image</div>
          )}
        </div>
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>
            {imgIndex + 1} of {item.images.length || 1}
          </span>
          <button
            onClick={() => setImgIndex((i) => Math.min(i + 1, item.images.length - 1))}
            className="text-slate-400 hover:text-[#0072CE] transition-colors"
          >
            →
          </button>
        </div>
        <button className="text-xs text-[#0072CE] hover:underline font-medium text-left">
          + Add image
        </button>
      </div>

      {/* Right: form grid */}
      <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
        {/* Display Name – spans full width */}
        <div className="col-span-2">
          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Display Name
          </label>
          <input
            value={item.name}
            onChange={(e) => update({ name: e.target.value })}
            className="w-full border-b border-slate-200 bg-transparent text-[#1E293B] font-medium text-sm pb-1 focus:outline-none focus:border-[#0072CE] transition-colors"
          />
        </div>

        {/* SKU */}
        <div>
          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            SKU
          </label>
          <input
            value={item.sku}
            onChange={(e) => update({ sku: e.target.value })}
            className="w-full border-b border-slate-200 bg-transparent text-[#1E293B] text-sm pb-1 focus:outline-none focus:border-[#0072CE] transition-colors font-mono"
          />
        </div>

        {/* Barcode */}
        <div>
          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Barcode
          </label>
          <input
            value={item.barcode}
            onChange={(e) => update({ barcode: e.target.value })}
            className="w-full border-b border-slate-200 bg-transparent text-[#1E293B] text-sm pb-1 focus:outline-none focus:border-[#0072CE] transition-colors font-mono"
          />
        </div>

        {/* Brand */}
        <div>
          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Brand
          </label>
          <div className="relative">
            <select
              value={item.brand}
              onChange={(e) => update({ brand: e.target.value })}
              className="w-full border-b border-slate-200 bg-transparent text-[#1E293B] text-sm pb-1 focus:outline-none focus:border-[#0072CE] transition-colors appearance-none pr-4"
            >
              <option>Elizavecca</option>
              <option>Cosrx</option>
              <option>Laneige</option>
            </select>
            <span className="absolute right-0 top-0 text-slate-400 pointer-events-none text-xs">▾</span>
          </div>
        </div>

        {/* Vendor */}
        <div>
          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Vendor
          </label>
          <div className="relative">
            <select
              value={item.vendor}
              onChange={(e) => update({ vendor: e.target.value })}
              className="w-full border-b border-slate-200 bg-transparent text-[#1E293B] text-sm pb-1 focus:outline-none focus:border-[#0072CE] transition-colors appearance-none pr-4"
            >
              <option>Koreacosm.com</option>
              <option>Seoul Beauty</option>
            </select>
            <span className="absolute right-0 top-0 text-slate-400 pointer-events-none text-xs">▾</span>
          </div>
        </div>

        {/* Stock Stats */}
        <div className="col-span-2">
          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Stock
          </label>
          <div className="flex gap-3">
            <StockStat
              label="Total"
              value={item.stock.total}
              onChange={(v) => stockPatch({ total: v })}
            />
            <StockStat
              label="Site"
              value={item.stock.site}
              onChange={(v) => stockPatch({ site: v })}
            />
            <StockStat
              label="Reserved"
              value={item.stock.reserved}
              onChange={(v) => stockPatch({ reserved: v })}
              highlight
            />
          </div>
        </div>

        {/* Price */}
        <div>
          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Price
          </label>
          <div className="flex items-center gap-2">
            <input
              value={priceInput}
              onChange={(e) => {
                const val = e.target.value
                setPriceInput(val)
                const num = parseFloat(val)
                if (!isNaN(num)) {
                  update({ price: num })
                }
              }}
              className="w-full border-b border-slate-200 bg-transparent text-[#1E293B] text-sm pb-1 focus:outline-none focus:border-[#0072CE] transition-colors font-mono"
            />
            <span className="flex-shrink-0 px-2 py-0.5 rounded-full bg-[#00A550]/10 text-[#00A550] text-[10px] font-bold whitespace-nowrap">
              {item.profitMargin}%
            </span>
          </div>
        </div>

        {/* Cost */}
        <div>
          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Cost
          </label>
          <input
            value={costInput}
            onChange={(e) => {
              const val = e.target.value
              setCostInput(val)
              const num = parseFloat(val)
              if (!isNaN(num)) {
                update({ cost: num })
              }
            }}
            className="w-full border-b border-slate-200 bg-transparent text-[#1E293B] text-sm pb-1 focus:outline-none focus:border-[#0072CE] transition-colors font-mono"
          />
        </div>

        {/* Exp Date */}
        <div>
          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Exp Date
          </label>
          <input
            value={item.expDate}
            onChange={(e) => update({ expDate: e.target.value })}
            className="w-full border-b border-slate-200 bg-transparent text-[#1E293B] text-sm pb-1 focus:outline-none focus:border-[#0072CE] transition-colors"
            placeholder="MM/YYYY"
          />
        </div>

        {/* Collection */}
        <div>
          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Collection
          </label>
          <input
            value={item.collection}
            onChange={(e) => update({ collection: e.target.value })}
            className="w-full border-b border-slate-200 bg-transparent text-[#1E293B] text-sm pb-1 focus:outline-none focus:border-[#0072CE] transition-colors"
          />
        </div>

        {/* Country */}
        <div>
          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Country
          </label>
          <input
            value={item.country}
            onChange={(e) => update({ country: e.target.value })}
            className="w-full border-b border-slate-200 bg-transparent text-[#1E293B] text-sm pb-1 focus:outline-none focus:border-[#0072CE] transition-colors"
          />
        </div>

        {/* Tags */}
        <div className="col-span-2">
          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium"
              >
                {tag}
              </span>
            ))}
            <button className="px-2.5 py-1 rounded-full border border-dashed border-slate-300 text-slate-400 text-[11px] hover:border-[#0072CE] hover:text-[#0072CE] transition-colors">
              + add
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="col-span-2 flex items-center justify-between pt-2 border-t border-slate-100 mt-1">
          <button className="text-xs font-semibold text-[#0072CE] hover:underline">
            Advanced edit
          </button>
          {saved && (
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#00A550]">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              AUTOMATICALLY SAVED
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function StockStat({
  label,
  value,
  onChange,
  highlight,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  highlight?: boolean
}) {
  return (
    <div className={`flex-1 rounded-xl px-3 py-2.5 text-center ${highlight ? 'bg-red-50' : 'bg-white border border-slate-100'}`}>
      <div
        className={`text-xl font-bold ${highlight ? 'text-[#EF4444]' : 'text-[#1E293B]'}`}
      >
        <input
          type="number"
          value={value ?? 0}
          onChange={(e) => onChange(parseInt(e.target.value, 10) || 0)}
          className="w-full text-center bg-transparent focus:outline-none"
        />
      </div>
      <div className="text-[10px] text-slate-400 font-medium mt-0.5">{label}</div>
    </div>
  )
}