export type ActionKey =
  | 'shift.close'
  | 'auth.login'
  | 'auth.logout'
  | 'order.cancel'
  | 'order.create'
  | 'price.update'
  | 'product.edit'
  | 'shift.open'
  | string

export interface Staff {
  full_name: string
  role: string
  initials?: string
  color?: string
  avatar?: string
}

export interface Branch {
  name: string
}

export interface AuditLog {
  id: number | string
  created_at: string
  staff: Staff
  branch: Branch | string
  action: ActionKey
  entity_type?: string
  entity_id?: number | string
  entity?: string
  ip_address: string
  metadata: Record<string, any>
}

export interface AuditLogFilter {
  search: string
  action?: string
  branch?: string
  staff?: string
}

export interface JsonMetadataModalProps {
  log: AuditLog
  onClose: () => void
}

export interface AuditLogTableProps {
  logs: AuditLog[]
  hoveredRow: number | string | null
  setHoveredRow: (id: number | string | null) => void
  onSelectLog: (log: AuditLog) => void
}