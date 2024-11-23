'use client'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function EnableWeb3Entry() {
  return (
    <Link
      className="mt-2 p-3 rounded-lg bg-foreground/5 hover:bg-foreground/10 flex items-center justify-between cursor-pointer transition-all"
      href="/~/create-space"
    >
      <div className="space-y-1 text-foreground/80">
        <div className="font-semibold text-base">Enable Web3</div>
        <div className="text-xs text-foreground/60 leading-normal">
          <div>Tokenize your blog</div>
          <div>Enable blog membership</div>
          <div>Make post collectible</div>
        </div>
      </div>
      <ArrowRight className="text-foreground/40" />
    </Link>
  )
}
