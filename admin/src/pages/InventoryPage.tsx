import { useState } from 'react'
import type {
  Branch,
  BranchInventory,
  StockMovement,
  StockReconciliation,
  MovementType,
} from '@/types/inventory'
import BranchStockTable from '@/components/inventory/BranchStockTable'
import StockReconciliationTable from '@/components/inventory/StockReconciliationTable'
import StockMovementModal from '@/components/inventory/StockMovementModal'

// ── Seed Data Chi nhánh & Tồn kho ──────────────────────────────────────────
const BRANCHES: Branch[] = [
  { id: 'b1', name: 'Chi nhánh Quận 1' },
  { id: 'b2', name: 'Chi nhánh Quận 3' },
  { id: 'b3', name: 'Chi nhánh Bình Thạnh' },
]

const SEED_BRANCH_INVENTORY: BranchInventory[] = [
  { id: 'i1', branch_id: 'b1', branch_name: 'Chi nhánh Quận 1', sku: '399-elz', product_id: '3', product_name: 'Elizavecca EGF Retinol Cream', product_image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=80&h=80&fit=crop&auto=format', current_stock: 20, reorder_level: 25 },
  { id: 'i2', branch_id: 'b1', branch_name: 'Chi nhánh Quận 1', sku: '101-elz', product_id: '1', product_name: 'Elizavecca Collagen Jella Pack', product_image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=80&h=80&fit=crop&auto=format', current_stock: 45, reorder_level: 20 },
  { id: 'i3', branch_id: 'b1', branch_name: 'Chi nhánh Quận 1', sku: '204-elz', product_id: '2', product_name: 'Elizavecca Vitamin C 23% Serum', product_image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=80&h=80&fit=crop&auto=format', current_stock: 8, reorder_level: 15 },
  { id: 'i4', branch_id: 'b2', branch_name: 'Chi nhánh Quận 3', sku: '399-elz', product_id: '3', product_name: 'Elizavecca EGF Retinol Cream', product_image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=80&h=80&fit=crop&auto=format', current_stock: 33, reorder_level: 20 },
  { id: 'i5', branch_id: 'b2', branch_name: 'Chi nhánh Quận 3', sku: '502-elz', product_id: '4', product_name: 'Elizavecca Galactomyces 97% Essence', product_image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=80&h=80&fit=crop&auto=format', current_stock: 5, reorder_level: 10 },
]

const SEED_RECONCILIATION: StockReconciliation[] = [
  { id: 'r1', branch_id: 'b1', branch_name: 'Chi nhánh Quận 1', sku: '399-elz', product_id: '3', product_name: 'Elizavecca EGF Retinol Cream', product_image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=80&h=80&fit=crop&auto=format', snapshot_stock: 25, computed_stock: 20, diff: -5 },
  { id: 'r2', branch_id: 'b2', branch_name: 'Chi nhánh Quận 3', sku: '502-elz', product_id: '4', product_name: 'Elizavecca Galactomyces 97% Essence', product_image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=80&h=80&fit=crop&auto=format', snapshot_stock: 3, computed_stock: 5, diff: 2 },
]

type ActiveTab = 'branch' | 'reconciliation'

interface ModalState {
  open: boolean
  productId?: string
  branchId?: string
  movementType?: MovementType
}

export function InventoryPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('branch')
  const [branchInventory, setBranchInventory] = useState<BranchInventory[]>(SEED_BRANCH_INVENTORY)
  const [reconciliation] = useState<StockReconciliation[]>(SEED_RECONCILIATION)
  const [movements, setMovements] = useState<StockMovement[]>([])
  const [modal, setModal] = useState<ModalState>({ open: false })

  const hasDiscrepancies = reconciliation.some((r) => r.diff !== 0)
  const discrepancyCount = reconciliation.filter((r) => r.diff !== 0).length

  const openModal = (productId?: string, branchId?: string, movementType?: MovementType) =>
    setModal({ open: true, productId, branchId, movementType })

  const handleModalSubmit = (payload: {
    branch_id: string
    product_id: string
    movement_type: MovementType
    quantity_change: number
    note: string
  }) => {
    const newMovement: StockMovement = {
      id: `mv_${Date.now()}`,
      ...payload,
      created_at: new Date().toISOString(),
    }
    setMovements((prev) => [newMovement, ...prev])

    setBranchInventory((prev) =>
      prev.map((row) =>
        row.product_id === payload.product_id && row.branch_id === payload.branch_id
          ? { ...row, current_stock: Math.max(0, row.current_stock + payload.quantity_change) }
          : row
      )
    )
  }

  return (
    <div className="min-h-screen bg-[#F3F5F9] flex flex-col">
      {/* Header & Tabs */}
      <div className="bg-white border-b border-slate-100 px-8 pt-5 pb-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1E293B] leading-tight">Quản lý Tồn kho Chi nhánh</h1>
            <p className="text-xs text-[#64748B] mt-0.5">
              Theo dõi tồn kho theo từng chi nhánh, tạo phiếu xuất/nhập kho và kiểm soát đối soát chênh lệch.
            </p>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-[#0072CE] text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors whitespace-nowrap shadow-md"
          >
            <span className="text-lg leading-none">+</span>
            Tạo Phiếu Kho
          </button>
        </div>

        {/* Tab Strip */}
        <div className="flex items-center gap-0.5">
          <TabStrip
            label="Tồn kho Chi nhánh"
            active={activeTab === 'branch'}
            onClick={() => setActiveTab('branch')}
          />
          <TabStrip
            label="Đối soát Chênh lệch"
            active={activeTab === 'reconciliation'}
            onClick={() => setActiveTab('reconciliation')}
            badge={hasDiscrepancies ? discrepancyCount : undefined}
          />
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 px-8 py-6">
        {activeTab === 'branch' && (
          <BranchStockTable
            rows={branchInventory}
            branches={BRANCHES}
            onOpenModal={(pid, bid) => openModal(pid, bid)}
          />
        )}

        {activeTab === 'reconciliation' && (
          <StockReconciliationTable
            rows={reconciliation}
            onOpenModal={(pid, bid) => openModal(pid, bid, 'adjustment')}
          />
        )}

        {/* Lịch sử Phiếu Kho Gần Đây */}
        {movements.length > 0 && (
          <div className="mt-5 bg-white rounded-3xl p-5 shadow-sm">
            <p className="text-[10px] font-semibold text-[#64748B] uppercase tracking-widest mb-3">
              Phiếu Kho Vừa Tạo
            </p>
            <div className="flex flex-col divide-y divide-slate-50">
              {movements.slice(0, 5).map((mv) => {
                const branchRow = branchInventory.find(
                  (r) => r.product_id === mv.product_id && r.branch_id === mv.branch_id
                )
                const isPos = mv.quantity_change > 0
                return (
                  <div key={mv.id} className="flex items-center gap-3 py-2.5 text-xs">
                    <span className="font-semibold text-[#1E293B] flex-1">
                      {branchRow?.product_name || mv.product_id}
                    </span>
                    <span className={`font-bold ${isPos ? 'text-[#00A550]' : 'text-[#EF4444]'}`}>
                      {isPos ? '+' : ''}{mv.quantity_change}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Modal Phiếu Kho */}
      {modal.open && (
        <StockMovementModal
          branches={BRANCHES}
          inventoryRows={branchInventory}
          initialProductId={modal.productId}
          initialBranchId={modal.branchId}
          initialMovementType={modal.movementType}
          onClose={() => setModal({ open: false })}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  )
}

function TabStrip({
  label,
  active,
  onClick,
  badge,
}: {
  label: string
  active: boolean
  onClick: () => void
  badge?: number
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold transition-all border-b-2 ${
        active
          ? 'text-[#0072CE] border-[#0072CE] bg-[#0072CE]/5'
          : 'text-[#64748B] border-transparent hover:text-[#1E293B] hover:bg-slate-50'
      }`}
    >
      {label}
      {badge !== undefined && (
        <span className="flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-[#EF4444] text-white text-[9px] font-bold">
          {badge}
        </span>
      )}
    </button>
  )
}