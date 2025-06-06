import React from 'react'
import { getBlockClassName } from '@/lib/utils'
import { cn } from '@udecode/cn'
import type { SlateElementProps } from '@udecode/plate'
import { SlateElement } from '@udecode/plate'

export const ParagraphElementStatic = ({
  children,
  className,
  ...props
}: SlateElementProps) => {
  return (
    <SlateElement
      className={cn(
        className,
        'm-0 px-0 py-2 leading-relaxed text-foreground/85',
        getBlockClassName(props),
      )}
      {...props}
    >
      {children}
    </SlateElement>
  )
}
