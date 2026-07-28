const THUMBNAILS = [
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=80&h=80&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=80&h=80&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=80&h=80&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=80&h=80&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1630691564027-f4ba8b53fb49?w=80&h=80&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=80&h=80&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=80&h=80&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=80&h=80&fit=crop&auto=format',
]

export default function InventorySidebar() {
  return (
    <aside className="w-72 flex-shrink-0 flex flex-col gap-4">
      {/* Overview header */}
      <p className="text-[10px] font-semibold text-[#64748B] uppercase tracking-widest px-1">
        Overview
      </p>

      {/* KPI Card */}
      <div
        className="bg-white rounded-3xl p-5 flex flex-col gap-4"
        style={{ boxShadow: '0px 20px 40px rgba(0, 114, 206, 0.08)' }}
      >
        <KPIRow label="SKU Total" value="12,039" />
        <div className="h-px bg-slate-100" />
        <KPIRow label="Products Reserved" value="234" />
        <div className="h-px bg-slate-100" />
        <KPIRow label="Stock Issues" value="2" highlight />
      </div>

      {/* HOT Product Card */}
      <div
        className="bg-white rounded-3xl overflow-hidden"
        style={{ boxShadow: '0px 20px 40px rgba(0, 114, 206, 0.08)' }}
      >
        <div className="relative h-36 bg-slate-100">
          <img
            src="https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=200&fit=crop&auto=format"
            alt="Hot product"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <span className="absolute top-3 left-3 bg-orange-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            🔥 HOT
          </span>
        </div>
        <div className="p-4">
          <p className="text-sm font-semibold text-[#1E293B] leading-snug mb-3">
            Elizavecca Milky Piggy Galactomyces 97%
          </p>
          <div className="flex flex-col gap-1.5">
            <MetricRow icon="👁" label="22 Views Today" />
            <MetricRow icon="📈" label="349 Views This Week" />
          </div>
        </div>
      </div>

      {/* Thumbnail gallery */}
      <div
        className="bg-white rounded-3xl p-4"
        style={{ boxShadow: '0px 20px 40px rgba(0, 114, 206, 0.08)' }}
      >
        <p className="text-[10px] font-semibold text-[#64748B] uppercase tracking-widest mb-3">
          Recent Products
        </p>
        <div className="grid grid-cols-4 gap-2">
          {THUMBNAILS.map((src, i) => (
            <div
              key={i}
              className="aspect-square rounded-xl overflow-hidden bg-slate-100 cursor-pointer hover:opacity-90 transition-opacity"
            >
              <img
                src={src}
                alt={`Product ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}

function KPIRow({
  label,
  value,
  highlight,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-[#64748B]">{label}</span>
      <span
        className={`text-2xl font-bold ${highlight ? 'text-[#EF4444]' : 'text-[#1E293B]'}`}
      >
        {value}
      </span>
    </div>
  )
}

function MetricRow({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-[#64748B]">
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  )
}
