'use client'

import { CreatePostButton } from '@/components/CreatePostButton'
import { useSeriesContext } from '@/components/SeriesContext'
import { Link, usePathname } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { ChevronLeft } from 'lucide-react'

interface Props {
  className?: string
}

export function SeriesNav({ className }: Props) {
  const pathname = usePathname()!
  const series = useSeriesContext()

  return (
    <div
      className={cn(
        'flex items-center space-x-3 justify-between fixed md:sticky right-0 left-0 bottom-0 md:top-0 h-12 px-2 bg-background z-20',
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <Link
          href={`/~/series`}
          className="inline-flex w-8 h-8 text-foreground items-center justify-center bg-accent rounded-xl cursor-pointer shrink-0"
        >
          <ChevronLeft size={20} />
        </Link>
      </div>
    </div>
  )
}
