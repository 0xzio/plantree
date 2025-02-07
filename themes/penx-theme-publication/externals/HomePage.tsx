import { cn } from '@/lib/utils'
import { Post, Site } from '@penxio/types'
import FeaturedPost from '../components/FeaturedPost'
import { PostItem } from '../components/PostItem'
import { Sidebar } from '../components/Sidebar'

const POSTS_PER_PAGE = Number(process.env.NEXT_PUBLIC_POSTS_PER_PAGE || 10)

interface Props {
  site: Site
  posts: Post[]
}

export function HomePage({ posts = [], site }: Props) {
  return (
    <div className="mt-12 flex flex-col gap-20 md:flex-row">
      <div className="flex-1">
        {posts.length > 0 && <FeaturedPost post={posts[0]} />}

        <div className="grid gap-2">
          {!posts.length && 'No posts found.'}
          {posts.slice(0, POSTS_PER_PAGE).map((post, index) => {
            return (
              <PostItem
                key={post.slug}
                post={post}
                className={cn(
                  posts.length - 1 !== index && 'border-b border-foreground/10',
                )}
              />
            )
          })}
        </div>
      </div>

      <Sidebar site={site} posts={posts}></Sidebar>
    </div>
  )
}
