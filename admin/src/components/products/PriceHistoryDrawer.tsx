import { useEffect } from 'react'
import type { PriceHistoryItem, Product } from '../../types/product'

interface PriceHistoryDrawerProps {
  product: Product | null
  history: PriceHistoryItem[]
  onClose: () => void
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

const AVATAR_COLORS = ['#0072CE', '#00A550', '#F45F3E', '#7C4DFF', '#F5A623', '#38BFFF']

function getAvatarColor(name: string) {
  let hash = 0
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) & 0xffffffff
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

function initials(name: string) {
  return name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function PriceHistoryDrawer({ product, history, onClose }: PriceHistoryDrawerProps) {
  const isOpen = !!product

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(11,30,53,0.35)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          zIndex: 400,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 0.25s ease',
        }}
      />

      {/* Drawer panel */}
      <aside
        style={{
          position: 'fixed',
          top: 12,
          right: isOpen ? 12 : -500,
          bottom: 12,
          width: 420,
          maxWidth: 'calc(100vw - 24px)',
          background: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: 24,
          boxShadow: '0 32px 80px rgba(0,114,206,0.18), 0 8px 24px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.9)',
          border: '1.5px solid rgba(255,255,255,0.7)',
          zIndex: 410,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'right 0.30s cubic-bezier(.4,0,.2,1)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 20px 16px',
            borderBottom: '1px solid rgba(230,237,246,0.8)',
            background: 'linear-gradient(145deg, rgba(0,114,206,0.03) 0%, transparent 60%)',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 9,
                    background: 'rgba(0,114,206,0.09)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0072CE" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#0B1E35', letterSpacing: '-0.02em' }}>
                    Price History
                  </h2>
                </div>
              </div>
              {product && (
                <div style={{ paddingLeft: 38 }}>
                  <span
                    style={{
                      fontFamily: "'DM Mono','Courier New',monospace",
                      fontSize: 11.5,
                      fontWeight: 600,
                      color: '#0072CE',
                      background: 'rgba(0,114,206,0.07)',
                      borderRadius: 7,
                      padding: '2px 8px',
                    }}
                  >
                    {product.sku}
                  </span>
                  <span style={{ fontSize: 12, color: '#5A7899', marginLeft: 8, fontWeight: 500 }}>
                    {product.name}
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              style={{
                width: 30,
                height: 30,
                borderRadius: 9,
                border: '1px solid #E6EDF6',
                background: 'rgba(243,245,249,0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#5A7899',
                flexShrink: 0,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Summary row */}
          {history.length > 0 && (
            <div
              style={{
                display: 'flex',
                gap: 12,
                marginTop: 14,
                padding: '10px 12px',
                background: 'rgba(243,245,249,0.7)',
                borderRadius: 12,
                border: '1px solid #E6EDF6',
              }}
            >
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#9AAFCB', letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 3 }}>Total Changes</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#0B1E35' }}>{history.length}</div>
              </div>
              <div style={{ width: 1, background: '#E6EDF6' }} />
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#9AAFCB', letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 3 }}>Current Price</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#0B1E35', fontFamily: "'DM Mono','Courier New',monospace" }}>
                  {product ? formatCurrency(product.selling_price) : '—'}
                </div>
              </div>
              <div style={{ width: 1, background: '#E6EDF6' }} />
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#9AAFCB', letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 3 }}>Last Updated</div>
                <div style={{ fontSize: 11.5, fontWeight: 600, color: '#5A7899' }}>
                  {history[0] ? timeAgo(history[0].changed_at) : '—'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Timeline body */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
          }}
        >
          {history.length === 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                gap: 12,
                color: '#9AAFCB',
              }}
            >
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#9AAFCB" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <p style={{ margin: 0, fontSize: 13.5, fontWeight: 500 }}>No price changes recorded yet.</p>
            </div>
          ) : (
            <div style={{ position: 'relative' }}>
              {/* Vertical line */}
              <div
                style={{
                  position: 'absolute',
                  left: 19,
                  top: 8,
                  bottom: 8,
                  width: 2,
                  background: 'linear-gradient(to bottom, rgba(0,114,206,0.18) 0%, rgba(0,114,206,0.06) 100%)',
                  borderRadius: 999,
                }}
              />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {history.map((item, i) => {
                  const increase = item.new_price > item.old_price
                  const diff = item.new_price - item.old_price
                  const diffPct = Math.round((diff / item.old_price) * 100)
                  const avatarColor = getAvatarColor(item.staff.full_name)

                  return (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        gap: 14,
                        paddingBottom: i < history.length - 1 ? 20 : 0,
                        position: 'relative',
                      }}
                    >
                      {/* Timeline dot */}
                      <div style={{ flexShrink: 0, position: 'relative', zIndex: 1 }}>
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            background: increase ? 'rgba(0,165,80,0.10)' : 'rgba(244,95,62,0.10)',
                            border: `2px solid ${increase ? 'rgba(0,165,80,0.25)' : 'rgba(244,95,62,0.25)'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={increase ? '#00A550' : '#F45F3E'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            {increase
                              ? <><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></>
                              : <><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></>}
                          </svg>
                        </div>
                      </div>

                      {/* Content card */}
                      <div
                        style={{
                          flex: 1,
                          background: 'rgba(243,245,249,0.6)',
                          borderRadius: 16,
                          padding: '14px 14px',
                          border: '1px solid #E6EDF6',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                        }}
                      >
                        {/* Price change row */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 6 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span
                              style={{
                                fontSize: 13.5,
                                fontWeight: 700,
                                color: '#9AAFCB',
                                fontFamily: "'DM Mono','Courier New',monospace",
                                textDecoration: 'line-through',
                              }}
                            >
                              {formatCurrency(item.old_price)}
                            </span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9AAFCB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="9 18 15 12 9 6"/>
                            </svg>
                            <span
                              style={{
                                fontSize: 15,
                                fontWeight: 800,
                                color: '#0B1E35',
                                fontFamily: "'DM Mono','Courier New',monospace",
                              }}
                            >
                              {formatCurrency(item.new_price)}
                            </span>
                          </div>
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              color: increase ? '#006B30' : '#B83A1E',
                              background: increase ? 'rgba(0,165,80,0.09)' : 'rgba(244,95,62,0.09)',
                              borderRadius: 999,
                              padding: '3px 9px',
                            }}
                          >
                            {increase ? '+' : ''}{diffPct}%
                          </span>
                        </div>

                        {/* Staff + timestamp */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div
                              style={{
                                width: 26,
                                height: 26,
                                borderRadius: 8,
                                background: avatarColor,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                boxShadow: `0 2px 6px ${avatarColor}44`,
                              }}
                            >
                              <span style={{ color: '#fff', fontSize: 9.5, fontWeight: 800 }}>{initials(item.staff.full_name)}</span>
                            </div>
                            <div>
                              <div style={{ fontSize: 12, fontWeight: 700, color: '#0B1E35' }}>{item.staff.full_name}</div>
                              <div style={{ fontSize: 10.5, color: '#9AAFCB' }}>{item.staff.role}</div>
                            </div>
                          </div>
                          <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <div style={{ fontSize: 11.5, color: '#5A7899', fontFamily: "'DM Mono','Courier New',monospace" }}>
                              {timeAgo(item.changed_at)}
                            </div>
                            <div style={{ fontSize: 10.5, color: '#9AAFCB' }}>
                              {formatDate(item.changed_at)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '14px 20px',
            borderTop: '1px solid rgba(230,237,246,0.8)',
            flexShrink: 0,
            display: 'flex',
            gap: 10,
          }}
        >
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '11px',
              borderRadius: 14,
              border: '1.5px solid #E6EDF6',
              background: 'rgba(243,245,249,0.8)',
              color: '#5A7899',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Close
          </button>
          <button
            style={{
              flex: 1,
              padding: '11px',
              borderRadius: 14,
              border: 'none',
              background: 'rgba(0,114,206,0.08)',
              color: '#0072CE',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export CSV
          </button>
        </div>
      </aside>
    </>
  )
}
