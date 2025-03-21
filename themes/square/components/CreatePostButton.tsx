'use client'

import { Button } from '@/components/ui/button'
import { Site } from '@/lib/theme.types'
import { Trans } from '@lingui/react/macro'
import { PencilIcon, PenToolIcon } from 'lucide-react'

interface Props {
  site: Site
  className?: string
}

export const CreatePostButton = ({ site, className }: Props) => {
  return (
    <Button
      // size={'icon'}
      size="sm"
      // variant="outline"
      variant="ghost"
      className="rounded-full gap-0.5"
      onClick={() => {
        //
      }}
    >
      {/* <PenToolIcon size={16} className="text-foreground/80" /> */}
      <span className="icon-[iconamoon--edit-light] size-5"></span>
      {/* <PencilIcon size={16} className="text-foreground/80" /> */}
      <Trans>Write</Trans>
    </Button>
  )
}
