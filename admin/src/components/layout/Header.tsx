import { T } from '../../constants/theme'
import { PillDropdown } from '../common/PillDropdown'
import { BRANCH_OPTS, SORT_OPTS } from '../../constants/mockData'

interface HeaderProps {
  branch: string
  setBranch: (v: string) => void
  sort: string
  setSort: (v: string) => void
}

export function Header({ branch, setBranch, sort, setSort }: HeaderProps) {
  return (
    <header style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ flex: 1 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: T.text, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
          Executive Dashboard
        </h1>
        <p style={{ margin: '3px 0 0', fontSize: 12.5, color: T.sub }}>Operational Insights</p>
      </div>

      <PillDropdown
        value={branch}
        options={BRANCH_OPTS}
        onChange={setBranch}
        icon={<span style={{ width: 7, height: 7, borderRadius: '50%', background: T.green, boxShadow: `0 0 0 2.5px rgba(0,165,80,0.22)`, flexShrink: 0 }}/>}
      />

      <PillDropdown value={sort} options={SORT_OPTS} onChange={setSort} prefix="Sort: "/>

      <button style={{
        width: 38, height: 38, borderRadius: 12, background: T.card,
        border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: T.sub, boxShadow: T.shadowSm, position: 'relative', flexShrink: 0,
      }}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={T.sub} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 01-3.46 0"/>
        </svg>
        <span style={{ position: 'absolute', top: 9, right: 10, width: 7, height: 7, borderRadius: '50%', background: T.coral, border: `1.5px solid ${T.bg}` }}/>
      </button>

      <div style={{ width: 38, height: 38, borderRadius: 12, background: `linear-gradient(135deg, ${T.blue} 0%, ${T.cyan} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: `0 4px 14px rgba(0,114,206,0.38)`, flexShrink: 0 }}>
        <span style={{ color: '#fff', fontSize: 11, fontWeight: 800 }}>HQ</span>
      </div>
    </header>
  )
}