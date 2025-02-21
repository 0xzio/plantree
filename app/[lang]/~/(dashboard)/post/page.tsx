'use client'

import { ImageCreation } from '@/components/Post/ImageCreation'
import { Post } from '@/components/Post/Post'
import { PostProvider } from '@/components/Post/PostProvider'
import { usePost } from '@/hooks/usePost'
import { PostType } from '@prisma/client'

export const dynamic = 'force-static'

function PostContent() {
  const { post } = usePost()

  if (post.type === PostType.IMAGE) {
    return <ImageCreation post={post} />
  }

  return <Post />
}

export default function PostPage() {
  return (
    <PostProvider>
      <PostContent />
    </PostProvider>
  )
}
