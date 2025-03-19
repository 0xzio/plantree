'use client'

import { Button } from '@/components/ui/button'
import { Site } from '@/lib/theme.types'
import { cn } from '@/lib/utils'
import { Trans } from '@lingui/react/macro'
import { Mail } from 'lucide-react'
import { SubscribeNewsletterDialog } from './SubscribeNewsletterDialog'
import { useSubscribeNewsletterDialog } from './useSubscribeNewsletterDialog'

interface Props {
  className?: string
  site: Site
}

export function SubscribeNewsletterCard({ site, className }: Props) {
  const { setIsOpen } = useSubscribeNewsletterDialog()

  return (
    <>
      <SubscribeNewsletterDialog site={site} />
      <div
        className={cn(
          'mx-auto flex flex-col items-center gap-4 mt-8',
          className,
        )}
      >
        <div className="font-bold text-2xl">
          <Trans>Subscribe to</Trans> {site.name}
        </div>
        <Button
          className="w-40 flex items-center gap-2"
          onClick={() => setIsOpen(true)}
        >
          <Mail size={16} className="opacity-70" />
          <span>
            <Trans>Subscribe</Trans>
          </span>
        </Button>
      </div>
    </>
  )
}
