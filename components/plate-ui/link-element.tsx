'use client'

import React from 'react'
import { cn, withRef } from '@udecode/cn'
import type { TLinkElement } from '@udecode/plate-link'
import { useLink } from '@udecode/plate-link/react'
import { PlateElement } from '@udecode/plate/react'
import { ArrowUpRight } from 'lucide-react'

export const LinkElement = withRef<typeof PlateElement>(
  ({ children, className, ...props }, ref) => {
    const element = props.element as TLinkElement
    const { props: linkProps } = useLink({ element })

    return (
      <PlateElement
        ref={ref}
        as="a"
        target="_blank"
        className={cn(
          className,
          'font-medium text-brand  decoration-brand underline-offset-4 inline-flex',
        )}
        {...(linkProps as any)}
        {...props}
      >
        {children}
        <ArrowUpRight size={16} className="mt-0.5" />
      </PlateElement>
    )
  },
)
