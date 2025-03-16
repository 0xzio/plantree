import { PageTitle } from '@/components/theme-ui/PageTitle'
import { Post, Site } from '@/lib/theme.types'
import { Trans } from '@lingui/react/macro'
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
      <PageTitle className="text-center">
        <Trans>Blog</Trans>
      </PageTitle>
      <PostList
        site={site}
        posts={posts}
        pagination={pagination}
        initialDisplayPosts={initialDisplayPosts}
      />
    </div>
  )
}
