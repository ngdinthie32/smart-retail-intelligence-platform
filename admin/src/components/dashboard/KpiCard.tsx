import { T } from '../../constants/theme'

interface KpiCardProps {
  label: string
  value: string
  badge: string
  bPos?: boolean
  bAmber?: boolean
  chart: React.ReactNode
}

export function KpiCard({ label, value, badge, bPos, bAmber, chart }: KpiCardProps) {
  const badgeBg = bAmber ? '#FFF3DC' : bPos ? '#E6F9F0' : '#FEECEC'
  const badgeFg = bAmber ? '#A06000' : bPos ? '#00733A' : '#C0392B'
  
  return (
    <div style={{
      background: T.card,
      borderRadius: 24,
      boxShadow: T.shadow,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      flex: 1,
      minWidth: 0,
      position: 'relative',
    }}>
      {/* Đã bỏ div background trắng mờ overlay ở đây */}
      <div style={{ padding: '22px 22px 10px', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.11em', color: T.muted, textTransform: 'uppercase' }}>
            {label}
          </span>
          <span style={{ fontSize: 11, fontWeight: 700, color: badgeFg, background: badgeBg, borderRadius: 999, padding: '3px 9px' }}>
            {badge}
          </span>
        </div>
        <div style={{ fontSize: 30, fontWeight: 800, color: T.text, letterSpacing: '-0.03em', lineHeight: 1 }}>
          {value}
        </div>
      </div>
      <div style={{ height: 150 }}>
        {chart}
      </div>
    </div>
  )
}