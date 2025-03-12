import { Pagination } from '@/components/theme-ui/Pagination'
import { PostItem } from '@/components/theme-ui/post-item-blocks'
import { Post, PostListStyle, Site } from '@/lib/theme.types'

interface PaginationProps {
  totalPages: number
  currentPage: number
}
interface PostListProps {
  site: Site
  posts: Post[]
  initialDisplayPosts?: Post[]
  pagination?: PaginationProps
}

export function PostList({
  site,
  posts,
  initialDisplayPosts = [],
  pagination,
}: PostListProps) {
  const postListStyle =
    site.theme?.common?.postListStyle ?? PostListStyle.SIMPLE
  const displayPosts =
    initialDisplayPosts.length > 0 ? initialDisplayPosts : posts

  return (
    <div className="">
      <div className="grid grid-cols-1 gap-6">
        {displayPosts.map((post) => {
          return (
            <PostItem
              key={post.slug}
              post={post}
              postListStyle={postListStyle}
            />
          )
        })}
      </div>
      {pagination && pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
        />
      )}
    </div>
  )
}
