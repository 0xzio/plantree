'use client'

import React from 'react'
import { getBlockClassName } from '@/lib/utils'
import { cn } from '@udecode/cn'
import { PlateElement, withRef } from '@udecode/plate/react'

export const ParagraphElement = withRef<typeof PlateElement>(
  ({ children, className, ...props }, ref) => {
    return (
      <PlateElement
        ref={ref}
        as="p"
        {...props}
        className={cn(
          'm-0 px-0 py-2 leading-normal text-foreground/85',
          className,
          getBlockClassName(props),
        )}
      >
        {children}
      </PlateElement>
    )
  },
)
