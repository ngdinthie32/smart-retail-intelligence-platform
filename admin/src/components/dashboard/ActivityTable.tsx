import { T } from '../../constants/theme'
import { activity, avColor } from '../../constants/mockData'

export function ActivityTable() {
  return (
    <div style={{ background: T.card, borderRadius: 24, padding: '22px 22px 10px', boxShadow: T.shadow, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: 24, background: 'linear-gradient(145deg,rgba(255,255,255,0.55) 0%,rgba(255,255,255,0) 45%)', pointerEvents: 'none' }}/>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: T.text, letterSpacing: '-0.015em' }}>Recent Operational Activity</h2>
          <p style={{ margin: '3px 0 0', fontSize: 11.5, color: T.muted }}>Shift events & audit logs · all branches</p>
        </div>
        <button style={{ fontSize: 12, fontWeight: 700, color: T.blue, background: 'rgba(0,114,206,0.08)', border: 'none', borderRadius: 999, padding: '7px 15px', cursor: 'pointer' }}>
          View all logs →
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '190px 1fr 90px 72px 130px', gap: 12, padding: '0 10px 10px', borderBottom: `1.5px solid ${T.border}` }}>
        {['Staff Member', 'Action', 'Branch', 'Time', 'Status'].map(h => (
          <span key={h} style={{ fontSize: 10, fontWeight: 700, color: T.muted, letterSpacing: '0.09em', textTransform: 'uppercase' }}>{h}</span>
        ))}
      </div>

      {activity.map((e, i) => {
        const resolved = e.status === 'Resolved'
        return (
          <div
            key={e.id}
            style={{
              display: 'grid', gridTemplateColumns: '190px 1fr 90px 72px 130px',
              gap: 12, padding: '12px 10px', alignItems: 'center',
              borderBottom: i < activity.length - 1 ? `1px solid ${T.border}` : 'none',
              borderRadius: 12, cursor: 'pointer', transition: 'background 0.13s',
            }}
            onMouseEnter={el => { (el.currentTarget as HTMLDivElement).style.background = '#F6FAFF' }}
            onMouseLeave={el => { (el.currentTarget as HTMLDivElement).style.background = 'transparent' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 11, flexShrink: 0,
                background: avColor[e.av] || T.blue,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 3px 10px ${avColor[e.av] ?? T.blue}44`,
              }}>
                <span style={{ color: '#fff', fontSize: 11, fontWeight: 800 }}>{e.av}</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: T.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.name}</span>
            </div>

            <span style={{ fontSize: 12.5, color: '#3A567A', lineHeight: 1.4 }}>{e.action}</span>

            <span style={{ fontSize: 11, fontWeight: 600, color: T.blue, background: 'rgba(0,114,206,0.08)', borderRadius: 8, padding: '3px 9px', whiteSpace: 'nowrap', display: 'inline-block' }}>
              {e.branch}
            </span>

            <span style={{ fontSize: 11.5, color: T.muted, fontFamily: "'DM Mono','Courier New',monospace", fontWeight: 500 }}>{e.time}</span>

            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '4px 10px 4px 7px', borderRadius: 999,
              background: resolved ? 'rgba(0,165,80,0.08)' : 'rgba(245,166,35,0.10)',
              color: resolved ? '#006B30' : '#A06000',
              fontSize: 11, fontWeight: 700,
              border: `1px solid ${resolved ? 'rgba(0,165,80,0.15)' : 'rgba(245,166,35,0.18)'}`,
              whiteSpace: 'nowrap',
            }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: resolved ? T.green : T.amber, flexShrink: 0 }}/>
              {e.status}
            </span>
          </div>
        )
      })}
    </div>
  )
}