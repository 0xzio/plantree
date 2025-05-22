'use client'

import { Link } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { Trans, useLingui } from '@lingui/react/macro'
import { usePathname } from 'next/navigation'

interface Props {
  className?: string
}
export function MembershipEntry({ className }: Props) {
  const pathname = usePathname()
  const { i18n } = useLingui()
  const isCN = ['zh-CN', 'zh-TW'].includes(i18n.locale)

  return (
    <Link
      href={`/subscribe?source=${pathname}`}
      className={cn(
        'font-medium inline-flex hover:text-brand text-foreground/90',
        'border border-brand text-brand rounded-full px-2 py-1 hover:bg-brand hover:text-background text-sm',
        isCN && 'py-1',
        className,
      )}
    >
      {isCN ? '成为会员' : <Trans>Membership</Trans>}
    </Link>
  )
}
