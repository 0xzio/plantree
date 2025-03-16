import { Post, Site, Tag } from '@/lib/theme.types'
import { FeatureBox } from './FeatureBox'
import { PostList } from './PostList'
import { TagList } from './TagList'

interface PaginationProps {
  totalPages: number
  currentPage: number
}
interface PostListWithTagProps {
  site: Site
  posts: Post[]
  featuredPost: Post
  tags: Tag[]
  initialDisplayPosts?: Post[]
  pagination?: PaginationProps
}

export function PostListWithTag({
  featuredPost,
  posts,
  site,
  tags = [],
  initialDisplayPosts = [],
  pagination,
}: PostListWithTagProps) {
  const displayPosts =
    initialDisplayPosts.length > 0 ? initialDisplayPosts : posts

  return (
    <div className="mt-12 flex flex-col gap-24">
      {featuredPost && <FeatureBox post={featuredPost} />}

      <div className="flex flex-col gap-6">
        <TagList tags={tags} />
        <PostList posts={displayPosts} site={site} />
      </div>
    </div>
  )
}
