'use client'

import React from 'react'
import { usePostListContext } from '@/components/PostListContext'
import { ContentRender } from '@/components/theme-ui/ContentRender'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { Link } from '@/lib/i18n'
import { SitePost } from '@/lib/types'
import { cn } from '@udecode/cn'
import type { SlateElementProps } from '@udecode/plate'
import { SlateElement } from '@udecode/plate'
import { TBidirectionalLinkElement } from '../lib'

export function BidirectionalLinkElementStatic({
  children,
  className,
  prefix,
  ...props
}: SlateElementProps & {
  prefix?: string
}) {
  const element = props.element as TBidirectionalLinkElement
  const posts = usePostListContext()
  const post = posts.find((p) => p.id === element.postId)!

  return (
    <SlateElement
      className={cn(
        className,
        'inline-block px-0.5 py-0 align-baseline font-medium hover:scale-105 transition-all',
        element.children[0].bold === true && 'font-bold',
        element.children[0].italic === true && 'italic',
        element.children[0].underline === true && 'underline',
      )}
      data-slate-value={element.value}
      {...props}
    >
      {post && <Content post={post as any} />}
      {children}
      {element.value}
    </SlateElement>
  )
}

function Content({ post }: { post: SitePost }) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Link
          href={`/posts/${post.slug}`}
          className="text-brand cursor-pointer"
        >
          {post?.title || 'Untitled'}
        </Link>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 max-h-64 overflow-auto space-y-4">
        <div className="text-xl font-bold">{post.title}</div>
        <ContentRender content={post.content} />
      </HoverCardContent>
    </HoverCard>
  )
}
