import { T } from '@/constants/theme'
import { revBars, profBars, BRANCH_KEYS, BRANCH_COLORS } from '@/constants/mockData'
import { KpiCard } from '@/components/dashboard/KpiCard'
import { CapsuleBars } from '@/components/charts/CapsuleBars'
import { OrdersWave } from '@/components/charts/OrdersWave'
import { BranchChart } from '@/components/charts/BranchChart'
import { LowStockAlert } from '@/components/dashboard/LowStockAlert'
import { ActivityTable } from '@/components/dashboard/ActivityTable'

interface DashboardPageProps {
  sort: string
}

export function DashboardPage({ sort }: DashboardPageProps) {
  return (
    <div className="flex flex-col gap-[18px]">
      {/* ── KPI Cards (Tự động chuyển từ 1 -> 2 -> 3 cột tùy kích thước màn hình) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px]">
        <KpiCard
          label="Revenue" value="$743,200" badge="+8.3%" bPos
          chart={<div style={{ height: '100%', padding: '0 18px 12px' }}><CapsuleBars data={revBars} c0={T.blue} c1={T.cyan}/></div>}
        />
        <KpiCard
          label="Net Profit" value="$186,800" badge="+5.9%" bPos
          chart={<div style={{ height: '100%', padding: '0 18px 12px' }}><CapsuleBars data={profBars} c0={T.green} c1="#A8F0C6"/></div>}
        />
        <KpiCard
          label="Orders" value="12,450" badge="+12%" bPos
          chart={<OrdersWave/>}
        />
      </div>

      {/* ── Middle Row (Responsive Layout: 1 cột trên mobile/tablet, 2fr-1fr trên màn hình lớn) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[18px]">
        <div 
          className="lg:col-span-2"
          style={{ background: T.card, borderRadius: 24, padding: '24px 22px 18px', boxShadow: T.shadow, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}
        >
          <div style={{ position: 'absolute', inset: 0, borderRadius: 24, background: 'linear-gradient(145deg,rgba(255,255,255,0.6) 0%,rgba(255,255,255,0) 50%)', pointerEvents: 'none' }}/>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: T.text, letterSpacing: '-0.015em' }}>Multi-Branch Sales Comparison</h2>
              <p style={{ margin: '3px 0 0', fontSize: 11.5, color: T.muted }}>Daily revenue · {sort.toLowerCase()}</p>
            </div>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', paddingTop: 2 }}>
              {BRANCH_KEYS.map((k, i) => (
                <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: BRANCH_COLORS[i] }}/>
                  <span style={{ fontSize: 11, color: T.sub, fontWeight: 500 }}>{k}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ height: 260 }}><BranchChart/></div>
        </div>

        <div className="lg:col-span-1">
          <LowStockAlert />
        </div>
      </div>

      {/* ── Recent Activity ── */}
      <ActivityTable />
    </div>
  )
}