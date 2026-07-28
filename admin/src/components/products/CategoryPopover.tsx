import { useEffect, useRef } from 'react'
import type { CategoryTag } from '@/types/inventory'

interface CategoryPopoverProps {
  categories: CategoryTag[]
  anchorRect: DOMRect
  onRemove: (id: string) => void
  onAdd: () => void
  onClose: () => void
}

export default function CategoryPopover({
  categories,
  anchorRect,
  onRemove,
  onAdd,
  onClose,
}: CategoryPopoverProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  const style: React.CSSProperties = {
    position: 'fixed',
    top: anchorRect.bottom + 6,
    left: anchorRect.left,
    zIndex: 9999,
  }

  return (
    <div
      ref={ref}
      style={style}
      className="bg-white rounded-2xl shadow-[0_20px_40px_rgba(0,114,206,0.16)] border border-slate-100 p-4 w-72 animate-[fadeIn_0.12s_ease]"
    >
      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">
        Categories
      </p>
      <div className="flex flex-col gap-2 mb-3">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center justify-between bg-slate-50 rounded-xl px-3 py-2 group"
          >
            <span className="text-xs text-slate-700 font-medium leading-snug">{cat.path}</span>
            <button
              onClick={() => onRemove(cat.id)}
              className="ml-2 flex-shrink-0 w-4 h-4 flex items-center justify-center rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors text-[11px]"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={onAdd}
        className="flex items-center gap-1.5 text-xs font-semibold text-[#0072CE] hover:text-blue-700 transition-colors"
      >
        <span className="text-base leading-none">+</span> Add category
      </button>
    </div>
  )
}
