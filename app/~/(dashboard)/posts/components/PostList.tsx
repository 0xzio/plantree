'use client'

import { usePosts } from '@/hooks/usePosts'
import { PostStatus } from '@/lib/constants'
import { PostItem } from './PostItem'

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
