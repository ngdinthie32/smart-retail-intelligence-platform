import { useState } from 'react'
import { AuditLog } from '@/types/audit'
import { AuditLogTable } from '@/components/audit/AuditLogTable'
import { JsonMetadataModal } from '@/components/audit/JsonMetadataModal'

function Icon({ d, size = 18, stroke = 'currentColor', fill = 'none', strokeWidth = 2 }: {
  d: string; size?: number; stroke?: string; fill?: string; strokeWidth?: number
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  )
}

const Icons = {
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35',
  chevDown: 'M6 9l6 6 6-6',
  chevLeft: 'M15 18l-6-6 6-6',
  chevRight: 'M9 18l6-6-6-6',
  globe: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z',
  bell: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0',
  filter: 'M22 3H2l8 9.46V19l4 2V12.46L22 3z',
}

const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: 1,
    created_at: '30/07/2026 21:15:00',
    staff: { full_name: 'Nguyễn Văn A', role: 'Manager', initials: 'NA', color: '#0072CE' },
    branch: { name: 'Chi nhánh Quận 3' },
    action: 'shift.close',
    entity_type: 'shift',
    entity_id: 102,
    entity: 'shift #102',
    ip_address: '192.168.1.45',
    metadata: {
      shift_id: 102,
      opening_float: 500000,
      expected_cash: 2450000,
      actual_cash_counted: 2435000,
      discrepancy: -15000,
      note: 'Lệch tiền mặt cuối ca',
    },
  },
  {
    id: 2,
    created_at: '30/07/2026 20:42:17',
    staff: { full_name: 'Trần Thị Bình', role: 'Cashier', initials: 'TB', color: '#805AD5' },
    branch: { name: 'HQ Main Store' },
    action: 'auth.login',
    entity_type: 'staff',
    entity_id: 18,
    entity: 'staff #18',
    ip_address: '10.0.0.112',
    metadata: {
      staff_id: 18,
      session_id: 'sess_8fk2lmx9',
      device: 'POS Terminal 02',
      location: 'HQ Main Store',
      login_method: 'PIN',
    },
  },
  {
    id: 3,
    created_at: '30/07/2026 19:58:03',
    staff: { full_name: 'Lê Minh Châu', role: 'Supervisor', initials: 'LC', color: '#00A550' },
    branch: { name: 'Chi nhánh Quận 1' },
    action: 'order.cancel',
    entity_type: 'order',
    entity_id: 409,
    entity: 'order #409',
    ip_address: '192.168.2.10',
    metadata: {
      order_id: 409,
      total_amount: 185000,
      cancel_reason: 'Khách hàng đổi ý',
      items_count: 3,
      refund_issued: true,
    },
  },
  {
    id: 4,
    created_at: '30/07/2026 18:30:55',
    staff: { full_name: 'Phạm Quốc Dũng', role: 'Manager', initials: 'PD', color: '#DD6B20' },
    branch: { name: 'Chi nhánh Bình Thạnh' },
    action: 'price.update',
    entity_type: 'product',
    entity_id: 15,
    entity: 'product #15',
    ip_address: '10.0.1.88',
    metadata: {
      product_id: 15,
      product_name: 'Cà phê sữa đá lon',
      old_price: 18000,
      new_price: 20000,
      effective_date: '2026-08-01',
      approved_by: 'HQ Admin',
    },
  },
  {
    id: 5,
    created_at: '30/07/2026 17:05:22',
    staff: { full_name: 'Hoàng Thị Lan', role: 'Cashier', initials: 'HL', color: '#E53E3E' },
    branch: { name: 'Chi nhánh Quận 7' },
    action: 'order.create',
    entity_type: 'order',
    entity_id: 410,
    entity: 'order #410',
    ip_address: '192.168.3.77',
    metadata: {
      order_id: 410,
      items: [
        { sku: 'FM-001', name: 'Bánh mì', qty: 2, unit_price: 25000 },
        { sku: 'FM-042', name: 'Nước ngọt', qty: 1, unit_price: 15000 },
      ],
      total_amount: 65000,
      payment_method: 'cash',
    },
  },
  {
    id: 6,
    created_at: '30/07/2026 15:48:11',
    staff: { full_name: 'Võ Thanh Hải', role: 'Supervisor', initials: 'VH', color: '#0072CE' },
    branch: { name: 'HQ Main Store' },
    action: 'shift.open',
    entity_type: 'shift',
    entity_id: 103,
    entity: 'shift #103',
    ip_address: '10.0.0.101',
    metadata: {
      shift_id: 103,
      opening_float: 500000,
      terminal_id: 'POS-01',
      opened_by: 'Võ Thanh Hải',
      scheduled_close: '2026-07-30T23:00:00',
    },
  },
  {
    id: 7,
    created_at: '30/07/2026 14:22:40',
    staff: { full_name: 'Nguyễn Thị Mai', role: 'Editor', initials: 'NM', color: '#805AD5' },
    branch: { name: 'Chi nhánh Quận 3' },
    action: 'product.edit',
    entity_type: 'product',
    entity_id: 88,
    entity: 'product #88',
    ip_address: '192.168.1.50',
    metadata: {
      product_id: 88,
      field_changed: 'stock_threshold',
      old_value: 10,
      new_value: 20,
      reason: 'Tăng ngưỡng cảnh báo tồn kho',
    },
  },
  {
    id: 8,
    created_at: '30/07/2026 12:10:05',
    staff: { full_name: 'Đinh Văn Khoa', role: 'Cashier', initials: 'DK', color: '#00A550' },
    branch: { name: 'Chi nhánh Quận 1' },
    action: 'auth.logout',
    entity_type: 'staff',
    entity_id: 22,
    entity: 'staff #22',
    ip_address: '10.0.2.34',
    metadata: {
      staff_id: 22,
      session_id: 'sess_3zp7rnq1',
      session_duration_min: 482,
      device: 'POS Terminal 01',
      logout_method: 'manual',
    },
  },
  {
    id: 9,
    created_at: '30/07/2026 10:05:33',
    staff: { full_name: 'Bùi Thị Ngọc', role: 'Manager', initials: 'BN', color: '#DD6B20' },
    branch: { name: 'Chi nhánh Bình Thạnh' },
    action: 'order.cancel',
    entity_type: 'order',
    entity_id: 398,
    entity: 'order #398',
    ip_address: '192.168.2.15',
    metadata: {
      order_id: 398,
      total_amount: 320000,
      cancel_reason: 'Hàng hết hàng',
      items_count: 5,
      refund_issued: false,
    },
  },
  {
    id: 10,
    created_at: '30/07/2026 08:30:00',
    staff: { full_name: 'Trần Văn Phúc', role: 'Manager', initials: 'TP', color: '#0072CE' },
    branch: { name: 'Chi nhánh Quận 7' },
    action: 'shift.open',
    entity_type: 'shift',
    entity_id: 101,
    entity: 'shift #101',
    ip_address: '10.0.3.22',
    metadata: {
      shift_id: 101,
      opening_float: 500000,
      terminal_id: 'POS-03',
      opened_by: 'Trần Văn Phúc',
      scheduled_close: '2026-07-30T17:00:00',
    },
  },
]

export function AuditLogsPage() {
  const [hoveredRow, setHoveredRow] = useState<number | string | null>(null)
  const [activeModal, setActiveModal] = useState<AuditLog | null>(null)
  const [page, setPage] = useState(1)
  const [filterText, setFilterText] = useState('')

  const totalItems = 128
  const perPage = 10
  const totalPages = Math.ceil(totalItems / perPage)

  const displayedLogs = filterText.trim()
    ? MOCK_AUDIT_LOGS.filter(r => {
        const branchName = typeof r.branch === 'string' ? r.branch : r.branch.name
        const entityName = r.entity || `${r.entity_type} #${r.entity_id}`
        const term = filterText.toLowerCase()
        return (
          r.staff.full_name.toLowerCase().includes(term) ||
          r.action.toLowerCase().includes(term) ||
          branchName.toLowerCase().includes(term) ||
          entityName.toLowerCase().includes(term)
        )
      })
    : MOCK_AUDIT_LOGS

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
      {/* Top Header Card */}
      <header style={{
        background: '#fff', borderRadius: 20,
        padding: '14px 24px',
        boxShadow: '0 4px 20px rgba(0,114,206,0.06)',
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#0F1C35', letterSpacing: -0.5 }}>
            Audit Logs&nbsp;
            <span style={{ fontWeight: 400, color: '#94A3B8', fontSize: 16 }}>/ Nhật ký hệ thống</span>
          </h1>
          <p style={{ margin: '2px 0 0', fontSize: 12, color: '#94A3B8' }}>
            Theo dõi các hành động nhạy cảm trong hệ thống{' '}
            <code style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, background: '#F1F5F9', padding: '1px 5px', borderRadius: 4 }}>
              activity_logs
            </code>
          </p>
        </div>

        {/* Scope selector */}
        <button style={{
          display: 'flex', alignItems: 'center', gap: 7,
          padding: '7px 13px', borderRadius: 11,
          background: 'rgba(0,114,206,0.06)', border: '1.5px solid rgba(0,114,206,0.15)',
          cursor: 'pointer', color: '#0072CE', fontSize: 12.5, fontWeight: 600,
          whiteSpace: 'nowrap', fontFamily: 'inherit',
        }}>
          <Icon d={Icons.globe} size={13} />
          Toàn chuỗi (HQ) / All Branches
          <Icon d={Icons.chevDown} size={12} />
        </button>

        {/* Search Header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 7,
          background: '#F8FAFC', borderRadius: 11,
          padding: '8px 13px', border: '1.5px solid #E8EDF3', width: 200,
        }}>
          <Icon d={Icons.search} size={13} color="#94A3B8" />
          <input
            placeholder="Tìm kiếm..."
            style={{ border: 'none', background: 'none', outline: 'none', fontSize: 12.5, color: '#334155', width: '100%', fontFamily: 'inherit' }}
          />
        </div>

        {/* Bell */}
        <button style={{
          width: 36, height: 36, borderRadius: 11,
          background: '#F8FAFC', border: '1.5px solid #E8EDF3',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: '#64748B', position: 'relative',
        }}>
          <Icon d={Icons.bell} size={16} />
          <span style={{
            position: 'absolute', top: 7, right: 8,
            width: 7, height: 7, borderRadius: '50%',
            background: '#E53E3E', border: '1.5px solid #fff',
          }} />
        </button>

        {/* Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 11,
            background: 'linear-gradient(135deg,#0072CE,#005BA4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,114,206,0.28)',
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>HQ</span>
          </div>
          <div style={{ lineHeight: 1.25 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1E293B' }}>HQ Admin</div>
            <div style={{ fontSize: 10.5, color: '#94A3B8' }}>Super Admin</div>
          </div>
        </div>
      </header>

      {/* Stats strip */}
      <div style={{ display: 'flex', gap: 12 }}>
        {[
          { label: 'Tổng hoạt động hôm nay', value: '128', color: '#0072CE', bg: 'rgba(0,114,206,0.06)' },
          { label: 'Hành động nhạy cảm', value: '14', color: '#E53E3E', bg: 'rgba(229,62,62,0.06)' },
          { label: 'Đăng nhập thành công', value: '38', color: '#00A550', bg: 'rgba(0,165,80,0.06)' },
          { label: 'Chi nhánh hoạt động', value: '7', color: '#805AD5', bg: 'rgba(128,90,213,0.06)' },
        ].map(s => (
          <div key={s.label} style={{
            flex: 1, background: '#fff', borderRadius: 16,
            padding: '14px 18px',
            boxShadow: '0 4px 16px rgba(0,114,206,0.05)',
            borderLeft: `3px solid ${s.color}`,
          }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color, letterSpacing: -0.5 }}>{s.value}</div>
            <div style={{ fontSize: 11.5, color: '#94A3B8', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Main table container */}
      <div style={{
        flex: 1, background: '#fff', borderRadius: 28,
        padding: '24px 28px 20px',
        boxShadow: '0 20px 40px rgba(0,114,206,0.08)',
        display: 'flex', flexDirection: 'column', gap: 0,
        overflow: 'hidden',
      }}>
        {/* Card toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 7,
            background: '#F8FAFC', borderRadius: 14,
            padding: '9px 14px', border: '1.5px solid #EEF2F7', flex: 1, maxWidth: 380,
          }}>
            <Icon d={Icons.search} size={13} color="#94A3B8" />
            <input
              value={filterText}
              onChange={e => setFilterText(e.target.value)}
              placeholder="Lọc theo tên, hành động, chi nhánh..."
              style={{ border: 'none', background: 'none', outline: 'none', fontSize: 12.5, color: '#334155', width: '100%', fontFamily: 'inherit' }}
            />
          </div>

          <button style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 12,
            background: '#F1F5F9', border: '1.5px solid #E8EDF3',
            fontSize: 12.5, fontWeight: 500, color: '#475569',
            cursor: 'pointer', fontFamily: 'inherit',
          }}>
            <Icon d={Icons.filter} size={13} />
            Bộ lọc
          </button>

          <div style={{ marginLeft: 'auto', fontSize: 12.5, color: '#94A3B8' }}>
            Nhấp vào hàng để xem metadata &rarr;
          </div>
        </div>

        {/* Table Component */}
        <AuditLogTable
          logs={displayedLogs}
          hoveredRow={hoveredRow}
          setHoveredRow={setHoveredRow}
          onSelectLog={log => setActiveModal(log)}
        />

        {/* Footer Pagination */}
        <div style={{
          display: 'flex', alignItems: 'center',
          paddingTop: 16, marginTop: 8,
          borderTop: '1px solid #EEF2F7', gap: 12,
        }}>
          <span style={{ fontSize: 12.5, color: '#94A3B8' }}>
            Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, totalItems)} of {totalItems} activity logs
          </span>

          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{
                padding: '5px 12px', borderRadius: 9, border: '1.5px solid #E8EDF3',
                background: page === 1 ? '#FAFBFD' : '#F8FAFC',
                fontSize: 12.5, fontWeight: 500,
                color: page === 1 ? '#CBD5E1' : '#475569',
                cursor: page === 1 ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', gap: 4,
                fontFamily: 'inherit', transition: 'all 0.14s',
              }}
            >
              <Icon d={Icons.chevLeft} size={12} /> Previous
            </button>

            {[1, 2, 3].map(n => (
              <button
                key={n}
                onClick={() => setPage(n)}
                style={{
                  width: 32, height: 32, borderRadius: 9, border: 'none',
                  background: page === n ? '#0072CE' : '#F8FAFC',
                  color: page === n ? '#fff' : '#475569',
                  fontSize: 13, fontWeight: page === n ? 700 : 500,
                  cursor: 'pointer', fontFamily: 'inherit',
                  boxShadow: page === n ? '0 2px 8px rgba(0,114,206,0.3)' : 'none',
                  transition: 'all 0.14s',
                }}
              >
                {n}
              </button>
            ))}

            <span style={{ color: '#CBD5E1', fontSize: 13 }}>…</span>
            <button onClick={() => setPage(totalPages)} style={{
              width: 32, height: 32, borderRadius: 9, border: 'none',
              background: '#F8FAFC', color: '#475569',
              fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
            }}>
              {totalPages}
            </button>

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{
                padding: '5px 12px', borderRadius: 9, border: '1.5px solid #E8EDF3',
                background: '#F8FAFC', fontSize: 12.5, fontWeight: 500,
                color: page === totalPages ? '#CBD5E1' : '#475569',
                cursor: page === totalPages ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', gap: 4,
                fontFamily: 'inherit', transition: 'all 0.14s',
              }}
            >
              Next <Icon d={Icons.chevRight} size={12} />
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 12, color: '#94A3B8' }}>Hiển thị</span>
            <button style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '5px 10px', borderRadius: 9,
              border: '1.5px solid #E8EDF3', background: '#F8FAFC',
              fontSize: 12.5, fontWeight: 500, color: '#475569',
              cursor: 'pointer', fontFamily: 'inherit',
            }}>
              10 <Icon d={Icons.chevDown} size={11} />
            </button>
          </div>
        </div>
      </div>

      {/* JSON Metadata Modal */}
      {activeModal && (
        <JsonMetadataModal log={activeModal} onClose={() => setActiveModal(null)} />
      )}
    </div>
  )
}