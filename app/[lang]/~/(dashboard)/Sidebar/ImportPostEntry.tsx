'use client'

import { useState } from 'react'
import { IconGoogle } from '@/components/icons/IconGoogle'
import { Button } from '@/components/ui/button'
import { useMyAccounts } from '@/hooks/useMyAccounts'
import { Link } from '@/lib/i18n'
import { ProviderType } from '@prisma/client'
import { ArrowRight, XIcon } from 'lucide-react'

const key = 'HAVE_IMPORTED_POSTS'

export function ImportPostEntry() {
  const [visible, setVisible] = useState(localStorage.getItem(key) !== 'true')

  if (!visible) return null

  return (
    <Link
      href="/~/settings/import-export"
      className="mt-2 p-3 rounded-lg bg-foreground/5 hover:bg-foreground/10 flex items-center justify-between cursor-pointer transition-all"
    >
      <div className="space-y-1 text-foreground">
        <div className="flex items-center gap-1">
          <div className="font-bold text-base">Import posts with AI</div>
        </div>
        <div className="text-sm text-foreground/70 leading-normal">
          One-click to import posts from you blog with AI.
        </div>
        <div className="flex items-center text-xs">
          <span className="mr-1 text-foreground/50">I have imported</span>
          <XIcon
            size={14}
            className="text-foreground/60 hover:text-foreground/90"
            onClick={() => {
              localStorage.setItem(key, 'true')
              setVisible(false)
            }}
          ></XIcon>
        </div>
      </div>
      <ArrowRight size={20} className="text-foreground/50 shrink-0" />
    </Link>
  )
}
