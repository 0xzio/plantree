'use client'

import React from 'react'
import { ContentRender } from '@/components/theme-ui/ContentRender'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { useMounted } from '@/hooks/use-mounted'
import { usePosts } from '@/hooks/usePosts'
import { Link } from '@/lib/i18n'
import { SitePost } from '@/lib/types'
import { cn, withRef } from '@udecode/cn'
import { getHandler, IS_APPLE } from '@udecode/plate'
import {
  PlateElement,
  useFocused,
  useReadOnly,
  useSelected,
} from '@udecode/plate/react'
import { TBidirectionalLinkElement } from '../lib'

export const BidirectionalLinkElement = withRef<
  typeof PlateElement,
  {
    prefix?: string
    onClick?: (mentionNode: any) => void
  }
>(({ children, className, prefix, onClick, ...props }, ref) => {
  const element = props.element as TBidirectionalLinkElement
  const selected = useSelected()
  const focused = useFocused()
  const mounted = useMounted()
  const readOnly = useReadOnly()
  const { data = [] } = usePosts()
  const post = data.find((p) => p.id === element.postId)

  return (
    <PlateElement
      ref={ref}
      className={cn(
        className,
        'inline-block rounded-md px-0.5 py-0 align-baseline font-medium mr-0.5 hover:scale-105 transition-all',
        !readOnly && 'cursor-pointer',
        selected && focused && 'bg-foreground/5',
        element.children[0].bold === true && 'font-bold',
        element.children[0].italic === true && 'italic',
        element.children[0].underline === true && 'underline',
      )}
      onClick={getHandler(onClick, element)}
      data-slate-value={element.value}
      contentEditable={false}
      draggable
      {...props}
    >
      {mounted && IS_APPLE ? (
        // Mac OS IME https://github.com/ianstormtaylor/slate/issues/3490
        <React.Fragment>
          {children}
          {prefix}
          <Content post={post!} />
        </React.Fragment>
      ) : (
        // Others like Android https://github.com/ianstormtaylor/slate/pull/5360
        <React.Fragment>
          {prefix}
          <Content post={post!} />
          {children}
        </React.Fragment>
      )}
    </PlateElement>
  )
})

function Content({ post }: { post: SitePost }) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Link href={`/~/post?id=${post.id}`} className="text-brand">
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
