'use client'

import { Link } from '@/lib/i18n'
import { Site } from '@/lib/theme.types'
import { useSession } from '@/lib/useSession'
import { usePathname } from 'next/navigation'
import { useLoginDialog } from '../LoginDialog/useLoginDialog'

interface Props {
  site: Site
  className?: string
}

export function ContributeButton({ site, className }: Props) {
  const isCanContribute = site.config?.features?.contribute ?? false
  const { session } = useSession()
  const { setIsOpen } = useLoginDialog()
  const pathname = usePathname()

  if (!isCanContribute) return null

  return (
    <div className="flex items-center">
      <Link
        href={`/contribute?source=${pathname}`}
        className="text-xs bg-brand/80 hover:bg-brand text-background px-2 py-1 rounded-full transition-all hover:scale-105"
        onClick={(e) => {
          if (!session) {
            e.preventDefault()
            setIsOpen(true)
          }
        }}
      >
        Contribute
      </Link>
    </div>
  )
}
