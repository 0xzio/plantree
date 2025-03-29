'use client'

import { JSX } from 'react'
import { PlateEditor } from '@/components/editor/plate-editor'
import { PodcastTips } from '@/components/theme-ui/PodcastTips'
import { PostActions } from '@/components/theme-ui/PostActions'
import { placeholderBlurhash } from '@/lib/constants'
import { Link } from '@/lib/i18n'
import { Post, PostType, User } from '@/lib/theme.types'
import { cn, formatDate } from '@/lib/utils'
import { MessageCircleIcon } from 'lucide-react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { Node } from 'slate'
import { getUserName } from '../lib/getUserName'
import { AuthorAvatar } from './AuthorAvatar'

interface PostItemProps {
  post: Post
  receivers?: string[]
  className?: string
  ContentRender?: (props: { content: any[]; className?: string }) => JSX.Element
}

export function PostItem({ post, receivers = [], className }: PostItemProps) {
  const { slug, title } = post
  const user = post.authors?.[0]?.user
  const name = getUserName(user)
  const params = useSearchParams()!
  const type = params.get('type')

  // console.log('========post:', post)

  if (type === 'photos' && post.type !== PostType.IMAGE) return null
  if (type === 'notes' && post.type !== PostType.NOTE) return null
  if (type === 'articles' && post.type !== PostType.ARTICLE) return null

  const getTitle = () => {
    if (post.type === PostType.IMAGE) return <div className="">{title}</div>
    if (post.type === PostType.NOTE) return <div className="">a note</div>
    if (post.type === PostType.ARTICLE) {
      return <div className="">an article</div>
    }
    return <div></div>
  }

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
      <div className="space-y-2">
        <div className="flex items-center gap-1 hover:scale-105 transition-all origin-left">
          <PodcastTips post={post} />
          <h2 className="text-2xl font-bold block">{post.title}</h2>
        </div>
        <p className="text-foreground/70 hover:text-foreground transition-all hover:scale-105 line-clamp-2">
          {post.description || str?.slice(0, 200)}
        </p>
      </div>
    )
  }

  return (
    <Link
      href={`/posts/${post.slug}`}
      className={cn(
        'flex justify-between items-center bg-background overflow-hidden h-48 drop-shadow-xs',
        className,
      )}
    >
      <div className="flex-1 overflow-clip cursor-pointer">
        <Image
          src={post.image || placeholderBlurhash}
          className={cn(
            'object-cover hover:scale-110 transition-all aspect-16/9',
            post.image && 'w-auto h-auto',
          )}
          placeholder="blur"
          blurDataURL={placeholderBlurhash}
          width={400}
          height={400}
          alt=""
        />
      </div>

      <div className="flex flex-col justify-center h-full gap-3 px-5 py-0 flex-1">
        {getContent()}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm">
            <AuthorAvatar post={post} />
            <div className="font-medium">{name}</div>

            <time className="text-xs text-foreground/50 ml-2">
              {formatDate(post.updatedAt)}
            </time>
          </div>
          <div className="flex items-center gap-1 text-foreground/50">
            <MessageCircleIcon size={16} className="" />
            {post.commentCount}
          </div>
        </div>
      </div>
    </Link>
  )
}
