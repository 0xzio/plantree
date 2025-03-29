'use client'

import { CSSProperties, useEffect, useState } from 'react'
import { Link } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { Trans } from '@lingui/react/macro'
import { slug } from 'github-slugger'
import { Node } from 'slate'
import { usePostListContext } from '../PostListContext'

interface Props {
  className?: string
  style?: CSSProperties
}

export const BackLinks = ({ className, style = {} }: Props) => {
  const { backLinkPosts = [] } = usePostListContext()
  if (!backLinkPosts.length) return null
  return (
    <div
      className={cn(
        'shrink-0 opacity-60 hover:opacity-100 transition-all',
        className,
      )}
      style={{
        ...style,
      }}
    >
      <div className="">
        <h2 className="font-semibold mb-4 text-sm text-foreground/90">
          <Trans>Backlinks</Trans>
        </h2>

        <div className="flex flex-col gap-2">
          {backLinkPosts.map((post) => {
            return (
              <Link
                key={post.id}
                href={`/posts/${post.slug}`}
                className={cn(
                  'cursor-pointer text-sm text-foreground/40 hover:text-foreground transition-all',
                )}
              >
                {post.title}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
