import { useState } from 'react'
import { AuditLog, JsonMetadataModalProps } from '@/types/audit'

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
  x: 'M18 6 6 18M6 6l12 12',
  copy: 'M20 9h-9a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2zM5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 0 2-2h9a2 2 0 0 0 2 2v1',
  check: 'M20 6 9 17l-5-5',
}

export const ACTION_CFG: Record<string, { bg: string; text: string; border: string }> = {
  'shift.close':   { bg: 'rgba(221,107,32,0.1)',  text: '#DD6B20', border: 'rgba(221,107,32,0.25)' },
  'auth.login':    { bg: 'rgba(0,114,206,0.08)',  text: '#0072CE', border: 'rgba(0,114,206,0.2)'  },
  'auth.logout':   { bg: 'rgba(100,116,139,0.08)',text: '#64748B', border: 'rgba(100,116,139,0.2)' },
  'order.cancel':  { bg: 'rgba(229,62,62,0.08)',  text: '#E53E3E', border: 'rgba(229,62,62,0.2)'  },
  'order.create':  { bg: 'rgba(0,165,80,0.08)',   text: '#00A550', border: 'rgba(0,165,80,0.2)'   },
  'price.update':  { bg: 'rgba(128,90,213,0.08)', text: '#805AD5', border: 'rgba(128,90,213,0.2)' },
  'product.edit':  { bg: 'rgba(128,90,213,0.08)', text: '#805AD5', border: 'rgba(128,90,213,0.2)' },
  'shift.open':    { bg: 'rgba(0,165,80,0.08)',   text: '#00A550', border: 'rgba(0,165,80,0.2)'   },
}

function colorizeJson(json: string): string {
  return json
    .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      (match) => {
        let cls = '#CE9178'
        if (/^"/.test(match)) {
          if (/:$/.test(match)) cls = '#9CDCFE'
          else cls = '#CE9178'
        } else if (/true|false/.test(match)) cls = '#569CD6'
        else if (/null/.test(match)) cls = '#569CD6'
        else cls = '#B5CEA8'
        const display = match.endsWith(':') ? match.slice(0, -1) : match
        const colon = match.endsWith(':') ? '<span style="color:#D4D4D4">:</span>' : ''
        return `<span style="color:${cls}">${display}</span>${colon}`
      })
    .replace(/([{}[\],])/g, '<span style="color:#D4D4D4">$1</span>')
}

export function JsonMetadataModal({ log, onClose }: JsonMetadataModalProps) {
  const [copied, setCopied] = useState(false)
  const jsonStr = JSON.stringify(log.metadata, null, 2)

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonStr).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  const colored = colorizeJson(jsonStr)
  const cfg = ACTION_CFG[log.action] || { bg: 'rgba(0,114,206,0.08)', text: '#0072CE', border: 'rgba(0,114,206,0.2)' }
  const branchName = typeof log.branch === 'string' ? log.branch : log.branch.name
  const entityName = log.entity || `${log.entity_type || ''} #${log.entity_id || ''}`

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 999,
        background: 'rgba(15,28,53,0.45)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: 24,
          boxShadow: '0 24px 80px rgba(0,114,206,0.18), 0 4px 24px rgba(0,0,0,0.12)',
          width: '100%', maxWidth: 580,
          overflow: 'hidden',
          animation: 'modalIn 0.22s cubic-bezier(.34,1.56,.64,1)',
        }}
      >
        <style>{`
          @keyframes modalIn {
            from { opacity:0; transform:scale(0.93) translateY(12px); }
            to   { opacity:1; transform:scale(1) translateY(0); }
          }
        `}</style>

        {/* Modal header */}
        <div style={{
          padding: '20px 24px 16px',
          borderBottom: '1px solid #EEF2F7',
          display: 'flex', alignItems: 'flex-start', gap: 12,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: cfg.text, flexShrink: 0,
              }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: cfg.text, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                {log.action}
              </span>
            </div>
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#0F1C35', letterSpacing: -0.3 }}>
              Chi tiết Dữ liệu Audit
            </h2>
            <p style={{ margin: '3px 0 0', fontSize: 12, color: '#94A3B8' }}>
              activity_logs.metadata — {entityName} · {log.created_at}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: 10,
              background: '#F1F5F9', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#64748B', flexShrink: 0,
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#E2E8F0')}
            onMouseLeave={e => (e.currentTarget.style.background = '#F1F5F9')}
          >
            <Icon d={Icons.x} size={15} />
          </button>
        </div>

        {/* Staff info strip */}
        <div style={{
          padding: '10px 24px',
          background: '#FAFBFD',
          borderBottom: '1px solid #EEF2F7',
          display: 'flex', gap: 24,
        }}>
          {[
            { label: 'Người thực hiện', value: `${log.staff.full_name} (${log.staff.role})` },
            { label: 'Chi nhánh', value: branchName },
            { label: 'IP Address', value: log.ip_address },
          ].map(item => (
            <div key={item.label}>
              <div style={{ fontSize: 10.5, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>
                {item.label}
              </div>
              <div style={{ fontSize: 12.5, fontWeight: 500, color: '#334155', fontFamily: item.label === 'IP Address' ? "'JetBrains Mono',monospace" : 'inherit' }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {/* JSON block */}
        <div style={{ padding: '0', position: 'relative' }}>
          <div style={{
            background: '#1E1E2E',
            margin: 0,
            padding: '6px 14px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF5F57', display: 'inline-block' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FEBC2E', display: 'inline-block' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28C840', display: 'inline-block' }} />
              <span style={{ fontSize: 11, color: '#6B7A99', marginLeft: 8, fontFamily: "'JetBrains Mono',monospace" }}>
                activity_logs.metadata.json
              </span>
            </div>
            <button
              onClick={handleCopy}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '4px 10px', borderRadius: 7,
                background: copied ? 'rgba(0,165,80,0.15)' : 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: copied ? '#00A550' : '#8B97B0',
                fontSize: 11, cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 0.15s',
              }}
            >
              <Icon d={copied ? Icons.check : Icons.copy} size={12} />
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <pre
            style={{
              margin: 0,
              background: '#1E1E2E',
              padding: '18px 24px 22px',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12.5,
              lineHeight: 1.75,
              color: '#D4D4D4',
              overflowX: 'auto',
              maxHeight: 300,
              overflowY: 'auto',
            }}
            dangerouslySetInnerHTML={{ __html: colored }}
          />
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #EEF2F7',
          display: 'flex', justifyContent: 'flex-end', gap: 10,
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '9px 22px', borderRadius: 12,
              background: '#F1F5F9', border: 'none',
              fontSize: 13.5, fontWeight: 600, color: '#475569',
              cursor: 'pointer', fontFamily: 'inherit',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#E2E8F0')}
            onMouseLeave={e => (e.currentTarget.style.background = '#F1F5F9')}
          >
            Đóng / Close
          </button>
        </div>
      </div>
    </div>
  )
}