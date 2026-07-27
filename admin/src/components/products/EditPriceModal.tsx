import { useState, useEffect, useRef } from 'react'
import type { EditPriceFormData } from '../../types/product'

interface EditPriceModalProps {
  data: EditPriceFormData | null
  onSave: (productId: string, newPrice: number) => void
  onCancel: () => void
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

export default function EditPriceModal({ data, onSave, onCancel }: EditPriceModalProps) {
  const [inputValue, setInputValue] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (data) {
      setInputValue(data.current_price.toFixed(2))
      setError('')
      setSaving(false)
      setTimeout(() => inputRef.current?.select(), 80)
    }
  }, [data])

  if (!data) return null

  const numericValue = parseFloat(inputValue)
  const isValid = !isNaN(numericValue) && numericValue > 0
  const priceDiff = isValid ? numericValue - data.current_price : 0
  const diffPct = isValid && data.current_price > 0
    ? Math.round((priceDiff / data.current_price) * 100)
    : 0

  function handleSave() {
    if (!isValid) {
      setError('Please enter a valid price greater than $0.00')
      return
    }
    if (numericValue === data!.current_price) {
      setError('New price must differ from the current selling price.')
      return
    }
    setSaving(true)
    setTimeout(() => {
      onSave(data!.product_id, numericValue)
      setSaving(false)
    }, 600)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') onCancel()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onCancel}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(11,30,53,0.45)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          zIndex: 500,
          animation: 'fadeIn 0.18s ease',
        }}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Edit Selling Price"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 460,
          maxWidth: 'calc(100vw - 32px)',
          zIndex: 510,
          animation: 'slideUp 0.22s cubic-bezier(.4,0,.2,1)',
        }}
      >
        <div
          style={{
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: 24,
            boxShadow: '0 32px 80px rgba(0,114,206,0.18), 0 8px 24px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.9)',
            border: '1.5px solid rgba(255,255,255,0.7)',
            overflow: 'hidden',
          }}
        >
          {/* Header stripe */}
          <div
            style={{
              padding: '20px 24px 18px',
              borderBottom: '1px solid rgba(230,237,246,0.8)',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 12,
              background: 'linear-gradient(145deg, rgba(0,114,206,0.03) 0%, transparent 60%)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    background: 'rgba(0,114,206,0.10)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0072CE" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </div>
                <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#0B1E35', letterSpacing: '-0.02em' }}>
                  Edit Selling Price
                </h2>
              </div>
              <p style={{ margin: 0, fontSize: 12, color: '#9AAFCB' }}>
                Updating price will trigger audit log entry
              </p>
            </div>
            <button
              onClick={onCancel}
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

          {/* Body */}
          <div style={{ padding: '20px 24px' }}>
            {/* Readonly product info */}
            <div
              style={{
                background: 'rgba(243,245,249,0.7)',
                borderRadius: 14,
                padding: '14px 16px',
                marginBottom: 18,
                border: '1px solid #E6EDF6',
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px' }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#9AAFCB', letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 4 }}>Product Name</div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: '#0B1E35', lineHeight: 1.3 }}>{data.name}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#9AAFCB', letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 4 }}>SKU</div>
                  <span
                    style={{
                      fontFamily: "'DM Mono','Courier New',monospace",
                      fontSize: 12,
                      fontWeight: 600,
                      color: '#0072CE',
                      background: 'rgba(0,114,206,0.07)',
                      borderRadius: 8,
                      padding: '2px 8px',
                    }}
                  >
                    {data.sku}
                  </span>
                </div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#9AAFCB', letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 4 }}>Current Selling Price</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0B1E35', fontFamily: "'DM Mono','Courier New',monospace" }}>
                    {formatCurrency(data.current_price)}
                  </div>
                </div>
                {isValid && numericValue !== data.current_price && (
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#9AAFCB', letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 4 }}>Price Change</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: priceDiff >= 0 ? '#006B30' : '#B83A1E' }}>
                        {priceDiff >= 0 ? '+' : ''}{formatCurrency(priceDiff)}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: priceDiff >= 0 ? '#006B30' : '#B83A1E',
                          background: priceDiff >= 0 ? 'rgba(0,165,80,0.09)' : 'rgba(244,95,62,0.09)',
                          borderRadius: 999,
                          padding: '2px 7px',
                        }}
                      >
                        {priceDiff >= 0 ? '+' : ''}{diffPct}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* New price input */}
            <label style={{ display: 'block', marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#0B1E35', marginBottom: 8, letterSpacing: '-0.005em' }}>
                New Selling Price <span style={{ color: '#F45F3E' }}>*</span>
              </div>
              <div style={{ position: 'relative' }}>
                <span
                  style={{
                    position: 'absolute',
                    left: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: 15,
                    fontWeight: 700,
                    color: '#5A7899',
                    fontFamily: "'DM Mono','Courier New',monospace",
                    pointerEvents: 'none',
                  }}
                >
                  $
                </span>
                <input
                  ref={inputRef}
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={inputValue}
                  onChange={e => { setInputValue(e.target.value); setError('') }}
                  onKeyDown={handleKeyDown}
                  placeholder="0.00"
                  style={{
                    width: '100%',
                    padding: '13px 14px 13px 28px',
                    borderRadius: 14,
                    border: `1.5px solid ${error ? '#F45F3E' : '#E6EDF6'}`,
                    background: '#FAFBFD',
                    fontSize: 16,
                    fontWeight: 700,
                    color: '#0B1E35',
                    fontFamily: "'DM Mono','Courier New',monospace",
                    outline: 'none',
                    transition: 'border-color 0.15s, box-shadow 0.15s',
                    boxSizing: 'border-box',
                    boxShadow: error ? '0 0 0 3px rgba(244,95,62,0.10)' : 'none',
                  }}
                  onFocus={e => {
                    if (!error) e.currentTarget.style.borderColor = '#0072CE'
                    e.currentTarget.style.boxShadow = error
                      ? '0 0 0 3px rgba(244,95,62,0.10)'
                      : '0 0 0 3px rgba(0,114,206,0.10)'
                  }}
                  onBlur={e => {
                    e.currentTarget.style.borderColor = error ? '#F45F3E' : '#E6EDF6'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                />
              </div>
              {error && (
                <p style={{ margin: '6px 0 0', fontSize: 12, color: '#B83A1E', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#B83A1E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {error}
                </p>
              )}
            </label>

            {/* System callout */}
            <div
              style={{
                display: 'flex',
                gap: 10,
                padding: '11px 14px',
                borderRadius: 12,
                background: 'rgba(0,114,206,0.05)',
                border: '1px solid rgba(0,114,206,0.14)',
                marginBottom: 20,
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0072CE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <p style={{ margin: 0, fontSize: 12, color: '#005BA5', lineHeight: 1.5 }}>
                Price update will automatically trigger{' '}
                <code
                  style={{
                    fontFamily: "'DM Mono','Courier New',monospace",
                    fontSize: 11.5,
                    fontWeight: 700,
                    background: 'rgba(0,114,206,0.10)',
                    padding: '1px 6px',
                    borderRadius: 5,
                  }}
                >
                  trg_products_price_history
                </code>{' '}
                and log this change with your admin credentials.
              </p>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={onCancel}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: 14,
                  border: '1.5px solid #E6EDF6',
                  background: 'rgba(243,245,249,0.8)',
                  color: '#5A7899',
                  fontSize: 13.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#9AAFCB' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#E6EDF6' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  flex: 1.6,
                  padding: '12px',
                  borderRadius: 14,
                  border: 'none',
                  background: saving ? 'rgba(0,165,80,0.7)' : '#00A550',
                  color: '#fff',
                  fontSize: 13.5,
                  fontWeight: 700,
                  cursor: saving ? 'wait' : 'pointer',
                  boxShadow: '0 6px 20px rgba(0,165,80,0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 7,
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => {
                  if (!saving) (e.currentTarget as HTMLButtonElement).style.background = '#008C44'
                }}
                onMouseLeave={e => {
                  if (!saving) (e.currentTarget as HTMLButtonElement).style.background = '#00A550'
                }}
              >
                {saving ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83">
                        <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite"/>
                      </path>
                    </svg>
                    Saving…
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Save New Price
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translate(-50%, calc(-50% + 16px)) } to { opacity: 1; transform: translate(-50%, -50%) } }
      `}</style>
    </>
  )
}
