'use client'

import React, { useState } from 'react'
import { cn, withRef } from '@udecode/cn'
import { PlateElement } from '@udecode/plate/react'

export const CommentBoxElement = withRef<typeof PlateElement>((props, ref) => {
  const { children, className, nodeProps, ...rest } = props

  return (
    <PlateElement
      ref={ref}
      className={cn(className)}
      {...props}
      contentEditable={false}
    >
      <div className="rounded-2xl p-4 h-20 border border-foreground/5 flex items-center justify-center text-foreground/60 bg-background">
        Comment box
      </div>
      {children}
    </PlateElement>
  )
})
