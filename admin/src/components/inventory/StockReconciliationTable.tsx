import type { StockReconciliation } from '@/types/inventory'

interface StockReconciliationTableProps {
  rows: StockReconciliation[]
  onOpenModal: (productId?: string, branchId?: string) => void
}

export default function StockReconciliationTable({ rows, onOpenModal }: StockReconciliationTableProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Banner */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3.5">
        <span className="text-amber-500 mt-0.5 flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1.5L14.5 13H1.5L8 1.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
            <path d="M8 6v3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            <circle cx="8" cy="11.5" r="0.75" fill="currentColor" />
          </svg>
        </span>
        <div>
          <p className="text-xs font-semibold text-amber-700 mb-0.5">Dữ liệu đối soát từ v_stock_reconciliation</p>
          <p className="text-[11px] text-amber-600 leading-relaxed">
            Chỉ hiển thị sản phẩm có chênh lệch diff ≠ 0. Kiểm tra và tạo phiếu điều chỉnh để đồng bộ tồn kho.
          </p>
        </div>
      </div>

      {/* Table card */}
      <div
        className="bg-white rounded-3xl overflow-hidden"
        style={{ boxShadow: '0px 20px 40px rgba(0, 114, 206, 0.08)' }}
      >
        {/* Header */}
        <div
          className="grid px-5 py-3 border-b border-slate-100 text-[10px] font-semibold text-[#64748B] uppercase tracking-widest"
          style={{ gridTemplateColumns: '160px 90px 1fr 110px 130px 100px 140px' }}
        >
          <span>Chi nhánh</span>
          <span>Mã SKU</span>
          <span>Tên Sản phẩm</span>
          <span className="text-right">Tồn Snapshot</span>
          <span className="text-right">Tồn từ nhật ký</span>
          <span className="text-center">Chênh lệch</span>
          <span className="text-right">Thao tác</span>
        </div>

        {/* Rows */}
        {rows.length === 0 ? (
          <div className="py-16 text-center text-sm text-[#00A550] font-medium">
            ✓ Không có chênh lệch. Tồn kho đã đồng bộ.
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-slate-50">
            {rows.map((row) => {
              const isNeg = row.diff < 0
              const isPos = row.diff > 0

              return (
                <div
                  key={row.id}
                  className={`grid items-center px-5 py-3.5 transition-colors hover:bg-slate-50/70 ${
                    isNeg ? 'bg-red-50/30' : isPos ? 'bg-amber-50/30' : ''
                  }`}
                  style={{ gridTemplateColumns: '160px 90px 1fr 110px 130px 100px 140px' }}
                >
                  {/* Branch */}
                  <span className="text-xs font-medium text-[#1E293B] truncate">{row.branch_name}</span>

                  {/* SKU */}
                  <span className="text-xs font-mono text-[#64748B]">{row.sku}</span>

                  {/* Product */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden">
                      <img src={row.product_image} alt={row.product_name} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs font-medium text-[#1E293B] truncate leading-snug">
                      {row.product_name}
                    </span>
                  </div>

                  {/* Snapshot */}
                  <span className="text-right text-xs text-[#64748B] tabular-nums font-mono">
                    {row.snapshot_stock}
                  </span>

                  {/* Computed */}
                  <span className="text-right text-xs text-[#64748B] tabular-nums font-mono">
                    {row.computed_stock}
                  </span>

                  {/* Diff badge */}
                  <div className="flex justify-center">
                    <span
                      className={`inline-flex items-center gap-0.5 px-2.5 py-1 rounded-full text-xs font-bold tabular-nums ${
                        isNeg
                          ? 'bg-[#EF4444]/10 text-[#EF4444]'
                          : isPos
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {isPos ? '+' : ''}{row.diff}
                    </span>
                  </div>

                  {/* Action */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => onOpenModal(row.product_id, row.branch_id)}
                      className="text-[11px] font-semibold text-[#0072CE] border border-[#0072CE]/30 rounded-lg px-2.5 py-1.5 hover:bg-[#0072CE] hover:text-white transition-colors whitespace-nowrap"
                    >
                      Tạo phiếu điều chỉnh
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
