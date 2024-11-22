import { Post, Site } from '@penxio/types'
import PageTitle from '../components/PageTitle'
import { PostList } from '../components/PostList'

interface Props {
  site: Site
  posts: Post[]
  initialDisplayPosts: Post[]
  pagination: {
    currentPage: number
    totalPages: number
  }
}

export function BlogPage({
  site,
  posts = [],
  pagination,
  initialDisplayPosts,
}: Props) {
  return (
    <div className="space-y-6">
      <PageTitle className="text-center">Blog</PageTitle>
      <PostList
        site={site}
        posts={posts}
        pagination={pagination}
        initialDisplayPosts={initialDisplayPosts}
      />
    </div>
  )
}
