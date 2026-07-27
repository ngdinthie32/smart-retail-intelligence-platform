import { useState } from 'react'
import { T } from '../../constants/theme'

interface PillDropdownProps {
  value: string
  options: string[]
  onChange: (v: string) => void
  prefix?: string
  icon?: React.ReactNode
}

export function PillDropdown({ value, options, onChange, prefix, icon }: PillDropdownProps) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '8px 13px',
          borderRadius: 999, background: T.card,
          border: `1.5px solid ${T.border}`,
          cursor: 'pointer', fontSize: 13, fontWeight: 600, color: T.text,
          boxShadow: T.shadowSm, whiteSpace: 'nowrap',
        }}
      >
        {icon}
        {prefix && <span style={{ color: T.muted, fontWeight: 500, fontSize: 12 }}>{prefix}</span>}
        {value}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.muted} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 290 }} onClick={() => setOpen(false)}/>
          <div style={{
            position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 300,
            background: T.card, borderRadius: 16,
            boxShadow: '0 16px 40px rgba(0,0,0,0.13), 0 2px 8px rgba(0,0,0,0.06)',
            border: `1px solid ${T.border}`, overflow: 'hidden', minWidth: '100%',
          }}>
            {options.map(opt => (
              <button key={opt} onClick={() => { onChange(opt); setOpen(false) }} style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '10px 16px', border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: opt === value ? 700 : 400,
                color: opt === value ? T.blue : T.text,
                background: opt === value ? 'rgba(0,114,206,0.06)' : 'transparent',
                whiteSpace: 'nowrap', transition: 'background 0.12s',
              }}>
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}