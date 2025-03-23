'use client'

import React from 'react'
import { useSiteContext } from '@/components/SiteContext'
import { SocialNav } from '@/components/theme-ui/SocialNav'
import { getBlockClassName } from '@/lib/utils'
import { cn } from '@udecode/cn'
import type { SlateElementProps } from '@udecode/plate'
import { SlateElement } from '@udecode/plate'

export const SocialLinksElementStatic = ({
  children,
  className,
  ...props
}: SlateElementProps) => {
  const site = useSiteContext()

  return (
    <SlateElement
      {...props}
      className={cn(
        className,
        getBlockClassName(props),
        'm-0 px-0 py-1 flex justify-center items-center h-full',
      )}
    >
      <SocialNav site={site as any} size={5} />
      {children}
    </SlateElement>
  )
}
