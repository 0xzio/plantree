import { Button } from '@/components/ui/button'
import { Link } from '@/lib/i18n'
import { Post, PostListStyle, Project, Site, Tag } from '@/lib/theme.types'
import { cn } from '@/lib/utils'
import FeaturedPost from '../components/FeaturedPost'
import { PostItem } from '../components/PostItem'
import { Sidebar } from '../components/Sidebar'

interface Props {
  about: any
  tags: Tag[]
  site: Site
  posts: Post[]
  projects: Project[]
}

export function HomePage({ posts = [], site, about }: Props) {
  const { popularPosts, featuredPost, featuredPosts, commonPosts } =
    extractPosts(posts)

  const displayedPosts = commonPosts.slice(0, 100)
  return (
    <div className="mt-12 flex flex-col gap-10 md:flex-row">
      <div className="flex-1 flex flex-col gap-16">
        {featuredPost && <FeaturedPost post={featuredPost} />}

        <div className="grid gap-4">
          {displayedPosts.map((post, index) => {
            return <PostItem key={post.slug} post={post} />
          })}
        </div>
        <div className="flex justify-center">
          <Link
            href="/posts"
            className="text-brand hover:text-brand/80 dark:hover:text-brand/80"
          >
            <Button variant="secondary">All posts &rarr;</Button>
          </Link>
        </div>
      </div>

      <Sidebar
        site={site}
        popularPosts={popularPosts}
        featuredPosts={featuredPosts}
        about={about}
      ></Sidebar>
    </div>
  )
}

function extractPosts(posts: Post[]) {
  const popularPosts = posts.filter((post) => post.isPopular)
  const featuredPost = posts.find((post) => post.featured) || posts[0]
  const featuredPosts = posts.filter(
    (post) => post.featured && post.id !== featuredPost.id,
  )
  const ids = popularPosts.map((post) => post.id)
  if (featuredPost) ids.push(featuredPost.id)
  const commonPosts = posts.filter((post) => !ids.includes(post.id))
  return {
    popularPosts,
    featuredPost,
    featuredPosts,
    commonPosts,
  }
}
