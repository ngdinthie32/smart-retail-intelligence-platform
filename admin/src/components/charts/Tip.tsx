export function Tip({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'rgba(11,30,53,0.92)', backdropFilter: 'blur(10px)', borderRadius: 12, padding: '8px 12px', border: '1px solid rgba(255,255,255,0.1)' }}>
      {label && <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 10, fontWeight: 600, marginBottom: 4 }}>{label}</div>}
      {payload.map(p => (
        <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#fff', fontWeight: 600, lineHeight: 1.7 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
          {p.name}: ${p.value.toLocaleString()}
        </div>
      ))}
    </div>
  )
}