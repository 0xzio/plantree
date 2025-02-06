import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { FarcasterLogo } from '../FarcasterLogo'

export function ActionButton({
  loading,
  label,
  onClick,
  initializing,
}: {
  label: ReactNode
  onClick: () => void
  initializing: boolean
  loading: boolean
}) {
  return (
    <Button
      variant="outline"
      className="border-foreground"
      onClick={onClick}
      disabled={initializing || loading}
    >
      <FarcasterLogo height={20} fill="purple" />
      <div style={{ marginLeft: 9 }} className="flex items-center gap-1">
        {label}
      </div>
    </Button>
  )
}
