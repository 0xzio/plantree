'use client'

import { JSX } from 'react'
import { PlateEditor } from '@/components/editor/plate-editor'
import { PodcastTips } from '@/components/theme-ui/PodcastTips'
import { PostActions } from '@/components/theme-ui/PostActions'
import { CommentSheet } from '@/components/theme-ui/PostActions/Comment/CommentSheet'
import { Link } from '@/lib/i18n'
import { Post, PostType, SeriesWithPosts, User } from '@/lib/theme.types'
import { cn, formatDate, getUrl } from '@/lib/utils'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { Node } from 'slate'
import { AuthorAvatar } from './AuthorAvatar'

interface PostItemProps {
  series: SeriesWithPosts
  post: Post
  receivers?: string[]
  className?: string
  ContentRender?: (props: { content: any[]; className?: string }) => JSX.Element
}

export function PostItem({
  post,
  series,
  receivers = [],
  className,
}: PostItemProps) {
  const { slug, title } = post
  const params = useSearchParams()!
  const type = params.get('type')

  // console.log('========post:', post)

  if (type === 'photos' && post.type !== PostType.IMAGE) return null
  if (type === 'notes' && post.type !== PostType.NOTE) return null
  if (type === 'articles' && post.type !== PostType.ARTICLE) return null

  const getContent = () => {
    if (post.type === PostType.IMAGE) {
      return (
        <img src={post.content} alt="" className="w-full h-auto rounded-lg" />
      )
    }

    if (post.type === PostType.NOTE) {
      return (
        <div className="text-foreground/80">
          <PlateEditor
            value={JSON.parse(post.content)}
            readonly
            className="px-0 py-0"
          />
        </div>
      )
    }

    const nodes: any[] =
      typeof post.content === 'string' && post.content.length
        ? JSON.parse(post.content)
        : post.content || []
    const str = nodes.map((node) => Node.string(node)).join('') || ''

    return (
      <Link href={`/series/${series.slug}/${slug}`} className="space-y-2">
        <div className="flex items-center gap-1 hover:scale-105 transition-all origin-left">
          <PodcastTips post={post} />
          <h2 className="text-2xl font-bold block">{post.title}</h2>
        </div>
        <p className="text-foreground/70 hover:text-foreground transition-all hover:scale-105 line-clamp-2">
          {post.description || str?.slice(0, 200)}
        </p>
      </Link>
    )
  }

  return (
    <div className={cn('flex justify-between items-center gap-10', className)}>
      <div className="flex flex-col gap-3 py-5 flex-1">
        {getContent()}

        <div className="flex items-center justify-between">
          <time className="text-xs text-foreground/50">
            {formatDate(post.updatedAt)}
          </time>
          <CommentSheet post={post} />
        </div>
      </div>

      {post.image && (
        <div className="max-w-[160px]">
          <Link href={`/series/${series.slug}/${slug}`}>
            <Image
              src={getUrl(post.image || '')}
              className="w-full h-auto rounded"
              style={{
                aspectRatio: '1.5/1',
              }}
              width={400}
              height={400}
              alt=""
            />
          </Link>
        </div>
      )}
    </div>
  )
}
