import { useState } from 'react'
import { T } from './constants/theme'
import { BRANCH_OPTS, SORT_OPTS } from './constants/mockData'
import { Sidebar } from './components/layout/Sidebar'
import { Header } from './components/layout/Header'
import { DashboardPage } from './pages/DashboardPage'

export default function App() {
  const [sideOpen, setSideOpen] = useState(true)
  const [activeNav, setActiveNav] = useState('Dashboard')
  const [branch, setBranch] = useState(BRANCH_OPTS[0])
  const [sort, setSort] = useState(SORT_OPTS[0])

  const ML = (sideOpen ? 208 : 74) + 28

  return (
    <div style={{ minHeight: '100vh', background: T.bg, fontFamily: "'Inter',system-ui,sans-serif", position: 'relative' }}>
      {/* Ambient background shapes */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 800, height: 800, borderRadius: '50%', top: -300, right: -200, background: `radial-gradient(circle, rgba(0,114,206,0.06) 0%, transparent 65%)` }}/>
        <div style={{ position: 'absolute', width: 560, height: 560, borderRadius: '50%', bottom: -180, left: 100, background: `radial-gradient(circle, rgba(0,165,80,0.05) 0%, transparent 65%)` }}/>
        <div style={{ position: 'absolute', width: 340, height: 340, borderRadius: '50%', top: '38%', left: '45%', background: `radial-gradient(circle, rgba(56,191,255,0.04) 0%, transparent 65%)` }}/>
      </div>

      <Sidebar open={sideOpen} onToggle={() => setSideOpen(s => !s)} active={activeNav} setActive={setActiveNav}/>

      <main style={{
        marginLeft: ML, padding: '16px 20px 28px',
        transition: 'margin-left 0.28s cubic-bezier(.4,0,.2,1)',
        position: 'relative', zIndex: 1,
        display: 'flex', flexDirection: 'column', gap: 15,
        minHeight: '100vh',
      }}>
        <Header branch={branch} setBranch={setBranch} sort={sort} setSort={setSort} />

        {/* Render theo trang tương ứng */}
        {activeNav === 'Dashboard' && <DashboardPage sort={sort} />}

        <div style={{ height: 4 }}/>
      </main>
    </div>
  )
}