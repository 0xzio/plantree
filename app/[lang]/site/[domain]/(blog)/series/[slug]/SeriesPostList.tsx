import { SeriesWithPost } from '@/lib/theme.types'
import { PostItem } from './PostItem'

interface Props {
  series: SeriesWithPost
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
