'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Link } from '@/lib/i18n'
import { cn, withRef } from '@udecode/cn'
import { PlateElement } from '@udecode/plate/react'

export const ProjectsElement = withRef<typeof PlateElement>((props, ref) => {
  const { children, className, nodeProps, ...rest } = props

  return (
    <PlateElement
      ref={ref}
      className={cn(className)}
      {...props}
      contentEditable={false}
    >
      <div className="rounded-2xl p-4 h-20 border bg-background border-foreground/5 flex items-center justify-center text-foreground/60 gap-2">
        <div>My Projects</div>
        <Link href="/~/settings/projects">
          <Button size="sm" variant="secondary">
            Edit
          </Button>
        </Link>
      </div>
      {children}
    </PlateElement>
  )
})
