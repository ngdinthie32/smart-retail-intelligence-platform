import { useState, useRef, useEffect } from 'react'

interface CapsuleBarsProps {
  data: number[]
  c0: string
  c1: string
  id?: string
  startYear?: number  // Năm bắt đầu (mặc định: 2025)
  startMonth?: number // Tháng bắt đầu 1..12 (mặc định: 1)
}

export function CapsuleBars({ 
  data, 
  c0, 
  c1, 
  startYear = 2025, 
  startMonth = 1 
}: CapsuleBarsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState<number>(0)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

  // Lắng nghe kích thước chiều rộng Card thực tế
  useEffect(() => {
    if (!containerRef.current) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width)
      }
    })

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  // Mỗi cột (bao gồm max width bar + gap) chiếm ~32px
  const SLOT_WIDTH = 32
  const paddingHorizontal = 20
  const availableWidth = Math.max(0, containerWidth - paddingHorizontal)
  
  // Tính tổng số cột hiển thị vừa vặn trong Card (Cho phép hiển thị nhiều năm nếu Card rất rộng)
  const calculatedCols = Math.floor(availableWidth / SLOT_WIDTH)
  const totalCols = Math.max(3, Math.min(calculatedCols || 7, 24))

  // Lấy danh sách dữ liệu tương ứng số cột
  const visibleData = Array.from({ length: totalCols }, (_, i) => {
    return data[i % data.length]
  })

  const max = Math.max(...visibleData, 1)

  // Hàm tính chính xác Tháng và Năm dựa trên index
  const getMonthYear = (index: number) => {
    const totalMonths = (startMonth - 1) + index
    const month = (totalMonths % 12) + 1
    const year = startYear + Math.floor(totalMonths / 12)
    return { month, year }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <div ref={containerRef} style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      <style>{`
        @keyframes barGrowUp {
          0% { transform: scaleY(0); opacity: 0; }
          100% { transform: scaleY(1); opacity: 1; }
        }
      `}</style>

      {/* ── Khung chứa các thanh + Tooltip chuột ── */}
      <div 
        style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: '100%', padding: '20px 10px 0', flex: 1, position: 'relative' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredIdx(null)}
      >
        {/* Tooltip hiển thị Tháng / Năm & Giá trị */}
        <div style={{
          position: 'absolute',
          left: `${mousePos.x}px`,
          top: `${mousePos.y - 12}px`,
          transform: 'translate(-50%, -100%)',
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
          opacity: hoveredIdx !== null ? 1 : 0,
          visibility: hoveredIdx !== null ? 'visible' : 'hidden',
          transition: 'left 0.28s cubic-bezier(0.15, 0.85, 0.35, 1.2), top 0.28s cubic-bezier(0.15, 0.85, 0.35, 1.2), opacity 0.18s ease, visibility 0.18s ease',
        }}>
          <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 10, fontWeight: 600, marginBottom: 2 }}>
            {hoveredIdx !== null ? `Tháng ${getMonthYear(hoveredIdx).month} / ${getMonthYear(hoveredIdx).year}` : ''}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#fff', fontWeight: 600, lineHeight: 1.4 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: c0, flexShrink: 0 }} />
            ${hoveredIdx !== null ? visibleData[hoveredIdx].toLocaleString() : 0}
          </div>
        </div>

        {/* ── Các cột Capsule ── */}
        {visibleData.map((v, i) => {
          const h = Math.max(12, Math.round((v / max) * 100))
          const isHovered = hoveredIdx === i
          const { month, year } = getMonthYear(i)
          
          // Kiểm tra xem cột này có phải mốc đầu năm (T1) hoặc cột đầu tiên không
          const isYearStart = month === 1 || i === 0
          const isNewYearBoundary = month === 1 && i > 0 // Vượt sang năm mới

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
                // Đường sọc đứng đứt nét ngăn cách giữa các năm
                borderLeft: isNewYearBoundary ? '1px dashed rgba(148, 163, 184, 0.4)' : 'none',
                paddingLeft: isNewYearBoundary ? 4 : 0,
              }}
            >
              {/* Thẻ năm (Badge) hiển thị phía trên đầu cột T1 */}
              {isYearStart && (
                <div style={{
                  position: 'absolute',
                  top: -18,
                  fontSize: 9,
                  fontWeight: 700,
                  color: c0,
                  background: `${c0}18`,
                  padding: '1px 5px',
                  borderRadius: 4,
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                  letterSpacing: '0.02em',
                }}>
                  {year}
                </div>
              )}

              {/* Thanh Capsule */}
              <div style={{
                width: '100%',
                maxWidth: 24,
                height: `${h}%`,
                background: `linear-gradient(to bottom, ${c0} 0%, ${c1}40 100%)`,
                borderRadius: 999,
                minHeight: 10,
                transformOrigin: 'bottom',
                animation: `barGrowUp 0.65s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.03}s both`,
                transition: 'filter 0.2s ease, transform 0.2s ease',
                filter: isHovered ? `brightness(1.25) drop-shadow(0 0 10px ${c0}99)` : 'none',
                transform: isHovered ? 'scaleY(1.04)' : undefined,
              }} />
            </div>
          )
        })}
      </div>

      {/* ── Nhãn T1, T2... T12 dưới chân các cột ── */}
      <div style={{ display: 'flex', gap: 8, padding: '6px 10px 0' }}>
        {visibleData.map((_, i) => {
          const { month } = getMonthYear(i)
          return (
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
              T{month}
            </div>
          )
        })}
      </div>
    </div>
  )
}