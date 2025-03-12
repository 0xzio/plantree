import { Post, PostListStyle } from '@/lib/theme.types'
import { PostItemCard } from './PostItemCard'
import { PostItemSimple } from './PostItemSimple'

interface PostItemProps {
  postListStyle: PostListStyle
  post: Post
}

export function PostItem({ post, postListStyle }: PostItemProps) {
  if (postListStyle === PostListStyle.CARD) {
    return <PostItemCard post={post} />
  }
  return <PostItemSimple post={post} />
}
