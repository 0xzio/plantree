import React from 'react'
import { cn } from '@udecode/cn'
import type { SlateElementProps } from '@udecode/plate'
import { SlateElement } from '@udecode/plate'
import { ArrowUpRight } from 'lucide-react'

export const LinkElementStatic = ({
  children,
  className,
  ...props
}: SlateElementProps) => {
  ;(props as any).target = '_blank'
  return (
    <SlateElement
      as="a"
      className={cn(
        className,
        'font-medium text-brand decoration-brand underline-offset-4 inline-flex hover:scale-105 transition-all',
      )}
      {...props}
    >
      {children}
      <ArrowUpRight size={16} className="mt-0.5" />
    </SlateElement>
  )
}
