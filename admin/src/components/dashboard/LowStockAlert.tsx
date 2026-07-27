import { T } from '../../constants/theme'
import { lowStock } from '../../constants/mockData'

export function LowStockAlert() {
  return (
    <div style={{ background: T.card, borderRadius: 24, padding: '22px 20px', boxShadow: T.shadow, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: 24, background: 'linear-gradient(145deg,rgba(255,255,255,0.6) 0%,rgba(255,255,255,0) 50%)', pointerEvents: 'none' }}/>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: T.text, letterSpacing: '-0.015em' }}>Low Stock Alert</h2>
          <p style={{ margin: '3px 0 0', fontSize: 11.5, color: T.muted }}>{lowStock.length} SKUs below threshold</p>
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, color: T.coral, background: 'rgba(244,95,62,0.09)', borderRadius: 999, padding: '3px 10px', border: '1px solid rgba(244,95,62,0.14)' }}>
          {lowStock.length} critical
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {lowStock.map(item => {
          const urgent = item.stock <= 3
          const pct = Math.round((item.stock / item.reorder) * 100)
          return (
            <div key={item.sku} style={{
              padding: '10px 12px', borderRadius: 14,
              background: urgent ? 'rgba(244,95,62,0.04)' : 'rgba(245,166,35,0.03)',
              border: `1px solid ${urgent ? 'rgba(244,95,62,0.14)' : 'rgba(245,166,35,0.12)'}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={urgent ? T.coral : T.amber} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                <span style={{ fontSize: 12, fontWeight: 600, color: T.text, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: urgent ? T.coral : T.amber, flexShrink: 0 }}>
                  {item.stock}<span style={{ color: T.muted, fontWeight: 400 }}>/{item.reorder}</span>
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ flex: 1, height: 4, borderRadius: 999, background: 'rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, borderRadius: 999, background: urgent ? T.coral : T.amber, transition: 'width 0.4s' }}/>
                </div>
                <span style={{ fontSize: 10, color: T.muted, whiteSpace: 'nowrap', flexShrink: 0 }}>{item.branch}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}