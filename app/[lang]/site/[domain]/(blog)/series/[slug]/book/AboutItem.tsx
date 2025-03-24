'use client'

import { Link } from '@/lib/i18n'
import { SeriesWithPosts, Site } from '@/lib/theme.types'
import { cn, getUrl } from '@/lib/utils'
import { Trans } from '@lingui/react/macro'
import { useParams } from 'next/navigation'

interface Props {
  series: SeriesWithPosts
  className?: string
}

export const AboutItem = ({ series }: Props) => {
  const params = useParams() as Record<string, string>
  const postSlug = params.postSlug || ''
  const isActive = postSlug === ''
  return (
    <Link
      href={`/series/${series.slug}`}
      className={cn(
        'catalogueItem py-1 relative rounded px-2 flex justify-between items-center mb-[1px] transition-colors',
        'hover:bg-foreground/5 cursor-pointer',
        isActive && 'bg-foreground/5',
      )}
    >
      <div className="flex items-center gap-x-1 flex-1 h-full cursor-pointer text-foreground/50">
        <div
          className={cn(
            'text-[15px] text-foreground/70',
            isActive && 'text-foreground/90',
          )}
        >
          <Trans>About</Trans>
        </div>
      </div>
    </Link>
  )
}
