import { ContentRender } from '@/components/theme-ui/ContentRender'
import { PageTitle } from '@/components/theme-ui/PageTitle'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { POSTS_PER_PAGE } from '@/lib/constants'
import { Post, Site } from '@/lib/theme.types'
import { PostItem } from '../components/PostItem'

interface Props {
  about: any
  site: Site
  posts: Post[]
}

export function HomePage({ posts = [], site, about }: Props) {
  const { popularPosts, featuredPost, commonPosts } = extractPosts(posts)
  return (
    <div className="mb-20 max-w-3xl mx-auto">
      <ContentRender content={about.content} />

      <div className="">
        <div className="pb-6 pt-6 flex items-center justify-between">
          <h1 className="text-xl font-medium tracking-tight text-foreground sm:text-3xl leading-none">
            Latest
          </h1>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {!posts.length && 'No posts found.'}
          {posts.slice(0, POSTS_PER_PAGE).map((post) => {
            return <PostItem key={post.slug} post={post} />
          })}
        </div>
      </div>

      {popularPosts.length > 0 && (
        <div className="mt-10">
          <div className="pb-6 pt-6 flex items-center justify-between">
            <h1 className="text-xl font-medium tracking-tight text-foreground sm:text-3xl leading-none">
              Most Popular
            </h1>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {popularPosts.slice(0, POSTS_PER_PAGE).map((post) => {
              return <PostItem key={post.slug} post={post} />
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function extractPosts(posts: Post[]) {
  const popularPosts = posts.filter((post) => post.isPopular)
  const featuredPost = posts.find((post) => post.featured) || posts[0]
  const ids = popularPosts.map((post) => post.id)
  if (featuredPost) ids.push(featuredPost.id)
  const commonPosts = posts.filter((post) => !ids.includes(post.id))
  return {
    popularPosts,
    featuredPost,
    commonPosts,
  }
}
