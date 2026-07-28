import { useState } from 'react'
import type { BranchInventory, Branch } from '@/types/inventory'

interface BranchStockTableProps {
  rows: BranchInventory[]
  branches: Branch[]
  onOpenModal: (productId?: string, branchId?: string) => void
}

export default function BranchStockTable({ rows, branches, onOpenModal }: BranchStockTableProps) {
  const [branchFilter, setBranchFilter] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const filtered = rows.filter((r) => {
    const matchBranch = branchFilter === 'all' || r.branch_id === branchFilter
    const q = search.toLowerCase()
    const matchSearch = !q || r.sku.toLowerCase().includes(q) || r.product_name.toLowerCase().includes(q)
    return matchBranch && matchSearch
  })

  const selectedBranchName =
    branchFilter === 'all'
      ? 'Toàn chuỗi'
      : branches.find((b) => b.id === branchFilter)?.name ?? 'All Branches'

  return (
    <div className="flex flex-col gap-4">
      {/* Filter bar */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Branch dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2 text-xs font-medium text-[#1E293B] hover:border-[#0072CE] hover:text-[#0072CE] transition-colors"
            style={{ boxShadow: '0 2px 8px rgba(0,114,206,0.06)' }}
          >
            <span className="text-[#64748B]">Chi nhánh:</span>
            <span className="font-semibold">{selectedBranchName}</span>
            <span className="text-[10px] text-slate-400">▾</span>
          </button>

          {dropdownOpen && (
            <div
              className="absolute top-full left-0 mt-2 bg-white rounded-2xl border border-slate-100 py-2 z-30 min-w-52"
              style={{ boxShadow: '0 20px 40px rgba(0,114,206,0.12)' }}
            >
              {[{ id: 'all', name: 'Toàn chuỗi / All Branches' }, ...branches].map((b) => (
                <button
                  key={b.id}
                  onClick={() => { setBranchFilter(b.id); setDropdownOpen(false) }}
                  className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors ${
                    branchFilter === b.id
                      ? 'text-[#0072CE] bg-blue-50'
                      : 'text-[#1E293B] hover:bg-slate-50'
                  }`}
                >
                  {b.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search */}
        <div
          className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-3.5 py-2 flex-1 max-w-72"
          style={{ boxShadow: '0 2px 8px rgba(0,114,206,0.06)' }}
        >
          <SearchIcon />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm SKU hoặc tên sản phẩm…"
            className="flex-1 bg-transparent text-xs text-[#1E293B] placeholder:text-slate-400 focus:outline-none"
          />
        </div>

        <span className="ml-auto text-xs text-[#64748B]">
          {filtered.length} sản phẩm
        </span>
      </div>

      {/* Table card */}
      <div
        className="bg-white rounded-3xl overflow-hidden"
        style={{ boxShadow: '0px 20px 40px rgba(0, 114, 206, 0.08)' }}
      >
        {/* Header */}
        <div
          className="grid px-5 py-3 border-b border-slate-100 text-[10px] font-semibold text-[#64748B] uppercase tracking-widest"
          style={{ gridTemplateColumns: '160px 90px 1fr 100px 110px 140px 100px' }}
        >
          <span>Chi nhánh</span>
          <span>Mã SKU</span>
          <span>Tên Sản phẩm</span>
          <span className="text-right">Tồn thực tế</span>
          <span className="text-right">Ngưỡng cảnh báo</span>
          <span className="text-center">Trạng thái</span>
          <span className="text-right">Thao tác</span>
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-slate-400">
            Không có dữ liệu phù hợp.
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-slate-50">
            {filtered.map((row) => {
              const safe = row.current_stock > row.reorder_level
              return (
                <div
                  key={row.id}
                  className="grid items-center px-5 py-3.5 hover:bg-slate-50/70 transition-colors"
                  style={{ gridTemplateColumns: '160px 90px 1fr 100px 110px 140px 100px' }}
                >
                  {/* Branch */}
                  <span className="text-xs font-medium text-[#1E293B] truncate">{row.branch_name}</span>

                  {/* SKU */}
                  <span className="text-xs font-mono text-[#64748B]">{row.sku}</span>

                  {/* Product name + thumbnail */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden">
                      <img src={row.product_image} alt={row.product_name} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs font-medium text-[#1E293B] truncate leading-snug">
                      {row.product_name}
                    </span>
                  </div>

                  {/* Current stock */}
                  <span className={`text-right text-sm font-bold tabular-nums ${safe ? 'text-[#1E293B]' : 'text-[#EF4444]'}`}>
                    {row.current_stock}
                  </span>

                  {/* Reorder level */}
                  <span className="text-right text-xs text-[#64748B] tabular-nums">
                    {row.reorder_level}
                  </span>

                  {/* Status badge */}
                  <div className="flex justify-center">
                    {safe ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#00A550]/10 text-[#00A550] text-[10px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00A550]" />
                        An toàn
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EF4444]/10 text-[#EF4444] text-[10px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
                        Cảnh báo thiếu
                      </span>
                    )}
                  </div>

                  {/* Action */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => onOpenModal(row.product_id, row.branch_id)}
                      className="text-[11px] font-semibold text-[#0072CE] border border-[#0072CE]/30 rounded-lg px-2.5 py-1.5 hover:bg-[#0072CE] hover:text-white transition-colors"
                    >
                      +/− Phiếu kho
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-slate-400 flex-shrink-0">
      <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M9.5 9.5l2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}
