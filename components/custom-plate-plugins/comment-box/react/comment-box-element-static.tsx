'use client'

import React from 'react'
import { CommentWidget } from '@/components/CommentWidget'
import { usePostContext } from '@/components/PostContext'
import { cn } from '@udecode/cn'
import type { SlateElementProps } from '@udecode/plate'
import { SlateElement } from '@udecode/plate'

export const CommentBoxElementStatic = ({
  children,
  className,
  ...props
}: SlateElementProps) => {
  const post = usePostContext()

  return (
    <SlateElement className={cn(className, 'm-0 px-0 py-1')} {...props}>
      <CommentWidget postId={post.id} isInPage={false} />
      {children}
    </SlateElement>
  )
}
