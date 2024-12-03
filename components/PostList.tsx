'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Post } from '@/hooks/usePost'
import { usePosts } from '@/hooks/usePosts'
import { PostStatus, ROOT_DOMAIN } from '@/lib/constants'
import { api } from '@/lib/trpc'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { Archive, Edit3Icon, ExternalLink, Trash2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useSiteContext } from './SiteContext'

interface PostItemProps {
  status: PostStatus
  post: Post
}

export function PostItem({ post, status }: PostItemProps) {
  const { refetch } = usePosts()
  const { data } = useSession()
  const { subdomain } = useSiteContext()

  const isPublished = post.postStatus === PostStatus.PUBLISHED
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
          <div className="text-base font-bold">{post.title || 'Untitled'}</div>
          {isPublished && (
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
        {/* <Link href={`/~/objects/${post.nodeId}`}> */}
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
