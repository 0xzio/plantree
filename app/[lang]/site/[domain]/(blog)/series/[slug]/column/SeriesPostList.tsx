import { SeriesWithPosts } from '@/lib/theme.types'
import { PostItem } from './PostItem'

interface Props {
  series: SeriesWithPosts
}
export function SeriesPostList({ series }: Props) {
  return (
    <div>
      {series.posts.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  )
}
