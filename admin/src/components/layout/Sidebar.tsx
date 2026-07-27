import { T } from '../../constants/theme'
import { NAV } from '../../constants/navigation'
import { Icon } from '../common/Icon'

interface SidebarProps {
  open: boolean
  onToggle: () => void
  active: string
  setActive: (k: string) => void
}

export function Sidebar({ open, onToggle, active, setActive }: SidebarProps) {
  const W = open ? 208 : 74

  // Style chung cho các phần chữ để thu/phóng mượt mà không bị giật
  const textTransitionStyle = (maxWidth = 120): React.CSSProperties => ({
    opacity: open ? 1 : 0,
    maxWidth: open ? maxWidth : 0,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    transition: 'all 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: open ? 'translateX(0)' : 'translateX(-8px)',
    pointerEvents: open ? 'auto' : 'none',
  })

  return (
    <aside style={{
      position: 'fixed', left: 14, top: 14, bottom: 14, width: W,
      background: `linear-gradient(175deg, #0080E0 0%, #0063B8 100%)`,
      borderRadius: 28,
      boxShadow: '0 20px 50px rgba(0,114,206,0.38), 0 4px 14px rgba(0,114,206,0.22), inset 0 1px 0 rgba(255,255,255,0.18)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      zIndex: 200, 
      transition: 'width 0.28s cubic-bezier(0.4, 0, 0.2, 1)', 
      /* QUAN TRỌNG: Đặt visible để nút toggle hình tròn không bị cắt nửa */
      overflow: 'visible', 
    }}>
      {/* ── Nút Toggle Thu/Phóng (Nổi nguyên hình tròn ra ngoài) ── */}
      <button
        onClick={onToggle}
        title={open ? "Thu nhỏ" : "Mở rộng"}
        style={{
          position: 'absolute', right: -11, top: 26,
          width: 24, height: 24, borderRadius: '50%',
          background: T.card, border: `1.5px solid ${T.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: T.blue, zIndex: 10,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)', padding: 0,
          transition: 'transform 0.2s ease, background-color 0.2s ease',
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.12)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.blue} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          {open ? <polyline points="15 18 9 12 15 6"/> : <polyline points="9 18 15 12 9 6"/>}
        </svg>
      </button>

      {/* ── Header Logo ── */}
      <div style={{
        width: '100%',
        padding: '20px 14px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        flexShrink: 0,
        overflow: 'hidden'
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: 13, flexShrink: 0,
          background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(10px)',
          border: '1.5px solid rgba(255,255,255,0.28)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.30)',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="8" height="8" rx="2" fill="white" fillOpacity="0.9"/>
            <rect x="13" y="3" width="8" height="8" rx="2" fill="white" fillOpacity="0.6"/>
            <rect x="3" y="13" width="8" height="8" rx="2" fill="white" fillOpacity="0.6"/>
            <rect x="13" y="13" width="8" height="8" rx="2" fill="white" fillOpacity="0.35"/>
          </svg>
        </div>

        {/* Chữ RetailHQ trượt mượt */}
        <div style={textTransitionStyle(120)}>
          <div style={{ color: '#fff', fontWeight: 800, fontSize: 14, letterSpacing: '-0.02em' }}>RetailHQ</div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 9.5, fontWeight: 600, letterSpacing: '0.09em', textTransform: 'uppercase' }}>Admin Panel</div>
        </div>
      </div>

      {/* ── Đường kẻ phân cách ── */}
      <div style={{
        width: open ? 'calc(100% - 28px)' : '32px',
        height: 1,
        background: 'rgba(255,255,255,0.12)',
        marginBottom: 8,
        flexShrink: 0,
        transition: 'width 0.28s cubic-bezier(0.4, 0, 0.2, 1)'
      }} />

      {/* ── Danh sách Navigation ── */}
      <nav style={{ flex: 1, width: '100%', padding: '4px 10px', display: 'flex', flexDirection: 'column', gap: 4, overflow: 'hidden' }}>
        {NAV.map(({ key, label, path }) => {
          const isActive = active === key
          return (
            <button
              key={key}
              onClick={() => setActive(key)}
              title={!open ? label : undefined}
              style={{
                width: '100%',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 14px', // Cố định padding để Icon luôn nằm cố định 1 chỗ
                justifyContent: 'flex-start',
                borderRadius: 16,
                background: isActive ? 'rgba(255,255,255,0.19)' : 'transparent',
                backdropFilter: isActive ? 'blur(14px)' : 'none',
                boxShadow: isActive ? 'inset 0 1px 0 rgba(255,255,255,0.26), 0 2px 8px rgba(0,0,0,0.08)' : 'none',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.52)',
                transition: 'background 0.2s ease, color 0.2s ease',
              }}
            >
              {/* Icon đứng im tuyệt đối không bị di chuyển */}
              <span style={{ flexShrink: 0, display: 'flex', width: 18, justifyContent: 'center' }}>
                <Icon d={path} size={17} color={isActive ? '#fff' : 'rgba(255,255,255,0.55)'} />
              </span>

              {/* Tên Menu biến đổi mượt mà */}
              <span style={{
                fontSize: 13,
                fontWeight: isActive ? 700 : 500,
                letterSpacing: '-0.01em',
                ...textTransitionStyle(100),
              }}>
                {label}
              </span>

              {/* Dấu chấm active xuất hiện mượt */}
              <span style={{
                marginLeft: 'auto',
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.85)',
                flexShrink: 0,
                opacity: isActive && open ? 1 : 0,
                transition: 'opacity 0.2s ease',
              }} />
            </button>
          )
        })}
      </nav>

      {/* ── Profile Admin Card ở đáy ── */}
      <div style={{
        width: 'calc(100% - 20px)',
        margin: '0 10px 12px',
        background: 'rgba(255,255,255,0.11)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.16)',
        borderRadius: 16,
        padding: '8px 10px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        cursor: 'pointer',
        flexShrink: 0,
        overflow: 'hidden',
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 10,
          background: 'rgba(255,255,255,0.20)',
          border: '1.5px solid rgba(255,255,255,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0
        }}>
          <span style={{ color: '#fff', fontSize: 10, fontWeight: 800 }}>HQ</span>
        </div>

        {/* Thông tin Admin mờ & hiện mượt */}
        <div style={textTransitionStyle(100)}>
          <div style={{ color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: '-0.01em' }}>HQ Admin</div>
          <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 10 }}>Super Admin</div>
        </div>
      </div>
    </aside>
  )
}