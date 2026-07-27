import { useState } from 'react'

const DEFAULT_MONTHS = ['Thg 1', 'Thg 2', 'Thg 3', 'Thg 4', 'Thg 5', 'Thg 6', 'Thg 7']

interface CapsuleBarsProps {
  data: number[]
  c0: string
  c1: string
  id?: string
  months?: string[]
}

export function CapsuleBars({ data, c0, c1, months = DEFAULT_MONTHS }: CapsuleBarsProps) {
  const max = Math.max(...data)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  
  // Tọa độ con chuột (x, y) tương đối trong khung biểu đồ
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

  // Lấy tọa độ con chuột khi di chuyển trong vùng biểu đồ
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <style>{`
        @keyframes barGrowUp {
          0% { transform: scaleY(0); opacity: 0; }
          100% { transform: scaleY(1); opacity: 1; }
        }
      `}</style>

      {/* ── Khung chứa các thanh + Bắt sự kiện di chuyển chuột ── */}
      <div 
        style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: '100%', padding: '0 10px', flex: 1, position: 'relative' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredIdx(null)}
      >
        
        {/* 🌟 TOOLTIP VẬT LÝ: Trượt mượt theo TỌA ĐỘ CON CHUỘT (X & Y) có độ trễ ── */}
        <div style={{
          position: 'absolute',
          left: `${mousePos.x}px`,
          top: `${mousePos.y - 12}px`, // Xuất hiện ngay phía trên đầu con chuột
          transform: 'translate(-50%, -100%)', // Đẩy ô text lên trên con chuột
          background: 'rgba(11,30,53,0.92)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderRadius: 12,
          padding: '7px 12px',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 10px 25px rgba(0,0,0,0.35)',
          pointerEvents: 'none',
          zIndex: 30,
          whiteSpace: 'nowrap',
          
          /* Trạng thái ẩn / hiện */
          opacity: hoveredIdx !== null ? 1 : 0,
          visibility: hoveredIdx !== null ? 'visible' : 'hidden',
          
          /* TRỌNG TÂM: Tạo độ trễ (Delay) & Chuyển động quán tính (Inertia / Spring) */
          transition: 'left 0.28s cubic-bezier(0.15, 0.85, 0.35, 1.2), top 0.28s cubic-bezier(0.15, 0.85, 0.35, 1.2), opacity 0.18s ease, visibility 0.18s ease',
        }}>
          {/* Tháng */}
          <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 10, fontWeight: 600, marginBottom: 2 }}>
            {hoveredIdx !== null ? (months[hoveredIdx] || `Tháng ${hoveredIdx + 1}`) : ''}
          </div>
          
          {/* Giá trị / Thông số */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#fff', fontWeight: 600, lineHeight: 1.4 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: c0, flexShrink: 0 }} />
            ${hoveredIdx !== null ? data[hoveredIdx].toLocaleString() : 0}
          </div>
        </div>

        {/* ── Các cột Capsule ── */}
        {data.map((v, i) => {
          const h = Math.max(12, Math.round((v / max) * 100))
          const isHovered = hoveredIdx === i

          return (
            <div
              key={i}
              onMouseEnter={() => setHoveredIdx(i)}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                height: '100%',
                position: 'relative',
                cursor: 'pointer',
              }}
            >
              <div style={{
                width: '100%',
                maxWidth: 24,
                height: `${h}%`,
                background: `linear-gradient(to bottom, ${c0} 0%, ${c1}40 100%)`,
                borderRadius: 999,
                minHeight: 10,
                transformOrigin: 'bottom',
                animation: `barGrowUp 0.65s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.05}s both`,
                transition: 'filter 0.2s ease, transform 0.2s ease',
                filter: isHovered ? `brightness(1.25) drop-shadow(0 0 10px ${c0}99)` : 'none',
                transform: isHovered ? 'scaleY(1.04)' : undefined,
              }} />
            </div>
          )
        })}
      </div>

      {/* ── Nhãn Tháng dưới chân các cột ── */}
      <div style={{ display: 'flex', gap: 8, padding: '6px 10px 0' }}>
        {data.map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              textAlign: 'center',
              fontSize: 10,
              fontWeight: hoveredIdx === i ? 700 : 500,
              color: hoveredIdx === i ? c0 : '#94A3B8',
              transition: 'color 0.2s ease',
            }}
          >
            {months[i] || `T${i + 1}`}
          </div>
        ))}
      </div>
    </div>
  )
}