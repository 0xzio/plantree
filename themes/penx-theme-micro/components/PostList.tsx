import { Post, Site } from '@penxio/types'
import { Pagination } from './Pagination'
import { PostItem } from './PostItem'

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
  const displayPosts =
    initialDisplayPosts.length > 0 ? initialDisplayPosts : posts

  return (
    <div className="">
      <div className="grid grid-cols-1 gap-6">
        {displayPosts.map((post) => {
          return <PostItem key={post.slug} site={site} post={post} />
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
