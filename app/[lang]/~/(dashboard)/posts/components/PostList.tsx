'use client'

import { useSiteContext } from '@/components/SiteContext'
import { usePosts } from '@/hooks/usePosts'
import { PostStatus } from '@/lib/constants'
import { trpc } from '@/lib/trpc'
import { PostItem } from './PostItem'

interface PostListProps {
  status: PostStatus
}

export function PostList({ status }: PostListProps) {
  const { data = [], isLoading } = usePosts()

  const { id } = useSiteContext()
  const { data: projects } = trpc.database.getProjects.useQuery({ siteId: id })
  console.log('======projects:', projects)

  if (isLoading) return <div className="text-foreground/60">Loading...</div>

  const posts = data.filter((post) => post.status === status)

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
