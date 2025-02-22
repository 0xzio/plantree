import { Post } from '@/components/Post/Post'
import { PostProvider } from '@/components/Post/PostProvider'

export const dynamic = 'force-static'

export default function PageApp() {
  return (
    <PostProvider>
      <Post />
    </PostProvider>
  )
}
