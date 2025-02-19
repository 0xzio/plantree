import { SocialNav } from '@/components/theme-ui/SocialNav'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { POSTS_PER_PAGE } from '@/lib/constants'
import { Post, Site, Tag } from '@/lib/theme.types'
import { formatDate } from '@/lib/utils'
import { slug } from 'github-slugger'
import Link from '../components/Link'
import { PostItem } from '../components/PostItem'
import { FeaturedCard } from './FeaturedCard'

interface Props {
  tags: Tag[]
  site: Site
  posts: Post[]
}

export function HomePage({ posts = [], tags, site }: Props) {
  const { popularPosts, featuredPosts } = extractPosts(posts)
  return (
    <div className="flex flex-col gap-16">
      <div className="flex flex-col items-center gap-2">
        {site.logo && (
          <Avatar className="w-20 h-20">
            <AvatarImage src={site.logo} />
            <AvatarFallback>{site.name.slice(0, 1)}</AvatarFallback>
          </Avatar>
        )}
        <div className="font-bold text-xl text-foreground">{site.name}</div>
        <div className="text-foreground/70">{site.description}</div>
        <SocialNav site={site} />
      </div>

      <FeaturedCard posts={featuredPosts} />

      {tags.length > 0 && (
        <div>
          <h1 className="text-xl font-medium tracking-tight text-foreground sm:text-xl leading-none mb-2">
            Tags
          </h1>

          <ul className="flex flex-wrap gap-x-5">
            {tags.map((t) => {
              return (
                <li key={t.id} className="">
                  <Link
                    href={`/tags/${slug(t.name)}`}
                    className="text-foreground/80 font-medium hover:text-brand-500 dark:hover:text-brand-500 rounded-full"
                    aria-label={`View posts tagged ${t.name}`}
                  >
                    #{`${t.name}`}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      <div className="">
        <div className="pb-6 flex items-center justify-between">
          <h1 className="text-xl font-medium tracking-tight text-foreground sm:text-xl leading-none">
            Latest
          </h1>

          <Link
            href="/posts"
            className="text-brand-500 hover:text-brand-600 dark:hover:text-brand-400"
          >
            All posts &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {posts.slice(0, POSTS_PER_PAGE).map((post) => {
            return <PostItem key={post.slug} post={post} />
          })}
        </div>
      </div>
    </div>
  )
}

function extractPosts(posts: Post[]) {
  const popularPosts = posts.filter((post) => post.isPopular)
  const featuredPosts = posts.filter((post) => post.featured)
  const ids = popularPosts.map((post) => post.id)
  const commonPosts = posts.filter((post) => !ids.includes(post.id))
  return {
    popularPosts,
    featuredPosts,
    commonPosts,
  }
}
