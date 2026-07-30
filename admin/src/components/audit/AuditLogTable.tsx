import { AuditLogTableProps } from '@/types/audit'
import { ACTION_CFG } from './JsonMetadataModal'

export function AuditLogTable({ logs, hoveredRow, setHoveredRow, onSelectLog }: AuditLogTableProps) {
  return (
    <div style={{ overflowX: 'auto', flex: 1 }}>
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, minWidth: 860 }}>
        <thead>
          <tr>
            {[
              'Thời gian (created_at)',
              'Người thực hiện',
              'Chi nhánh',
              'Hành động',
              'Đối tượng tác động',
              'IP Address',
            ].map((h, i) => (
              <th key={h} style={{
                padding: '10px 14px',
                textAlign: 'left',
                fontSize: 10.5, fontWeight: 700,
                letterSpacing: 0.5, color: '#94A3B8',
                textTransform: 'uppercase',
                background: '#F8FAFC',
                borderBottom: '1px solid #EEF2F7',
                borderRadius: i === 0 ? '12px 0 0 0' : i === 5 ? '0 12px 0 0' : 0,
                whiteSpace: 'nowrap',
              }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {logs.map(row => {
            const isHovered = hoveredRow === row.id
            const cfg = ACTION_CFG[row.action] || { bg: 'rgba(0,114,206,0.08)', text: '#0072CE', border: 'rgba(0,114,206,0.2)' }
            const branchName = typeof row.branch === 'string' ? row.branch : row.branch.name
            const entityName = row.entity || `${row.entity_type || ''} #${row.entity_id || ''}`
            const avatarColor = row.staff.color || '#0072CE'
            const initials = row.staff.initials || row.staff.full_name.split(' ').slice(-2).map(n => n[0]).join('').toUpperCase()

            return (
              <tr
                key={row.id}
                onMouseEnter={() => setHoveredRow(row.id)}
                onMouseLeave={() => setHoveredRow(null)}
                onClick={() => onSelectLog(row)}
                style={{
                  background: isHovered ? '#F0F6FF' : 'transparent',
                  cursor: 'pointer',
                  transition: 'background 0.12s',
                }}
              >
                {/* Timestamp */}
                <td style={{ padding: '12px 14px', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: 11.5, color: '#475569', fontWeight: 500,
                  }}>
                    {row.created_at}
                  </span>
                </td>

                {/* Staff */}
                <td style={{ padding: '12px 14px', borderBottom: '1px solid #F1F5F9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: avatarColor,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      boxShadow: `0 2px 6px ${avatarColor}50`,
                    }}>
                      <span style={{ fontSize: 10.5, fontWeight: 700, color: '#fff' }}>{initials}</span>
                    </div>
                    <div style={{ lineHeight: 1.25 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#1E293B' }}>{row.staff.full_name}</div>
                      <div style={{ fontSize: 11, color: '#94A3B8' }}>{row.staff.role}</div>
                    </div>
                  </div>
                </td>

                {/* Branch */}
                <td style={{ padding: '12px 14px', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    padding: '3px 10px', borderRadius: 20,
                    background: branchName === 'HQ Main Store' ? 'rgba(0,114,206,0.07)' : '#F1F5F9',
                    color: branchName === 'HQ Main Store' ? '#0072CE' : '#475569',
                    fontSize: 12, fontWeight: 500,
                  }}>
                    {branchName}
                  </span>
                </td>

                {/* Action */}
                <td style={{ padding: '12px 14px', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center',
                    padding: '3px 10px', borderRadius: 8,
                    background: cfg.bg,
                    border: `1px solid ${cfg.border}`,
                    color: cfg.text, fontSize: 11, fontWeight: 700,
                    fontFamily: "'JetBrains Mono',monospace",
                    letterSpacing: 0.2,
                  }}>
                    {row.action}
                  </span>
                </td>

                {/* Entity */}
                <td style={{ padding: '12px 14px', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: 12, fontWeight: 500, color: '#334155',
                    background: '#F1F5F9', padding: '3px 10px',
                    borderRadius: 8, display: 'inline-block',
                  }}>
                    {entityName}
                  </span>
                </td>

                {/* IP */}
                <td style={{ padding: '12px 14px', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: 11.5, color: '#94A3B8', fontWeight: 400,
                  }}>
                    {row.ip_address}
                  </span>
                  {isHovered && (
                    <span style={{
                      marginLeft: 8, fontSize: 11, color: '#0072CE', fontFamily: 'inherit',
                    }}>
                      Xem →
                    </span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}