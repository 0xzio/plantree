'use client'

import { Link, usePathname } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export function MembershipEntry() {
  const pathname = usePathname()
  return (
    <Link
      href={`/subscribe?source=${pathname}`}
      className={cn(
        'font-medium hover:text-brand text-foreground/90',
        'border border-brand text-brand rounded-full px-2 py-1 hover:bg-brand hover:text-background text-sm',
      )}
    >
      Membership
    </Link>
  )
}
