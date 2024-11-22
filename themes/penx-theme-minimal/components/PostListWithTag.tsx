import { Post, Site, Tag } from '@penxio/types'
import PageTitle from './PageTitle'
import { PostList } from './PostList'
import { TagList } from './TagList'

interface PaginationProps {
  totalPages: number
  currentPage: number
}
interface PostListWithTagProps {
  site: Site
  posts: Post[]
  tags: Tag[]
  initialDisplayPosts?: Post[]
  pagination?: PaginationProps
}

export function PostListWithTag({
  site,
  posts,
  tags = [],
  initialDisplayPosts = [],
  pagination,
}: PostListWithTagProps) {
  const displayPosts =
    initialDisplayPosts.length > 0 ? initialDisplayPosts : posts

  return (
    <div className="flex flex-col">
      <PageTitle>Tags</PageTitle>
      <TagList tags={tags} />
      <div className="mt-10">
        <PostList site={site} posts={displayPosts} />
      </div>
    </div>
  )
}
