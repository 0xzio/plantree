'use client'

import { withCn } from '@udecode/cn'
import { Toolbar } from './toolbar'

export const FixedToolbar = withCn(
  Toolbar,
  'sticky top-0 left-0 z-50 scrollbar-hide w-full justify-between overflow-x-auto border border-foreground/10 rounded-xl bg-background/95 p-1 backdrop-blur-sm supports-backdrop-blur:bg-background/60',
)
