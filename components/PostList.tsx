'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Post } from '@/hooks/usePost'
import { usePosts } from '@/hooks/usePosts'
import { PostStatus, ROOT_DOMAIN } from '@/lib/constants'
import { api } from '@/lib/trpc'
import { cn, getUrl } from '@/lib/utils'
import { PostType } from '@prisma/client'
import { format } from 'date-fns'
import { Archive, Edit3Icon, ExternalLink, Trash2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { PlateEditor } from './editor/plate-editor'
import { useSiteContext } from './SiteContext'

interface PostItemProps {
  status: PostStatus
  post: Post
}

export function PostItem({ post, status }: PostItemProps) {
  const { refetch } = usePosts()
  const { data } = useSession()
  const isPublished = post.postStatus === PostStatus.PUBLISHED

  function getContent() {
    if (post.type === PostType.NOTE) {
      return (
        <div className="flex-1">
          <PlateEditor
            value={JSON.parse(post.content)}
            readonly
            className="px-0 py-0"
          />
        </div>
      )
    }

    if (post.type === PostType.IMAGE) {
      return (
        <div className="flex flex-col gap-1">
          <div className="text-base font-bold">{post.title || 'Untitled'}</div>
          <Image
            src={getUrl(post.content)}
            alt=""
            width={300}
            height={300}
            className="w-64 h-64 rounded-lg"
          />
        </div>
      )
    }
    return <div className="text-base font-bold">{post.title || 'Untitled'}</div>
  }

  function getPostType() {
    if (post.type === PostType.NOTE) {
      return (
        <Badge variant="secondary" size="sm" className="h-6 text-xs">
          Note
        </Badge>
      )
    }
    return null
  }

  return (
    <div className={cn('flex flex-col gap-2 py-[6px]')}>
      <div>
        <Link
          target={isPublished ? '_blank' : '_self'}
          href={
            isPublished
              ? `${location.protocol}//${data?.domain.domain}.${ROOT_DOMAIN}/posts/${post.slug}`
              : `/~/post/${post.id}`
          }
          className="inline-flex items-center hover:scale-105 transition-transform gap-2"
        >
          {getPostType()}
          {getContent()}
          {isPublished && post.type === PostType.ARTICLE && (
            <ExternalLink size={14} className="text-foreground/40" />
          )}
        </Link>
      </div>
      <div className="flex gap-2">
        {post.postTags.map((item) => (
          <Badge key={item.id} variant="outline">
            {item.tag.name}
          </Badge>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <div className="text-sm text-foreground/50">
          <div>{format(new Date(post.updatedAt), 'yyyy-MM-dd')}</div>
        </div>
        <Link href={`/~/post/${post.id}`}>
          <Button
            size="xs"
            variant="ghost"
            className="rounded-full text-xs h-7 gap-1 opacity-50"
          >
            <Edit3Icon size={14}></Edit3Icon>
            <div>Edit</div>
          </Button>
        </Link>

        {status !== PostStatus.ARCHIVED && (
          <Button
            size="xs"
            variant="ghost"
            className="rounded-full text-xs h-7 gap-1 opacity-60"
            onClick={async () => {
              await api.post.archive.mutate(post.id)
              refetch()
            }}
          >
            <Archive size={14}></Archive>
            <div>Archive</div>
          </Button>
        )}

        {status === PostStatus.ARCHIVED && (
          <Button
            size="xs"
            variant="ghost"
            className="rounded-full text-xs h-7 text-red-500 gap-1 opacity-60"
            onClick={async () => {
              await api.post.delete.mutate(post.id)
              refetch()
            }}
          >
            <Trash2 size={14}></Trash2>
            <div>Delete</div>
          </Button>
        )}
      </div>
    </div>
  )
}

interface PostListProps {
  status: PostStatus
}

export function PostList({ status }: PostListProps) {
  const { data = [], isLoading } = usePosts()

  if (isLoading) return <div className="text-foreground/60">Loading...</div>

  const posts = data.filter((post) => post.postStatus === status)

  if (!posts.length) {
    return <div className="text-foreground/60">No posts yet.</div>
  }

  return (
    <div className="grid gap-4">
      {posts.map((post) => {
        return <PostItem key={post.id} post={post as any} status={status} />
      })}
    </div>
  )
}
